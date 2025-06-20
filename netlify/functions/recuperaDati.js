// netlify/functions/recuperaDati.js
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
    // Verifica che la richiesta sia GET
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Metodo non permesso' })
      };
    }
    
    // Accedi al Blobs Store - configurazione per supportare l'ambiente di produzione e locale
    let store;
      // In Netlify, getStore funzionerà in ogni caso anche se dovesse fallire
    // cerchiamo di gestire l'errore in modo più elegante    // Otteniamo siteID e token dall'ambiente
    const siteID = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_AUTH_TOKEN;
    
    // Log delle variabili d'ambiente per il debug
    console.log("SITE_ID:", siteID ? "Presente" : "Mancante");
    console.log("NETLIFY_AUTH_TOKEN:", token ? "Presente" : "Mancante");
    console.log("NETLIFY env:", process.env.NETLIFY);
    console.log("NETLIFY_DEV env:", process.env.NETLIFY_DEV);
    console.log("CONTEXT env:", process.env.CONTEXT);
    
    try {
      // Configuriamo lo store con siteID e token se disponibili
      const storeOptions = { 
        name: 'spese-familiari',
      };
      
      // Aggiungiamo siteID e token solo se disponibili
      if (siteID) storeOptions.siteID = siteID;
      if (token) storeOptions.token = token;
      
      store = getStore(storeOptions);
    } catch (storeError) {
      console.log("Errore nella creazione dello store:", storeError);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          movimenti: [], 
          message: 'Impossibile connettersi allo store Netlify Blobs. Usando localStorage.',
          error: storeError.message
        })
      };
    }
    
    try {
      // Usa una chiave comune per tutti gli utenti
      const key = 'dati-condivisi';
      const movimenti = await store.get(key);
      
      // Se non ci sono dati, restituisci un array vuoto
      if (!movimenti) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ movimenti: [] })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ movimenti: JSON.parse(movimenti) })
      };
    } catch (error) {
      // Se il blob non esiste, restituisci un array vuoto
      console.log("Dati non trovati nel database condiviso");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ movimenti: [] })
      };
    }
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Errore durante il recupero dei dati', details: error.message })
    };
  }
};
