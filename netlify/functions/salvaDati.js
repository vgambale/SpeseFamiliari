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
    
    // Accedi al Blobs Store - configurazione per supportare l'ambiente di produzione e locale
    let store;
    
    // Controlla se siamo in ambiente Netlify
    if (process.env.NETLIFY && process.env.NETLIFY === 'true') {
      // In ambiente Netlify, getStore funzionerà automaticamente
      store = getStore({ name: 'spese-familiari' });
      
      // Salva i dati con una chiave comune per tutti gli utenti
      const key = 'dati-condivisi';
      await store.set(key, JSON.stringify(data.movimenti));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Dati salvati con successo' })
      };
    } else {
      // Per test locali, restituisci successo ma indica che i dati devono essere salvati in localStorage
      console.log("Ambiente non-Netlify rilevato. I dati dovranno essere salvati in localStorage.");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Ambiente non-Netlify. Usa localStorage per test locali',
          localOnly: true
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
