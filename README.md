# Gestione Spese Familiari - Applicazione Vue.js

Un'applicazione web client-side per la gestione delle entrate e uscite familiari, sviluppata con Vue.js.

## Caratteristiche

- Inserimento di entrate e uscite
- Organizzazione per categoria, data, frequenza e persona
- Salvataggio dei dati in localStorage del browser
- Import/export dei dati in formato JSON
- Dashboard con grafici riepilogativi
- Filtri avanzati per tipo, categoria, data e persona
- Design responsive e moderno

## Come eseguire l'applicazione

1. Aprire il file `index.html` nel browser
2. Non è necessario alcun server web, l'applicazione è completamente client-side

## Tecnologie utilizzate

- Vue.js 3 (CDN)
- Chart.js per i grafici
- LocalStorage per la persistenza dei dati
- Fontawesome per le icone
- Nessun framework CSS (solo CSS personalizzato)

## Modello dati

```json
[
  {
    "id": "uuid",
    "tipo": "entrata | uscita",
    "categoria": "Affitto | Spesa | Stipendio | ...",
    "importo": 250.00,
    "data": "2025-06-20",
    "frequenza": "una_tantum | giornaliera | mensile | annuale",
    "persona": "Mario"
  }
]
```

## Sviluppo futuro

Possibili miglioramenti:
- Aggiungere supporto per valute multiple
- Implementare notifiche per movimenti ricorrenti
- Aggiungere supporto per tag personalizzati
- Implementare un sistema di budget
