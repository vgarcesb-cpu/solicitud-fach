// Service Worker – Solicitud de Adquisición AGA
var CACHE_NAME = "adquisicion-v1";
var ARCHIVOS = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// INSTALACIÓN — guarda los archivos en caché
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Archivos guardados en caché");
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// ACTIVACIÓN — limpia cachés viejos
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          console.log("Caché viejo eliminado:", key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH — responde con caché si no hay internet
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(respuesta) {
      if (respuesta) {
        return respuesta; // Responde desde caché
      }
      return fetch(e.request).catch(function() {
        // Sin internet y sin caché
        return caches.match("./index.html");
      });
    })
  );
});
