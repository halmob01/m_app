/* Static shell cache; no student data is cached in the service worker. */
const CACHE="m_app_static_v8";
const SHELL=["./","./index.html","./src/styles.css","./src/app.mjs","./src/engine.mjs","./src/pictograms.mjs","./src/neural-audio.mjs","./src/curriculum.mjs","./icon.svg","./manifest.webmanifest","./assets/pictograms/mano.svg","./assets/pictograms/mela.svg","./assets/pictograms/sole.svg","./assets/pictograms/luna.svg","./assets/pictograms/pane.svg","./assets/pictograms/casa.svg","./assets/pictograms/cane.svg","./assets/pictograms/dado.svg","./assets/pictograms/treno.svg","./assets/pictograms/libro.svg","./assets/pictograms/bus.svg","./assets/pictograms/bike.svg","./assets/pictograms/computer.svg","./assets/pictograms/telefono.svg","./assets/pictograms/orologio.svg","./assets/pictograms/calendario.svg","./assets/pictograms/matita.svg","./assets/pictograms/scuola.svg","./assets/pictograms/negozio.svg","./assets/pictograms/carrello.svg","./assets/pictograms/caffe.svg","./assets/pictograms/maglia.svg","./assets/pictograms/biglietto.svg","./assets/pictograms/chiave.svg","./assets/pictograms/messaggio.svg","./assets/pictograms/auto.svg","./assets/pictograms/albero.svg","./assets/pictograms/ombrello.svg","./assets/pictograms/bagno.svg","./assets/pictograms/palla.svg","./assets/pictograms/quaderno.svg","./assets/pictograms/gatto.svg","./assets/pictograms/valigetta.svg"];
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
