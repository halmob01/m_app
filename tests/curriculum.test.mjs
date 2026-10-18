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


test("45 asset Tabler SVG locali, senza immagini remote e senza duplicati",()=>{
  assert.equal(Object.keys(PICTOGRAMS).length,45);
  const filenames=new Set();
  for(const [name,item] of Object.entries(PICTOGRAMS)){
    assert.match(item.filename,/^[a-z-]+\.svg$/);
    assert.ok(item.alt && item.spoken,name);
    filenames.add(item.filename);
    const svg=readFileSync(new URL("../assets/pictograms/"+item.filename,import.meta.url),"utf8");
    assert.match(svg,/<svg\b/);
  }
  assert.equal(filenames.size,45);
});
test("ogni unità include un'attività pittogramma, senza anticipare prove di lettura",()=>{
  assert.equal(Object.keys(PICTURE_PRACTICE).length,60);
  for(let id=1;id<=60;id++){
    const raw=PICTURE_PRACTICE[id];
    assert.ok(Array.isArray(raw)&&raw.length>0,"Unità senza pittogramma: "+id);
    const tasks=makeActivities(LESSONS[id-1],"ALEX",rng(id));
    const pictureTasks=tasks.filter(x=>x.type.startsWith("picture-"));
    assert.ok(pictureTasks.length>0,"Unità con motore senza pittogramma: "+id);
    for(const task of pictureTasks){
      assert.equal(task.choices.length,3);
      assert.equal(new Set(task.choices).size,3);
      assert.ok(task.choices.includes(task.correct));
      assert.equal(checkChoice(task,task.correct),true);
      if(id<=10){
        assert.equal(task.type,"picture-listen");
        assert.ok(task.choices.every(key=>PICTOGRAMS[key]));
      }else if(id<=36){
        assert.ok(["picture-listen","picture-letter","picture-syllable"].includes(task.type));
        if(task.type==="picture-letter"||task.type==="picture-syllable"){
          assert.ok(task.choices.every(x=>x.length===task.correct.length));
          assert.equal((task.display.match(/_/g)||[]).length,task.correct.length);
          assert.equal(task.display.replace(/_+/,task.correct),task.word);
        }
      }else{
        assert.equal(task.type,"picture-meaning");
        assert.ok(task.display?.trim());
        assert.ok(task.choices.every(key=>PICTOGRAMS[key]));
      }
    }
  }
});
test("posizione di risposta visiva cambia nelle prove ripetute",()=>{
  const positions=new Set();
  for(let i=1;i<=40;i++){
    const [task]=pictureActivitiesFor(43,rng(i));
    positions.add(task.choices.indexOf(task.correct));
  }
  assert.ok(positions.size>=2);
});
