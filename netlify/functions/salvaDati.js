// netlify/functions/salvaDati.js
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Abilita CORS
  const headers = {
    'Access-Control-Allow-Origin': '*', // In produzione, sostituisci con il tuo dominio
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Gestione delle richieste preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call success' })
    };
  }

  try {
    // Verifica che la richiesta sia POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Metodo non permesso' })
      };
    }

    // Estrai i dati dal corpo della richiesta
    const data = JSON.parse(event.body);
      // Accedi al Blobs Store
    let store;
    
    try {
      // In Netlify, getStore dovrebbe funzionare normalmente
      store = getStore({ name: 'spese-familiari' });
      
      // Salva i dati con una chiave comune per tutti gli utenti
      const key = 'dati-condivisi';
      await store.set(key, JSON.stringify(data.movimenti));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Dati salvati con successo su Netlify Blobs' })
      };
    } catch (storeError) {
      // Log informazioni utili per il debug
      console.log("Errore nella gestione dello store:", storeError);
      console.log("NETLIFY env:", process.env.NETLIFY);
      console.log("NETLIFY_DEV env:", process.env.NETLIFY_DEV); 
      console.log("CONTEXT env:", process.env.CONTEXT);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Impossibile salvare su Netlify Blobs. Usa localStorage.',
          localOnly: true,
          error: storeError.message
        })
      };
    }
  } catch (error) {
    console.error('Errore durante il salvataggio dei dati:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Errore durante il salvataggio dei dati', details: error.message })
    };
  }
};
