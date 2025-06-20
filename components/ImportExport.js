// Componente ImportExport

const ImportExport = {
  props: {
    esportaDati: {
      type: Function,
      required: true
    }
  },
  emits: ['importa-dati'],  setup(props, { emit }) {
    const { ref } = Vue;
    
    const fileInput = ref(null)
    const jsonDaEsportare = ref('')
    const alertMessage = ref({
      show: false,
      type: 'success',
      text: ''
    })
    
    // Funzione per esportare i dati
    function esporta() {
      try {
        jsonDaEsportare.value = props.esportaDati()
        
        // Crea un elemento <a> per il download
        const element = document.createElement('a')
        const file = new Blob([jsonDaEsportare.value], { type: 'application/json' })
        element.href = URL.createObjectURL(file)
        
        // Genera nome del file con data attuale
        const now = new Date()
        const dateStr = now.toISOString().split('T')[0]
        element.download = `spese_familiari_${dateStr}.json`
        
        // Simula click per download
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
        
        // Mostra messaggio di successo
        showAlert('success', 'Dati esportati con successo!')
      } catch (err) {
        console.error('Errore durante l\'esportazione', err)
        showAlert('danger', 'Errore durante l\'esportazione dei dati')
      }
    }
    
    // Funzione per importare i dati
    function importa() {
      if (!fileInput.value.files.length) {
        showAlert('danger', 'Seleziona un file da importare')
        return
      }
      
      const file = fileInput.value.files[0]
      const reader = new FileReader()
      
      reader.onload = function(e) {
        try {
          const datiImportati = JSON.parse(e.target.result)
          
          // Validazione che sia un array
          if (!Array.isArray(datiImportati)) {
            throw new Error('Il file non contiene un array di movimenti valido')
          }
          
          // Validazione che ogni movimento abbia le proprietà richieste
          const requiredFields = ['id', 'tipo', 'categoria', 'importo', 'data', 'frequenza', 'persona']
          const isValid = datiImportati.every(movimento => {
            return requiredFields.every(field => movimento.hasOwnProperty(field))
          })
          
          if (!isValid) {
            throw new Error('Alcuni movimenti non hanno tutte le proprietà richieste')
          }
          
          // Emetti evento con i dati importati
          emit('importa-dati', datiImportati)
          showAlert('success', `Importati con successo ${datiImportati.length} movimenti`)
          
          // Reset del campo file
          fileInput.value.value = ''
        } catch (err) {
          console.error('Errore durante l\'importazione', err)
          showAlert('danger', 'Il file selezionato non è valido. Verifica il formato JSON.')
        }
      }
      
      reader.onerror = function() {
        showAlert('danger', 'Errore nella lettura del file')
      }
      
      reader.readAsText(file)
    }
    
    // Funzione per mostrare gli alert
    function showAlert(type, text) {
      alertMessage.value = {
        show: true,
        type,
        text
      }
      
      // Nascondi l'alert dopo 5 secondi
      setTimeout(() => {
        alertMessage.value.show = false
      }, 5000)
    }
    
    return {
      fileInput,
      jsonDaEsportare,
      alertMessage,
      esporta,
      importa
    }
  },
  template: `
    <div class="card">
      <div class="card-header">
        <h2>Import / Export Dati</h2>
      </div>
      
      <div class="card-body">
        <!-- Alert messaggi -->
        <div 
          v-if="alertMessage.show" 
          :class="'alert alert-' + alertMessage.type" 
          style="padding: 1rem; margin-bottom: 1rem; border-radius: var(--border-radius); color: white; background-color: var(--primary-color);"
          :style="alertMessage.type === 'danger' ? 'background-color: var(--danger-color);' : ''"
        >
          {{ alertMessage.text }}
        </div>
        
        <!-- Esporta -->
        <div class="section mb-3">
          <h3 class="mb-1">Esporta Dati</h3>
          <p class="mb-2">Scarica i dati delle spese familiari in un file JSON che puoi conservare come backup.</p>
          
          <button class="btn btn-primary" @click="esporta">
            <i class="fas fa-download"></i> Esporta Dati
          </button>
        </div>
        
        <hr style="margin: 2rem 0;">
        
        <!-- Importa -->
        <div class="section">
          <h3 class="mb-1">Importa Dati</h3>
          <p class="mb-2">Carica un file JSON precedentemente esportato. <strong>Attenzione:</strong> questa operazione sovrascriverà tutti i dati esistenti.</p>
          
          <div class="form-group">
            <label for="import-file">Seleziona File JSON</label>
            <input 
              type="file" 
              id="import-file" 
              ref="fileInput"
              accept=".json" 
              style="padding: 0.5rem 0;"
            />
          </div>
          
          <button class="btn btn-primary" @click="importa">
            <i class="fas fa-upload"></i> Importa Dati
          </button>
        </div>
      </div>
    </div>
  `
}
