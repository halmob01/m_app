# TRACCIA — DESIGN.md (v2)

## Intento
Piccolo redesign editoriale dell'app di alfabetizzazione, senza modificare la voce già approvata né l'architettura delle 60 unità. Target: adolescente che non può leggere istruzioni lunghe. Interfaccia mobile, non infantile. **Il design deve ridurre il carico cognitivo, non aggiungere decorazione.**

## Riferimenti visitati su getdesign.md
- [Apple](https://getdesign.md/design-md/apple): economia visiva, respiro e gerarchia delle azioni. Non adottare la sua tipografia di sistema per il brand, perché il progetto ha già una coppia approvata.
- [Lovable](https://getdesign.md/design-md/lovable): superfici calde e accoglienti senza azzerare il contrasto.
- [PlayStation](https://getdesign.md/design-md/playstation): oggetti/azioni centrali in grandi aree visive, con una scelta prioritaria per schermata.

**Interpretazione originale, non replica di template o componenti proprietari.** Non importare framework grafici nuovi. Mantenere CSS semplice.

## Direzione attuata
- Font: **Anton** per identità e titoli di livello; **Manrope** per risposte, etichette e testi docenti. SVG pittogrammi originali **Tabler** (MIT) disponibili nella cartella asset e senza CDN.
- Fondo: caldo quasi bianco; testo: blu notte/charcoal; accenti: navy e verde salvia tenue; segnale lime usato solo per microdettagli. Non moltiplicare colori funzionali.
- Spazio: layout a colonna singola su telefono, risposta 3 pulsanti grandi, spaziatura generosa; card della figura predominante.
- Azioni: **ASCOLTA**, tre alternative, **AVANTI**. Quaderno sempre distinto. Area docente resta in accesso secondario e contiene mappa dei livelli, obiettivi, dati e opzioni. Nessun testo introduttivo da leggere lato studente.
- Disegni: SVG riconoscibili, dimensioni coerenti, non trasformarli in illustrazioni caricaturali. Non aggiungere foto stock o AI generata.
- Movimento: microtransizioni solo su pressione/feedback; `prefers-reduced-motion` rispettato. Non serve motion scroll.
- Accessibilità: contrasto elevato, target touch grandi, focus evidente, testo alternativo per pittogrammi, pulsanti non identificati solo dal colore.
- Audio: pulsante esplicito. La voce neurale già presente non viene cambiata. Nessun audio che anticipi la soluzione in prove autonome.
- Prove: l'immagine è un **supporto**. Lettura autonoma e scrittura sul quaderno continuano senza indizi visivi. Le frasi in livelli 7–10 sono brevi, funzionali e non vincolano la verifica della decodifica.

## Anti-pattern
Blocchi di testo nello schermo studente, barre di navigazione affollate, classifica/mascotte, espressioni infantili, tappeti di icone, bottoni sotto 48 px, risposte corrette riconoscibili dalla lunghezza o da un disegno ambiguo.

## Manutenzione
Ogni nuova unità include una domanda visuale catalogata in `src/pictograms.mjs`. Tutti i file hanno attribuzione Tabler MIT. Ogni cambio al catalogo deve aggiornare il service worker e testare sia la progressione sia la disponibilità offline. Il costo offline dipende dalla lista cache, non dai nomi dell'app o dalle pagine pubbliche.
