// Curriculum: 60 unità. Il nome personale è configurato solo nel dispositivo.
// Testi e prompt scritti per adolescenti, senza dati identificativi.
export const LEVELS = [
  "Partire da ciò che sai",
  "Le prime sillabe",
  "Leggere nuove parole",
  "Le consonanti",
  "I suoni dell’italiano",
  "Parole più complesse",
  "Dalla parola alla frase",
  "Leggere nella vita quotidiana",
  "Scrivere brevi testi",
  "Verso l’autonomia"
];

// Ogni riga: titolo; obiettivo; tipo; elementi esercitati; attività sul quaderno.
// 'visual' = riconoscimento grafico, 'sound' = ascolto e scelta,
// 'word' = parola ascoltata/scritta, 'reading' = comprensione del testo.
const RAW = [
  ["Il mio nome","Riconoscere una parola già nota e le sue lettere","visual","@NOME|@NOME_MAIUSCOLO","Scrivi il tuo nome. Poi circonda la prima e l’ultima lettera."],
  ["Le lettere del nome","Riconoscere le lettere anche fuori dal nome","visual","M|A|N|U|E|L","Copia due lettere del tuo nome. Poi scrivile senza guardare."],
  ["Le vocali A ed E","Distinguere il segno e il suono di A ed E","sound","A|E|A|E","Copia A ed E una volta. Nascondile e riscrivile."],
  ["Le vocali I, O, U","Riconoscere le altre vocali","sound","I|O|U|I|O|U","Scrivi I, O, U. Poi prova a scriverle dopo averle ascoltate."],
  ["Tutte le vocali","Riconoscere le cinque vocali in ordine diverso","sound","A|E|I|O|U","Scrivi le cinque vocali. Scegline due e cerchiale."],
  ["Controllo delle vocali","Riconoscere le vocali senza modello","sound","U|A|I|E|O","Scrivi tre vocali dopo averle ascoltate, senza copiare."],
  ["MA, ME, MI, MO, MU","Associare la consonante M alle vocali","sound","MA|ME|MI|MO|MU","Copia MA e MI. Poi nascondile e scrivi MA."],
  ["NA, NE, NI, NO, NU","Distinguere N e M nelle sillabe","sound","NA|NE|NI|NO|NU|MA","Scrivi NA, NO e NU. Poi completa MA_NO con l’insegnante."],
  ["LA, LE, LI, LO, LU","Leggere e scrivere sillabe con L","sound","LA|LE|LI|LO|LU","Copia LA, LE, LI; poi scrivi LA senza modello."],
  ["SA, SE, SI, SO, SU","Leggere e scrivere sillabe con S","sound","SA|SE|SI|SO|SU","Copia SO, SA, SE; prova a scrivere SO sotto dettatura."],
  ["Le prime parole","Fondere due sillabe in una parola","word","MANO|MELA|LUNA|SOLE|NASO","Copia MANO e SOLE. Nascondile e scrivine una sotto dettatura."],
  ["Controllo delle sillabe","Leggere parole già composte da sillabe note","word","MELA|LAMA|LUNA|NASO|SALE","Scrivi due parole ascoltate. Rileggi ciò che hai scritto."],
  ["PA, PE, PI, PO, PU","Aggiungere le sillabe con P","sound","PA|PE|PI|PO|PU","Scrivi PA, PE e PI. Poi copia PANE una volta."],
  ["TA, TE, TI, TO, TU","Aggiungere le sillabe con T","sound","TA|TE|TI|TO|TU","Copia TA, TO, TU. Scrivi TANA dopo averla ascoltata."],
  ["RA, RE, RI, RO, RU","Leggere sillabe con R","sound","RA|RE|RI|RO|RU","Scrivi RA e RE. Poi copia MARE una volta."],
  ["FA, FE, FI, FO, FU","Leggere sillabe con F","sound","FA|FE|FI|FO|FU","Scrivi FA e FO. Prova a scrivere FILO sotto dettatura."],
  ["Tre sillabe","Leggere parole più lunghe senza indovinarle","word","PAROLA|LIMONE|SAPONE|PATATA|TELEFONO","Separa PA-RO-LA sul quaderno. Poi riscrivi PAROLA senza trattini."],
  ["Nuove parole, controllo","Decodificare parole mai mostrate in questa unità","word","FARO|RANA|TELA|PANE|LIMONE","Scrivi una parola ascoltata e una scelta da te."],
  ["BA e DA","Distinguere sillabe con B e D","sound","BA|DA|BE|DE|BI|DI|BO|DO","Copia BA e DA. Poi scrivi DADO dopo averlo ascoltato."],
  ["VA, VE, VI, VO, VU","Leggere parole con V","sound","VA|VE|VI|VO|VU","Scrivi VA e VI. Poi copia VELA e VINO."],
  ["CA, CO, CU","Conoscere il suono forte di C","sound","CA|CO|CU|CA|CO","Copia CA, CO, CU. Scrivi CASA dopo averla ascoltata."],
  ["GA, GO, GU","Conoscere il suono forte di G","sound","GA|GO|GU|GA|GO","Copia GA, GO, GU. Scrivi GOLA sotto dettatura."],
  ["CA o GA?","Distinguere il suono forte di C e G","sound","CA|GA|CO|GO|CU|GU","Completa due sillabe: _A, _O. Controlla la lettera iniziale."],
  ["Controllo di C e G","Leggere parole con consonanti già apprese","word","CASA|CANE|GOLA|VINO|DADO","Copia CANE. Poi scrivi CASA senza guardare."],
  ["CE e CI","Conoscere il suono dolce di C","sound","CE|CI|CE|CI","Copia CE e CI. Poi copia CENA e VOCE."],
  ["GE e GI","Conoscere il suono dolce di G","sound","GE|GI|GE|GI","Scrivi GE e GI. Poi copia GIRA e GELATO."],
  ["CHE e CHI","Leggere il suono forte con H","sound","CHE|CHI|CHE|CHI","Copia CHE, CHI e CHIAVE. Evidenzia H."],
  ["GHE e GHI","Leggere il suono forte con GH","sound","GHE|GHI|GHE|GHI","Scrivi GHE e GHI. Poi copia GHIRO."],
  ["QU e H nelle frasi","Conoscere parole frequenti con QU, HO, HA","word","QUA|QUANDO|HO|HA|ACQUA","Scrivi HO e HA. Completa sul quaderno: Io __ fame."],
  ["Controllo dei gruppi","Distinguere gruppi ortografici nel contesto","word","CENA|GIRA|CHIAVE|GHIRO|QUANDO","Scrivi due parole ascoltate. Cerchia il gruppo difficile."],
  ["SP, ST, SC","Leggere consonanti vicine","sound","SPA|SPO|STA|STO|SCA|SCO","Copia SPA, STO, SCO. Scrivi SPESA sotto dettatura."],
  ["PR, TR, BR","Leggere gruppi di consonanti","sound","PRA|PRE|TRA|TRE|BRA|BRE","Copia PRA, TRA, TRE. Poi scrivi PRATO."],
  ["SCE e SCI","Leggere il suono di SC davanti a E/I","sound","SCE|SCI|SCE|SCI","Copia SCE e SCI. Poi copia SCENA."],
  ["GN e GLI","Riconoscere due gruppi con un suono speciale","word","BAGNO|SOGNO|FOGLIO|AGLIO|LEGNO","Copia BAGNO e FOGLIO; cerchia GN e GLI."],
  ["Le doppie","Capire che una lettera doppia può cambiare la parola","word","PALA|PALLA|NONO|NONNO|CASA|CASSA","Scrivi PALA e PALLA. Cerchia ciò che cambia."],
  ["Controllo dei gruppi","Consolidare parole con gruppi e doppie","word","TRENO|PRATO|BAGNO|PALLA|SCENA","Scrivi due parole ascoltate. Confronta con un modello."],
  ["IL, LA, UN, UNA","Unire articolo e nome","reading","IL PANE|LA CASA|UN LIBRO|UNA MELA","Copia due espressioni. Poi inventane una con le parole che sai leggere."],
  ["Chi fa cosa","Leggere soggetto e azione","reading","Luca legge.|Anna lavora.|Marco cammina.","Scrivi «Luca legge.» Poi cambia il nome con un altro."],
  ["Io sono, io ho","Leggere frasi su di sé","reading","Io sono a scuola.|Io ho una penna.|Oggi ho tempo.","Completa sul quaderno: «Io sono …» e «Io ho …»."],
  ["Dove sono","Leggere semplici indicazioni di luogo","reading","Sono a casa.|Vado a scuola.|Il libro è sul tavolo.","Scrivi una frase che dica dove sei."],
  ["Dire di no","Leggere scelte e negazioni","reading","Non voglio uscire.|Preferisco restare.|Oggi non posso.","Scrivi una frase che inizi con NON."],
  ["Il punto e la domanda","Usare maiuscola, punto e punto interrogativo","reading","Oggi piove.|Dove sei?|Arrivo domani.","Copia una frase e una domanda. Controlla il segno finale."],
  ["Un messaggio breve","Trovare un'informazione in un messaggio","reading","Ciao, arrivo alle 15.|Ci vediamo al bar.","Scrivi un messaggio con un orario."],
  ["Avvisi e cartelli","Comprendere parole presenti nella città","reading","ENTRATA|USCITA|CHIUSO|ATTENZIONE","Scrivi due parole che potresti trovare su un cartello."],
  ["Orari e appuntamenti","Leggere semplici orari","reading","La visita è alle 10.|Il treno parte alle 16.","Scrivi un appuntamento inventato con un orario."],
  ["Lista della spesa","Leggere e scrivere una lista","reading","pane, latte, mele|acqua, pasta, riso","Scrivi tre cose da comprare, una per riga."],
  ["Due istruzioni","Seguire una breve sequenza scritta","reading","Apri il quaderno. Scrivi il nome.|Prendi la penna. Copia la parola.","Scrivi due azioni da fare in ordine."],
  ["Tre frasi","Comprendere un breve testo","reading","Luca è a scuola. Ha un quaderno. Oggi scrive una frase.","Scrivi chi è il protagonista e cosa fa."],
  ["La frase del giorno","Produrre una frase autonoma","reading","Oggi sono in classe.|Dopo vado a casa.","Scrivi una frase vera sulla tua giornata."],
  ["Scrivere a un amico","Comporre due frasi in un messaggio","reading","Ciao, come stai?|Ci vediamo domani.","Scrivi un messaggio di due frasi a un amico immaginario."],
  ["Prima, poi, infine","Raccontare tre azioni in ordine","reading","Prima esco. Poi prendo il bus. Infine arrivo a scuola.","Scrivi tre azioni della tua mattina."],
  ["Descrivere un oggetto","Scrivere due frasi che descrivano","reading","Questa è una penna. È blu.|Questo è un telefono. È nero.","Scegli un oggetto reale e scrivi due frasi."],
  ["Descrivere un luogo","Scrivere frasi su un luogo noto","reading","La scuola è grande. Ha molte aule.|La strada è lunga.","Descrivi un luogo in tre frasi."],
  ["Rileggere e correggere","Migliorare il proprio testo con una checklist","reading","Oggi vado a scuola.|La penna è sul banco.","Scrivi due frasi. Controlla spazio, maiuscola e punto."],
  ["Un testo di cinque frasi","Recuperare informazioni esplicite","reading","Oggi è lunedì. Marco esce presto. Va al lavoro. Prende il bus. Arriva alle otto.","Scrivi due informazioni del testo senza copiarlo tutto."],
  ["Leggere e rispondere","Rispondere a un messaggio con informazioni pertinenti","reading","Ciao, ci vediamo alle 17?|Sì, arrivo alle 17.","Scrivi una risposta a un invito inventato."],
  ["Tre passaggi","Comprendere istruzioni in sequenza","reading","Prendi il quaderno. Scrivi la data. Poi rileggi.","Scrivi tre istruzioni semplici per un compagno."],
  ["Un modulo semplice","Capire i campi di un modulo","reading","NOME|DATA|CITTÀ|FIRMA","Copia i quattro campi. Compila con informazioni inventate, non dati reali."],
  ["Raccontare un fatto","Leggere e produrre un testo di alcune frasi","reading","Ieri Luca è uscito. Ha incontrato Anna. Sono andati al parco. Poi è tornato a casa.","Racconta una piccola esperienza in tre o cinque frasi."],
  ["Leggo e scrivo da solo","Concludere un compito autentico in autonomia","reading","Domani la biblioteca apre alle 9. Chiude alle 18. Luca vuole prendere un libro.","Scrivi un messaggio e un testo breve. Chiedi una verifica all'insegnante."]
];

