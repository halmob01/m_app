import test from "node:test";
import assert from "node:assert/strict";
import {LESSONS,LEVELS,personalizedItems,validateCurriculum} from "../src/curriculum.mjs";
import {makeActivities,makeChoices,checkChoice,scoreSession,shuffle} from "../src/engine.mjs";
import {PICTOGRAMS, PICTURE_PRACTICE, pictureActivitiesFor} from "../src/pictograms.mjs";
import {readFileSync} from "node:fs";

function rng(seed=17){
  let n=seed>>>0;
  return ()=>((n=(1664525*n+1013904223)>>>0)/4294967296);
}
test("sillabo completo: 10 livelli, 60 unità e quaderno",()=>{
  assert.equal(LEVELS.length,10);
  assert.equal(LESSONS.length,60);
  assert.deepEqual(validateCurriculum(),[]);
  for(const lesson of LESSONS){
    assert.ok(lesson.objective.trim());
    assert.ok(lesson.notebook.trim());
    assert.equal(Math.floor((lesson.id-1)/6)+1,lesson.level);
  }
});
test("nome proprio solo parametro locale",()=>{
  assert.ok(personalizedItems(LESSONS[0],"MARCO").includes("MARCO"));
  assert.deepEqual(personalizedItems(LESSONS[1],"MARCO"),["M","A","R","C","O"]);
  assert.deepEqual(personalizedItems(LESSONS[1],"ALEX"),["A","L","E","X"]);
});
test("tutte le attività hanno opzioni verificabili",()=>{
  for(const lesson of LESSONS){
    const tasks=makeActivities(lesson,"ALEX",rng(lesson.id));
    assert.ok(tasks.length>=4,"Unità "+lesson.id+": troppo poche attività");
    assert.equal(tasks.filter(t=>t.type==="notebook").length,1);
    for(const task of tasks){
      if(["visual","listen","complete","comprehension","picture-letter","picture-syllable"].includes(task.type)){
        assert.equal(task.choices.length,3,"Unità "+lesson.id+": opzioni");
        assert.equal(new Set(task.choices).size,3,"Unità "+lesson.id+": doppioni");
        assert.equal(task.choices.filter(v=>v.toUpperCase()===task.correct.toUpperCase()).length,1);
        assert.equal(checkChoice(task,task.correct),true);
        assert.equal(checkChoice(task,"SCELTA SBAGLIATA"),false);
      }
      if(task.type==="typing"){
        assert.equal(checkChoice(task,task.correct.toLowerCase()),true);
        assert.equal(checkChoice(task,"altra parola"),false);
      }
    }
  }
});
test("consonanti isolate in U02 non pronunciate con TTS come fonemi",()=>{
  const tasks=makeActivities(LESSONS[1],"MARCO",rng(22));
  assert.equal(tasks.some(t=>["listen","read","typing"].includes(t.type)),false);
  assert.equal(tasks.filter(t=>t.type==="visual").length,3);
});
test("distrattori di sillabe di uguale lunghezza e posizioni variabili",()=>{
  const positions=new Set();
  for(let s=1;s<=40;s++){
    const options=makeChoices("MA",["MA","ME","MI","MO","MU"],rng(s));
    assert.equal(options.length,3);
    assert.ok(options.every(x=>x.length===2));
    positions.add(options.indexOf("MA"));
  }
  assert.ok(positions.size>1,"Risposta sempre nello stesso posto");
});
test("testi lunghi non imposti come digitazione integrale",()=>{
  const tasks=makeActivities(LESSONS[54],"",rng(5));
  assert.equal(tasks.some(t=>t.type==="typing"&&t.correct.length>45),false);
});
test("due sessioni e lettura dichiarata autonoma necessarie per criterio digitale",()=>{
  assert.equal(scoreSession([{correct:6,answered:6,independentRead:true}]).digitalTarget,false);
  assert.equal(scoreSession([{correct:6,answered:6,independentRead:false},{correct:5,answered:5,independentRead:true}]).digitalTarget,true);
  assert.equal(scoreSession([{correct:3,answered:5,independentRead:true},{correct:5,answered:5,independentRead:true}]).digitalTarget,false);
});
test("shuffle conserva gli elementi",()=>{
  assert.deepEqual(shuffle(["A","B","C","D"],rng(8)).sort(),["A","B","C","D"]);
});

test("tutti e dieci gli asset Tabler sono inclusi, disponibili localmente e utilizzati",()=>{
  const used=new Set(Object.values(PICTURE_PRACTICE).flat().map(x=>x.picture));
  assert.equal(used.size,10);
  assert.deepEqual([...used].sort(),Object.keys(PICTOGRAMS).sort());
  for(const [name,item] of Object.entries(PICTOGRAMS)){
    assert.match(item.filename,/^[a-z-]+\.svg$/);
    const body=readFileSync(new URL("../assets/pictograms/"+item.filename,import.meta.url),"utf8");
    assert.match(body,/<svg\b/);
    assert.ok(body.length>100,name+" asset troppo piccolo");
  }
});
test("esercizi pittogrammi graduati con alternative bilanciate",()=>{
  for(const [unit,items] of Object.entries(PICTURE_PRACTICE)){
    const n=Number(unit);
    assert.ok(n>=11,"Nessuna immagine prima delle sillabe apprese");
    for(const item of items){
      assert.ok(item.word.length>0);
      assert.equal(item.choices.length,3);
      assert.equal(item.choices.filter(x=>x===item.correct).length,1);
      assert.ok(item.choices.every(x=>x.length===item.correct.length));
      const missing=(item.display.match(/_/g)||[]).length;
      assert.equal(missing,item.correct.length,"Maschera grafica incoerente");
      assert.equal(item.display.replace(/_+/,item.correct),item.word,"Parola non ricostruibile");
      const lesson=LESSONS[n-1];
      assert.ok(lesson.items.join("|").toUpperCase().includes(item.word),"Parola non prevista nel livello "+unit);
    }
    const tasks=pictureActivitiesFor(n,rng(n));
    assert.equal(tasks.length,items.length);
    for(const t of tasks){
      assert.equal(checkChoice(t,t.correct),true);
      assert.equal(new Set(t.choices).size,3);
      assert.equal(t.choices.indexOf(t.correct)>=0,true);
    }
  }
});
test("nessuna immagine prematura nei livelli introduttivi",()=>{
  for(let id=1;id<=10;id++){
    assert.equal(pictureActivitiesFor(id).length,0);
    const tasks=makeActivities(LESSONS[id-1],"ALEX",rng(id));
    assert.equal(tasks.some(t=>t.type.startsWith("picture-")),false);
  }
});
