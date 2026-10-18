import test from "node:test";
import assert from "node:assert/strict";
import {createNeuralPlayer} from "../src/neural-audio.mjs";

test("Neural audio loads a manifest and plays packaged clips; unknown text falls back",async ()=>{
  const originalFetch=globalThis.fetch;
  const originalAudio=globalThis.Audio;
  const calls=[];
  const native=[];
  try{
    globalThis.fetch=async ()=>({ok:true,json:async()=>({schema:1,clips:{"MANO":"0123456789abcdefabcd.mp3"}})});
    globalThis.Audio=class {
      constructor(url){this.src=url;calls.push(url);}
      play(){calls.push("play");return Promise.resolve();}
      pause(){calls.push("pause");}
      removeAttribute(){}
      load(){}
    };
    const voice=createNeuralPlayer({nativeFallback:(text,kind)=>native.push([text,kind])});
    assert.equal(await voice.prepare(),true);
    assert.equal(voice.count(),1);
    assert.equal(voice.available(" mano "),true);
    assert.equal(voice.play("mano","word"),"neural");
    assert.ok(calls[0].endsWith("/audio/generated/0123456789abcdefabcd.mp3"));
    assert.ok(calls.includes("play"));
    assert.equal(native.length,0);
    assert.equal(voice.play("parola personale","word"),"device");
    assert.deepEqual(native,[["parola personale","word"]]);
    voice.stop();
  }finally{
    globalThis.fetch=originalFetch;
    globalThis.Audio=originalAudio;
  }
});
test("Missing manifest does not prevent ordinary lessons",async()=>{
  const old=globalThis.fetch;
  const fallback=[];
  try {
    globalThis.fetch=async()=>({ok:false});
    const voice=createNeuralPlayer({nativeFallback:(text)=>fallback.push(text)});
    assert.equal(await voice.prepare(),false);
    assert.equal(voice.play("MA","word"),"device");
    assert.deepEqual(fallback,["MA"]);
  }finally{globalThis.fetch=old;}
});
test("Refuses to create audio URLs from untrusted manifest paths",async()=>{
  const oldFetch=globalThis.fetch,oldAudio=globalThis.Audio;
  let opened=false;const fallback=[];
  try{
    globalThis.fetch=async()=>({ok:true,json:async()=>({schema:1,clips:{"CIAO":"../../other.mp3"}})});
    globalThis.Audio=class {constructor(){opened=true;}};
    const voice=createNeuralPlayer({nativeFallback:(text)=>fallback.push(text)});
    await voice.prepare();
    assert.equal(voice.play("CIAO"),"device");
    assert.equal(opened,false);
    assert.deepEqual(fallback,["CIAO"]);
  }finally{globalThis.fetch=oldFetch;globalThis.Audio=oldAudio;}
});
