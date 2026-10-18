// Prefer packaged Piper clips. Browser TTS handles uncached/dynamic content.
// The manifest is fetched at startup (before most user clicks): audio.play()
// is then invoked synchronously inside the click handler for iOS compatibility.
export function createNeuralPlayer({nativeFallback, baseUrl="../audio/generated/"}) {
  let clips=null;
  let loading=null;
  let active=null;
  let generation=0;
  const normalize = value=>String(value??"").trim().replace(/\s+/g," ").toLocaleUpperCase("it-IT");
  const root = new URL(baseUrl,import.meta.url);
  function prepare() {
    if(loading)return loading;
    loading=fetch(new URL("manifest.json",root),{cache:"no-cache"})
      .then(r=>{if(!r.ok)throw Error("No neural audio manifest");return r.json();})
      .then(x=>{clips=x?.schema===1&&x.clips&&typeof x.clips==="object"?x.clips:null;return !!clips;})
      .catch(()=>{clips=null;return false;});
    return loading;
  }
  function stop() {
    generation++;
    if(active){
      active.pause();
      active.removeAttribute("src");
      active.load();
      active=null;
    }
  }
  function available(text) {
    return !!clips&&Object.prototype.hasOwnProperty.call(clips,normalize(text));
  }
  function play(text,kind="word",forceNative=false) {
    stop();
    const turn=generation;
    if(!forceNative&&available(text)){
      const file=clips[normalize(text)];
      if(typeof file==="string"&&/^[0-9a-f]{20}\.mp3$/.test(file)){
        const audio=new Audio(new URL(file,root).href);
        active=audio;
        audio.preload="auto";
        audio.onended=()=>{if(turn===generation)active=null;};
        const fallback=()=>{
          if(turn!==generation)return;
          active=null;
          nativeFallback(text,kind);
        };
        audio.onerror=fallback;
        const result=audio.play();
        if(result&&typeof result.catch==="function")result.catch(fallback);
        return "neural";
      }
    }
    nativeFallback(text,kind);
    return "device";
  }
  return {prepare,play,stop,available,isReady:()=>!!clips,count:()=>Object.keys(clips||{}).length};
}