const READING_QUESTIONS = {
  37:[["Quale espressione parla di una casa?","LA CASA","IL PANE","UN LIBRO"]],
  38:[["Chi legge?","Luca","Anna","Marco"],["Che cosa fa Anna?","lavora","legge","corre"]],
  39:[["Dove sono?","a scuola","a casa","al bar"],["Che cosa ho?","una penna","una bici","un libro"]],
  40:[["Dove vado?","a scuola","al lavoro","al cinema"]],
  41:[["Voglio uscire?","No","Sì","Non si sa"]],
  42:[["Quale frase è una domanda?","Dove sei?","Oggi piove.","Arrivo domani."]],
  43:[["A che ora arrivo?","alle 15","alle 12","alle 18"],["Dove ci vediamo?","al bar","a scuola","in palestra"]],
  44:[["Quale parola indica un'uscita?","USCITA","ENTRATA","CHIUSO"]],
  45:[["A che ora è la visita?","alle 10","alle 16","alle 12"],["Che cosa parte alle 16?","il treno","il bus","la visita"]],
  46:[["Quale cosa compare nella lista?","latte","scarpe","matita"]],
  47:[["Che cosa devi aprire?","il quaderno","la porta","il libro"],["Che cosa devi scrivere?","il nome","un numero","una data"]],
  48:[["Dove si trova Luca?","a scuola","a casa","in negozio"],["Che cosa scrive?","una frase","un messaggio","una lista"]],
  49:[["Dove si trova chi parla?","in classe","al bar","sul treno"]],
  50:[["Quando ci vediamo?","domani","oggi","ieri"]],
  51:[["Che cosa prende dopo essere uscito?","il bus","la bici","il treno"],["Dove arriva?","a scuola","al cinema","a casa"]],
  52:[["Di che colore è la penna?","blu","nera","rossa"]],
  53:[["Che cosa ha la scuola?","molte aule","un cinema","una piscina"]],
  54:[["Quale frase comincia con la maiuscola e finisce con il punto?","Oggi vado a scuola.","oggi vado a scuola.","Oggi vado a scuola"]],
  55:[["Dove va Marco?","al lavoro","al parco","a scuola"],["A che ora arriva?","alle otto","alle nove","alle dieci"]],
  56:[["A che ora propone l'incontro?","alle 17","alle 15","alle 19"]],
  57:[["Che cosa devi scrivere?","la data","un messaggio","un numero"]],
  58:[["Quale campo indica la città?","CITTÀ","FIRMA","DATA"]],
  59:[["Chi incontra Luca?","Anna","Marco","Paolo"],["Dove vanno insieme?","al parco","al bar","a scuola"]],
  60:[["A che ora apre la biblioteca?","alle 9","alle 8","alle 18"],["Che cosa vuole Luca?","prendere un libro","incontrare Anna","comprare il pane"]]
};

