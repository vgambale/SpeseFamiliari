// netlify-plugin-blobs.js
// Plugin personalizzato per configurare Netlify Blobs

module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Configurazione Netlify Blobs in corso...');
    
    // Assicurati che la variabile d'ambiente sia impostata
    if (!process.env.NETLIFY_BLOBS_ENABLED) {
      process.env.NETLIFY_BLOBS_ENABLED = 'true';
      console.log('Variabile NETLIFY_BLOBS_ENABLED impostata su true');
    }
    
    console.log('Configurazione Netlify Blobs completata');
  }
};
