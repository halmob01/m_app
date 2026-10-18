// Tabler Icons, licenza MIT. La selezione visuale è pratica aggiuntiva, non un test di decodifica.
export const PICTOGRAMS=Object.freeze({
  "mano": {
    "filename": "mano.svg",
    "alt": "Una mano"
  },
  "mela": {
    "filename": "mela.svg",
    "alt": "Una mela"
  },
  "sole": {
    "filename": "sole.svg",
    "alt": "Il sole"
  },
  "luna": {
    "filename": "luna.svg",
    "alt": "La luna"
  },
  "pane": {
    "filename": "pane.svg",
    "alt": "Il pane"
  },
  "casa": {
    "filename": "casa.svg",
    "alt": "Una casa"
  },
  "cane": {
    "filename": "cane.svg",
    "alt": "Un cane"
  },
  "dado": {
    "filename": "dado.svg",
    "alt": "Un dado"
  },
  "treno": {
    "filename": "treno.svg",
    "alt": "Un treno"
  },
  "libro": {
    "filename": "libro.svg",
    "alt": "Un libro"
  },
  "bus": {
    "filename": "bus.svg",
    "alt": "Un autobus"
  },
  "bici": {
    "filename": "bici.svg",
    "alt": "Una bicicletta"
  },
  "computer": {
    "filename": "computer.svg",
    "alt": "Un computer"
  },
  "telefono": {
    "filename": "telefono.svg",
    "alt": "Un telefono"
  },
  "orologio": {
    "filename": "orologio.svg",
    "alt": "Un orologio"
  },
  "calendario": {
    "filename": "calendario.svg",
    "alt": "Un calendario"
  },
  "matita": {
    "filename": "matita.svg",
    "alt": "Una matita"
  },
  "scuola": {
    "filename": "scuola.svg",
    "alt": "Una scuola"
  },
  "negozio": {
    "filename": "negozio.svg",
    "alt": "Un negozio"
  },
  "spesa": {
    "filename": "spesa.svg",
    "alt": "Un carrello della spesa"
  },
  "caffe": {
    "filename": "caffe.svg",
    "alt": "Un caffè"
  },
  "maglia": {
    "filename": "maglia.svg",
    "alt": "Una maglia"
  },
  "biglietto": {
    "filename": "biglietto.svg",
    "alt": "Un biglietto"
  },
  "chiave": {
    "filename": "chiave.svg",
    "alt": "Una chiave"
  },
  "messaggio": {
    "filename": "messaggio.svg",
    "alt": "Un messaggio"
  },
  "lettera": {
    "filename": "lettera.svg",
    "alt": "Una lettera"
  },
  "auto": {
    "filename": "auto.svg",
    "alt": "Un'automobile"
  },
  "palla": {
    "filename": "palla.svg",
    "alt": "Un pallone"
  },
  "pesce": {
    "filename": "pesce.svg",
    "alt": "Un pesce"
  },
  "albero": {
    "filename": "albero.svg",
    "alt": "Un albero"
  },
  "ombrello": {
    "filename": "ombrello.svg",
    "alt": "Un ombrello"
  },
  "ospedale": {
    "filename": "ospedale.svg",
    "alt": "Un ospedale"
  },
  "valigia": {
    "filename": "valigia.svg",
    "alt": "Una valigia"
  },
  "gelato": {
    "filename": "gelato.svg",
    "alt": "Un gelato"
  },
  "gatto": {
    "filename": "gatto.svg",
    "alt": "Un gatto"
  },
  "bagno": {
    "filename": "bagno.svg",
    "alt": "Una vasca da bagno"
  },
  "acqua": {
    "filename": "acqua.svg",
    "alt": "Una goccia d'acqua"
  },
  "bicchiere": {
    "filename": "bicchiere.svg",
    "alt": "Un bicchiere"
  },
  "quaderno": {
    "filename": "quaderno.svg",
    "alt": "Un quaderno"
  }
});