export const LESSONS = RAW.map(([title,objective,kind,values,notebook],i) => {
  const id=i+1;
  return {
    id,
    level:Math.floor(i/6)+1,
    title,
    objective,
    kind,
    items:values.split("|"),
    notebook,
    questions:(READING_QUESTIONS[id]||[]).map(([prompt,correct,wrong1,wrong2])=>({prompt,correct,options:[correct,wrong1,wrong2]}))
  };
});

export function personalizedItems(lesson,name="") {
  const safe=(name||"").trim().replace(/\s+/g," ").slice(0,30).toLocaleUpperCase("it-IT");
  if(lesson.id===1){
    return [safe||"NOME", "CASA", "SOLE", "SCUOLA"].filter(Boolean);
  }
  if(lesson.id===2 && safe){
    return [...new Set([...safe].filter(letter=>/^[A-ZÀ-Ù]$/.test(letter)))];
  }
  return lesson.items.map(x=>x==="@NOME"||x==="@NOME_MAIUSCOLO" ? (safe||"NOME") : x);
}

export function validateCurriculum() {
  const errors=[];
  if(LESSONS.length!==60)errors.push("Il sillabo non contiene 60 unità");
  const keys=new Set();
  for(const l of LESSONS){
    if(keys.has(l.id))errors.push("Duplicato: "+l.id);
    keys.add(l.id);
    if(!l.title||!l.objective||!l.notebook||l.items.length<1)errors.push("Unità incompleta: "+l.id);
    for(const q of l.questions){
      if(!q.options.includes(q.correct)||new Set(q.options).size!==3)errors.push("Domanda non valida: "+l.id);
    }
  }
  return errors;
}
