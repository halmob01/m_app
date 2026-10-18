# MATITA — Leggere e scrivere

Web app leggera per un percorso di **alfabetizzazione iniziale di un adolescente**, che alterna smartphone e **quaderno cartaceo**. Design sobrio; nessuna mascotte, classifica, suono automatico o registrazione richiesta al docente.

## Cosa è funzionante nella v1
- 60 unità consultabili, divise in 10 livelli, dalle vocali ai testi brevi; ciascuna unità contiene contenuti, esercizi e una consegna manuale.
- Ricerca del livello di partenza accompagnata dal docente (non è una diagnosi o test normato).
- Riconoscimento visivo, ascolto/scegli, lettera mancante, dettato facoltativo da tastiera, lettura senza audio iniziale, comprensione di frasi e testi.
- Quaderno: mostra modello, nascondi, dettato e conclusione **autodichiarata**, da verificare manualmente.
- Voce italiana tramite **Web Speech API** nativa del browser, avviata a tocco. Nessuna registrazione o chiave API dell'app; le voci possono dipendere dai servizi del dispositivo.
- Dati e nome opzionale salvati solo in localStorage sul browser del dispositivo; nessuna telemetria o database.
- Sessione interrotta riprendibile; possibilità di scegliere qualsiasi unità e ripeterla.
- Area docente locale, **non protetta**: storico delle sessioni, esito digitale, indicazione manuale quaderno verificato, esportazione JSON e cancellazione dei dati.
- File statici in cache con service worker per uso offline dopo il primo caricamento. **La voce offline non è garantita**: dipende dal dispositivo.

## Prima prova
1. Aprire l'app dal browser mobile dopo la pubblicazione come sito statico (HTTPS).
2. Configurare solo il nome, se utile. È salvato localmente: non mettere cognomi, diagnosi o altri identificativi nel repository.
3. Iniziare da U01 oppure far scegliere al docente un'unità in base alle competenze osservate.
4. In ascolto premere **Ascolta** (nessuna riproduzione automatica).
5. Quando appare «Quaderno», alternare copia e richiamo dalla memoria, nascondendo il modello e ascoltando il dettato.
6. Nell'area docente controllare il quaderno reale; il «completato» dello studente non è una certificazione di correttezza.

Nelle prove di lettura lo studente prova prima a leggere, poi ascolta per confrontare la propria risposta; l'autovalutazione non sostituisce la verifica del docente. I criteri orientativi per la parte digitale prevedono due sessioni almeno all'85% e un tentativo di lettura prima del suggerimento audio; la scrittura sul quaderno viene controllata separatamente.

## Eseguire in locale

Nessuna dipendenza npm per l'app stessa. È sufficiente servire la cartella con un server HTTP locale:

