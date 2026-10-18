# Audio senza registrazioni: decisione per m_app

Il docente NON deve registrare suoni o parole. Nessun servizio esterno a pagamento.

## MVP: sintesi vocale del dispositivo
Usiamo Web Speech API (speechSynthesis e SpeechSynthesisUtterance), con lingua it-IT, preferenza per una voce italiana e attivazione mediante tocco. Serve per vocali, sillabe pronunciate naturalmente, parole, frasi, consegne e dettati. L'app non invia esplicitamente le parole a un servizio vocale; il browser o il sistema operativo possono utilizzare servizi propri per generare le voci. Non serve un account API dell'app. La disponibilità offline e la voce effettiva dipendono dal telefono: verificare sul dispositivo.

L'interfaccia tiene separati: istruzione parlata, lettura guidata, lettura autonoma e dettato. Per la lettura autonoma NON pronuncia la parola prima del tentativo; per i dettati nasconde la parola durante l'ascolto; audio sempre manuale con pulsante «Ascolta».

## Distinzione fonetica essenziale
Pronunciare la lettera M come «emme» non equivale a insegnare il fonema /m/. Non usare TTS diretto di lettere consonantiche isolate per presentare i suoni.

- A: il TTS può dire «a», verificando sul telefono.
- MA: pronunciare «ma» (sillaba intera), poi ME, MI, MO, MU.
- MANO: «mano», per confronto sillabe/parola.
- Frasi: voce naturale con ritmo moderato.
- Consonante isolata /m/: introdotta inizialmente dal docente in un momento di modellamento; poi l'app rinforza le sillabe. In versione futura, usare un asset fonetico verificato: mai assumere che una lettera o «mmmm» pronunciata dal TTS corrisponda al suono corretto.

Il nome personale noto è un punto di partenza motivante, non prova della capacità di decodificare automaticamente ogni sua lettera.

## Requisiti tecnici
- Event handler esplicito su un vero pulsante, per compatibilità iOS.
- Lingua it-IT; enumerazione delle voci con getVoices e voiceschanged; fallback su voce italiana predefinita.
- Velocità indicativa 0.85 per sillabe e parole e 0.95 per istruzioni, da validare, mai innaturalmente lenta.
- Annullare parlato precedente prima di iniziare il successivo.
- Gestire errori e assenza di voci senza bloccare gli esercizi.
- Nessuna lettura automatica ad ogni nuova schermata, nessuna musica o effetti.
- Distinzione fra audio della consegna e audio che rivela la soluzione.
- Nessuna registrazione né invio intenzionale di progressi a servizi esterni da parte dell'app. Il trattamento del testo da parte delle voci del dispositivo dipende dalle impostazioni e dal fornitore della voce.
- Non dichiarare «offline garantito» fino a prova su telefono reale.

## Alternativa se il TTS non funziona bene
Generare UNA volta un pacchetto di audio statici, automaticamente da testo, con motore TTS locale: Piper (voci italiane, verificare la licenza del modello) o eSpeak NG (robustezza, ma voce meccanica). Non grava sul telefono e non richiede registrazioni del docente. L'asset del singolo fonema deve essere revisionato prima dell'uso; parole e frasi possono essere sintetizzate in batch. Distribuire i file insieme all'app e metterli in cache per uso offline.

Non scaricare e mescolare audio casuali da Internet; ciò renderebbe pronuncia, licenze e livello didattico incontrollabili.

## Verifica obbligatoria prima della lezione
Sul vero telefono verificare: A, MA, ME, MANO, una frase, una consegna, dettato con testo nascosto, ripetizione del suono, volume/muto, comportamento senza rete. Solo audio intelligibili e consonanti corrette possono entrare nelle unità. Se il TTS sbaglia sillabe o resta muto, utilizzare audio statici approvati.

## Nota GitHub Pages
La repository m_app risulta privata. GitHub Free pubblica Pages soltanto da repository pubbliche; un piano idoneo permette siti da repository private. Un sito Pages è normalmente accessibile pubblicamente anche da repo privata. Non inserire dati identificativi, progressi personali o diagnosi nel repository.
