# MATITA — pacchetto completamente offline

Dopo il merge, il workflow **Audio neurale e pubblicazione Pages** crea anche l'artefatto **MATITA_OFFLINE** contenente `MATITA_OFFLINE.zip`.

Il pacchetto nasce **dallo stesso sito compilato e dallo stesso inventario Piper usati da Pages**. Un controllo verifica prima che siano presenti **tutti** gli MP3 e tutti gli SVG e che il manifest non contenga riferimenti mancanti. Se la verifica fallisce, lo ZIP non viene pubblicato.

## Scaricamento

1. Vai in GitHub → **Actions** → **Audio neurale e pubblicazione Pages**.
2. Apri una esecuzione completata con spunta verde sul branch `main`.
3. In basso, **Artifacts** → scarica `MATITA_OFFLINE`.
4. Estrai l'archivio scaricato: contiene `MATITA_OFFLINE.zip`. Estrai anche quello in una cartella del computer.
5. Apri **MATITA_OFFLINE/AVVIA_WINDOWS.bat**. Si aprirà `http://127.0.0.1:8765/`. Lascia aperta la finestra che ospita il server locale.

Il download degli artefatti richiede normalmente l'accesso a GitHub. L'artefatto ha una conservazione impostata a **90 giorni**. Dopo averlo scaricato, il pacchetto può essere conservato e trasferito su altri computer senza Internet.

## Altri sistemi
Su macOS/Linux: `sh MATITA_OFFLINE/AVVIA_MAC_LINUX.command` (richiede Python 3). In alternativa `python3 MATITA_OFFLINE/avvia_python.py`.

## Comportamento atteso

- La prima apertura e gli esercizi funzionano **senza connessione**: tutto è distribuito localmente.
- I MP3 Piper sono contenuti nel pacchetto: nessuna generazione vocale durante la lezione.
- Il fallback vocale per espressioni dinamiche non presenti nell'inventario dipende dalle voci del computer. Non si promette la stessa qualità per parole mai previste.
- I progressi sono memorizzati nel browser del singolo PC (localStorage), non nello ZIP, e non passano da un computer all'altro.
- I font Anton e Manrope vengono richiesti a Google Fonts, ma è previsto un fallback ai font di sistema; gli esercizi rimangono usabili offline. Per una distribuzione perfettamente identica nella tipografia è opportuno includere font autorizzati in una successiva versione.
- La versione non è un file HTML da aprire con doppio clic: richiede il server HTTP locale incluso nei launcher.
- La prima esecuzione dello script PowerShell può essere bloccata da criteri scolastici aziendali; in quel caso serve l'autorizzazione dei tecnici.

## File
- `scripts/build-offline-package.py`: costruzione, controllo e verifica ZIP.
- `offline/AVVIA_WINDOWS.bat`: avvio con PowerShell integrato.
- `offline/avvia_windows.ps1`: server HTTP su loopback, incluso supporto Range per MP3.
- `offline/avvia_python.py`: avvio alternativo con Python.
- `offline/AVVIA_MAC_LINUX.command`: avvio su altri sistemi.
- `offline/LEGGIMI.txt`: guida inclusa nello ZIP.

## Test da effettuare sul PC della scuola

Estrai il pacchetto, disattiva temporaneamente Wi-Fi e rete cablata, avvia il file BAT. Prova U01 (scelta immagini e audio), una unità di sillabe, una unità di frasi, il quaderno e l'area docenti. Chiudi e riapri il browser, verifica il salvataggio. Verifica inoltre la riproduzione di più MP3 consecutivi. Questi controlli su hardware reale non sono sostituiti dai test della pipeline.

**Non si registrano né si esportano dati dello studente nel processo di build.**