\`\`\`bash
python3 -m http.server 8080
\`\`\`

Aprire http://localhost:8080 (la Web Speech API dipende da disponibilità del browser e voci installate). La registrazione del service worker richiede localhost o HTTPS.

Test del sillabo e della logica:

\`\`\`bash
npm run check
\`\`\`

Richiede Node.js 20 o successivo. I test verificano struttura delle 60 unità, numero e unicità delle risposte, variazione della posizione corretta, personalizzazione locale, assenza di TTS sulle consonanti isolate e criteri di avanzamento. Non sostituiscono la prova pratica.

## Pubblicazione
È una **single-page web app statica senza build**. Può essere pubblicata via GitHub Pages, Cloudflare Pages, Netlify o un comune server HTTPS. Le risorse usano percorsi relativi e funzionano anche sotto /m_app/.

La repo è attualmente **privata**. Se usi GitHub Free, Pages generalmente richiede una repo pubblica; puoi mantenere privata la repo e usare un altro hosting statico che supporti deploy privati. Verifica piano e policy della scuola. Anche con codice privato, l'URL di un sito pubblicato potrebbe essere accessibile pubblicamente. Non includere nel sito dati clinici o personali.

Per GitHub Pages, dopo il merge e se la tua configurazione lo consente: **Settings → Pages → Deploy from a branch → main → /(root)**. Aspettare l'indirizzo fornito da GitHub (non inventare URL). Un cambio di deploy richiede ricaricare la pagina: la cache offline v1 è prioritaria finché non si aggiorna il nome della cache nel service worker.

## Struttura
- \`index.html\`, \`src/styles.css\` — interfaccia responsive.
- \`src/app.mjs\` — flusso lezione, voce, salvataggio, area docente.
- \`src/curriculum.mjs\` — 60 unità e domande di comprensione, contenuti separati dal motore.
- \`src/engine.mjs\` — costruzione attività e distrattori, controllo automatico.
- \`sw.js\`, \`manifest.webmanifest\` — base PWA/offline.
- \`tests/curriculum.test.mjs\` — test automatici.
- \`docs/SILLABO.md\` e \`docs/AUDIO.md\` — riferimenti didattici e tecnici.
- \`prototype/audio.html\` — banco prova voce della PR precedente.

## Limiti da non confondere con funzioni completate
- **Non sono presenti** riconoscimento vocale, scansione/valutazione della scrittura, account, sincronizzazione multipiattaforma, audio fonetici isolati sintetici revisionati, tutor AI o analytics remoti.
- Il nome dello studente non compare nel codice. Qualsiasi profilo impostato localmente rimane tuttavia accessibile a chiunque usi quello stesso browser/dispositivo. L'app non trasmette esplicitamente nome o progressi; il motore TTS dell'OS/browser può dipendere dal fornitore del dispositivo.
- Voce Web Speech, offline, navigazione, tastiera virtuale e interfaccia vanno provati **sull'iPhone reale** e con il ragazzo. Le voci italiane possono variare; non usare la pronuncia del nome di una consonante come se fosse il suo fonema.
- Le 60 unità costituiscono una prima banca di contenuti completa e strutturata, **non un programma pedagogico validato**: la qualità dell'audio, la progressione fonografica, il lessico e il carico cognitivo richiedono revisione di un docente e calibrazione sul PEI. Non procedere alla lezione successiva solo perché l'app ha registrato un punteggio alto.
- Il backend non esiste: si può usare un solo dispositivo e una sola installazione browser alla volta. Cancellare i dati Safari elimina i progressi senza backup.
- La configurazione del docente non ha password: non è un registro scolastico e non va trattata come tale.

## Priorità dopo la prova in classe
1. Provare l'intera U01–U06 con studente e docente, correggere suoni e tempi.
2. Verificare che i distrattori siano sempre pertinenti e privi di indizi accidentali in tutte le unità.
3. Aggiungere tracce TTS pre-generate automaticamente e revisionate per suoni che il browser non pronuncia correttamente.
4. Ripensare le unità che il ragazzo affronta con difficoltà grafo-motorie; non limitare l'avanzamento alla calligrafia.
5. Aggiornare service worker version a ogni release che modifica i file statici.


## Voce neurale italiana (nuova)
L'interfaccia ora può riprodurre **MP3 neurali Piper/Paola generati automaticamente** durante il deployment GitHub Actions, anziché usare esclusivamente la voce sintetica predefinita del telefono. Non è necessaria alcuna registrazione. Dall'area docenti si può passare alla voce del dispositivo, ascoltare un esempio o modificarne la velocità. Le clip personalizzate o assenti usano il TTS del browser come fallback.

**Importante:** per pubblicare effettivamente i file audio aprire **GitHub Settings → Pages → Source: GitHub Actions** dopo il merge, quindi controllare che il workflow **Audio neurale e pubblicazione Pages** sia riuscito. Finché non si esegue e non completa con successo, il sito continua a usare la voce precedente. Il modello non viene scaricato sullo smartphone.

Manuale completo, licenze e verifica fonetica: [docs/NEURAL_AUDIO.md](docs/NEURAL_AUDIO.md).

## Pittogrammi nelle 60 unità e redesign MATITA
Ogni unità U01–U60 contiene **un'attività visuale** graduata, realizzata con **33 pittogrammi SVG Tabler Icons** conservati localmente sotto licenza MIT. La voce approvata resta invariata.

- U01–U10: ascolto e selezione tra tre disegni, senza richiedere lettura.
- U11–U36: una lettera o una sillaba mancante, con un pittogramma di supporto.
- U37–U60: breve frase funzionale e parola mancante con contesto visivo.

Le prove di lettura e le attività sul quaderno continuano a essere proposte anche senza indizi illustrati. L'interfaccia dello studente mostra soprattutto il livello, il pulsante di ascolto e le risposte grandi; i dettagli restano nell'area docente.

Il redesign utilizza **Anton** e **Manrope**, superfici calde, navy e verde tenue, ispirandosi alla gerarchia visiva di design esaminati su [getdesign.md](https://getdesign.md/). Tutte le scelte e gli anti-pattern sono documentati in [DESIGN.md](DESIGN.md). Catalogo e linee guida di attribuzione in [docs/PICTOGRAMS.md](docs/PICTOGRAMS.md), testo MIT in [assets/pictograms/LICENSE](assets/pictograms/LICENSE). Gli asset usati dall'app sono inclusi nella cache della PWA **v6**.
