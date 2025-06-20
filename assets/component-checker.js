// Controlla che tutti i componenti necessari siano caricati correttamente
(function() {
  // Esegue il controllo dei componenti quando il DOM è completamente caricato
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Verifica caricamento componenti...');
      // Lista di componenti necessari
    const requiredComponents = [
      { name: 'FormMovimento', variable: window.FormMovimento, tagName: 'form-movimento' },
      { name: 'ListaMovimenti', variable: window.ListaMovimenti, tagName: 'lista-movimenti' },
      { name: 'DashboardView', variable: window.DashboardView, tagName: 'dashboard-view' },
      { name: 'ImportExport', variable: window.ImportExport, tagName: 'import-export' },
      { name: 'ModalModifica', variable: window.ModalModifica, tagName: 'modal-modifica' }
    ];
      // Verifica ogni componente
    const missingComponents = requiredComponents.filter(comp => typeof comp.variable === 'undefined');
    
    // Verifica eventuali errori nell'app
    const appComponent = window.App;
    const appErrors = [];
    
    if (appComponent && appComponent.components) {
      // Verifica che i tag name nel componente App corrispondano ai nostri requiredComponents
      requiredComponents.forEach(comp => {
        if (typeof comp.variable !== 'undefined' && !appComponent.components[comp.tagName]) {
          // Il componente è caricato ma non registrato in App con il nome corretto
          appErrors.push(`Componente '${comp.name}' caricato ma non registrato in App con il tag '${comp.tagName}'`);
        }
      });
    }
    
    if (missingComponents.length > 0 || appErrors.length > 0) {
      // Log errori
      if (missingComponents.length > 0) {
        console.error('ERRORE: Componenti mancanti:', missingComponents.map(c => c.name).join(', '));
      }
      
      if (appErrors.length > 0) {
        console.error('ERRORE: Problemi di registrazione componenti:');
        appErrors.forEach(err => console.error(' - ' + err));
      }
      
      // Suggerimenti per la risoluzione
      console.info('Suggerimenti per la risoluzione:');
      console.info('1. Controlla che tutti i file dei componenti esistano nella cartella components/');
      console.info('2. Verifica che l\'ordine di caricamento degli script in index.html sia corretto');
      console.info('3. Assicurati che ogni componente utilizzi la sintassi globale (const NomeComponente = {...})');
      console.info('4. Verifica che i tag name nei componenti corrispondano a quelli usati in App.components');
      
      // Avviso HTML visibile nella pagina
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #f44336; color: white; padding: 15px; z-index: 9999; text-align: center;';
      
      let errorMessage = '';
      if (missingComponents.length > 0) {
        errorMessage += `<strong>ERRORE:</strong> Componenti non caricati: ${missingComponents.map(c => c.name).join(', ')}`;
      }
      
      if (appErrors.length > 0) {
        if (errorMessage) errorMessage += '<br>';
        errorMessage += `<strong>ERRORE:</strong> Problemi di registrazione componenti`;
      }
      
      warningDiv.innerHTML = `
        ${errorMessage}
        <br>Controlla la console per i dettagli e suggerimenti.
      `;
      document.body.appendChild(warningDiv);
    } else {
      console.log('✓ Tutti i componenti sono correttamente caricati.');
    }
  });
})();
