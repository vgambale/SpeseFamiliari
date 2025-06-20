// Componente App principale

const App = {
  components: {
    'form-movimento': FormMovimento,
    'lista-movimenti': ListaMovimenti,
    'dashboard': DashboardView,
    'import-export': ImportExport
  },  setup() {
    const { ref, computed, onMounted, watch } = Vue;
    
    const tabAttiva = ref('dashboard')
    const movimenti = ref([])
    const filtri = ref({
      tipo: '',
      categoria: '',
      persona: '',
      mese: '',
      anno: ''
    })

    // Riferimenti ai valori unici per i filtri
    const categorie = computed(() => {
      return [...new Set(movimenti.value.map(m => m.categoria))]
    })

    const persone = computed(() => {
      return [...new Set(movimenti.value.map(m => m.persona))]
    })

    const anni = computed(() => {
      return [...new Set(movimenti.value.map(m => {
        return new Date(m.data).getFullYear()
      }))].sort((a, b) => b - a) // Ordine decrescente
    })

    const mesi = computed(() => {
      return [
        { valore: '01', nome: 'Gennaio' },
        { valore: '02', nome: 'Febbraio' },
        { valore: '03', nome: 'Marzo' },
        { valore: '04', nome: 'Aprile' },
        { valore: '05', nome: 'Maggio' },
        { valore: '06', nome: 'Giugno' },
        { valore: '07', nome: 'Luglio' },
        { valore: '08', nome: 'Agosto' },
        { valore: '09', nome: 'Settembre' },
        { valore: '10', nome: 'Ottobre' },
        { valore: '11', nome: 'Novembre' },
        { valore: '12', nome: 'Dicembre' }
      ]
    })

    const movimentiFiltrati = computed(() => {
      return movimenti.value.filter(m => {
        const dataMovimento = new Date(m.data)
        const meseMovimento = (dataMovimento.getMonth() + 1).toString().padStart(2, '0')
        const annoMovimento = dataMovimento.getFullYear().toString()

        return (
          (!filtri.value.tipo || m.tipo === filtri.value.tipo) &&
          (!filtri.value.categoria || m.categoria === filtri.value.categoria) &&
          (!filtri.value.persona || m.persona === filtri.value.persona) &&
          (!filtri.value.mese || meseMovimento === filtri.value.mese) &&
          (!filtri.value.anno || annoMovimento === filtri.value.anno)
        )
      })
    })

    // Dati di riepilogo
    const totaleEntrate = computed(() => {
      return movimentiFiltrati.value
        .filter(m => m.tipo === 'entrata')
        .reduce((acc, m) => acc + m.importo, 0)
    })

    const totaleUscite = computed(() => {
      return movimentiFiltrati.value
        .filter(m => m.tipo === 'uscita')
        .reduce((acc, m) => acc + m.importo, 0)
    })

    const saldo = computed(() => {
      return totaleEntrate.value - totaleUscite.value
    })

    const entratePerCategoria = computed(() => {
      return getImportiPerCategoria('entrata')
    })

    const uscitePerCategoria = computed(() => {
      return getImportiPerCategoria('uscita')
    })

    const entratePerPersona = computed(() => {
      return getImportiPerPersona('entrata')
    })

    const uscitePerPersona = computed(() => {
      return getImportiPerPersona('uscita')
    })

    function getImportiPerCategoria(tipo) {
      const risultato = {}
      
      movimentiFiltrati.value
        .filter(m => m.tipo === tipo)
        .forEach(m => {
          if (!risultato[m.categoria]) risultato[m.categoria] = 0
          risultato[m.categoria] += m.importo
        })
      
      return risultato
    }

    function getImportiPerPersona(tipo) {
      const risultato = {}
      
      movimentiFiltrati.value
        .filter(m => m.tipo === tipo)
        .forEach(m => {
          if (!risultato[m.persona]) risultato[m.persona] = 0
          risultato[m.persona] += m.importo
        })
      
      return risultato
    }    // Funzioni CRUD
    function aggiungiMovimento(movimento) {
      movimento.id = uuid.v4()
      movimenti.value.unshift(movimento)
      salvaSuServer()
    }

    function modificaMovimento(id, datiAggiornati) {
      const indice = movimenti.value.findIndex(m => m.id === id)
      if (indice !== -1) {
        movimenti.value[indice] = { ...datiAggiornati, id }
        salvaSuServer()
      }
    }

    function eliminaMovimento(id) {
      movimenti.value = movimenti.value.filter(m => m.id !== id)
      salvaSuServer()
    }
    
    // ID Utente - in una app reale utilizzeresti un sistema di autenticazione
    const userId = ref(localStorage.getItem('speseFamiliari_userId') || null)
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    // Crea un ID utente se non esiste
    function creaUserId() {
      if (!userId.value) {
        userId.value = uuid.v4()
        localStorage.setItem('speseFamiliari_userId', userId.value)
      }
    }
    
    // Funzioni per salvare su Netlify Functions
    async function salvaSuServer() {
      if (!userId.value) {
        creaUserId()
      }
      
      isLoading.value = true
      errorMessage.value = ''
      
      try {
        const response = await fetch('/api/salvaDati', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId.value,
            movimenti: movimenti.value
          })
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Errore durante il salvataggio dei dati')
        }
        
        // Backup in localStorage come fallback
        localStorage.setItem('speseFamiliari', JSON.stringify(movimenti.value))
        
      } catch (err) {
        console.error('Errore nel salvataggio dei dati sul server:', err)
        errorMessage.value = `Errore di salvataggio: ${err.message}`
        
        // Salva comunque in localStorage come fallback
        localStorage.setItem('speseFamiliari', JSON.stringify(movimenti.value))
      } finally {
        isLoading.value = false
      }
    }
    
    async function caricaDalServer() {
      if (!userId.value) {
        // Se non c'è un userId, prova prima localStorage
        caricaDaLocalStorage()
        return
      }
      
      isLoading.value = true
      errorMessage.value = ''
      
      try {
        const response = await fetch(`/api/recuperaDati?userId=${encodeURIComponent(userId.value)}`)
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero dei dati')
        }
        
        const data = await response.json()
        
        if (data && Array.isArray(data.movimenti)) {
          movimenti.value = data.movimenti
        }
        
      } catch (err) {
        console.error('Errore nel caricamento dei dati dal server:', err)
        errorMessage.value = `Errore di caricamento: ${err.message}`
        
        // Fallback a localStorage
        caricaDaLocalStorage()
      } finally {
        isLoading.value = false
      }
    }

    // Funzione di fallback per localStorage
    function caricaDaLocalStorage() {
      try {
        const dati = localStorage.getItem('speseFamiliari')
        if (dati) {
          movimenti.value = JSON.parse(dati)
        }
      } catch (err) {
        console.error('Errore nel caricamento dei dati da localStorage', err)
      }
    }    // Importa ed esporta
    function importaDatiJSON(dati) {
      try {
        movimenti.value = dati
        salvaSuServer()
      } catch (err) {
        console.error('Errore nell\'importazione dei dati', err)
      }
    }

    function esportaDatiJSON() {
      return JSON.stringify(movimenti.value, null, 2)
    }

    // Gestione filtri
    function resetFiltri() {
      filtri.value = {
        tipo: '',
        categoria: '',
        persona: '',
        mese: '',
        anno: ''
      }
    }    // Caricamento iniziale
    onMounted(() => {
      creaUserId()
      caricaDalServer()
    })    // Non usiamo più watch per l'auto-salvataggio poiché aggiungiMovimento, 
    // modificaMovimento e eliminaMovimento chiamano già salvaSuServer()
    
    return {
      tabAttiva,
      movimenti,
      movimentiFiltrati,
      filtri,
      categorie,
      persone,
      anni,
      mesi,
      totaleEntrate,
      totaleUscite,
      saldo,
      entratePerCategoria,
      uscitePerCategoria,
      entratePerPersona,
      uscitePerPersona,
      aggiungiMovimento,
      modificaMovimento,
      eliminaMovimento,
      importaDatiJSON,
      esportaDatiJSON,
      resetFiltri,
      userId,
      isLoading,
      errorMessage,
      salvaSuServer
    }
  },
  template: `    <div class="container">      <header class="app-header">
        <div class="logo">
          <i class="fas fa-wallet logo-icon"></i>
          <span>Gestione Spese Familiari</span>
        </div>
        <div class="user-info">
          <span v-if="isLoading" class="loading-indicator">
            <i class="fas fa-sync fa-spin"></i> Sincronizzazione...
          </span>
          <span v-else-if="userId" class="user-id">
            <i class="fas fa-check-circle"></i> Sincronizzato
          </span>
          <button v-if="userId" class="btn btn-sm btn-primary" @click="salvaSuServer" title="Sincronizza manualmente">
            <i class="fas fa-sync"></i>
          </button>
        </div>
      </header>
      
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ 'active': tabAttiva === 'dashboard' }" 
          @click="tabAttiva = 'dashboard'"
        >
          <i class="fas fa-chart-pie"></i> Dashboard
        </div>
        <div 
          class="tab" 
          :class="{ 'active': tabAttiva === 'lista' }" 
          @click="tabAttiva = 'lista'"
        >
          <i class="fas fa-list"></i> Movimenti
        </div>
        <div 
          class="tab" 
          :class="{ 'active': tabAttiva === 'nuovo' }" 
          @click="tabAttiva = 'nuovo'"
        >
          <i class="fas fa-plus"></i> Nuovo Movimento
        </div>
        <div 
          class="tab" 
          :class="{ 'active': tabAttiva === 'import-export' }" 
          @click="tabAttiva = 'import-export'"
        >
          <i class="fas fa-file-export"></i> Import/Export
        </div>
      </div>
      
      <!-- Filtri comuni -->
      <div class="card mb-3" v-if="tabAttiva === 'lista' || tabAttiva === 'dashboard'">
        <h3 class="mb-2">Filtri</h3>
        <div class="filter-bar">
          <div class="filter-item">
            <label for="filtroTipo">Tipo</label>
            <select id="filtroTipo" v-model="filtri.tipo">
              <option value="">Tutti</option>
              <option value="entrata">Entrata</option>
              <option value="uscita">Uscita</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label for="filtroCategoria">Categoria</label>
            <select id="filtroCategoria" v-model="filtri.categoria">
              <option value="">Tutte</option>
              <option v-for="categoria in categorie" :value="categoria">{{ categoria }}</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label for="filtroPersona">Persona</label>
            <select id="filtroPersona" v-model="filtri.persona">
              <option value="">Tutte</option>
              <option v-for="persona in persone" :value="persona">{{ persona }}</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label for="filtroMese">Mese</label>
            <select id="filtroMese" v-model="filtri.mese">
              <option value="">Tutti</option>
              <option v-for="mese in mesi" :value="mese.valore">{{ mese.nome }}</option>
            </select>
          </div>
          
          <div class="filter-item">
            <label for="filtroAnno">Anno</label>
            <select id="filtroAnno" v-model="filtri.anno">
              <option value="">Tutti</option>
              <option v-for="anno in anni" :value="anno">{{ anno }}</option>
            </select>
          </div>
          
          <div class="filter-item" style="align-self: flex-end;">
            <button class="btn btn-primary" @click="resetFiltri">
              <i class="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>
      </div>
      
      <!-- Dashboard -->
      <div v-if="tabAttiva === 'dashboard'">
        <dashboard
          :totale-entrate="totaleEntrate"
          :totale-uscite="totaleUscite"
          :saldo="saldo"
          :movimenti-filtrati="movimentiFiltrati"
          :entrate-per-categoria="entratePerCategoria"
          :uscite-per-categoria="uscitePerCategoria"
          :entrate-per-persona="entratePerPersona"
          :uscite-per-persona="uscitePerPersona"
        />
      </div>
      
      <!-- Lista Movimenti -->
      <div v-else-if="tabAttiva === 'lista'">
        <lista-movimenti
          :movimenti="movimentiFiltrati"
          @modifica="modificaMovimento"
          @elimina="eliminaMovimento"
        />
      </div>
      
      <!-- Nuovo Movimento -->
      <div v-else-if="tabAttiva === 'nuovo'">
        <form-movimento
          :categorie="categorie"
          :persone="persone"
          @salva="aggiungiMovimento"
        />
      </div>
      
      <!-- Import/Export -->
      <div v-else-if="tabAttiva === 'import-export'">
        <import-export
          :esporta-dati="esportaDatiJSON"
          @importa-dati="importaDatiJSON"
        />
      </div>
    </div>
  `
}
