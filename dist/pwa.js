let installPrompt;
const installButton = document.querySelector('#install-app');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  if (!window.matchMedia('(display-mode: standalone)').matches) installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installButton.hidden = true;
  await installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
});
window.addEventListener('appinstalled', () => { installButton.hidden = true; installPrompt = null; });
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {
      // The website remains usable if this browser does not allow service workers.
    });
  });
}
