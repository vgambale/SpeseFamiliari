// Componente FormMovimento

const FormMovimento = {
  props: {
    categorie: Array,
    persone: Array,
    movimentoDaModificare: {
      type: Object,
      default: null
    }
  },
  emits: ['salva'],  setup(props, { emit }) {
    const { ref, computed } = Vue;
    
    const categoriePreDefinite = [
      'Affitto', 
      'Bollette', 
      'Spesa',
      'Trasporti', 
      'Salute', 
      'Svago', 
      'Abbigliamento', 
      'Stipendio', 
      'Regalo', 
      'Altro'
    ]
      const oggi = new Date().toISOString().split('T')[0]
    
    // Funzioni per formattazione date
    function formatDateForDisplay(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    function formatDateForInput(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    }
    
    // Stato form
    const tipo = ref(props.movimentoDaModificare?.tipo || 'uscita')
    const categoria = ref(props.movimentoDaModificare?.categoria || '')
    const categoriaPersonalizzata = ref('')
    const importo = ref(props.movimentoDaModificare?.importo || '')
    const data = ref(props.movimentoDaModificare?.data || oggi)
    const dataVisualizzata = ref(formatDateForDisplay(props.movimentoDaModificare?.data || oggi))
    const frequenza = ref(props.movimentoDaModificare?.frequenza || 'una_tantum')
    const persona = ref(props.movimentoDaModificare?.persona || '')
    const personaPersonalizzata = ref('')
    const descrizione = ref(props.movimentoDaModificare?.descrizione || '')
    
    // Opzioni per le categorie e persone, unite tra quelle esistenti e predefinite
    const opzioniCategorie = computed(() => {
      const categorieEsistenti = props.categorie || []
      return [...new Set([...categoriePreDefinite, ...categorieEsistenti])]
    })
    
    const opzioniPersone = computed(() => {
      return props.persone || []
    })
      // Funzione di validazione
    const formValido = computed(() => {
      return (
        tipo.value &&
        (categoria.value || categoriaPersonalizzata.value) &&
        importo.value > 0 &&
        data.value &&
        frequenza.value &&
        (persona.value || personaPersonalizzata.value) &&
        descrizione.value.trim() !== '' // La descrizione è obbligatoria
      )
    })
      // Funzione di salvataggio    function salvaMovimento() {
      if (!formValido.value) return
      
      const nuovoMovimento = {
        tipo: tipo.value,
        categoria: categoria.value || categoriaPersonalizzata.value,
        importo: parseFloat(importo.value),
        data: data.value,
        frequenza: frequenza.value,
        persona: persona.value || personaPersonalizzata.value,
        descrizione: descrizione.value
      }
      
      emit('salva', nuovoMovimento)
      
      // Reset form
      tipo.value = 'uscita'
      categoria.value = ''
      categoriaPersonalizzata.value = ''
      importo.value = ''
      data.value = oggi
      dataVisualizzata.value = formatDateForDisplay(oggi)
      frequenza.value = 'una_tantum'
      persona.value = ''
      personaPersonalizzata.value = ''
      descrizione.value = ''
    }
      return {
      tipo,
      categoria,
      categoriaPersonalizzata,
      importo,
      data,
      dataVisualizzata,
      frequenza,
      persona,
      personaPersonalizzata,
      descrizione,
      opzioniCategorie,
      opzioniPersone,
      formValido,
      salvaMovimento
    }
  },
  template: `
    <div class="card">
      <div class="card-header">
        <h2>
          <i class="fas" :class="tipo === 'entrata' ? 'fa-arrow-down' : 'fa-arrow-up'"></i>
          {{ tipo === 'entrata' ? 'Nuova Entrata' : 'Nuova Uscita' }}
        </h2>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="salvaMovimento">          <!-- Tipo movimento -->
          <div class="form-group">
            <label>Tipo di movimento</label>
            <div class="btn-group tipo-movimento">
              <button 
                type="button" 
                class="btn btn-tipo" 
                :class="{'btn-success': tipo === 'entrata', 'btn-outline': tipo !== 'entrata'}"
                @click="tipo = 'entrata'"
              >
                <i class="fas fa-arrow-down"></i> Entrata
              </button>
              
              <button 
                type="button" 
                class="btn btn-tipo" 
                :class="{'btn-danger': tipo === 'uscita', 'btn-outline': tipo !== 'uscita'}"
                @click="tipo = 'uscita'"
              >
                <i class="fas fa-arrow-up"></i> Uscita
              </button>
            </div>
          </div>
          
          <!-- Categoria -->
          <div class="form-row">
            <div class="form-group">
              <label for="categoria">Categoria</label>
              <select id="categoria" v-model="categoria">
                <option value="">Seleziona o inserisci manualmente</option>
                <option v-for="cat in opzioniCategorie" :value="cat">{{ cat }}</option>
              </select>
            </div>
            
            <div class="form-group" v-if="!categoria">
              <label for="categoriaPersonalizzata">Categoria personalizzata</label>
              <input 
                type="text" 
                id="categoriaPersonalizzata" 
                v-model="categoriaPersonalizzata" 
                placeholder="Es: Palestra"
              />
            </div>
          </div>
          
          <!-- Importo e Data -->
          <div class="form-row">
            <div class="form-group">
              <label for="importo">Importo (€)</label>
              <input 
                type="number" 
                id="importo" 
                v-model="importo" 
                placeholder="Es: 25.50" 
                step="0.01" 
                min="0.01"
                required
              />
            </div>
              <div class="form-group">
              <label for="data">Data</label>              <div class="data-input-wrapper">
                <input 
                  type="date" 
                  id="data" 
                  v-model="data" 
                  required
                  class="data-input-hidden"
                  @change="dataVisualizzata = formatDateForDisplay(data)"
                />
                <div class="data-input-display">
                  {{ dataVisualizzata }}
                  <i class="fas fa-calendar-alt"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Frequenza -->
          <div class="form-group">
            <label for="frequenza">Frequenza</label>
            <select id="frequenza" v-model="frequenza" required>
              <option value="una_tantum">Una tantum</option>
              <option value="giornaliera">Giornaliera</option>
              <option value="mensile">Mensile</option>
              <option value="annuale">Annuale</option>
            </select>
          </div>
            <!-- Persona -->
          <div class="form-row">
            <div class="form-group">
              <label for="persona">Persona</label>
              <select id="persona" v-model="persona">
                <option value="">Seleziona o inserisci manualmente</option>
                <option v-for="p in opzioniPersone" :value="p">{{ p }}</option>
              </select>
            </div>
            
            <div class="form-group" v-if="!persona">
              <label for="personaPersonalizzata">Nome persona</label>
              <input 
                type="text" 
                id="personaPersonalizzata" 
                v-model="personaPersonalizzata" 
                placeholder="Es: Mario"
              />
            </div>
          </div>
          
          <!-- Descrizione -->
          <div class="form-group">
            <label for="descrizione">Descrizione</label>
            <input 
              type="text" 
              id="descrizione" 
              v-model="descrizione" 
              placeholder="Es: Spesa settimanale al supermercato" 
              required
            />
          </div>
          
          <!-- Pulsanti -->
          <div class="form-group">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="!formValido"
            >
              <i class="fas fa-save"></i> Salva Movimento
            </button>
          </div>
        </form>
      </div>
    </div>
  `
}
