// Inventory completo delle stringhe audio statiche realmente utilizzate nelle 60 unità.
// Il nome dell'allievo NON viene mai esportato o sintetizzato per la distribuzione.
import fs from "node:fs";
import {LESSONS} from "../src/curriculum.mjs";
import {makeActivities} from "../src/engine.mjs";

const samples=new Map();
function clean(text){
  return String(text||"").trim().replace(/\s+/g," ");
}
function key(text){return clean(text).toLocaleUpperCase("it-IT");}
function collect(text){
  const s=clean(text);
  if(!s || /^@[A-Z_]+$/.test(s))return;
  if(s.length===1 && !/[AEIOUÀÈÉÌÒÙ]/i.test(s))return; // Non fingere che "emme" sia /m/.
  if(s.length>280)return; // Frasi troppo lunghe da segmentare prima del rilascio.
  samples.set(key(s),s);
}

[
  "Premi inizia per fare gli esercizi.",
  "Tocca la parola uguale.",
  "Guarda il disegno. Scegli la lettera o la sillaba che manca.",
  "Guarda il disegno. Scegli la frase giusta.",
  "Leggi da solo. Quando hai provato, tocca il pulsante avanti.",
  "Oggi sono a scuola. Leggo una parola e poi scrivo sul quaderno."
].forEach(collect);

for(const lesson of LESSONS){
  for(const item of lesson.items){
    collect(item);
    for(const sentence of item.split(/(?<=[.!?])\s+/))collect(sentence);
  }
  collect(lesson.notebook);
  for(const q of lesson.questions){
    collect("Leggi il testo. "+q.prompt);
  }
  // Include what the engine actually constructs, beyond the content table.
  // No personal name is passed into this path.
  for(let seed=1;seed<=2;seed++){
    let n=seed*lesson.id + 13;
    const random=()=>((n=(1664525*n+1013904223)>>>0)/4294967296);
    for(const task of makeActivities(lesson,"",random)){
      if(task.type==="listen"||task.type==="complete"||task.type==="read"||task.type==="typing")collect(task.readout);
      if(task.type==="notebook")collect(task.prompt);
      if(task.type==="picture-audio")collect(task.readout);
      if(task.type==="comprehension")collect("Leggi il testo. "+task.prompt);
    }
  }
}
const entries=[...samples].sort(([a],[b])=>a.localeCompare(b,"it")).map(([key,text])=>({key,text}));
const destination=process.argv[2]||"audio/inventory.json";
fs.mkdirSync(destination.substring(0,destination.lastIndexOf("/"))||".",{recursive:true});
fs.writeFileSync(destination,JSON.stringify({version:1,voice:"it_IT-paola-medium",entries},null,2)+"\n");
console.log("Audio inventory: "+entries.length+" utterances -> "+destination);
