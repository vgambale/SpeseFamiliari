// Attendi che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', () => {
  // Inizializza l'app Vue
  const { createApp } = Vue;
  
  // Monta l'applicazione sul div #app
  createApp(App).mount('#app');
});
