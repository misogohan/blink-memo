const sw = self as any as ServiceWorkerGlobalScope;

sw.addEventListener('install', () => {
  sw.skipWaiting();
});

sw.addEventListener('activate', () => {
});

sw.addEventListener('fetch', () => {
});
