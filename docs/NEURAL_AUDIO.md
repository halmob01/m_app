# Audio neurale di MATITA — Piper italiano

## Come funziona
L’app preferisce un pacchetto di MP3 sintetizzati con **Piper / it_IT-paola-medium**. Il modello viene scaricato e usato solo da **GitHub Actions** per costruire il sito; non viene eseguito, installato né scaricato sul telefono. Non si richiedono registrazioni del docente.

I testi sono raccolti dalle 60 unità, dalle consegne, dalle domande di comprensione e dall’inventario effettivo degli esercizi mediante `node scripts/voice-inventory.mjs`. Non vengono inclusi cognomi, nomi personali inseriti nell’app o dati sui progressi.

Il lettore `src/neural-audio.mjs` carica `audio/generated/manifest.json`, cerca una corrispondenza esatta (ignorando maiuscole e spazi ripetuti) e, al tocco, riproduce il relativo MP3. Se la clip non esiste, il caricamento fallisce o il manifest non è ancora disponibile, il lettore richiama il TTS del dispositivo. Anche sul telefono in assenza di collegamento internet, solo le clip già in cache sono garantite dalla logica PWA: **il primo caricamento di tutti gli MP3 non è garantito offline**.

**Attenzione alla fonetica:** i singoli grafemi consonantici NON vengono presentati come fonemi generati artificialmente. Con Piper le sillabe e alcune parole possono avere errori di prosodia o lettura; ascoltare campioni e correggere o rimuovere i file errati prima di usare l'app senza supervisione.

## Preparazione alla pubblicazione — un’azione nelle impostazioni
GitHub Pages attualmente potrebbe essere impostato su **Deploy from a branch**. Il workflow introdotto qui usa invece **GitHub Actions** per pubblicare sito e audio insieme.

1. Unire la PR con il codice e i workflow.
2. In GitHub, aprire **Settings → Pages → Build and deployment → Source**.
3. Scegliere **GitHub Actions**.
4. In **Actions**, aprire **Audio neurale e pubblicazione Pages**, lanciare **Run workflow** su `main` se il workflow non è partito da solo dopo il merge.
5. Verificare che il workflow completi con successo prima di usare il sito e che `https://halmob01.github.io/m_app/audio/generated/manifest.json` restituisca una struttura JSON.
6. Aprire `https://halmob01.github.io/m_app/#docenti`, ascoltare «Prova voce scelta» e almeno 5 sillabe e 5 parole nella prima unità. Testare inoltre dettato e riproduzione ripetuta su iPhone.

L’URL **non cambia** e il vecchio QR code resta valido.

Il workflow `.github/workflows/neural-pages.yml` genera soltanto 12 clip nelle PR per il collaudo della pipeline. Su merge a `main` genera la banca completa e la distribuisce come artefatto Pages. Un workflow riuscito sul codice **non significa** che il pacchetto MP3 sia già stato pubblicato: serve la pubblicazione effettiva.

## Architettura e file
- `scripts/voice-inventory.mjs`: inventario stabile di testi; nessun dato dello studente.
- `scripts/build-neural-audio.py`: sintesi Piper e compressione MP3 con FFmpeg.
- `requirements-audio.txt`: dipendenza di build, non richiesta per lo studente.
- `audio/generated/manifest.json`: indice generato durante il deployment, non conservato nel repository.
- `audio/generated/<hash>.mp3`: clip statiche scaricate all’occorrenza.
- `src/neural-audio.mjs`: selettore audio + fallback su Web Speech API.
- `src/app.mjs`: impostazioni docenti, modalità «Neurale» o «Voce telefono» e test.
- `sw.js`: cache dell’app e download di risorse audio su richiesta.

## Origine, licenze e integrità
Voce: [rhasspy/piper-voices — it_IT/paola/medium](https://huggingface.co/rhasspy/piper-voices/tree/main/it/it_IT/paola/medium), repository che riporta licenza MIT; il modello cita il [dataset CC0](https://huggingface.co/datasets/paolapersico1/Voice-Dataset-Italian). Verificare le condizioni applicabili prima di ridistribuire gli audio al di fuori del progetto didattico.

Il workflow verifica SHA-256 del modello ONNX, fissato a:
`6fc918b5a0ea6137382833dddfa567bffbe6a5060c02043c87192ee59c04210c`

Piper è usato come strumento di build, non incluso nel codice JavaScript del sito.

## Problemi noti
- Se GitHub Pages è ancora impostato su **Deploy from a branch**, i nuovi MP3 non appariranno automaticamente sul sito.
- Se il workflow fallisce, il vecchio sito resta utilizzabile con la voce del browser finché non si pubblica un pacchetto valido.
- Per nomi personalizzati e testi mai presenti nell’inventario continua a funzionare la sintesi del telefono.
- L'audio nelle prove di lettura deve essere richiesto dopo il tentativo, per non falsare la verifica.
- La voce «Paola» è sintetica neurale, non una lettura umana registrata. La chiarezza fonetica va controllata sul dispositivo usato dallo studente.
