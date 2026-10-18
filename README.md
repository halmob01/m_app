# m_app — Leggere e scrivere

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

La lettura iniziale è autonoma: prima il tentativo, poi il controllo con audio; è un'autovalutazione e non una misurazione della decodifica. La padronanza digitale orientativa richiede due sessioni almeno all'85% e una lettura dichiarata autonoma; la verifica docente rimane distinta.

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

## Pittogrammi per lettere e sillabe
Le unità 11, 12, 13, 19, 21, 24, 32 e 37 includono un piccolo numero di esercizi visivi **immagine + lettera/sillaba mancante**. Sono utilizzati **10 SVG originali di Tabler Icons (licenza MIT)**, conservati localmente e disponibili nella cache offline. Il catalogo è in `src/pictograms.mjs`, la guida e attribuzione in `docs/PICTOGRAMS.md` e la licenza in `assets/pictograms/LICENSE`. Gli esercizi illustrati sono pratica assistita, non certificano la decodifica senza immagine.

## Redesign e pittogrammi in 60 unità
Da questa versione, **tutte le unità U01–U60** comprendono almeno un'attività illustrata. La sezione studente ha una palette calda, carte più riconoscibili, voce prominente e tre scelte grandi; l'area docente conserva la mappa dettagliata dei livelli. La voce approvata non è stata modificata. Sono presenti **45 asset SVG locali Tabler Icons (MIT)**, con licenza originale in `assets/pictograms/LICENSE` e cache offline v6. Le attività illustrate non sostituiscono quelle di lettura indipendente. Progetto, criteri e riferimento a getdesign.md in [docs/DESIGN_ILLUSTRATED.md](docs/DESIGN_ILLUSTRATED.md).
