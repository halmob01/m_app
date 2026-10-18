import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {LEVELS,LESSONS} from "../src/curriculum.mjs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("MATITA is the public app name, without changing the repository or local saves",()=>{
  const manifest=JSON.parse(read("manifest.webmanifest"));
  assert.equal(manifest.name,"Matita — Leggere e scrivere");
  assert.equal(manifest.short_name,"Matita");
  assert.match(read("index.html"),/<title>Matita — Leggere e scrivere<\/title>/);
  assert.match(read("src/app.mjs"),/brand wordmark","MATITA"/);
  assert.match(read("src/app.mjs"),/const STORE = "m_app_local_v1"/);
  assert.match(read("icon.svg"),/aria-label="Matita, lettera M"/);
});

test("The student sees M on the right, teacher access on the left",()=>{
  const app=read("src/app.mjs");
  assert.match(app,/student-monogram","M"/);
  assert.match(app,/teacher-visible-link",gotoTeacher/);
  const css=read("src/styles.css");
  assert.match(css,/\.pupil-topbar \.student-monogram\s*\{[\s\S]*?margin-left:auto/);
  assert.match(css,/\.pupil-topbar \.teacher-visible-link\s*\{[\s\S]*?order:-1/);
});

test("Visible lesson titles focus on reading and writing, without autonomy labels",()=>{
  assert.equal(LEVELS.length,10);
  assert.equal(LESSONS.length,60);
  assert.equal(LEVELS[9],"Leggere e scrivere testi");
  assert.equal(LESSONS[59].title,"Leggo e scrivo");
  assert.doesNotMatch(LEVELS.join(" "),/autonom/i);
  assert.doesNotMatch(LESSONS.map(l=>l.title+" "+l.objective).join(" "),/autonom|da solo/i);
});

test("The approved audio engine remains intact; prompt inventory follows the revised wording",()=>{
  assert.match(read("src/app.mjs"),/createNeuralPlayer/);
  assert.match(read("scripts/voice-inventory.mjs"),/Prova a leggere\. Poi premi avanti\./);
  assert.match(read("src/app.mjs"),/Prova a leggere\. Poi premi avanti\./);
});

test("Offline shell invalidates old app chrome after the redesign",()=>{
  assert.match(read("sw.js"),/m_app_static_v7/);
  assert.match(read("sw.js"),/\.\/icon\.svg/);
  assert.match(read("sw.js"),/\.\/manifest\.webmanifest/);
});
