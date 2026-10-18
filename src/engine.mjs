import { personalizedItems } from "./curriculum.mjs";

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
const WORD_POOL=["MANO","MELA","LUNA","SOLE","NASO","LAMA","MULO","MIMO","SALE","PANE","PALA","TANA","TELA","MARE","RANA","FARO","FILO","FUMO","PAROLA","LIMONE","SAPONE","PATATA","DADO","BENE","VELA","VINO","CASA","CANE","COSA","GOLA","GARA","CENA","CIMA","VOCE","GELATO","GIRA","GENTE","CHIAVE","GHIRO","QUANDO","ACQUA","SPESA","POSTO","PRATO","TRENO","SCENA","BAGNO","SOGNO","FOGLIO","PALA","PALLA","NONO","NONNO","CASSA"];

export function makeChoices(correct, pool, random=Math.random, count=3) {
  const answer=normalized(correct);
  const distractors=unique([...pool,...(answer.length<=3?SYLLABLE_POOL:WORD_POOL)])
    .filter(x=>x!==answer);
  // Prefer similar graphic length. This reduces the chance of solving by length alone.
  distractors.sort((a,b)=>Math.abs(a.length-answer.length)-Math.abs(b.length-answer.length));
  const nearest=distractors.filter(x=>Math.abs(x.length-answer.length)<=1);
  const source=nearest.length>=count-1?nearest:distractors;
  const candidates=shuffle(source,random).slice(0,count-1);
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
  const picks=usable.slice(0,Math.min(3,usable.length));
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
  if(early){
    for(const term of shuffle(terms.filter(x=>x.length>=3),random).slice(0,2)){
      const activity=completeItem(term,terms,random);
      if(activity)arr.push(activity);
    }
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
  if(!["listen","complete","comprehension"].includes(activity?.type))return null;
  return normalized(answer)===normalized(activity.correct);
}

export function scoreSession(history=[]) {
  const eligible=history.filter(s=>Number.isFinite(s.answered)&&s.answered>0);
  const lastTwo=eligible.slice(-2);
  const both=lastTwo.length===2&&lastTwo.every(s=>s.correct/s.answered>=0.85);
  const independent=lastTwo.some(s=>s.independentRead===true);
  return {runs:eligible.length,lastAccuracy:eligible.length?Math.round(100*eligible.at(-1).correct/eligible.at(-1).answered):null,digitalTarget:both&&independent};
}
