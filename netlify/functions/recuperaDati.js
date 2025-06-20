// netlify/functions/recuperaDati.js
const { createClient } = require('@netlify/blobs');

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

    // Estrai l'ID utente dalla query
    const params = new URLSearchParams(event.queryStringParameters);
    const userId = params.get('userId') || event.queryStringParameters.userId;
    
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ID utente mancante' })
      };
    }    // Accedi al Blobs Store
    const client = createClient(context);
    const store = client.get('spese-familiari');
    
    try {
      // Recupera i dati associati all'ID utente
      const key = `user-${userId}`;
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
      console.log("Dati non trovati per l'utente:", userId);
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
