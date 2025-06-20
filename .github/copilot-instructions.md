<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Spese Familiari - Vue.js Single Page Application

Questa è una single page application Vue.js per la gestione delle spese familiari. L'applicazione consente di:

- Inserire entrate e uscite familiari
- Organizzarle per categoria, data, frequenza e persona
- Salvare i dati in localStorage
- Importare ed esportare dati in formato JSON
- Visualizzare riepiloghi per mese, anno, categoria, tipo (entrata/uscita) e persona

L'applicazione è completamente client-side, senza necessità di un server backend.

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
