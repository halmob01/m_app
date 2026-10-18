// Asset già pronti da Tabler Icons (MIT), copiati in assets/pictograms/.
// Non confondere il pittogramma con una prova di decodifica autonoma.
export const PICTOGRAMS = Object.freeze({
  mano:{filename:"mano.svg",alt:"Una mano"},
  mela:{filename:"mela.svg",alt:"Una mela"},
  sole:{filename:"sole.svg",alt:"Il sole"},
  luna:{filename:"luna.svg",alt:"La luna"},
  pane:{filename:"pane.svg",alt:"Un pane"},
  casa:{filename:"casa.svg",alt:"Una casa"},
  cane:{filename:"cane.svg",alt:"Un cane"},
  dado:{filename:"dado.svg",alt:"Un dado"},
  treno:{filename:"treno.svg",alt:"Un treno"},
  libro:{filename:"libro.svg",alt:"Un libro"}
});

// Una consegna breve, il pittogramma e tre scelte equivalenti.
// Le parole rispettano la progressione fonografica del sillabo.
// Non utilizzare questi esercizi per valutare la sola lettura autonoma.
export const PICTURE_PRACTICE = Object.freeze({
  11:[
    {picture:"mano",display:"MA_O",correct:"N",choices:["N","L","S"],type:"picture-letter",word:"MANO"},
    {picture:"mela",display:"ME_A",correct:"L",choices:["L","N","S"],type:"picture-letter",word:"MELA"}
  ],
  12:[
    {picture:"luna",display:"LU__",correct:"NA",choices:["NA","MA","LA"],type:"picture-syllable",word:"LUNA"},
    {picture:"sole",display:"__LE",correct:"SO",choices:["SO","SA","SE"],type:"picture-syllable",word:"SOLE"}
  ],
  13:[{picture:"pane",display:"PA_E",correct:"N",choices:["N","L","M"],type:"picture-letter",word:"PANE"}],
  19:[{picture:"dado",display:"D_DO",correct:"A",choices:["A","E","O"],type:"picture-letter",word:"DADO"}],
  21:[{picture:"casa",display:"C_SA",correct:"A",choices:["A","O","U"],type:"picture-letter",word:"CASA"}],
  24:[{picture:"cane",display:"CA_E",correct:"N",choices:["N","L","S"],type:"picture-letter",word:"CANE"}],
  32:[{picture:"treno",display:"T_ENO",correct:"R",choices:["R","L","N"],type:"picture-letter",word:"TRENO"}],
  37:[{picture:"libro",display:"LI_RO",correct:"B",choices:["B","D","P"],type:"picture-letter",word:"LIBRO"}]
});
export function pictogramPath(name) {
  const icon=PICTOGRAMS[name];
  return icon ? new URL("../assets/pictograms/"+icon.filename,import.meta.url).href : null;
}
export function pictureActivitiesFor(unit,random=Math.random){
  const list=PICTURE_PRACTICE[Number(unit)]||[];
  return list.map(item=>{
    if(!PICTOGRAMS[item.picture])throw Error("Pittogramma sconosciuto: "+item.picture);
    if(new Set(item.choices).size!==3||!item.choices.includes(item.correct)){
      throw Error("Alternative non valide: "+item.picture);
    }
    const choices=[...item.choices];
    for(let i=choices.length-1;i>0;i--){
      const j=Math.floor(random()*(i+1));
      [choices[i],choices[j]]=[choices[j],choices[i]];
    }
    return {...item,choices,prompt:"Guarda il disegno e completa la parola."};
  });
}
