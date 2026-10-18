import {LEVELS,LESSONS,personalizedItems,validateCurriculum} from "./curriculum.mjs";
import {makeActivities,checkChoice,scoreSession} from "./engine.mjs";

const STORE="m_app_local_v1";
const empty=()=>({profile:{name:"",setup:false},history:{},reviewed:{},active:null});
let data=readStore();
let current={view:"home",id:1,tasks:[],index:0,answered:false,tries:0,feedback:null,readStep:0,modelHidden:false,typedText:"",score:{correct:0,answered:0,independentRead:false,notebookDone:false}};
const root=document.getElementById("app");
let audioStatus="";
let voice=null;

function readStore(){
  try {
    const v=JSON.parse(localStorage.getItem(STORE)||"null");
    if(v&&typeof v==="object"&&!Array.isArray(v))
      return {...empty(),...v,profile:{...empty().profile,...v.profile},history:v.history&&typeof v.history==="object"?v.history:{},reviewed:v.reviewed&&typeof v.reviewed==="object"?v.reviewed:{}};
  }catch{/* blocked or corrupt storage */}
  return empty();
}
function persist(){
  try {localStorage.setItem(STORE,JSON.stringify(data));return true;}catch {return false;}
}
function e(tag,cls,text){
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!==undefined&&text!==null)n.textContent=String(text);
  return n;
}
function add(p,...items){items.flat().filter(Boolean).forEach(x=>p.append(x));return p;}
function button(label,cls,fn){
  const b=e("button",cls,label);b.type="button";b.addEventListener("click",fn);return b;
}
function heading(kicker,title,intro=""){
  const b=e("div");
  add(b,e("div","eyebrow",kicker),e("h1",null,title));
  if(intro)add(b,e("p","lead",intro));
  return b;
}
function card(...children){return add(e("section","card"),...children);}
function divLine(){return e("div","divider");}
function note(text){return e("p","small",text);}
function scrollTop(){window.scrollTo({top:0,behavior:"instant"});}
function speechSupported(){return "speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;}
function selectVoice(){
  if(!speechSupported())return;
  const voices=speechSynthesis.getVoices();
  voice=voices.find(v=>v.lang.toLowerCase()==="it-it")||voices.find(v=>v.lang.toLowerCase().startsWith("it"))||null;
}
if(speechSupported()){
  selectVoice();
  speechSynthesis.addEventListener?.("voiceschanged",selectVoice);
}
function stopVoice(){if(speechSupported())speechSynthesis.cancel();}
function speak(text,kind="word"){
  audioStatus="";
  if(!speechSupported()){audioStatus="La voce non è disponibile in questo browser.";render();return;}
  selectVoice();
  stopVoice();
  const utterance=new SpeechSynthesisUtterance(String(text));
  utterance.lang="it-IT";
  if(voice)utterance.voice=voice;
  utterance.rate=kind==="instruction"?0.96:kind==="sentence"?0.93:0.86;
  utterance.pitch=1;
  utterance.onerror=()=>{audioStatus="Impossibile riprodurre l’audio. Controlla la voce italiana e il volume.";render();};
  speechSynthesis.speak(utterance);
}
function speakBtn(text,label="Ascolta",kind="word"){
  return button("◖))  "+label,"secondary",()=>speak(text,kind));
}
function showView(view){stopVoice();current.view=view;audioStatus="";render();scrollTop();}
function home(){showView("home");}
function progressFor(id){
  const history=data.history[id]||[];
  return {history,...scoreSession(history),reviewed:!!data.reviewed[id]};
}
function getLesson(id){return LESSONS.find(l=>l.id===Number(id));}
function render(){
  root.replaceChildren();
  const shell=e("div","shell");
  const header=e("header","topbar");
  const logo=button("","brand",home);
  add(logo,e("span","monogram","m"),e("span",null,"m_app"));
  const nav=e("div","nav-actions");
  add(nav,button("Percorso","",home),button("Docente","",()=>showView("teacher")));
  add(header,logo,nav);
  const main=e("main");main.id="main";main.tabIndex=-1;
  if(!data.profile.setup)setup(main);
  else if(current.view==="home")homeScreen(main);
  else if(current.view==="unit")unitScreen(main);
  else if(current.view==="done")doneScreen(main);
  else if(current.view==="teacher")teacherScreen(main);
  else if(current.view==="profile")profileScreen(main);
  const footer=e("footer","footer","Progressi salvati sul dispositivo. Nessun account o servizio esterno. Il quaderno richiede la verifica di un adulto.");
  add(shell,header,main,footer);root.append(shell);
}
function setup(main){
  add(main,heading("Benvenuto","Un passo alla volta.","Impara a leggere e scrivere. Userai il telefono e anche il quaderno."));
  const c=card(e("h2",null,"Prima di iniziare"),note("Puoi scrivere solo il tuo nome, se vuoi. Rimane su questo dispositivo e non viene inviato a nessuno."));
  const label=e("label",null,"Nome (facoltativo)");
  label.htmlFor="name";
  const input=e("input","field");input.id="name";input.autocomplete="off";input.maxLength=30;input.placeholder="Il tuo nome";input.value=data.profile.name||"";
  const start=button("Inizia il percorso","primary wide",()=>{
    data.profile.name=input.value.trim().slice(0,30);
    data.profile.setup=true;
    persist();home();
  });
  add(c,label,input,note("Anche senza inserire un nome puoi iniziare. Lo potrai aggiungere in seguito."),start);
  add(main,c);
}
function homeScreen(main){
  const greeting=data.profile.name?"Ciao, "+data.profile.name+".":"Leggere e scrivere.";
  add(main,heading("Il tuo percorso",greeting,"Un esercizio alla volta. Quando compare il quaderno, scrivi a mano."));
  const completed=Object.values(data.history).filter(h=>Array.isArray(h)&&h.length).length;
  const count=e("div","row");
  add(count,e("span","small",completed+" unità provate su 60"),e("span","chip","10 livelli"));
  const bar=e("div","progress");const inner=e("div");inner.style.width=(completed/60*100)+"%";bar.append(inner);
  const intro=card(e("h2",null,data.active?"Riprendi da dove eri":"Da dove cominciamo?"),note("Il livello iniziale si può scegliere con l'insegnante. Non sei obbligato a completare tutto in ordine."));
  if(data.active&&getLesson(data.active.id)){
    add(intro,button("Riprendi l’unità "+String(data.active.id).padStart(2,"0"),"primary wide",resume));
  }else{
    const suggested=LESSONS.find(l=>!data.history[l.id]?.length)||LESSONS[0];
    add(intro,button("Apri: "+suggested.title,"primary wide",()=>startLesson(suggested.id)));
  }
  add(intro,divLine(),count,bar);
  add(main,intro,e("h2",null,"Tutte le unità"));
  for(let level=1;level<=10;level++){
    const group=e("section");
    const head=e("div","level-heading");
    add(head,e("h3",null,String(level).padStart(2,"0")+" / "+LEVELS[level-1]),e("span","caption","6 unità"));
    const list=e("div","lesson-list");
    for(const lesson of LESSONS.filter(l=>l.level===level)){
      const p=progressFor(lesson.id);
      const b=button("","lesson-link",()=>startLesson(lesson.id));
      add(b,e("span","lesson-num",String(lesson.id).padStart(2,"0")),e("span","lesson-title",lesson.title),e("span","lesson-meta",p.history.length?"Ripetibile":"Apri"));
      list.append(b);
    }
    add(group,head,list);main.append(group);
  }
  main.append(button("Modifica il nome sul dispositivo","text-button",()=>showView("profile")));
}
function profileScreen(main){
  add(main,heading("Impostazioni","Il tuo nome","Questo dato resta nella memoria di questo browser."));
  const c=card();
  const l=e("label",null,"Nome");l.htmlFor="editname";
  const inp=e("input","field");inp.id="editname";inp.maxLength=30;inp.value=data.profile.name||"";
  add(c,l,inp,button("Salva","primary wide",()=>{data.profile.name=inp.value.trim().slice(0,30);data.active=null;persist();home();}),note("Cambiare il nome azzera soltanto un’eventuale unità incompleta, non i risultati già salvati."));
  add(main,c);
}
function startLesson(id){
  const lesson=getLesson(id);
  if(!lesson)return;
  stopVoice();
  current={...current,view:"unit",id:lesson.id,tasks:makeActivities(lesson,data.profile.name),index:0,answered:false,tries:0,feedback:null,readStep:0,modelHidden:false,typedText:"",score:{correct:0,answered:0,independentRead:false,notebookDone:false}};
  rememberDraft();
  render();scrollTop();
}
function rememberDraft(){
  if(current.view!=="unit")return;
  data.active={id:current.id,tasks:current.tasks,index:current.index,answered:current.answered,tries:current.tries,feedback:current.feedback,readStep:current.readStep,modelHidden:current.modelHidden,typedText:current.typedText,score:current.score};
  persist();
}
function resume(){
  const a=data.active;
  if(!a||!getLesson(a.id)||!Array.isArray(a.tasks)||!a.tasks.length){data.active=null;persist();home();return;}
  current={...current,...a,view:"unit",score:{correct:0,answered:0,independentRead:false,notebookDone:false,...a.score}};
  render();scrollTop();
}
function unitScreen(main){
  const lesson=getLesson(current.id);
  if(!lesson){home();return;}
  const total=current.tasks.length;
  const task=current.tasks[current.index];
  if(!task){finish();return;}
  const top=e("div","row");
  add(top,e("span","eyebrow","Unità "+String(current.id).padStart(2,"0")+" · "+LEVELS[lesson.level-1]),e("span","chip",(current.index+1)+" / "+total));
  add(main,top,e("h1",null,lesson.title),e("p","lead",lesson.objective));
  const progress=e("div","progress");
  const fill=e("div");fill.style.width=(((current.index+1)/total)*100)+"%";progress.append(fill);main.append(progress);
  const c=card();
  if(task.type==="visual")visualScreen(c,task);
  else if(task.type==="listen")listenScreen(c,task);
  else if(task.type==="complete")completeScreen(c,task);
  else if(task.type==="read")readScreen(c,task);
  else if(task.type==="typing")typingScreen(c,task);
  else if(task.type==="comprehension")comprehensionScreen(c,task);
  else if(task.type==="notebook")notebookScreen(c,task,lesson);
  add(main,c);
  const controls=e("div","btn-row");
  add(controls,button("Esci e riprendi dopo","secondary",home),button("Ricomincia l’unità","text-button",()=>{if(confirm("Ricominciare l’unità dall’inizio?"))startLesson(current.id);}));
  add(main,controls);
}
function taskHeader(c,kicker,title,description){
  add(c,e("div","eyebrow",kicker),e("h2",null,title));
  if(description)c.append(note(description));
}
function listeningButtons(c,readout,kind){
  const buttons=e("div","btn-row");
  add(buttons,speakBtn("Ascolta e scegli.","Consegna","instruction"),speakBtn(readout,"Ascolta di nuovo",kind));
  add(c,buttons);
  if(audioStatus)c.append(e("div","feedback error",audioStatus));
}
function optionButtons(c,task){
  const options=e("div","choices");options.setAttribute("role","group");options.setAttribute("aria-label","Risposte possibili");
  for(const value of task.choices){
    const b=button(value,"choice",()=>answerChoice(task,value));
    if(current.feedback&&current.feedback.value===value)b.classList.add((current.feedback.correct||current.feedback.revealed)?"success":"error");
    if(current.answered)b.disabled=true;
    options.append(b);
  }
  c.append(options);
  if(current.feedback){
    const good=current.feedback.correct;
    const text=current.feedback.revealed?"La risposta corretta è: "+task.correct+".":good?"Corretto. Puoi continuare.":current.tries>=2?"Non è corretto. Riprova oppure passa alla correzione.":"Non è corretto. Riprova.";
    c.append(e("div","feedback "+(good?"success":"error"),text));
    if(!good&&current.tries>=2&&!current.feedback.revealed){
      c.append(button("Mostra la risposta e continua","secondary wide",()=>{
        current.feedback={value:task.correct,correct:false,revealed:true};
        current.answered=true;nextButtonOnly();
      }));
    }
  }
  if(current.answered)nextButton(c);
}
function answerChoice(task,value){
  if(current.answered)return;
  const good=checkChoice(task,value);
  if(current.tries===0){
    current.score.answered++;
    if(good)current.score.correct++;
  }
  current.tries++;
  current.feedback={value,correct:good};
  current.answered=good;
  rememberDraft();render();
}
function visualScreen(c,task){
  taskHeader(c,"01 / Riconoscimento","Trova lo stesso segno","Osserva e scegli l’elemento uguale. Non serve ascoltare lettere isolate.");
  c.append(e("div","stimulus",task.display));
  optionButtons(c,task);
}
function typingScreen(c,task){
  taskHeader(c,"02 / Scrittura sul telefono","Scrivi dopo l’ascolto","Ascolta senza vedere la parola. Se la tastiera è faticosa, puoi saltare: scriverai sul quaderno.");
  c.append(speakBtn(task.readout,"Ascolta il dettato",task.readout.length>20?"sentence":"word"));
  if(audioStatus)c.append(e("div","feedback error",audioStatus));
  const form=e("form");
  const lab=e("label",null,"Scrivi qui ciò che hai ascoltato");lab.htmlFor="typed";
  const input=e("input","field");input.id="typed";input.type="text";input.autocomplete="off";input.autocapitalize="characters";
  input.spellcheck=false;input.value=current.typedText||"";
  input.disabled=current.answered;
  input.addEventListener("input",()=>{current.typedText=input.value;rememberDraft();});
  const check=e("button","primary wide","Controlla");
  check.type="submit";check.disabled=current.answered;
  form.addEventListener("submit",event=>{event.preventDefault();if(!current.answered)answerChoice(task,input.value);});
  add(form,lab,input,check);c.append(form);
  if(current.feedback){
    const message=current.feedback.revealed?"Risposta: "+task.correct:current.feedback.correct?"Corretto.":current.tries>=2?"Riprova oppure mostra la risposta.":"Non è corretto. Prova ancora.";
    c.append(e("div","feedback "+(current.feedback.correct?"success":"error"),message));
    if(!current.answered&&current.tries>=2)c.append(button("Mostra la risposta","secondary wide",()=>{current.feedback={value:task.correct,correct:false,revealed:true};current.answered=true;rememberDraft();render();}));
  }
  if(current.answered)nextButton(c);
  else c.append(button("Salta la tastiera","text-button",advance));
}
function listenScreen(c,task){
  taskHeader(c,"01 / Ascolto","Quale parola senti?","Ascolta il suono. Poi scegli una risposta.");
  listeningButtons(c,task.readout,task.readout.length>20?"sentence":"word");
  optionButtons(c,task);
}
function completeScreen(c,task){
  taskHeader(c,"02 / Scrittura","Quale lettera manca?","Guarda la parola e scegli la lettera corretta.");
  add(c,e("div","stimulus",task.display),speakBtn(task.readout,"Ascolta la parola"));
  if(audioStatus)c.append(e("div","feedback error",audioStatus));
  optionButtons(c,task);
}
function comprehensionScreen(c,task){
  taskHeader(c,"03 / Comprensione","Leggi e rispondi","Trova la risposta nel testo. Non serve ascoltarlo prima.");
  add(c,e("div","passage",task.passage),e("h3",null,task.prompt));
  optionButtons(c,task);
}
function readScreen(c,task){
  taskHeader(c,"Lettura autonoma","Prova a leggere","Prima leggi da solo. Poi puoi controllare con l’audio.");
  c.append(e("div","stimulus "+(task.display.length>22?"sentence":""),task.display));
  if(current.readStep===0){
    c.append(button("Ho provato a leggere","primary wide",()=>{current.readStep=1;rememberDraft();render();}));
  }else{
    c.append(speakBtn(task.readout,"Ascolta e controlla",task.readout.length>22?"sentence":"word"));
    c.append(note("Dopo aver ascoltato, indica se la tua lettura corrispondeva. È un'autovalutazione, non una verifica automatica."));
    const actions=e("div","btn-row");
    add(actions,button("Sì, corrispondeva","secondary",()=>{current.score.independentRead=true;advance();}),button("Devo riprovare","secondary",advance));
    c.append(actions);
  }
  if(audioStatus)c.append(e("div","feedback error",audioStatus));
}
function notebookScreen(c,task,lesson){
  taskHeader(c,"Quaderno","Adesso scrivi a mano","Prendi il quaderno. Puoi lavorare con calma.");
  const box=e("div","notebook");
  add(box,e("div","notebook-mark","QUADERNO"),e("p",null,task.prompt));
  c.append(box);
  c.append(note("Modello da copiare. Dopo aver copiato, nascondilo e prova a riscrivere senza guardare."));
  const term=personalizedItems(lesson,data.profile.name)[0];
  const model=e("div","stimulus "+(current.modelHidden?"hidden-model ":"")+(term.length>18?"sentence":""),term);
  model.setAttribute("aria-label",current.modelHidden?"Modello nascosto":term);
  c.append(model);
  const acts=e("div","btn-row");
  add(acts,button(current.modelHidden?"Mostra il modello":"Nascondi il modello","secondary",()=>{current.modelHidden=!current.modelHidden;rememberDraft();render();}),speakBtn(term,"Dettato","word"));
  c.append(acts);
  if(audioStatus)c.append(e("div","feedback error",audioStatus));
  c.append(note("L'app non può controllare il quaderno. Segnala solo che hai terminato; un insegnante controllerà la scrittura."));
  c.append(button("Ho terminato sul quaderno","primary wide",()=>{current.score.notebookDone=true;advance();}));
}
function nextButton(c){
  const label=current.index===current.tasks.length-1?"Completa l’unità":"Continua";
  c.append(button(label,"primary wide",advance));
}
function nextButtonOnly(){rememberDraft();render();}
function advance(){
  stopVoice();
  if(current.index>=current.tasks.length-1){finish();return;}
  current.index++;
  current.answered=false;current.tries=0;current.feedback=null;current.readStep=0;current.modelHidden=false;current.typedText="";
  rememberDraft();render();scrollTop();
}
function finish(){
  const history=data.history[current.id]||[];
  const session={...current.score,endedAt:new Date().toISOString()};
  history.push(session);
  data.history[current.id]=history.slice(-20);
  // Una nuova attività manuale richiede una nuova osservazione: non ereditare una verifica precedente.
  data.reviewed[current.id]=false;
  data.active=null;
  persist();
  current.view="done";
  render();scrollTop();
}
function doneScreen(main){
  const lesson=getLesson(current.id);
  const p=progressFor(current.id);
  add(main,heading("Unità conclusa",lesson.title,"Il lavoro digitale è terminato. Puoi ripetere la stessa unità quando vuoi."));
  const rate=current.score.answered?Math.round(100*current.score.correct/current.score.answered):null;
  const c=card();
  add(c,e("h2",null,"Riepilogo"),e("div","summary-number",rate===null?"—":rate+"%"),note("Risposte corrette al primo tentativo negli esercizi con correzione automatica."));
  add(c,e("p",null,current.score.notebookDone?"Quaderno: attività dichiarata conclusa, in attesa di verifica.":"Quaderno: non registrato."),e("p",null,"Lettura: "+(current.score.independentRead?"lo studente dichiara di aver letto correttamente.":"da riprovare o verificare con l’insegnante.")));
  if(p.digitalTarget)add(c,e("div","feedback","Due sessioni digitali almeno all’85%, con una prova di lettura dichiarata autonoma. Non equivale a certificare la competenza."));
  const row=e("div","btn-row");
  add(row,button("Ripeti l’unità","secondary",()=>startLesson(current.id)),button(current.id===60?"Torna al percorso":"Unità successiva","primary",()=>current.id===60?home():startLesson(current.id+1)));
  add(c,row);main.append(c);
  main.append(button("Torna al percorso","text-button",home));
}
function teacherScreen(main){
  add(main,heading("Area docente","Osserva i progressi","Questa schermata non è protetta da password. Il controllo delle attività scritte avviene sul quaderno reale."));
  const done=Object.keys(data.history).length;
  const c=card(e("h2",null,"Risultati locali"),note(done+" unità con almeno una sessione registrata. I punteggi misurano solo gli esercizi digitali correggibili automaticamente."));
  const action=e("div","btn-row");
  add(action,button("Esporta progressi JSON","secondary",exportData),button("Rimuovi dati locali","secondary",clearData));
  add(c,action,divLine());
  for(const lesson of LESSONS){
    const p=progressFor(lesson.id);
    if(!p.history.length)continue;
    const row=e("div","row");
    const detail=e("div","stack");
    add(detail,e("strong",null,String(lesson.id).padStart(2,"0")+" — "+lesson.title),e("span","small",p.runs+" sessioni · ultima prova: "+(p.lastAccuracy??"—")+"% · "+(p.digitalTarget?"criterio digitale raggiunto":"da consolidare")));
    const b=button(p.reviewed?"Quaderno verificato ✓":"Segna quaderno verificato","secondary",()=>{
      data.reviewed[lesson.id]=!data.reviewed[lesson.id];persist();render();
    });
    add(row,detail,b);
    add(c,row,divLine());
  }
  if(!done)c.append(note("Non sono presenti sessioni completate."));
  c.append(e("div","alert","Il segno «quaderno verificato» viene inserito manualmente. Non documenta da solo una padronanza acquisita: occorre leggere e osservare gli elaborati."));
  main.append(c);
  const back=button("Torna al percorso","primary",home);
  add(main,back);
}
function exportData(){
  const dump={schema:1,exportedAt:new Date().toISOString(),...data};
  const blob=new Blob([JSON.stringify(dump,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="m_app-progressi.json";document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2500);
}
function clearData(){
  if(!confirm("Eliminare definitivamente nome e progressi salvati su questo dispositivo?"))return;
  localStorage.removeItem(STORE);
  data=empty();current.view="home";render();scrollTop();
}
const problems=validateCurriculum();
if(problems.length){
  root.textContent="Impossibile aprire il percorso: "+problems.join("; ");
}else{
  // Non viene inviato alcun evento a un server: lo storico resta nel browser.
  render();
  if("serviceWorker" in navigator){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{}));
  }
}