// Un'attività visuale contestuale per ognuna delle sessanta unità.
// U01–U10: ascolto e riconoscimento di immagini; U11–U36: grafema/sillaba;
// U37–U60: frase funzionale con parola mancante. Le prove autonome restano senza immagini.
export const PICTURE_PRACTICE=Object.freeze({
  "1": [
    {
      "type": "picture-match",
      "picture": "mano",
      "display": "",
      "correct": "mano",
      "choices": [
        "mano",
        "mela",
        "sole"
      ],
      "word": "MANO"
    }
  ],
  "2": [
    {
      "type": "picture-match",
      "picture": "mela",
      "display": "",
      "correct": "mela",
      "choices": [
        "mela",
        "mano",
        "luna"
      ],
      "word": "MELA"
    }
  ],
  "3": [
    {
      "type": "picture-match",
      "picture": "acqua",
      "display": "",
      "correct": "acqua",
      "choices": [
        "acqua",
        "sole",
        "casa"
      ],
      "word": "ACQUA"
    }
  ],
  "4": [
    {
      "type": "picture-match",
      "picture": "orologio",
      "display": "",
      "correct": "orologio",
      "choices": [
        "orologio",
        "libro",
        "pane"
      ],
      "word": "OROLOGIO"
    }
  ],
  "5": [
    {
      "type": "picture-match",
      "picture": "luna",
      "display": "",
      "correct": "luna",
      "choices": [
        "luna",
        "mela",
        "sole"
      ],
      "word": "LUNA"
    }
  ],
  "6": [
    {
      "type": "picture-match",
      "picture": "sole",
      "display": "",
      "correct": "sole",
      "choices": [
        "sole",
        "casa",
        "mano"
      ],
      "word": "SOLE"
    }
  ],
  "7": [
    {
      "type": "picture-match",
      "picture": "mela",
      "display": "",
      "correct": "mela",
      "choices": [
        "mela",
        "mano",
        "pane"
      ],
      "word": "MELA"
    }
  ],
  "8": [
    {
      "type": "picture-match",
      "picture": "mano",
      "display": "",
      "correct": "mano",
      "choices": [
        "mano",
        "casa",
        "luna"
      ],
      "word": "MANO"
    }
  ],
  "9": [
    {
      "type": "picture-match",
      "picture": "luna",
      "display": "",
      "correct": "luna",
      "choices": [
        "luna",
        "mela",
        "casa"
      ],
      "word": "LUNA"
    }
  ],
  "10": [
    {
      "type": "picture-match",
      "picture": "sole",
      "display": "",
      "correct": "sole",
      "choices": [
        "sole",
        "mano",
        "mela"
      ],
      "word": "SOLE"
    }
  ],
  "11": [
    {
      "type": "picture-letter",
      "picture": "mano",
      "display": "MA_O",
      "correct": "N",
      "choices": [
        "N",
        "L",
        "S"
      ],
      "word": "MANO"
    }
  ],
  "12": [
    {
      "type": "picture-syllable",
      "picture": "luna",
      "display": "LU__",
      "correct": "NA",
      "choices": [
        "NA",
        "MA",
        "LA"
      ],
      "word": "LUNA"
    }
  ],
  "13": [
    {
      "type": "picture-letter",
      "picture": "pane",
      "display": "PA_E",
      "correct": "N",
      "choices": [
        "N",
        "L",
        "M"
      ],
      "word": "PANE"
    }
  ],
  "14": [
    {
      "type": "picture-letter",
      "picture": "mela",
      "display": "ME_A",
      "correct": "L",
      "choices": [
        "L",
        "N",
        "R"
      ],
      "word": "MELA"
    }
  ],
  "15": [
    {
      "type": "picture-letter",
      "picture": "mano",
      "display": "M_NO",
      "correct": "A",
      "choices": [
        "A",
        "E",
        "O"
      ],
      "word": "MANO"
    }
  ],
  "16": [
    {
      "type": "picture-letter",
      "picture": "sole",
      "display": "SO_E",
      "correct": "L",
      "choices": [
        "L",
        "M",
        "N"
      ],
      "word": "SOLE"
    }
  ],
  "17": [
    {
      "type": "picture-syllable",
      "picture": "mela",
      "display": "M__A",
      "correct": "EL",
      "choices": [
        "EL",
        "AL",
        "IL"
      ],
      "word": "MELA"
    }
  ],
  "18": [
    {
      "type": "picture-syllable",
      "picture": "sole",
      "display": "__LE",
      "correct": "SO",
      "choices": [
        "SO",
        "SA",
        "SI"
      ],
      "word": "SOLE"
    }
  ],
  "19": [
    {
      "type": "picture-letter",
      "picture": "dado",
      "display": "D_DO",
      "correct": "A",
      "choices": [
        "A",
        "E",
        "O"
      ],
      "word": "DADO"
    }
  ],
  "20": [
    {
      "type": "picture-letter",
      "picture": "pane",
      "display": "PA_E",
      "correct": "N",
      "choices": [
        "N",
        "L",
        "R"
      ],
      "word": "PANE"
    }
  ],
  "21": [
    {
      "type": "picture-letter",
      "picture": "casa",
      "display": "C_SA",
      "correct": "A",
      "choices": [
        "A",
        "O",
        "U"
      ],
      "word": "CASA"
    }
  ],
  "22": [
    {
      "type": "picture-letter",
      "picture": "casa",
      "display": "CA_A",
      "correct": "S",
      "choices": [
        "S",
        "N",
        "M"
      ],
      "word": "CASA"
    }
  ],
  "23": [
    {
      "type": "picture-letter",
      "picture": "cane",
      "display": "C_NE",
      "correct": "A",
      "choices": [
        "A",
        "O",
        "E"
      ],
      "word": "CANE"
    }
  ],
  "24": [
    {
      "type": "picture-letter",
      "picture": "cane",
      "display": "CA_E",
      "correct": "N",
      "choices": [
        "N",
        "L",
        "R"
      ],
      "word": "CANE"
    }
  ],
  "25": [
    {
      "type": "picture-letter",
      "picture": "casa",
      "display": "C_SA",
      "correct": "A",
      "choices": [
        "A",
        "O",
        "E"
      ],
      "word": "CASA"
    }
  ],
  "26": [
    {
      "type": "picture-syllable",
      "picture": "gelato",
      "display": "GE__TO",
      "correct": "LA",
      "choices": [
        "LA",
        "LE",
        "LI"
      ],
      "word": "GELATO"
    }
  ],
  "27": [
    {
      "type": "picture-letter",
      "picture": "chiave",
      "display": "CHI_VE",
      "correct": "A",
      "choices": [
        "A",
        "E",
        "I"
      ],
      "word": "CHIAVE"
    }
  ],
  "28": [
    {
      "type": "picture-letter",
      "picture": "chiave",
      "display": "CHIA_E",
      "correct": "V",
      "choices": [
        "V",
        "N",
        "L"
      ],
      "word": "CHIAVE"
    }
  ],
  "29": [
    {
      "type": "picture-syllable",
      "picture": "acqua",
      "display": "AC__A",
      "correct": "QU",
      "choices": [
        "QU",
        "CH",
        "GU"
      ],
      "word": "ACQUA"
    }
  ],
  "30": [
    {
      "type": "picture-syllable",
      "picture": "gelato",
      "display": "GE__TO",
      "correct": "LA",
      "choices": [
        "LA",
        "LI",
        "LO"
      ],
      "word": "GELATO"
    }
  ],
  "31": [
    {
      "type": "picture-syllable",
      "picture": "spesa",
      "display": "__ESA",
      "correct": "SP",
      "choices": [
        "SP",
        "ST",
        "SC"
      ],
      "word": "SPESA"
    }
  ],
  "32": [
    {
      "type": "picture-syllable",
      "picture": "treno",
      "display": "__ENO",
      "correct": "TR",
      "choices": [
        "TR",
        "PR",
        "BR"
      ],
      "word": "TRENO"
    }
  ],
  "33": [
    {
      "type": "picture-syllable",
      "picture": "gelato",
      "display": "GE__TO",
      "correct": "LA",
      "choices": [
        "LA",
        "LE",
        "LI"
      ],
      "word": "GELATO"
    }
  ],
  "34": [
    {
      "type": "picture-syllable",
      "picture": "bagno",
      "display": "BA__O",
      "correct": "GN",
      "choices": [
        "GN",
        "GL",
        "GH"
      ],
      "word": "BAGNO"
    }
  ],
  "35": [
    {
      "type": "picture-syllable",
      "picture": "palla",
      "display": "PA__A",
      "correct": "LL",
      "choices": [
        "LL",
        "LN",
        "LT"
      ],
      "word": "PALLA"
    }
  ],
  "36": [
    {
      "type": "picture-syllable",
      "picture": "palla",
      "display": "PA__A",
      "correct": "LL",
      "choices": [
        "LL",
        "LM",
        "LN"
      ],
      "word": "PALLA"
    }
  ],
  "37": [
    {
      "type": "picture-context",
      "picture": "libro",
      "display": "Ho un _____.",
      "correct": "LIBRO",
      "choices": [
        "LIBRO",
        "TRENO",
        "PESCE"
      ],
      "word": "LIBRO"
    }
  ],
  "38": [
    {
      "type": "picture-context",
      "picture": "scuola",
      "display": "Vado a _____.",
      "correct": "SCUOLA",
      "choices": [
        "SCUOLA",
        "TEATRO",
        "CINEMA"
      ],
      "word": "SCUOLA"
    }
  ],
  "39": [
    {
      "type": "picture-context",
      "picture": "telefono",
      "display": "Ho un _____.",
      "correct": "TELEFONO",
      "choices": [
        "TELEFONO",
        "OROLOGIO",
        "COMPUTER"
      ],
      "word": "TELEFONO"
    }
  ],
  "40": [
    {
      "type": "picture-context",
      "picture": "casa",
      "display": "Sono a _____.",
      "correct": "CASA",
      "choices": [
        "CASA",
        "ROMA",
        "MARE"
      ],
      "word": "CASA"
    }
  ],
  "41": [
    {
      "type": "picture-context",
      "picture": "ombrello",
      "display": "Non ho l'_____.",
      "correct": "OMBRELLO",
      "choices": [
        "OMBRELLO",
        "OROLOGIO",
        "AUTOBUS"
      ],
      "word": "OMBRELLO"
    }
  ],
  "42": [
    {
      "type": "picture-context",
      "picture": "biglietto",
      "display": "Dov'è il _____?",
      "correct": "BIGLIETTO",
      "choices": [
        "BIGLIETTO",
        "TELEFONO",
        "QUADERNO"
      ],
      "word": "BIGLIETTO"
    }
  ],
  "43": [
    {
      "type": "picture-context",
      "picture": "messaggio",
      "display": "Ho un _____.",
      "correct": "MESSAGGIO",
      "choices": [
        "MESSAGGIO",
        "OMBRELLO",
        "TELEFONO"
      ],
      "word": "MESSAGGIO"
    }
  ],
  "44": [
    {
      "type": "picture-context",
      "picture": "chiave",
      "display": "Apro con la _____.",
      "correct": "CHIAVE",
      "choices": [
        "CHIAVE",
        "MATITA",
        "MAGLIA"
      ],
      "word": "CHIAVE"
    }
  ],
  "45": [
    {
      "type": "picture-context",
      "picture": "orologio",
      "display": "Guardo l'_____.",
      "correct": "OROLOGIO",
      "choices": [
        "OROLOGIO",
        "OMBRELLO",
        "AUTOBUS"
      ],
      "word": "OROLOGIO"
    }
  ],
  "46": [
    {
      "type": "picture-context",
      "picture": "spesa",
      "display": "Faccio la _____.",
      "correct": "SPESA",
      "choices": [
        "SPESA",
        "PAUSA",
        "FESTA"
      ],
      "word": "SPESA"
    }
  ],
  "47": [
    {
      "type": "picture-context",
      "picture": "quaderno",
      "display": "Scrivo sul _____.",
      "correct": "QUADERNO",
      "choices": [
        "QUADERNO",
        "TELEFONO",
        "COMPUTER"
      ],
      "word": "QUADERNO"
    }
  ],
  "48": [
    {
      "type": "picture-context",
      "picture": "treno",
      "display": "Prendo il _____.",
      "correct": "TRENO",
      "choices": [
        "TRENO",
        "LIBRO",
        "PESCE"
      ],
      "word": "TRENO"
    }
  ],
  "49": [
    {
      "type": "picture-context",
      "picture": "matita",
      "display": "Uso la _____.",
      "correct": "MATITA",
      "choices": [
        "MATITA",
        "CHIAVE",
        "MAGLIA"
      ],
      "word": "MATITA"
    }
  ],
  "50": [
    {
      "type": "picture-context",
      "picture": "lettera",
      "display": "Scrivo una _____.",
      "correct": "LETTERA",
      "choices": [
        "LETTERA",
        "DOMANDA",
        "PAROLA"
      ],
      "word": "LETTERA"
    }
  ],
  "51": [
    {
      "type": "picture-context",
      "picture": "bici",
      "display": "Vado in _____.",
      "correct": "BICI",
      "choices": [
        "BICI",
        "AUTO",
        "TAXI"
      ],
      "word": "BICI"
    }
  ],
  "52": [
    {
      "type": "picture-context",
      "picture": "bicchiere",
      "display": "Bevo dal _____.",
      "correct": "BICCHIERE",
      "choices": [
        "BICCHIERE",
        "TELEFONO",
        "QUADERNO"
      ],
      "word": "BICCHIERE"
    }
  ],
  "53": [
    {
      "type": "picture-context",
      "picture": "negozio",
      "display": "Entro nel _____.",
      "correct": "NEGOZIO",
      "choices": [
        "NEGOZIO",
        "TEATRO",
        "GIARDINO"
      ],
      "word": "NEGOZIO"
    }
  ],
  "54": [
    {
      "type": "picture-context",
      "picture": "calendario",
      "display": "Controllo il _____.",
      "correct": "CALENDARIO",
      "choices": [
        "CALENDARIO",
        "COMPUTER",
        "TELEFONO"
      ],
      "word": "CALENDARIO"
    }
  ],
  "55": [
    {
      "type": "picture-context",
      "picture": "calendario",
      "display": "Segno la data sul _____.",
      "correct": "CALENDARIO",
      "choices": [
        "CALENDARIO",
        "COMPUTER",
        "QUADERNO"
      ],
      "word": "CALENDARIO"
    }
  ],
  "56": [
    {
      "type": "picture-context",
      "picture": "telefono",
      "display": "Rispondo al _____.",
      "correct": "TELEFONO",
      "choices": [
        "TELEFONO",
        "COMPUTER",
        "QUADERNO"
      ],
      "word": "TELEFONO"
    }
  ],
  "57": [
    {
      "type": "picture-context",
      "picture": "valigia",
      "display": "Preparo la _____.",
      "correct": "VALIGIA",
      "choices": [
        "VALIGIA",
        "MAGLIA",
        "LETTERA"
      ],
      "word": "VALIGIA"
    }
  ],
  "58": [
    {
      "type": "picture-context",
      "picture": "quaderno",
      "display": "Compilo il _____.",
      "correct": "QUADERNO",
      "choices": [
        "QUADERNO",
        "BIGLIETTO",
        "TELEFONO"
      ],
      "word": "QUADERNO"
    }
  ],
  "59": [
    {
      "type": "picture-context",
      "picture": "albero",
      "display": "Nel parco c'è un _____.",
      "correct": "ALBERO",
      "choices": [
        "ALBERO",
        "SEDILE",
        "POZZO"
      ],
      "word": "ALBERO"
    }
  ],
  "60": [
    {
      "type": "picture-context",
      "picture": "libro",
      "display": "Prendo un _____.",
      "correct": "LIBRO",
      "choices": [
        "LIBRO",
        "TRENO",
        "PESCE"
      ],
      "word": "LIBRO"
    }
  ]
});

export function pictogramPath(name){
 const item=PICTOGRAMS[name];
 return item?new URL("../assets/pictograms/"+item.filename,import.meta.url).href:null;
}
export function pictureActivitiesFor(unit,random=Math.random){
 const list=PICTURE_PRACTICE[Number(unit)]||[];
 return list.map(item=>{
  if(!PICTOGRAMS[item.picture])throw Error("Pittogramma mancante: "+item.picture);
  if(new Set(item.choices).size!==3||!item.choices.includes(item.correct))throw Error("Alternative errate in U"+unit);
  const choices=[...item.choices];
  for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
  const prompt=item.type==="picture-match"?"Ascolta e trova il disegno.":item.type==="picture-context"?"Completa la frase guardando il disegno.":"Completa la parola guardando il disegno.";
  return {...item,choices,prompt};
 });
}
