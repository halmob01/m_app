import { LEVELS, LESSONS, personalizedItems, validateCurriculum } from "./curriculum.mjs";
import { makeActivities, checkChoice, scoreSession } from "./engine.mjs";
import { PICTOGRAMS, pictogramPath } from "./pictograms.mjs";
import { createNeuralPlayer } from "./neural-audio.mjs";

const STORE = "m_app_local_v1"; // Keep the existing key: preserve installed students' progress.
const defaults = () => ({
  profile: {name:"",setup:false},
  history:{},reviewed:{},active:null,
  assignment:1,
  preferences:{typing:false,voiceURI:'',rate:1,audioMode:"neural"}
});
const root = document.querySelector("#app");
let data = readStore();
let ui = {view:location.hash==="#docenti"?"teacher":"student", lesson:1, tasks:[], index:0, answered:false, tries:0,
  feedback:null, readStep:0, modelHidden:false, typedText:"",
  score:{correct:0,answered:0,independentRead:false,notebookDone:false}};
let audioMessage = "";
let selectedVoice = null;
const ICONS = {
  sound:["M11 5 6 9H2v6h4l5 4V5Z","M15.54 8.46a5 5 0 0 1 0 7.08","M19.07 4.93a10 10 0 0 1 0 14.14"],
  next:["M5 12h14","m12 5 7 7-7 7"],
  back:["m15 18-6-6 6-6"],
  check:["M20 6 9 17l-5-5"],
  retry:["M3 11a9 9 0 1 1 2.6 6.4","M3 4v7h7"],
  pen:["M12 19h9","m15 5 4 4","M4 20l4-.8L19 8a2.12 2.12 0 0 0-3-3L5 16l-1 4Z"],
  eye:["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  eyeoff:["M3 3l18 18","M10.6 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a14.2 14.2 0 0 1-3.2 4.2","M6 6.1C3.3 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.1-.8"],
  settings:["M12 3v3","M12 18v3","M3 12h3","M18 12h3","M5.64 5.64l2.12 2.12","M16.24 16.24l2.12 2.12","M18.36 5.64l-2.12 2.12","M7.76 16.24l-2.12 2.12","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  home:["m3 10 9-7 9 7","M5 9v12h14V9"],
  keyboard:["M3 5h18v14H3z","M7 9h.01","M11 9h.01","M15 9h.01","M19 9h.01","M7 13h.01","M11 13h.01","M15 13h.01","M8 16h8"],
  close:["M18 6 6 18","M6 6l12 12"],
  book:["M4 19.5A2.5 2.5 0 0 1 6.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"]
};
function readStore(){
  try{
    const x=JSON.parse(localStorage.getItem(STORE)||"null");
    if(x&&typeof x==="object"&&!Array.isArray(x)){
      const initial=defaults();
      return {...initial,...x,profile:{...initial.profile,...x.profile},
        preferences:{...initial.preferences,...x.preferences},
        assignment:Number.isInteger(x.assignment)?Math.max(1,Math.min(60,x.assignment)):1,
        history:x.history&&typeof x.history==="object"?x.history:{},
        reviewed:x.reviewed&&typeof x.reviewed==="object"?x.reviewed:{}};
    }
  }catch{}
  return defaults();
}
function save(){try{localStorage.setItem(STORE,JSON.stringify(data));return true;}catch{return false;}}
function el(tag,cls,text){
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(text!==undefined&&text!==null)node.textContent=String(text);
  return node;
}
function append(parent,...children){for(const child of children.flat())if(child)parent.append(child);return parent;}
function icon(name,sz=24){
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("width",sz);svg.setAttribute("height",sz);
  svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");
  svg.setAttribute("stroke-width","2");svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");
  svg.setAttribute("aria-hidden","true");
  for(const d of ICONS[name]||[]){
    const path=document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d",d);svg.append(path);
  }
  return svg;
}
function btn(label,cls,click,{ico=null,aria=null}={}){
  const b=el("button",cls);
  b.type="button";
  if(ico)b.append(icon(ico,24));
  if(label)b.append(el("span",null,label));
  if(aria)b.setAttribute("aria-label",aria);
  b.addEventListener("click",click);return b;
}
function divline(){return el("div","divider");}
function top(){window.scrollTo({top:0,behavior:"instant"});}
function speechAvailable(){return typeof window.speechSynthesis!=="undefined"&&typeof window.SpeechSynthesisUtterance!=="undefined";}
function selectVoice(){
  if(!speechAvailable())return;
  const voices=window.speechSynthesis.getVoices();
  selectedVoice=voices.find(v=>v.voiceURI===data.preferences.voiceURI&&/^it/i.test(v.lang))||voices.find(v=>v.lang?.toLowerCase()==="it-it")||voices.find(v=>v.lang?.toLowerCase().startsWith("it"))||null;
}
if(speechAvailable()){
  selectVoice();
  window.speechSynthesis.addEventListener?.("voiceschanged",selectVoice);
}
function nativeSpeech(text,kind="instruction"){
  if(!speechAvailable()){
    audioMessage="Audio non disponibile su questo dispositivo.";
    render();return;
  }
  selectVoice();
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(String(text));
  utterance.lang="it-IT";
  if(selectedVoice)utterance.voice=selectedVoice;
  utterance.rate=Number(data.preferences.rate)||1;
  utterance.pitch=1;
  utterance.onerror=()=>{audioMessage="Audio non disponibile. Controlla il volume e la voce italiana.";render();};
  speechSynthesis.speak(utterance);
}
const neuralVoice=createNeuralPlayer({nativeFallback:nativeSpeech});
neuralVoice.prepare();
function stop(){
  neuralVoice.stop();
  if(speechAvailable())window.speechSynthesis.cancel();
}
function say(text,kind="instruction",mode=null){
  audioMessage="";
  const selectedMode=mode||data.preferences.audioMode||"neural";
  if(speechAvailable())window.speechSynthesis.cancel();
  neuralVoice.play(text,kind,selectedMode==="device");
}
function audioButton(text,kind="instruction",label="ASCOLTA"){
  return btn(label,"audio-btn",()=>say(text,kind),{ico:"sound",aria:label});
}
function audioAlert(container){
  if(audioMessage)container.append(el("p","sound-error",audioMessage));
}
function page(view){stop();audioMessage="";ui.view=view;render();top();}
function gotoTeacher(){location.hash="docenti";page("teacher");}
function gotoStudent(){history.replaceState(null,"",location.pathname+location.search);page("student");}
function lesson(id){return LESSONS.find(l=>l.id===Number(id));}
function progress(id){const sessions=data.history[id]||[];return {...scoreSession(sessions),sessions,reviewed:!!data.reviewed[id]};}
function activeSave(){
  if(ui.view!=="unit")return;
  data.active={id:ui.lesson,tasks:ui.tasks,index:ui.index,answered:ui.answered,
    tries:ui.tries,feedback:ui.feedback,readStep:ui.readStep,modelHidden:ui.modelHidden,
    typedText:ui.typedText,score:ui.score};
  save();
}
function makeSession(id){
  const item=lesson(id);if(!item)return;
  stop();audioMessage="";
  const tasks=makeActivities(item,data.profile.name).filter(x=>data.preferences.typing||x.type!=="typing");
  ui={...ui,view:"unit",lesson:id,tasks,index:0,answered:false,tries:0,
    feedback:null,readStep:0,modelHidden:false,typedText:"",
    score:{correct:0,answered:0,independentRead:false,notebookDone:false}};
  activeSave();render();top();
}
function resume(){
  const a=data.active;
  if(!a||!lesson(a.id)||!Array.isArray(a.tasks)||!a.tasks.length){data.active=null;save();return makeSession(data.assignment);}
  ui={...ui,...a,lesson:a.id,view:"unit",score:{correct:0,answered:0,independentRead:false,notebookDone:false,...a.score}};
  audioMessage="";render();top();
}
function render(){
  root.replaceChildren();
  const shell=el("div",ui.view==="teacher"?"shell teacher-shell":"shell pupil-shell");
  const header=el("header",ui.view==="teacher"?"topbar teacher-topbar":"topbar pupil-topbar");
  if(ui.view==="teacher"){
    append(header,el("strong","brand wordmark","TRACCIA"),
      btn("TORNA AGLI ESERCIZI","teacher-back",gotoStudent,{ico:"back"}));
  }else{
    append(header,el("span","brandmark","T"),
      btn("DOCENTI","teacher-visible-link",gotoTeacher,{ico:"settings",aria:"Apri area docenti"}));
  }
  const main=el("main");main.id="main";
  if(ui.view==="teacher")teacherView(main);
  else if(ui.view==="unit")unitView(main);
  else if(ui.view==="done")doneView(main);
  else studentHome(main);
  append(shell,header,main);root.append(shell);
}
function studentHome(main){
  const current=lesson(data.active?.id||data.assignment)||LESSONS[0];
  const hero=el("section","pupil-home");
  append(hero,el("span","student-level","LIVELLO "+String(current.level).padStart(2,"0")),
    el("h1","display-title",LEVELS[current.level-1]));
  const audio=audioButton("Premi inizia per fare gli esercizi.","instruction");
  const start=btn(data.active?"CONTINUA":"INIZIA","primary start-btn",
    ()=>data.active?resume():makeSession(current.id),{ico:"next"});
  append(hero,audio,start);
  audioAlert(hero);main.append(hero);
}
function progressLine(main,index,total){
  const bar=el("div","step-progress");
  const fill=el("div","step-fill");fill.style.width=(100*(index+1)/total)+"%";
  bar.append(fill);main.append(bar);
}
function unitView(main){
  const l=lesson(ui.lesson);
  if(!l){return gotoStudent();}
  const task=ui.tasks[ui.index];if(!task){return finish();}
  const head=el("div","pupil-heading");
  append(head,el("div","student-level","LIVELLO "+String(l.level).padStart(2,"0")),
    el("h1","level-title",LEVELS[l.level-1]));
  main.append(head);
  progressLine(main,ui.index,ui.tasks.length);
  const stage=el("section","stage");
  if(task.type==="visual")visualStage(stage,task);
  if(task.type==="picture-letter"||task.type==="picture-syllable")pictureStage(stage,task);
  if(task.type==="picture-listen"||task.type==="picture-match")pictureListenStage(stage,task);
  if(task.type==="picture-meaning")pictureMeaningStage(stage,task);
  if(task.type==="picture-context")pictureContextStage(stage,task);
  if(task.type==="listen")listenStage(stage,task);
  if(task.type==="complete")completeStage(stage,task);
  if(task.type==="typing")typingStage(stage,task);
  if(task.type==="read")readStage(stage,task);
  if(task.type==="comprehension")comprehensionStage(stage,task);
  if(task.type==="notebook")notebookStage(stage,task,l);
  main.append(stage);
  main.append(btn("","quiet-exit",gotoStudent,{ico:"home",aria:"Torna all'inizio, salvando l'esercizio"}));
}
function target(text,cls=""){
  return el("div","target "+cls,text);
}
function choiceButtons(stage,task){
  const grid=el("div","choices");
  grid.setAttribute("role","group");
  grid.setAttribute("aria-label","Scegli la risposta");
  for(const value of task.choices){
    const b=btn(value,"choice",()=>pick(task,value));
    b.classList.toggle("right",!!ui.feedback&&ui.feedback.value===value&&(ui.feedback.correct||ui.feedback.revealed));
    b.classList.toggle("wrong",!!ui.feedback&&ui.feedback.value===value&&!ui.feedback.correct&&!ui.feedback.revealed);
    b.disabled=ui.answered;
    grid.append(b);
  }
  stage.append(grid);
  if(ui.feedback){
    const feedback=el("div","simple-feedback");
    append(feedback,icon(ui.feedback.correct?"check":ui.feedback.revealed?"check":"retry",30),
      el("span",null,ui.feedback.revealed?"RISPOSTA: "+task.correct:ui.feedback.correct?"CORRETTO":"RIPROVA"));
    feedback.classList.add(ui.feedback.correct?"ok":"again");
    stage.append(feedback);
    if(!ui.feedback.correct&&ui.tries>=2&&!ui.feedback.revealed){
      stage.append(btn("MOSTRA","soft-action",()=>{
        ui.feedback={value:task.correct,correct:false,revealed:true};
        ui.answered=true;activeSave();render();
      },{ico:"eye"}));
    }
  }
  if(ui.answered)stage.append(btn("AVANTI","primary next-btn",advance,{ico:"next"}));
}
function pick(task,value){
  if(ui.answered)return;
  const correct=checkChoice(task,value);
  if(ui.tries===0){ui.score.answered++;if(correct)ui.score.correct++;}
  ui.tries++;ui.feedback={value,correct};ui.answered=correct;
  activeSave();render();
}
function visualStage(stage,task){
  stage.append(audioButton("Tocca la parola uguale.","instruction"));
  stage.append(target(task.display));
  choiceButtons(stage,task);
}
function listenStage(stage,task){
  stage.append(audioButton(task.readout,task.readout.length>24?"sentence":"word"));
  stage.append(el("div","audio-spacer"));
  choiceButtons(stage,task);
  audioAlert(stage);
}
function pictogramElement(name,small=false){
  const img=el("img",small?"picture-option-icon":"pictogram-asset");
  const url=pictogramPath(name);
  if(url)img.src=url;
  img.alt=PICTOGRAMS[name]?.alt||name;
  img.loading="eager";img.decoding="async";
  return img;
}
function pictogramChoices(stage,task){
  const grid=el("div","picture-options");
  grid.setAttribute("role","group");
  grid.setAttribute("aria-label","Scegli un disegno");
  for(const value of task.choices){
    const b=btn("","picture-choice",()=>pick(task,value),{aria:PICTOGRAMS[value]?.alt||value});
    b.append(pictogramElement(value,true));
    if(ui.feedback&&ui.feedback.value===value)b.classList.add(ui.feedback.correct||ui.feedback.revealed?"right":"wrong");
    b.disabled=ui.answered;grid.append(b);
  }
  stage.append(grid);
  if(ui.feedback){
    const feedback=el("div","simple-feedback "+(ui.feedback.correct?"ok":"again"));
    append(feedback,icon(ui.feedback.correct?"check":"retry",28),
      el("span",null,ui.feedback.correct?"CORRETTO":ui.feedback.revealed?"GUARDA IL DISEGNO":"RIPROVA"));
    stage.append(feedback);
    if(!ui.feedback.correct&&ui.tries>=2&&!ui.feedback.revealed){
      stage.append(btn("MOSTRA","soft-action",()=>{
        ui.feedback={value:task.correct,correct:false,revealed:true};
        ui.answered=true;activeSave();render();
      },{ico:"eye"}));
    }
  }
  if(ui.answered)stage.append(btn("AVANTI","primary next-btn",advance,{ico:"next"}));
}
function pictureListenStage(stage,task){
  // L'ascolto, non la lettura, è il requisito delle attività visive iniziali.
  const spoken=PICTOGRAMS[task.picture]?.spoken||PICTOGRAMS[task.picture]?.alt||task.picture;
  stage.append(audioButton("Tocca il disegno: "+spoken,"instruction"));
  stage.append(el("div","picture-listening-cue"));
  pictogramChoices(stage,task);
  audioAlert(stage);
}
function pictureMeaningStage(stage,task){
  stage.append(audioButton("Leggi la frase e tocca il disegno giusto.","instruction"));
  stage.append(target(task.display,"long picture-sentence"));
  pictogramChoices(stage,task);
  audioAlert(stage);
}
function pictureContextStage(stage,task){
  // L'immagine fornisce il contesto, mentre la frase richiede scelta semantica.
  // Non svelare la parola bersaglio nella consegna sonora.
  stage.append(audioButton("Guarda il disegno. Leggi la frase e scegli la parola mancante.","instruction"));
  const frame=el("div","pictogram-frame context-visual");
  const image=el("img","pictogram-asset");
  const path=pictogramPath(task.picture);
  if(path)image.src=path;
  image.alt=PICTOGRAMS[task.picture]?.alt||"Pittogramma";
  image.decoding="async";
  frame.append(image);
  stage.append(frame);
  stage.append(target(task.display,"long picture-sentence"));
  choiceButtons(stage,task);
  audioAlert(stage);
}
function pictureStage(stage,task){
  // Il pittogramma guida il riconoscimento della parola, non sostituisce
  // una prova indipendente di lettura: la parola intera non viene pronunciata.
  stage.append(audioButton("Guarda il disegno. Scegli la lettera o la sillaba che manca.","instruction"));
  const holder=el("div","pictogram-frame");
  const image=el("img","pictogram-asset");
  const path=pictogramPath(task.picture);
  if(path)image.src=path;
  image.alt=PICTOGRAMS[task.picture]?.alt||"Pittogramma";
  image.decoding="async";
  append(holder,image);
  stage.append(holder);
  stage.append(target(task.display,"pictogram-target"));
  choiceButtons(stage,task);
  audioAlert(stage);
}
function completeStage(stage,task){
  stage.append(audioButton(task.readout,"word"));
  stage.append(target(task.display));
  choiceButtons(stage,task);
  audioAlert(stage);
}
function typingStage(stage,task){
  stage.append(audioButton(task.readout,task.readout.length>24?"sentence":"word"));
  const form=el("form","typing-form");
  const input=el("input","typing-input");
  input.type="text";input.value=ui.typedText||"";
  input.setAttribute("aria-label","Scrivi ciò che senti");
  input.autocapitalize="characters";input.autocomplete="off";input.spellcheck=false;input.disabled=ui.answered;
  input.addEventListener("input",()=>{ui.typedText=input.value;activeSave();});
  const submit=el("button","primary next-btn");submit.type="submit";
  append(submit,icon("check"),el("span",null,"CONTROLLA"));
  submit.disabled=ui.answered;
  form.addEventListener("submit",ev=>{ev.preventDefault();if(!ui.answered)pick(task,input.value);});
  append(form,input,submit);stage.append(form);
  if(ui.feedback){
    const message=ui.feedback.revealed?"RISPOSTA: "+task.correct:ui.feedback.correct?"CORRETTO":"RIPROVA";
    stage.append(el("div","simple-feedback "+(ui.feedback.correct?"ok":"again"),message));
    if(!ui.answered&&ui.tries>=2)stage.append(btn("MOSTRA","soft-action",()=>{
      ui.feedback={value:task.correct,correct:false,revealed:true};ui.answered=true;activeSave();render();
    },{ico:"eye"}));
  }
  if(ui.answered)stage.append(btn("AVANTI","primary next-btn",advance,{ico:"next"}));
  else stage.append(btn("SALTA","text-action",advance,{ico:"next"}));
  audioAlert(stage);
}
function readStage(stage,task){
  stage.append(target(task.display,task.display.length>20?"long":""));
  if(ui.readStep===0){
    stage.append(audioButton("Leggi da solo. Quando hai provato, tocca il pulsante avanti.","instruction"));
    stage.append(btn("AVANTI","primary next-btn",()=>{ui.readStep=1;activeSave();render();},{ico:"next"}));
  }else{
    stage.append(audioButton(task.readout,task.display.length>24?"sentence":"word"));
    const controls=el("div","binary-controls");
    append(controls,btn("GIUSTO","choice rightish",()=>{ui.score.independentRead=true;advance();},{ico:"check"}),
      btn("RIPROVA","choice",advance,{ico:"retry"}));
    stage.append(controls);
  }
  audioAlert(stage);
}
function comprehensionStage(stage,task){
  stage.append(audioButton("Leggi il testo. "+task.prompt,"instruction"));
  stage.append(target(task.passage,"long reading-passage"));
  stage.append(el("p","question-text",task.prompt));
  choiceButtons(stage,task);
  audioAlert(stage);
}
function notebookStage(stage,task,l){
  const word=personalizedItems(l,data.profile.name)[0]||"";
  const heading=el("div","notebook-head");
  append(heading,icon("pen",28),el("span",null,"QUADERNO"));
  stage.append(heading);
  stage.append(audioButton(task.prompt,"instruction"));
  const t=target(word,"notebook-model"+(ui.modelHidden?" model-hidden":""));
  t.setAttribute("aria-label",ui.modelHidden?"Modello nascosto":word);
  stage.append(t);
  stage.append(btn(ui.modelHidden?"MOSTRA":"NASCONDI","soft-action",()=>{
    ui.modelHidden=!ui.modelHidden;activeSave();render();
  },{ico:ui.modelHidden?"eye":"eyeoff"}));
  stage.append(btn("FATTO","primary next-btn",()=>{ui.score.notebookDone=true;advance();},{ico:"check"}));
  audioAlert(stage);
}
function advance(){
  stop();audioMessage="";
  if(ui.index>=ui.tasks.length-1)return finish();
  ui.index++;ui.answered=false;ui.tries=0;ui.feedback=null;ui.readStep=0;
  ui.modelHidden=false;ui.typedText="";activeSave();render();top();
}
function finish(){
  const sessions=data.history[ui.lesson]||[];
  sessions.push({...ui.score,endedAt:new Date().toISOString()});
  data.history[ui.lesson]=sessions.slice(-20);
  data.reviewed[ui.lesson]=false;
  data.active=null;
  data.assignment=ui.lesson<60?ui.lesson+1:60;
  save();ui.view="done";render();top();
}
function doneView(main){
  const item=lesson(ui.lesson);
  const area=el("section","completed");
  append(area,el("div","completion-check",null),el("span","student-level","LIVELLO "+item.level),
    el("h1","display-title","FATTO"));
  area.firstChild.append(icon("check",64));
  append(area,btn("CONTINUA","primary start-btn",()=>makeSession(data.assignment),{ico:"next"}),
    btn("","quiet-exit",gotoStudent,{ico:"home",aria:"Torna all'inizio"}));
  main.append(area);
}
function teacherView(main){
  append(main,el("div","eyebrow","AREA DOCENTE"),el("h1","teacher-title","Mappa del percorso"));
  main.append(el("p","teacher-lead","Le 60 unità sono organizzate in 10 livelli. Seleziona una unità per impostarla come prossima attività dello studente. I testi delle consegne e la valutazione restano qui."));
  const summary=el("section","teacher-panel");
  const count=Object.values(data.history).filter(x=>Array.isArray(x)&&x.length).length;
  append(summary,el("h2",null,"Impostazioni e progressi"),el("p","teacher-muted",count+" unità provate su 60. Progressi salvati soltanto in questo browser."));
  const nameLabel=el("label",null,"Nome locale (facoltativo)");
  nameLabel.htmlFor="student-name";
  const nameInput=el("input","teacher-input");nameInput.id="student-name";nameInput.value=data.profile.name||"";nameInput.maxLength=30;nameInput.autocomplete="off";
  const saveName=btn("Salva nome","teacher-secondary",()=>{
    data.profile.name=nameInput.value.trim().slice(0,30);
    data.profile.setup=true;data.active=null;save();render();
  });
  const typingLabel=el("label","check-label");
  const typing=el("input");typing.type="checkbox";typing.checked=!!data.preferences.typing;
  typing.addEventListener("change",()=>{
    data.preferences.typing=typing.checked;
    data.active=null;save();
  });
  append(typingLabel,typing,el("span",null,"Attiva dettati con tastiera (facoltativi; possono affaticare lo studente)"));
  append(summary,nameLabel,nameInput,saveName,typingLabel);
  const voiceBox=el("section","voice-settings");
  voiceBox.append(el("h3",null,"Voce italiana"));
  const modeLabel=el("label",null,"Riproduzione consigliata");modeLabel.htmlFor="voice-mode";
  const modeSelect=el("select","teacher-input");modeSelect.id="voice-mode";
  const neuralOption=el("option",null,"Neurale Piper (se installata)");neuralOption.value="neural";
  const deviceOption=el("option",null,"Voce del telefono");deviceOption.value="device";
  append(modeSelect,neuralOption,deviceOption);
  modeSelect.value=data.preferences.audioMode==="device"?"device":"neural";
  modeSelect.addEventListener("change",()=>{data.preferences.audioMode=modeSelect.value;stop();save();});
  append(voiceBox,modeLabel,modeSelect,
    el("p","teacher-muted","Audio neurali disponibili: "+neuralVoice.count()+". Se non sono stati ancora pubblicati o manca un file, usa automaticamente la voce del telefono."));
  const voiceSelect=el("select","teacher-input");voiceSelect.id="voice-choice";
  const populate=()=>{
    voiceSelect.replaceChildren();
    const automatic=el("option",null,"Automatica");automatic.value="";voiceSelect.append(automatic);
    const available=speechAvailable()?speechSynthesis.getVoices().filter(v=>/^it/i.test(v.lang)):[];
    for(const v of available){const option=el("option",null,v.name+" ("+v.lang+")");option.value=v.voiceURI;voiceSelect.append(option);}
    voiceSelect.value=available.some(v=>v.voiceURI===data.preferences.voiceURI)?data.preferences.voiceURI:"";
  };
  populate();
  voiceSelect.addEventListener("change",()=>{data.preferences.voiceURI=voiceSelect.value;save();selectVoice();});
  const voiceLabel=el("label",null,"Scegli una voce italiana");voiceLabel.htmlFor="voice-choice";
  const rateLabel=el("label",null,"Velocità");rateLabel.htmlFor="voice-rate";
  const rateSelect=el("select","teacher-input");rateSelect.id="voice-rate";
  for(const speed of [0.85,0.95,1,1.1]){const opt=el("option",null,speed===1?"Normale":String(speed)+"×");opt.value=String(speed);rateSelect.append(opt);}
  rateSelect.value=String(data.preferences.rate||1);
  rateSelect.addEventListener("change",()=>{data.preferences.rate=Number(rateSelect.value);save();});
  append(voiceBox,voiceLabel,voiceSelect,rateLabel,rateSelect,
    btn("Prova voce scelta","teacher-primary",()=>say("Oggi sono a scuola. Leggo una parola e poi scrivo sul quaderno.","sentence")),
    btn("Confronta voce telefono","teacher-secondary",()=>say("Oggi sono a scuola. Leggo una parola e poi scrivo sul quaderno.","sentence","device")),
    btn("Aggiorna voci","teacher-secondary",populate),
    el("p","teacher-muted","La scelta dipende dalle voci che il browser rende disponibili. Prova una voce diversa a velocità normale. Su alcuni telefoni le voci avanzate possono essere installate dalle impostazioni di accessibilità."));
  summary.append(voiceBox);
  const tools=el("div","teacher-tools");
  append(tools,btn("Esporta progressi","teacher-secondary",exportProgress),
    btn("Cancella progressi locali","teacher-secondary danger",clearProgress));
  append(summary,tools,el("p","teacher-muted","La sezione docente non è protetta da password. L’attività sul quaderno va verificata osservando la scrittura, non con il punteggio digitale."));
  main.append(summary);
  main.append(el("h2","teacher-map-title","Livelli e unità"));
  for(let level=1;level<=10;level++){
    const section=el("section","level-map");
    const heading=el("div","map-head");
    append(heading,el("div","map-index",String(level).padStart(2,"0")),
      el("h3",null,LEVELS[level-1]));
    section.append(heading);
    const list=el("div","teacher-lessons");
    for(const l of LESSONS.filter(x=>x.level===level)){
      const p=progress(l.id);
      const item=el("article","teacher-lesson"+(data.assignment===l.id?" chosen":""));
      const text=el("div","teacher-lesson-details");
      append(text,el("div","lesson-label","UNITÀ "+String(l.id).padStart(2,"0")),
        el("h4",null,l.title),el("p","teacher-muted",l.objective),
        el("p","teacher-mini",l.notebook));
      if(p.sessions.length){
        text.append(el("p","teacher-score",p.runs+" sessioni · ultimo punteggio digitale "+(p.lastAccuracy??"—")+"% · quaderno "+(p.reviewed?"verificato":"da controllare")));
      }
      const actions=el("div","teacher-lesson-actions");
      actions.append(btn(data.assignment===l.id?"SELEZIONATA":"ASSEGNA","teacher-primary",()=>{
        data.assignment=l.id;data.active=null;data.profile.setup=true;save();gotoStudent();
      }));
      if(p.sessions.length){
        actions.append(btn(p.reviewed?"Verifica annullata":"Quaderno verificato","teacher-secondary",()=>{
          data.reviewed[l.id]=!data.reviewed[l.id];save();render();
        }));
      }
      append(item,text,actions);list.append(item);
    }
    section.append(list);main.append(section);
  }
  const last=el("section","teacher-panel");
  append(last,el("h2",null,"Indicazioni didattiche"),el("p",null,"La mappa segue il sillabo dal riconoscimento delle lettere ai brevi testi. Il livello è una scelta didattica del docente, non una diagnosi. Evita di saltare una unità soltanto perché il punteggio digitale risulta alto."),
    el("p",null,"Le consegne sul quaderno sono pronunciate dall’app, ma la calligrafia e la comprensione vanno valutate da un adulto."),
    el("p",null,"Il nome e i progressi vengono salvati nel browser del dispositivo; esporta un backup se necessario. Le voci del sistema operativo possono dipendere dai servizi del fornitore."));
  main.append(last);
}
function exportProgress(){
  const payload=new Blob([JSON.stringify({schema:1,exportedAt:new Date().toISOString(),...data},null,2)],{type:"application/json"});
  const uri=URL.createObjectURL(payload);
  const a=document.createElement("a");a.href=uri;a.download="traccia-progressi.json";
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(uri),2000);
}
function clearProgress(){
  if(!confirm("Eliminare il nome e tutti i progressi memorizzati in questo browser?"))return;
  localStorage.removeItem(STORE);data=defaults();ui.view="teacher";render();top();
}
const issues=validateCurriculum();
if(issues.length){root.textContent="Impossibile caricare il percorso: "+issues.join("; ");}
else{
  render();
  if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{}));
}
