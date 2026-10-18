# Pittogrammi per gli esercizi (prima selezione)

## Libreria scelta

**Tabler Icons** — https://tabler.io/icons  
Repository sorgente: https://github.com/tabler/tabler-icons  
Licenza: **MIT**. Copia della licenza originale inclusa in `assets/pictograms/LICENSE`.

La libreria offre icone vettoriali sobrie e coerenti, senza dipendere da API, CDN o servizi al momento dell'uso. Le copie statiche sono versionate nel repository; per rispettare la licenza conserviamo attribuzione e testo MIT. Non sono state generate nuove illustrazioni.

## Asset attualmente importati

| Nome dell'oggetto | Icona Tabler | File locale |
|---|---|---|
| Mela | `apple` | `mela.svg` |
| Mano | `hand-stop` | `mano.svg` |
| Sole | `sun` | `sole.svg` |
| Luna | `moon` | `luna.svg` |
| Pane | `bread` | `pane.svg` |
| Casa | `home` | `casa.svg` |
| Cane | `dog` | `cane.svg` |
| Dado | `dice-5` | `dado.svg` |
| Treno | `train` | `treno.svg` |
| Libro | `book` | `libro.svg` |

Origine dei file: `icons/outline/<nome-icon>.svg` nel repository Tabler. I file sono conservati con la loro definizione grafica originale.

## Attività integrate

Nel modulo `src/pictograms.mjs` è definita la relazione **lezione – parola – figura – maschera – tre scelte**. I task sono aggiunti dal motore agli esercizi previsti per le unità 11, 12, 13, 19, 21, 24, 32 e 37.

Due tipologie: 
- `picture-letter`: immagine + parola con **una lettera** mancante, con tre scelte di una lettera.
- `picture-syllable`: immagine + parola con **una sillaba** mancante, con tre scelte della stessa lunghezza.

Il lato studente mostra: **pulsante Ascolta**, pittogramma grande, parola incompleta, tre pulsanti grandi. Il nome della figura non viene letto automaticamente, per non fornire involontariamente la risposta. La consegna invece è pronunciata. Non si devono pronunciare consonanti isolate attraverso un TTS che potrebbe leggerne il nome.

## Regole didattiche

Queste attività servono come **supporto visivo e pratica guidata**, non come verifica autonoma di decodifica: la figura potrebbe consentire di indovinare una parola memorizzata senza leggerla. Vanno alternate a prove senza immagine e ad attività sul quaderno.

Alcune icone, come `hand-stop` e `bread`, devono essere validate con il ragazzo per verificare che riconosca l'oggetto senza ambiguità. Non vanno ampliate indiscriminatamente: usare soltanto elementi chiari, non infantili, e parole congruenti con il livello.

Tutti gli asset SVG vengono memorizzati nella cache statica della PWA insieme al modulo: non si caricano immagini esterne durante gli esercizi. La sintesi vocale offline rimane separata e deve essere collaudata sul dispositivo.
