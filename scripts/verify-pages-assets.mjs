import {readFileSync,existsSync} from "node:fs";
import {join} from "node:path";
import {PICTOGRAMS,validatePicturePractice} from "../src/pictograms.mjs";

const directory=process.argv[2]||"_site";
const errors=validatePicturePractice();
const shell=readFileSync(join(directory,"sw.js"),"utf8");
const assets=Object.values(PICTOGRAMS).map(x=>x.filename);
for(const f of ["index.html","manifest.webmanifest","src/app.mjs","src/pictograms.mjs",...assets.map(x=>"assets/pictograms/"+x)]){
  if(!existsSync(join(directory,f)))errors.push("Missing Pages file: "+f);
}
for(const filename of assets){
  if(!shell.includes("./assets/pictograms/"+filename))errors.push("Not precached: "+filename);
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Validated "+assets.length+" pictured SVGs in Pages artifact.");
