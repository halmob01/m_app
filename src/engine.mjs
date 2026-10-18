import { personalizedItems, LESSONS } from "./curriculum.mjs";
import { pictureActivitiesFor } from "./pictograms.mjs";

export function shuffle(items, random=Math.random) {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}

function normalized(value) {
  return String(value ?? "").trim().toLocaleUpperCase("it-IT").replace(/\s+/g," ");
}

function unique(items) {
  return [...new Set(items.map(normalized).filter(Boolean))];
}

const SYLLABLE_POOL=["MA","ME","MI","MO","MU","NA","NE","NI","NO","NU","LA","LE","LI","LO","LU","SA","SE","SI","SO","SU","PA","PE","PI","PO","PU","TA","TE","TI","TO","TU","RA","RE","RI","RO","RU","FA","FE","FI","FO","FU","BA","BE","BI","BO","BU","DA","DE","DI","DO","DU","VA","VE","VI","VO","VU","CA","CO","CU","GA","GO","GU","CE","CI","GE","GI","CHE","CHI","GHE","GHI","QUA","SCE","SCI","PRA","TRA","BRA","SPA","STA","SCA"];
const READING_POOL=LESSONS.filter(l=>l.id>=37).flatMap(l=>l.items.flatMap(item=>[item,...item.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean)]));
const WORD_POOL=["MANO","MELA","LUNA","SOLE","NASO","LAMA","MULO","MIMO","SALE","PANE","PALA","TANA","TELA","MARE","RANA","FARO","FILO","FUMO","PAROLA","LIMONE","SAPONE","PATATA","DADO","BENE","VELA","VINO","CASA","CANE","COSA","GOLA","GARA","CENA","CIMA","VOCE","GELATO","GIRA","GENTE","CHIAVE","GHIRO","QUANDO","ACQUA","SPESA","POSTO","PRATO","TRENO","SCENA","BAGNO","SOGNO","FOGLIO","PALA","PALLA","NONO","NONNO","CASSA"];

export function makeChoices(correct, pool, random=Math.random, count=3) {
  const answer=normalized(correct);
  const bank=answer.length>18?READING_POOL:(answer.length<=3?SYLLABLE_POOL:WORD_POOL);
  const distractors=unique([...pool,...bank]).filter(x=>x!==answer);
  // Equal length first (single consonants, syllables, words), near-length for sentences.
  const ranked=shuffle(distractors,random).sort((a,b)=>
    Math.abs(a.length-answer.length)-Math.abs(b.length-answer.length));
  const closest=ranked.filter(x=>Math.abs(x.length-answer.length)<=(answer.length>18?15:1));
  const source=closest.length>=count-1?closest:ranked;
  const candidates=source.slice(0,count-1);
  return shuffle([answer,...candidates],random);
}

function completeItem(term, pool, random=Math.random) {
  const chars=[...normalized(term)];
  const indexes=chars.flatMap((c,i)=>/^[A-ZÀ-Ù]$/.test(c)?[i]:[]);
  if(chars.length<3||indexes.length<2)return null;
  const ix=indexes[Math.floor(random()*indexes.length)];
  const correct=chars[ix];
  const same=unique(pool.flatMap(s=>[...s])).filter(c=>c.length===1&&/^[A-Z]$/.test(c)&&c!==correct);
  const alternatives=shuffle([...same,...[..."AEIOMNLSRPTFVBDCG"]],random).filter((c,i,a)=>a.indexOf(c)===i&&c!==correct);
  return {type:"complete",prompt:"Completa la parola.",display:chars.map((c,i)=>i===ix?"_":c).join(""),correct,choices:shuffle([correct,...alternatives.slice(0,2)],random),readout:normalized(term)};
}

export function makeActivities(lesson,name="",random=Math.random) {
  const terms=unique(personalizedItems(lesson,name)).filter(x=>!x.includes("@"));
  const arr=[];
  const early=lesson.id<=36;
  const usable=shuffle(terms,random);
  const audioTerms=!early ? unique(terms.flatMap(t=>t.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean))) : terms;
  const picks=shuffle(audioTerms,random).slice(0,Math.min(3,audioTerms.length));
  if(lesson.kind==="visual"){
    for(const word of picks){
      arr.push({type:"visual",prompt:"Trova lo stesso segno.",display:word,
        correct:word,choices:makeChoices(word,terms,random)});
    }
    // Nei primi livelli la figura si associa alla parola ascoltata, senza richiedere lettura.
    arr.push(...pictureActivitiesFor(lesson.id,random));
    if(lesson.id===1)arr.push({type:"read",prompt:"Leggi il tuo nome.",display:usable[0],readout:usable[0],correct:null,choices:[]});
    arr.push({type:"notebook",prompt:lesson.notebook,readout:null,correct:null});
    return arr;
  }
  for(const word of picks) {
    arr.push({
      type:"listen",
      prompt:early?"Ascolta e scegli.":"Ascolta e scegli la frase.",
      display:null,
      correct:word,
      choices:makeChoices(word,terms,random),
      readout:word
    });
  }
  // Mini-esercizi immagine + grafema/sillaba: solo unità e parole già insegnate.
  arr.push(...pictureActivitiesFor(lesson.id,random));
  if(early){
    for(const term of shuffle(terms.filter(x=>x.length>=3),random).slice(0,2)){
      const activity=completeItem(term,terms,random);
      if(activity)arr.push(activity);
    }
  }
  if(lesson.id>=11){
    const typed=usable.find(x=>x.length>=3&&x.length<=(early?20:45));
    if(typed)arr.push({type:"typing",prompt:early?"Scrivi la parola ascoltata.":"Scrivi la frase ascoltata.",display:null,readout:typed,correct:typed,choices:[]});
  }
  arr.push({
    type:"read",
    prompt:early?"Prova a leggere. Poi controlla con l’audio.":"Leggi senza aiuto. Poi ascolta per controllare.",
    display:usable[0],
    readout:usable[0],
    correct:null,
    choices:[]
  });
  for(const q of lesson.questions){
    arr.push({
      type:"comprehension",
      prompt:q.prompt,
      passage:lesson.items.join(" "),
      correct:q.correct,
      choices:shuffle(q.options,random),
      readout:null
    });
  }
  arr.push({type:"notebook",prompt:lesson.notebook,readout:null,correct:null});
  return arr;
}

export function checkChoice(activity,answer) {
  if(!["visual","listen","complete","comprehension","typing","picture-letter","picture-syllable","picture-listen","picture-meaning"].includes(activity?.type))return null;
  return normalized(answer)===normalized(activity.correct);
}

export function scoreSession(history=[]) {
  const eligible=history.filter(s=>Number.isFinite(s.answered)&&s.answered>0);
  const lastTwo=eligible.slice(-2);
  const both=lastTwo.length===2&&lastTwo.every(s=>s.correct/s.answered>=0.85);
  const independent=lastTwo.some(s=>s.independentRead===true);
  return {runs:eligible.length,lastAccuracy:eligible.length?Math.round(100*eligible.at(-1).correct/eligible.at(-1).answered):null,digitalTarget:both&&independent};
}
