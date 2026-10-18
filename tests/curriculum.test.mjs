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
      if(["visual","listen","complete","comprehension","picture-letter","picture-syllable","picture-listen","picture-meaning"].includes(task.type)){
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


test("tutti i pittogrammi provengono da file SVG locali",()=>{
  const keys=Object.keys(PICTOGRAMS);
  assert.equal(keys.length,40);
  const paths=new Set();
  for(const key of keys){
    const item=PICTOGRAMS[key];
    assert.match(item.filename,/^[a-z-]+\\.svg$/);
    assert.ok(item.alt,"Descrizione accessibile mancante per "+key);
    paths.add(item.filename);
    const content=readFileSync(new URL("../assets/pictograms/"+item.filename,import.meta.url),"utf8");
    assert.match(content,/<svg\\b/);
  }
  assert.equal(paths.size,keys.length);
});

test("tutte le 60 unità contengono esattamente un'attività illustrata",()=>{
  assert.equal(Object.keys(PICTURE_PRACTICE).length,60);
  for(let id=1;id<=60;id++){
    const items=PICTURE_PRACTICE[id];
    assert.ok(Array.isArray(items)&&items.length===1,"Copertura U"+id);
    const task=pictureActivitiesFor(id,rng(id))[0];
    assert.ok(PICTOGRAMS[task.picture],"Icona mancante U"+id);
    assert.equal(task.choices.length,3);
    assert.equal(new Set(task.choices).size,3);
    assert.ok(task.choices.includes(task.correct));
    assert.equal(checkChoice(task,task.correct),true);
    const generated=makeActivities(LESSONS[id-1],"ALEX",rng(id));
    assert.equal(generated.filter(x=>x.type.startsWith("picture-")).length,1);
    if(id<=10){
      assert.equal(task.type,"picture-match");
      assert.ok(task.choices.every(x=>PICTOGRAMS[x]));
    }else if(id<=36){
      assert.ok(["picture-letter","picture-syllable"].includes(task.type));
      assert.equal((task.display.match(/_/g)||[]).length,task.correct.length);
      assert.equal(task.display.replace(/_+/,task.correct),task.word);
      assert.ok(task.choices.every(x=>x.length===task.correct.length));
    }else{
      assert.equal(task.type,"picture-context");
      assert.equal((task.display.match(/_/g)||[]).length,5);
      assert.ok(task.choices.every(x=>typeof x==="string"&&x.length>0));
      assert.ok(task.display.length<=45);
    }
  }
});
test("le scelte illustrate cambiano posizione nelle ripetizioni",()=>{
  const locations=new Set();
  for(const value of [0,0.2,0.45,0.7,0.99]){
    locations.add(pictureActivitiesFor(43,()=>value)[0].choices.indexOf("MESSAGGIO"));
  }
  assert.ok(locations.size>=2);
});
