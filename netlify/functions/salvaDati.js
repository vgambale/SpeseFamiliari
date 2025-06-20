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
    
    // Valida che ci sia un ID utente
    const userId = data.userId;
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ID utente mancante' })
      };
    }

    // Accedi al KV Store
    const store = getStore({ name: 'spese-familiari' });
    
    // Salva i dati associati all'ID utente
    await store.set(`user-${userId}`, JSON.stringify(data.movimenti));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Dati salvati con successo' })
    };
  } catch (error) {
    console.error('Errore durante il salvataggio dei dati:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Errore durante il salvataggio dei dati', details: error.message })
    };
  }
};
