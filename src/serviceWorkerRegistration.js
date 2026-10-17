// Xairod PWA — Service Worker Registration
// Drop this file in src/ of the CRA project

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Dev: check if SW actually exists
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // Check for updates periodically
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content available — show refresh prompt
              console.info('[SW] New version available. Reload to update.');
              // Dispatch event so app can show a "Update available" toast
              window.dispatchEvent(new CustomEvent('swUpdateAvailable'));
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('[SW] Registration error:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType && !contentType.includes('javascript'))
      ) {
        // SW not found — reload to clear any old SW
        navigator.serviceWorker.ready.then(registration => registration.unregister())
          .then(() => window.location.reload());
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.info('[SW] No internet. Running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => registration.unregister())
      .catch(err => console.error(err.message));
  }
}
