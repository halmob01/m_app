# TRACCIA — Design e pittogrammi v2

## Riferimento di design

Riferimento ispirazionale: https://getdesign.md/design-md (galleria di sistemi `design.md`).
Direzione selezionata: semplicità dei prodotti editoriali maturi e chiarezza dei sistemi di design, non imitazione di una specifica interfaccia. Il principio guida è **una sola azione principale per schermata**.

### Sistema visivo adottato
- **Target:** studente diciassettenne in prima alfabetizzazione. Nessuna mascotte, simbolo infantile, parete di testo o titolo descrittivo delle consegne.
- **Student view:** parola/figura, tre scelte grandi, audio sempre disponibile, feedback breve, avanzamento intuitivo. Titolo del livello (massimo) e barra di avanzamento discreta.
- **Docente:** mappa di 10 livelli e 60 unità, valutazione, scelta del punto di partenza e metadati didattici.
- **Tipografia:** Anton per marchio/titoli sintetici; Manrope per lettere in esercizi e pulsanti. Fallback sans. Mai testo inciso dentro l'asset.
- **Palette:** warm paper `#f7f5f0`, ink `#172238`, navy `#253b5b`, signal lime `#d7ee81` solo come accento di interazione, carte avorio `#fffefb`.
- **Componenti:** pulsante voce scuro prominente, carte con profondità leggera, immagini centrali grandi, risposte tattili di dimensione adeguata a iPhone, bordi arrotondati controllati.
- **Motion:** solo microfeedback e minimi effetti al tocco; compatibile con `prefers-reduced-motion`.
- **Vincolo pratico:** nessuna dipendenza JS aggiuntiva per l'interfaccia; nessun font o immagine stock richiesti a runtime per i pittogrammi.

## Catalogo illustrato e progressione

La versione include **45 SVG reali di Tabler Icons**, scaricati dall'upstream in `assets/pictograms/`. Licenza MIT originale presente in `assets/pictograms/LICENSE`. Fonte: https://github.com/tabler/tabler-icons, categorie inclusi oggetti, trasporti, scuola, strumenti, luoghi e comunicazioni.

Le 60 unità hanno ciascuna almeno un'attività illustrata, definita in `src/pictograms.mjs`:

| Unità | Forma | Abilità e avvertenze |
|---|---|---|
| 1–10 | **Ascolta e indica figura** | Pratica di comprensione orale e associazione; non richiede lettura, ma **non** misura decodifica |
| 11–36 | **Immagine + grafema/sillaba mancante**, o abbinamento orale di recupero | Supporto alla corrispondenza suono–segno, con parole che il docente deve confermare coerenti con il livello; non sostituisce prova autonoma |
| 37–60 | **Leggi frase → scegli immagine** | Comprensione guidata da un supporto iconico; conserva anche esercizi senza immagini per distinguere la lettura autonoma |

I primi livelli non chiedono la lettura di parole nuove a partire da figure. Negli ultimi, **la frase non viene letta automaticamente dal pulsante della consegna**, evitando di trasformare un test di lettura in un esercizio di ascolto.

Le alternative sono tre e senza pattern fissi di posizione; tutte corrispondono a icone locali dello stesso sistema. Per le lettere/sillabe, distrattori di lunghezza identica alla soluzione. Le figure devono essere comprensibili nello specifico contesto (ad es. chiave, pane, bagno, lavoro), soprattutto quando l'icona è una rappresentazione schematica.

## Accettazione per lo studente
- Mostrare tre immagini: chiederne la comprensione *senza leggerne l'etichetta*, registrando eventuali equivoci.
- Provare almeno due unità per macrofase (01–10, 11–36, 37–60), con quaderno.
- Verificare pulsante audio, tasto avanti, area docente, leggibilità dei tasti e funzionamento senza rete dopo prima visita.
- Se una figura è ambigua, sostituire l'asset: non trattare un errore di interpretazione dell'icona come errore di lettura.

## Implementazione
- `src/pictograms.mjs`: 60 definizioni puntuali, metadati di 45 asset e per-unit task generator.
- `src/engine.mjs`: aggiunge `picture-listen`, `picture-meaning` e mantiene `picture-letter`, `picture-syllable`.
- `src/app.mjs`: rendering delle opzioni illustrate e consegne parlate, stessa voce approvata in precedenza.
- `src/styles.css`: piccola revisione tipografica/cromatica e miglioramento delle figure.
- `sw.js`: nuova cache v6 con tutti gli asset per l'uso offline.
- `tests/curriculum.test.mjs`: verifica automatica della copertura di tutte le unità.

La parte audio precedente è conservata: nessuna nuova registrazione e nessun cambio del player vocale.
