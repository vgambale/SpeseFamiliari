// Componente ModalModifica

const ModalModifica = {
  props: {
    movimento: {
      type: Object,
      required: true
    }
  },
  emits: ['chiudi', 'salva'],  setup(props, { emit }) {
    const { ref, computed } = Vue;    const tipo = ref(props.movimento.tipo)
    const categoria = ref(props.movimento.categoria)
    const importo = ref(props.movimento.importo)
    const data = ref(props.movimento.data)
    const frequenza = ref(props.movimento.frequenza)
    const persona = ref(props.movimento.persona)
    const descrizione = ref(props.movimento.descrizione || '')
    
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
    
    const dataVisualizzata = ref(formatDateForDisplay(props.movimento.data))
    
    const formValido = computed(() => {
      return (
        tipo.value &&
        categoria.value &&
        importo.value > 0 &&
        data.value &&
        frequenza.value &&
        persona.value &&
        descrizione.value.trim() !== ''
      )
    })
    
    function salvaModifiche() {
      if (!formValido.value) return
        const movimentoModificato = {
        id: props.movimento.id,
        tipo: tipo.value,
        categoria: categoria.value,
        importo: parseFloat(importo.value),
        data: data.value,
        frequenza: frequenza.value,
        persona: persona.value,
        descrizione: descrizione.value
      }
      
      emit('salva', movimentoModificato)
    }
    
    function chiudiModal() {
      emit('chiudi')
    }    return {
      tipo,
      categoria,
      importo,
      data,
      dataVisualizzata,
      frequenza,
      persona,
      descrizione,
      formValido,
      salvaModifiche,
      chiudiModal,
      formatDateForDisplay
    }
  },
  template: `
    <div class="modal-backdrop" @click.self="chiudiModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Modifica Movimento</h3>
          <button class="close-btn" @click="chiudiModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="salvaModifiche">            <!-- Tipo movimento -->
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
            <div class="form-group">
              <label for="categoria-mod">Categoria</label>
              <input 
                type="text" 
                id="categoria-mod" 
                v-model="categoria" 
                required
              />
            </div>
            
            <!-- Importo e Data -->
            <div class="form-row">
              <div class="form-group">
                <label for="importo-mod">Importo (€)</label>
                <input 
                  type="number" 
                  id="importo-mod" 
                  v-model="importo" 
                  step="0.01" 
                  min="0.01"
                  required
                />
              </div>
                <div class="form-group">
                <label for="data-mod">Data</label>
                <div class="data-input-wrapper">
                  <input 
                    type="date" 
                    id="data-mod" 
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
              <label for="frequenza-mod">Frequenza</label>
              <select id="frequenza-mod" v-model="frequenza" required>
                <option value="una_tantum">Una tantum</option>
                <option value="giornaliera">Giornaliera</option>
                <option value="mensile">Mensile</option>
                <option value="annuale">Annuale</option>
              </select>
            </div>            <!-- Persona -->
            <div class="form-group">
              <label for="persona-mod">Persona</label>
              <input 
                type="text" 
                id="persona-mod" 
                v-model="persona" 
                required
              />
            </div>
            
            <!-- Descrizione -->
            <div class="form-group">
              <label for="descrizione-mod">Descrizione</label>
              <input 
                type="text" 
                id="descrizione-mod" 
                v-model="descrizione" 
                placeholder="Es: Spesa settimanale al supermercato" 
                required
              />
            </div>
            
            <!-- Descrizione -->
            <div class="form-group">
              <label for="descrizione-mod">Descrizione</label>
              <input 
                type="text" 
                id="descrizione-mod" 
                v-model="descrizione" 
                placeholder="Es: Spesa settimanale al supermercato" 
                required
              />
            </div>
          </form>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-danger" @click="chiudiModal">Annulla</button>
          <button 
            class="btn btn-primary" 
            @click="salvaModifiche"
            :disabled="!formValido"
          >
            Salva Modifiche
          </button>
        </div>
      </div>
    </div>
  `
}
