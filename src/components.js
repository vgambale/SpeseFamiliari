// Registrazione dei componenti globali
document.addEventListener('DOMContentLoaded', () => {
  // Assicuriamoci che tutti i componenti siano disponibili globalmente
  const componentsToRegister = {
    'FormMovimento': FormMovimento,
    'ListaMovimenti': ListaMovimenti,
    'DashboardView': DashboardView,
    'ImportExport': ImportExport,
    'ModalModifica': ModalModifica
  };
  
  // Registra ogni componente globalmente
  for (const [name, component] of Object.entries(componentsToRegister)) {
    if (typeof component !== 'undefined') {
      window[name] = component;
      console.log(`Componente ${name} registrato globalmente`);
    } else {
      console.error(`Componente ${name} non trovato`);
    }
  }
  
  // Verifica che tutti i componenti siano disponibili
  const componentNames = Object.keys(componentsToRegister);
  const missingComponents = componentNames.filter(name => typeof window[name] === 'undefined');
  
  if (missingComponents.length > 0) {
    console.error('Componenti non caricati:', missingComponents.join(', '));
  } else {
    console.log('Tutti i componenti Vue sono disponibili.');
  }
});
