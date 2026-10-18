# Pittogrammi in tutte le 60 unità — TRACCIA

## Provenienza
Gli SVG sono **asset già esistenti di Tabler Icons** (https://tabler.io/icons), disponibili con licenza **MIT**. Non sono immagini generate con IA né illustrazioni create a mano. Sono copiati localmente nella cartella `assets/pictograms/`. L'attribuzione e la licenza integrale si trovano in `assets/pictograms/LICENSE`. Le icone arrivano dal catalogo sorgente `tabler/tabler-icons/icons/outline/`.

La prima banca attiva contiene **33 pittogrammi** con gli stessi tratti grafici, non una libreria esterna caricata dal telefono. Nuove immagini richiedono controllo del significato, del livello e dell'attribuzione.

## Tre famiglie, una attività illustrata in ogni unità

| Unità | Tipo | Esperienza sul telefono | Valore didattico |
|---|---|---|---|
| U01–U10 | `picture-audio` | Ascolta una parola; scegli tra tre immagini grandi | Comprensione orale e familiarità col dispositivo, **non misura decodifica** |
| U11–U36 | `picture-letter` / `picture-syllable` | Guarda un oggetto; completa una lettera o un gruppo nella parola | Rinforzo di grafemi e sillabe; alcune sono revisioni di parole già apprese |
| U37–U60 | `picture-choice` | Guarda l'immagine; seleziona la frase che la descrive | Lettura funzionale e riconoscimento semantico, con distrattori plausibili |

La regola obbligatoria è **almeno una attività illustrata per ciascuna delle 60 unità**, verificata automaticamente nel test del sillabo. L'immagine non viene inserita in ogni singolo esercizio: lettura autonoma e quaderno mantengono prove prive di indizi iconografici.

Gli esercizi con figura non valgono da soli come prova di padronanza della lettura. Una figura potrebbe permettere di indovinare senza decodificare; per questo rimangono compiti senza figura.

## Riconoscibilità e progressione

- I primi 10 item usano tre immagini, **senza testo da leggere**.
- Tra U11 e U36 la lunghezza del vuoto corrisponde esattamente a quella della soluzione, e tutte e tre le alternative hanno uguale lunghezza.
- Nei livelli successivi le tre frasi sono ordinate casualmente e il pittogramma non fornisce l'intera soluzione per audio.
- L'inventario della voce Piper integra anche le consegne illustrate e gli audio per gli oggetti usati nei primi livelli. La voce già approvata non viene cambiata.
- Scegliere immagini che un adolescente riconosca rapidamente; verificare in particolare `hand-stop` (mano), `bread` (pane), `briefcase` (valigetta) e `shopping-cart` (spesa).
- Non infantilizzare il sistema con mascotte, stimoli superflui o animazioni continue.

## Struttura tecnica

- `src/pictograms.mjs`: mappa di 33 asset e banca di 60 compiti; esporta `validatePicturePractice`.
- `src/engine.mjs`: inserimento del task illustrato in ciascuna lezione, rispettando il percorso base.
- `src/app.mjs`: scelta tra immagini o tra lettere/sillabe/frasi sullo schermo studente.
- `src/styles.css`: figure grandi, bottoni ad alto contrasto, superfici calde.
- `sw.js`: cache PWA `m_app_static_v6` che include 33 SVG locali.
- `scripts/voice-inventory.mjs`: inventario dei nuovi prompt pronunciati senza alterare il motore vocale.

## Verifica prima della scuola

Provare sul vero iPhone almeno U01, U07, U11, U27, U34, U37, U49 e U60. Controllare comprensibilità delle figure, pronuncia, risposta su tre pulsanti, visibilità su schermi piccoli, salvataggio e riapertura dell'attività, quaderno. Rivedere con il docente le parole che anticipano contenuti troppo complessi.

Se una figura risulta ambigua, sostituirla con altro asset Tabler appropriato, oppure usare temporaneamente un compito diverso: **non aggiungere disegni decorativi solo per raggiungere una quota**.
