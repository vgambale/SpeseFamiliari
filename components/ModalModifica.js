// Componente ModalModifica

const ModalModifica = {
  props: {
    movimento: {
      type: Object,
      required: true
    }
  },
  emits: ['chiudi', 'salva'],  setup(props, { emit }) {
    const { ref, computed } = Vue;
    
    const tipo = ref(props.movimento.tipo)
    const categoria = ref(props.movimento.categoria)
    const importo = ref(props.movimento.importo)
    const data = ref(props.movimento.data)
    const frequenza = ref(props.movimento.frequenza)
    const persona = ref(props.movimento.persona)
    
    const formValido = computed(() => {
      return (
        tipo.value &&
        categoria.value &&
        importo.value > 0 &&
        data.value &&
        frequenza.value &&
        persona.value
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
        persona: persona.value
      }
      
      emit('salva', movimentoModificato)
    }
    
    function chiudiModal() {
      emit('chiudi')
    }
    
    return {
      tipo,
      categoria,
      importo,
      data,
      frequenza,
      persona,
      formValido,
      salvaModifiche,
      chiudiModal
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
          <form @submit.prevent="salvaModifiche">
            <!-- Tipo movimento -->
            <div class="form-group">
              <label>Tipo di movimento</label>
              <div style="display: flex; gap: 1rem;">
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="entrata" 
                    v-model="tipo" 
                    style="margin-right: 0.5rem;"
                  />
                  <span class="text-success">
                    <i class="fas fa-arrow-down"></i> Entrata
                  </span>
                </label>
                
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                  <input 
                    type="radio" 
                    name="tipo" 
                    value="uscita" 
                    v-model="tipo" 
                    style="margin-right: 0.5rem;"
                  />
                  <span class="text-danger">
                    <i class="fas fa-arrow-up"></i> Uscita
                  </span>
                </label>
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
                <input 
                  type="date" 
                  id="data-mod" 
                  v-model="data" 
                  required
                />
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
            </div>
            
            <!-- Persona -->
            <div class="form-group">
              <label for="persona-mod">Persona</label>
              <input 
                type="text" 
                id="persona-mod" 
                v-model="persona" 
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
