// Componente DashboardView

const DashboardView = {
  props: {
    totaleEntrate: Number,
    totaleUscite: Number,
    saldo: Number,
    movimentiFiltrati: Array,
    entratePerCategoria: Object,
    uscitePerCategoria: Object,
    entratePerPersona: Object,
    uscitePerPersona: Object,
  },  setup(props) {
    const { ref, onMounted, computed, watch } = Vue;
    
    const grafici = ref({
      bilancioPrincipale: null,
      categorieEntrate: null,
      categorieUscite: null,
      personeEntrate: null,
      personeUscite: null
    })
    
    const tabAttivaDashboard = ref('bilancio') // bilancio, categoria, persona
    
    const coloriBilancio = ['rgba(76, 201, 240, 0.7)', 'rgba(247, 37, 133, 0.7)']
    
    // Colori per i vari grafici
    const coloriCategorieEntrate = [
      'rgba(76, 201, 240, 0.9)',
      'rgba(67, 97, 238, 0.9)',
      'rgba(58, 12, 163, 0.9)',
      'rgba(114, 9, 183, 0.9)',
      'rgba(39, 125, 161, 0.9)',
      'rgba(144, 224, 239, 0.9)',
      'rgba(0, 119, 182, 0.9)',
      'rgba(3, 4, 94, 0.9)'
    ]
    
    const coloriCategorieUscite = [
      'rgba(247, 37, 133, 0.9)',
      'rgba(218, 24, 132, 0.9)',
      'rgba(188, 19, 106, 0.9)',
      'rgba(158, 14, 80, 0.9)',
      'rgba(240, 113, 103, 0.9)',
      'rgba(217, 4, 41, 0.9)',
      'rgba(231, 29, 54, 0.9)',
      'rgba(230, 57, 70, 0.9)'
    ]
    
    // Controllo se Chart.js è caricato
    const isChartJsLoaded = computed(() => {
      return typeof Chart !== 'undefined'
    })
    
    // Funzioni per creare o aggiornare i grafici
    function creaGraficoBilancio() {
      if (!isChartJsLoaded.value) return
      
      const ctx = document.getElementById('graficoBilancio').getContext('2d')
      
      if (grafici.value.bilancioPrincipale) {
        grafici.value.bilancioPrincipale.destroy()
      }
      
      grafici.value.bilancioPrincipale = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Entrate', 'Uscite'],
          datasets: [{
            data: [props.totaleEntrate, props.totaleUscite],
            backgroundColor: coloriBilancio,
            borderColor: 'white',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const formattedValue = new Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value)
                  return label + ': ' + formattedValue
                }
              }
            }
          }
        }
      })
    }
    
    function creaGraficoCategorie() {
      if (!isChartJsLoaded.value) return
      
      // Grafico per entrate per categoria
      if (Object.keys(props.entratePerCategoria).length > 0) {
        const ctxEntrate = document.getElementById('graficoCategorie-entrate').getContext('2d')
        
        if (grafici.value.categorieEntrate) {
          grafici.value.categorieEntrate.destroy()
        }
        
        const labels = Object.keys(props.entratePerCategoria)
        const data = Object.values(props.entratePerCategoria)
        
        grafici.value.categorieEntrate = new Chart(ctxEntrate, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: coloriCategorieEntrate.slice(0, labels.length),
              borderColor: 'white',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || ''
                    const value = context.parsed
                    const formattedValue = new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(value)
                    return label + ': ' + formattedValue
                  }
                }
              }
            }
          }
        })
      }
      
      // Grafico per uscite per categoria
      if (Object.keys(props.uscitePerCategoria).length > 0) {
        const ctxUscite = document.getElementById('graficoCategorie-uscite').getContext('2d')
        
        if (grafici.value.categorieUscite) {
          grafici.value.categorieUscite.destroy()
        }
        
        const labels = Object.keys(props.uscitePerCategoria)
        const data = Object.values(props.uscitePerCategoria)
        
        grafici.value.categorieUscite = new Chart(ctxUscite, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: coloriCategorieUscite.slice(0, labels.length),
              borderColor: 'white',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || ''
                    const value = context.parsed
                    const formattedValue = new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(value)
                    return label + ': ' + formattedValue
                  }
                }
              }
            }
          }
        })
      }
    }
    
    function creaGraficoPersone() {
      if (!isChartJsLoaded.value) return
      
      // Grafico per entrate per persona
      if (Object.keys(props.entratePerPersona).length > 0) {
        const ctxEntrate = document.getElementById('graficoPersone-entrate').getContext('2d')
        
        if (grafici.value.personeEntrate) {
          grafici.value.personeEntrate.destroy()
        }
        
        const labels = Object.keys(props.entratePerPersona)
        const data = Object.values(props.entratePerPersona)
        
        grafici.value.personeEntrate = new Chart(ctxEntrate, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Entrate per persona',
              data: data,
              backgroundColor: coloriCategorieEntrate[0],
              borderColor: 'white',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0
                    }).format(value)
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || ''
                    const value = context.parsed.y
                    const formattedValue = new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(value)
                    return formattedValue
                  }
                }
              }
            }
          }
        })
      }
      
      // Grafico per uscite per persona
      if (Object.keys(props.uscitePerPersona).length > 0) {
        const ctxUscite = document.getElementById('graficoPersone-uscite').getContext('2d')
        
        if (grafici.value.personeUscite) {
          grafici.value.personeUscite.destroy()
        }
        
        const labels = Object.keys(props.uscitePerPersona)
        const data = Object.values(props.uscitePerPersona)
        
        grafici.value.personeUscite = new Chart(ctxUscite, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Uscite per persona',
              data: data,
              backgroundColor: coloriCategorieUscite[0],
              borderColor: 'white',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0
                    }).format(value)
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || ''
                    const value = context.parsed.y
                    const formattedValue = new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(value)
                    return formattedValue
                  }
                }
              }
            }
          }
        })
      }
    }
    
    function aggiornaGrafici() {
      // Aggiorna tutti i grafici in base alla tab attiva
      if (tabAttivaDashboard.value === 'bilancio') {
        creaGraficoBilancio()
      } else if (tabAttivaDashboard.value === 'categoria') {
        creaGraficoCategorie()
      } else if (tabAttivaDashboard.value === 'persona') {
        creaGraficoPersone()
      }
    }
    
    // Formattazione dei numeri
    function formattaValuta(valore) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
      }).format(valore)
    }
    
    // Osserva i cambiamenti nei dati
    watch(
      [
        () => props.totaleEntrate,
        () => props.totaleUscite,
        () => props.entratePerCategoria,
        () => props.uscitePerCategoria,
        () => props.entratePerPersona,
        () => props.uscitePerPersona,
      ],
      () => {
        aggiornaGrafici()
      },
      { deep: true }
    )
    
    // Osserva i cambiamenti nella tab attiva
    watch(tabAttivaDashboard, () => {
      // Permette di essere sicuri che il DOM sia pronto per i nuovi canvas
      setTimeout(() => {
        aggiornaGrafici()
      }, 100)
    })
    
    onMounted(() => {
      // Inizializza i grafici quando il componente è montato
      setTimeout(() => {
        aggiornaGrafici()
      }, 200)
    })
    
    return {
      tabAttivaDashboard,
      formattaValuta,
      isChartJsLoaded
    }
  },
  template: `
    <div>
      <!-- Cards di riepilogo -->
      <div class="summary-cards">
        <div class="summary-card income">
          <div class="summary-card-header">
            <span class="summary-card-title">Entrate totali</span>
            <div class="summary-card-icon">
              <i class="fas fa-arrow-down"></i>
            </div>
          </div>
          <div class="summary-card-value">{{ formattaValuta(totaleEntrate) }}</div>
          <div class="summary-card-subtitle">
            <span>Da {{ Object.keys(entratePerCategoria).length }} categorie</span>
          </div>
        </div>
        
        <div class="summary-card expense">
          <div class="summary-card-header">
            <span class="summary-card-title">Uscite totali</span>
            <div class="summary-card-icon">
              <i class="fas fa-arrow-up"></i>
            </div>
          </div>
          <div class="summary-card-value">{{ formattaValuta(totaleUscite) }}</div>
          <div class="summary-card-subtitle">
            <span>Da {{ Object.keys(uscitePerCategoria).length }} categorie</span>
          </div>
        </div>
        
        <div class="summary-card balance">
          <div class="summary-card-header">
            <span class="summary-card-title">Saldo</span>
            <div class="summary-card-icon">
              <i class="fas fa-wallet"></i>
            </div>
          </div>
          <div class="summary-card-value" :class="saldo >= 0 ? 'text-success' : 'text-danger'">
            {{ formattaValuta(saldo) }}
          </div>
          <div class="summary-card-subtitle">
            <span>{{ movimentiFiltrati.length }} movimenti</span>
          </div>
        </div>
      </div>
      
      <!-- Tabs per tipi di grafici -->
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ 'active': tabAttivaDashboard === 'bilancio' }" 
          @click="tabAttivaDashboard = 'bilancio'"
        >
          <i class="fas fa-chart-pie"></i> Bilancio Generale
        </div>
        <div 
          class="tab" 
          :class="{ 'active': tabAttivaDashboard === 'categoria' }" 
          @click="tabAttivaDashboard = 'categoria'"
        >
          <i class="fas fa-tags"></i> Per Categoria
        </div>
        <div 
          class="tab" 
          :class="{ 'active': tabAttivaDashboard === 'persona' }" 
          @click="tabAttivaDashboard = 'persona'"
        >
          <i class="fas fa-users"></i> Per Persona
        </div>
      </div>
      
      <!-- Grafici -->
      <!-- Bilancio Generale -->
      <div v-if="tabAttivaDashboard === 'bilancio'" class="card">
        <div class="card-header">
          <h3>Bilancio Generale</h3>
        </div>
        
        <div v-if="isChartJsLoaded">
          <div class="chart-container">
            <canvas id="graficoBilancio"></canvas>
          </div>
        </div>
        <div v-else class="p-2 text-center">
          <p>Chart.js non è caricato correttamente</p>
        </div>
      </div>
      
      <!-- Grafici per Categoria -->
      <div v-else-if="tabAttivaDashboard === 'categoria'" class="card">
        <div class="card-header">
          <h3>Ripartizione per Categoria</h3>
        </div>
        
        <div v-if="isChartJsLoaded">
          <div v-if="Object.keys(entratePerCategoria).length > 0" class="mb-3">
            <h4 class="mb-2">Entrate per Categoria</h4>
            <div class="chart-container">
              <canvas id="graficoCategorie-entrate"></canvas>
            </div>
          </div>
          <div v-else class="mb-3 p-2 text-center">
            <p>Nessuna entrata disponibile per visualizzare il grafico</p>
          </div>
          
          <div v-if="Object.keys(uscitePerCategoria).length > 0" class="mb-3">
            <h4 class="mb-2">Uscite per Categoria</h4>
            <div class="chart-container">
              <canvas id="graficoCategorie-uscite"></canvas>
            </div>
          </div>
          <div v-else class="mb-3 p-2 text-center">
            <p>Nessuna uscita disponibile per visualizzare il grafico</p>
          </div>
        </div>
        <div v-else class="p-2 text-center">
          <p>Chart.js non è caricato correttamente</p>
        </div>
      </div>
      
      <!-- Grafici per Persona -->
      <div v-else-if="tabAttivaDashboard === 'persona'" class="card">
        <div class="card-header">
          <h3>Ripartizione per Persona</h3>
        </div>
        
        <div v-if="isChartJsLoaded">
          <div v-if="Object.keys(entratePerPersona).length > 0" class="mb-3">
            <h4 class="mb-2">Entrate per Persona</h4>
            <div class="chart-container">
              <canvas id="graficoPersone-entrate"></canvas>
            </div>
          </div>
          <div v-else class="mb-3 p-2 text-center">
            <p>Nessuna entrata disponibile per visualizzare il grafico</p>
          </div>
          
          <div v-if="Object.keys(uscitePerPersona).length > 0" class="mb-3">
            <h4 class="mb-2">Uscite per Persona</h4>
            <div class="chart-container">
              <canvas id="graficoPersone-uscite"></canvas>
            </div>
          </div>
          <div v-else class="mb-3 p-2 text-center">
            <p>Nessuna uscita disponibile per visualizzare il grafico</p>
          </div>
        </div>
        <div v-else class="p-2 text-center">
          <p>Chart.js non è caricato correttamente</p>
        </div>
      </div>
    </div>
  `
}
