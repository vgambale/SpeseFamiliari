// Componente ListaMovimenti

const ListaMovimenti = {
  components: {
    'modal-modifica': ModalModifica
  },
  props: {
    movimenti: {
      type: Array,
      required: true
    }  },
  emits: ['modifica', 'elimina'],
  setup(props, { emit }) {
    const { ref, computed } = Vue;
    
    const movimentoSelezionato = ref(null)
    const mostraModalModifica = ref(false)
    const ordinamento = ref({
      campo: 'data',
      direzione: 'desc' // 'desc' o 'asc'
    })
    
    const movimentiOrdinati = computed(() => {
      return [...props.movimenti].sort((a, b) => {
        let valoreDiConfronto
        
        if (ordinamento.value.campo === 'data') {
          const dateA = new Date(a.data)
          const dateB = new Date(b.data)
          valoreDiConfronto = ordinamento.value.direzione === 'asc' ? dateA - dateB : dateB - dateA
        } else if (ordinamento.value.campo === 'importo') {
          valoreDiConfronto = ordinamento.value.direzione === 'asc' ? a.importo - b.importo : b.importo - a.importo
        } else {
          // Per campi di testo come categoria, persona, ecc.
          const valA = a[ordinamento.value.campo] || ''
          const valB = b[ordinamento.value.campo] || ''
          valoreDiConfronto = ordinamento.value.direzione === 'asc' ? 
            valA.localeCompare(valB) : 
            valB.localeCompare(valA)
        }
        
        return valoreDiConfronto
      })
    })
    
    function cambiaOrdinamento(campo) {
      if (ordinamento.value.campo === campo) {
        // Inverti la direzione se il campo è lo stesso
        ordinamento.value.direzione = ordinamento.value.direzione === 'asc' ? 'desc' : 'asc'
      } else {
        // Imposta il nuovo campo e direzione default
        ordinamento.value.campo = campo
        ordinamento.value.direzione = 'desc'
      }
    }
    
    function iconaOrdinamento(campo) {
      if (ordinamento.value.campo !== campo) {
        return 'fa-sort'
      } else if (ordinamento.value.direzione === 'asc') {
        return 'fa-sort-up'
      } else {
        return 'fa-sort-down'
      }
    }
    
    function apriModalModifica(movimento) {
      movimentoSelezionato.value = { ...movimento }
      mostraModalModifica.value = true
    }
    
    function chiudiModalModifica() {
      mostraModalModifica.value = false
      movimentoSelezionato.value = null
    }
    
    function confermaModifica(movimentoModificato) {
      emit('modifica', movimentoModificato.id, movimentoModificato)
      chiudiModalModifica()
    }
    
    function confermaEliminazione(id) {
      if (confirm('Sei sicuro di voler eliminare questo movimento?')) {
        emit('elimina', id)
      }
    }
    
    function formattaData(dataString) {
      if (!dataString) return ''
      const data = new Date(dataString)
      return data.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    function formattaImporto(importo) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
      }).format(importo)
    }
    
    function getFrequenzaLabel(frequenza) {
      const labels = {
        una_tantum: 'Una tantum',
        giornaliera: 'Giornaliera',
        mensile: 'Mensile',
        annuale: 'Annuale'
      }
      return labels[frequenza] || frequenza
    }
    
    return {
      movimentiOrdinati,
      ordinamento,
      movimentoSelezionato,
      mostraModalModifica,
      cambiaOrdinamento,
      iconaOrdinamento,
      apriModalModifica,
      chiudiModalModifica,
      confermaModifica,
      confermaEliminazione,
      formattaData,
      formattaImporto,
      getFrequenzaLabel
    }
  },
  template: `
    <div class="card">
      <div class="card-header">
        <h2>Lista Movimenti</h2>
      </div>
      
      <div v-if="movimentiOrdinati.length === 0" class="card-body p-2 text-center">
        <p>Nessun movimento trovato. Usa i filtri o aggiungi nuovi movimenti.</p>
      </div>
      
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th @click="cambiaOrdinamento('tipo')">
                Tipo <i class="fas" :class="iconaOrdinamento('tipo')"></i>
              </th>
              <th @click="cambiaOrdinamento('data')">
                Data <i class="fas" :class="iconaOrdinamento('data')"></i>
              </th>              <th @click="cambiaOrdinamento('categoria')">
                Categoria <i class="fas" :class="iconaOrdinamento('categoria')"></i>
              </th>
              <th @click="cambiaOrdinamento('descrizione')">
                Descrizione <i class="fas" :class="iconaOrdinamento('descrizione')"></i>
              </th>
              <th @click="cambiaOrdinamento('importo')" class="text-right">
                Importo <i class="fas" :class="iconaOrdinamento('importo')"></i>
              </th>
              <th @click="cambiaOrdinamento('persona')">
                Persona <i class="fas" :class="iconaOrdinamento('persona')"></i>
              </th>
              <th @click="cambiaOrdinamento('frequenza')">
                Frequenza <i class="fas" :class="iconaOrdinamento('frequenza')"></i>
              </th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movimento in movimentiOrdinati" :key="movimento.id">
              <td>
                <span 
                  class="badge" 
                  :class="movimento.tipo === 'entrata' ? 'badge-success' : 'badge-danger'"
                >
                  <i 
                    class="fas" 
                    :class="movimento.tipo === 'entrata' ? 'fa-arrow-down' : 'fa-arrow-up'"
                  ></i>
                  {{ movimento.tipo === 'entrata' ? 'Entrata' : 'Uscita' }}
                </span>
              </td>              <td>{{ formattaData(movimento.data) }}</td>
              <td>{{ movimento.categoria }}</td>
              <td>{{ movimento.descrizione || '-' }}</td>
              <td class="text-right">
                <span :class="movimento.tipo === 'entrata' ? 'text-success' : 'text-danger'">
                  {{ formattaImporto(movimento.importo) }}
                </span>
              </td>
              <td>{{ movimento.persona }}</td>
              <td>{{ getFrequenzaLabel(movimento.frequenza) }}</td>
              <td>
                <div class="flex gap-1">
                  <button 
                    class="btn btn-sm btn-primary btn-icon" 
                    @click="apriModalModifica(movimento)" 
                    title="Modifica"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger btn-icon" 
                    @click="confermaEliminazione(movimento.id)" 
                    title="Elimina"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <teleport to="body">
      <!-- Modal per modifica -->
      <modal-modifica 
        v-if="mostraModalModifica" 
        :movimento="movimentoSelezionato"
        @chiudi="chiudiModalModifica"
        @salva="confermaModifica"
      />
    </teleport>
  `
}
