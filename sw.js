/* Static shell cache; no student data is cached in the service worker. */
const CACHE="m_app_static_v5";
const SHELL=["./","./index.html","./src/styles.css","./src/app.mjs","./src/engine.mjs","./src/pictograms.mjs","./src/neural-audio.mjs","./src/curriculum.mjs","./icon.svg","./manifest.webmanifest","./assets/pictograms/mela.svg","./assets/pictograms/mano.svg","./assets/pictograms/sole.svg","./assets/pictograms/luna.svg","./assets/pictograms/pane.svg","./assets/pictograms/casa.svg","./assets/pictograms/cane.svg","./assets/pictograms/dado.svg","./assets/pictograms/treno.svg","./assets/pictograms/libro.svg"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("m_app_static_")&&key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached)return cached;
    return fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    });
  }));
});
