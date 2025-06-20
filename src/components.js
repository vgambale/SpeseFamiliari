// Registrazione dei componenti globali
document.addEventListener('DOMContentLoaded', () => {
  // Assicuriamoci che FormMovimento sia disponibile globalmente
  if (typeof FormMovimento !== 'undefined') {
    window.FormMovimento = FormMovimento;
  }
  
  // Verifico che tutti i componenti siano correttamente caricati
  const componentNames = ['FormMovimento', 'ListaMovimenti', 'DashboardView', 'ImportExport', 'ModalModifica'];
  const missingComponents = componentNames.filter(name => typeof window[name] === 'undefined');
  
  if (missingComponents.length > 0) {
    console.error('Componenti non caricati:', missingComponents.join(', '));
  } else {
    console.log('Tutti i componenti Vue sono disponibili.');
  }
});
