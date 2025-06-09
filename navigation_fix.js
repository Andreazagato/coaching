// navigation-fix.js
// Fix completo per la navigazione e integrazione di tutte le funzionalità

// Variabili globali per la gestione dello stato
let isNavigationSetup = false;
let currentSection = 'dashboard';

// Funzione principale di inizializzazione
function initApp() {
    console.log('🚀 Inizializzazione Mental Coach Pro...');
    
    try {
        // Carica i dati salvati
        loadDataFromLocalStorage();
        
        // Inizializza le funzioni di base
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        // Configura la navigazione
        setupNavigation();
        
        // Configura i filtri di ricerca
        setupSearchFilters();
        
        // Carica le preferenze
        if (typeof loadPreferences === 'function') {
            loadPreferences();
        }
        
        // Setup auto-salvataggio
        if (typeof setupAutosave === 'function') {
            setupAutosave();
        }
        
        // Aggiorna i dati della dashboard
        updateDashboard();
        
        // Aggiorna analytics
        updateAnalytics();
        
        // Renderizza i componenti principali
        renderGlobalTodos();
        renderCategories();
        renderTags();
        
        // Nascondi tutti i modali
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Mostra la sezione dashboard
        showSection('dashboard');
        
        // Setup event listeners aggiuntivi
        setupAdditionalEventListeners();
        
        console.log('✅ Inizializzazione completata con successo');
        
    } catch (error) {
        console.error('❌ Errore durante l\'inizializzazione:', error);
        alert('Errore durante l\'inizializzazione dell\'applicazione. Ricarica la pagina.');
    }
}

// Setup della navigazione con debugging
function setupNavigation() {
    console.log('🧭 Setup navigazione...');
    
    if (isNavigationSetup) {
        console.log('⚠️ Navigazione già configurata');
        return;
    }
    
    const navTabs = document.querySelectorAll('.nav-tab');
    console.log(`📋 Trovati ${navTabs.length} tab di navigazione`);
    
    navTabs.forEach((tab, index) => {
        const sectionId = tab.dataset.section;
        console.log(`🔗 Configurando tab ${index + 1}: ${sectionId}`);
        
        // Rimuovi listener esistenti
        tab.removeEventListener('click', handleNavigation);
        
        // Aggiungi nuovo listener
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const targetSection = this.dataset.section;
            console.log(`🎯 Click su tab: ${targetSection}`);
            
            if (targetSection) {
                showSection(targetSection);
            } else {
                console.error('❌ Sezione non trovata per tab:', this);
            }
        });
    });
    
    isNavigationSetup = true;
    console.log('✅ Navigazione configurata');
}

// Handler per la navigazione
function handleNavigation(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const targetSection = this.dataset.section;
    console.log(`🎯 Navigazione verso: ${targetSection}`);
    
    if (targetSection) {
        showSection(targetSection);
    }
}

// Funzione per mostrare una sezione specifica
function showSection(sectionId) {
    console.log(`🔄 Cambio sezione: ${currentSection} → ${sectionId}`);
    
    if (currentSection === sectionId) {
        console.log('⚠️ Sezione già attiva');
        return;
    }
    
    try {
        // Rimuovi classe active da tutte le sezioni
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Rimuovi classe active da tutti i tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Attiva la sezione target
        const targetSection = document.getElementById(sectionId);
        const targetTab = document.querySelector(`.nav-tab[data-section="${sectionId}"]`);
        
        if (targetSection && targetTab) {
            targetSection.classList.add('active');
            targetTab.classList.add('active');
            currentSection = sectionId;
            
            // Carica i dati specifici per la sezione
            loadSectionData(sectionId);
            
            console.log(`✅ Sezione attivata: ${sectionId}`);
        } else {
            console.error(`❌ Sezione o tab non trovato: ${sectionId}`);
        }
        
    } catch (error) {
        console.error('❌ Errore nel cambio sezione:', error);
    }
}

// Carica i dati specifici per ogni sezione
function loadSectionData(sectionId) {
    console.log(`📊 Caricamento dati per sezione: ${sectionId}`);
    
    try {
        switch(sectionId) {
            case 'dashboard':
                updateDashboard();
                renderGlobalTodos();
                break;
                
            case 'companies':
                renderCompanies();
                break;
                
            case 'sessions':
                loadCompaniesForSessionSelection();
                break;
                
            case 'analytics':
                updateAnalytics();
                loadAnalyticsData();
                break;
                
            case 'tools':
                loadToolsSection();
                break;
                
            case 'settings':
                renderCategories();
                renderTags();
                break;
                
            default:
                console.log(`⚠️ Nessun caricamento specifico per: ${sectionId}`);
        }
        
    } catch (error) {
        console.error(`❌ Errore caricamento dati per ${sectionId}:`, error);
    }
}

// Setup dei filtri di ricerca
function setupSearchFilters() {
    console.log('🔍 Setup filtri di ricerca...');
    
    // Filtro aziende
    const companySearch = document.getElementById('companySearch');
    if (companySearch) {
        companySearch.addEventListener('input', debounce(filterCompanies, 300));
        console.log('✅ Filtro aziende configurato');
    }
    
    // Filtro tipo azienda
    const companyFilter = document.getElementById('companyFilter');
    if (companyFilter) {
        companyFilter.addEventListener('change', filterCompanies);
        console.log('✅ Filtro tipo azienda configurato');
    }
    
    // Filtro clienti
    const clientSearch = document.getElementById('clientSearch');
    if (clientSearch) {
        clientSearch.addEventListener('input', debounce(filterClients, 300));
        console.log('✅ Filtro clienti configurato');
    }
    
    // Filtro clienti nel modal
    const modalClientSearch = document.getElementById('modalClientSearch');
    if (modalClientSearch) {
        modalClientSearch.addEventListener('input', debounce(filterModalClients, 300));
        console.log('✅ Filtro clienti modal configurato');
    }
}

// Setup event listeners aggiuntivi
function setupAdditionalEventListeners() {
    console.log('🎧 Setup event listeners aggiuntivi...');
    
    // Event listener per salvare le note del cliente
    const clientNotes = document.getElementById('clientNotes');
    if (clientNotes) {
        clientNotes.addEventListener('blur', saveClientNotes);
        
        // Auto-save durante la digitazione
        let saveTimeout;
        clientNotes.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveClientNotes, 2000);
        });
        
        console.log('✅ Auto-save note cliente configurato');
    }
    
    // Event listener per le preferenze
    ['emailNotifications', 'pushNotifications', 'timezone', 'autosave'].forEach(id => {
        const element = document.getElementById(id);
        if (element && typeof savePreferences === 'function') {
            element.addEventListener('change', savePreferences);
        }
    });
    
    // Event listener per i modali (chiusura con ESC)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const visibleModals = document.querySelectorAll('.modal[style*="flex"]');
            visibleModals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
    
    console.log('✅ Event listeners aggiuntivi configurati');
}

// Funzioni di filtro migliorata
function filterCompanies() {
    const searchTerm = document.getElementById('companySearch')?.value?.toLowerCase() || '';
    const filterType = document.getElementById('companyFilter')?.value || '';
    
    console.log(`🔍 Filtro aziende: "${searchTerm}" tipo: "${filterType}"`);
    
    if (typeof renderCompanies === 'function') {
        renderCompanies(searchTerm, filterType);
    }
}

function filterClients() {
    const searchTerm = document.getElementById('clientSearch')?.value?.toLowerCase() || '';
    console.log(`🔍 Filtro clienti: "${searchTerm}"`);
    
    // Implementa la logica di filtro clienti
    if (appData.currentCompanyId) {
        renderClientsForSessionSelection();
    }
}

function filterModalClients() {
    const searchTerm = document.getElementById('modalClientSearch')?.value?.toLowerCase() || '';
    console.log(`🔍 Filtro clienti modal: "${searchTerm}"`);
    
    // Implementa la logica di filtro clienti nel modal
    if (appData.currentCompanyId) {
        const company = appData.companies.find(c => c.id === appData.currentCompanyId);
        if (company && typeof renderClientsInModal === 'function') {
            renderClientsInModal(company, searchTerm);
        }
    }
}

// Funzione di aggiornamento data/ora
function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById('currentDateTime');
    
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Funzioni Analytics migliorata
function updateAnalytics() {
    console.log('📈 Aggiornamento analytics...');
    
    let totalGoals = 0;
    let completedGoals = 0;
    let totalRating = 0;
    let ratingCount = 0;
    let currentMonthSessions = 0;

    appData.companies.forEach(company => {
        company.clients.forEach(client => {
            client.masterElements.forEach(master => {
                totalGoals++;
                if (master.subElements.length > 0 && master.subElements.every(sub => sub.completed)) {
                    completedGoals++;
                }
            });
            
            // Calcola sessioni del mese corrente
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            client.sessionHistory.forEach(session => {
                const sessionDate = new Date(session.date);
                if (sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear) {
                    currentMonthSessions++;
                }
            });
        });
    });

    const completionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : 0;
    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
    const activeGoals = totalGoals - completedGoals;

    // Aggiorna gli elementi del DOM se esistono
    const completionRateEl = document.getElementById('completionRate');
    const averageRatingEl = document.getElementById('averageRating');
    const activeGoalsEl = document.getElementById('activeGoals');
    const monthlyAverageEl = document.getElementById('monthlyAverage');

    if (completionRateEl) completionRateEl.textContent = completionRate + '%';
    if (averageRatingEl) averageRatingEl.textContent = averageRating;
    if (activeGoalsEl) activeGoalsEl.textContent = activeGoals;
    if (monthlyAverageEl) monthlyAverageEl.textContent = currentMonthSessions;
    
    console.log('✅ Analytics aggiornati');
}

// Caricamento dati analytics
function loadAnalyticsData() {
    console.log('📊 Caricamento dati analytics...');
    
    const topPerformanceDiv = document.getElementById('topPerformance');
    if (topPerformanceDiv) {
        // Calcola top performer
        const clientPerformance = [];
        
        appData.companies.forEach(company => {
            company.clients.forEach(client => {
                const completedGoals = client.masterElements.filter(m => 
                    m.subElements.length > 0 && m.subElements.every(s => s.completed)
                ).length;
                
                const totalGoals = client.masterElements.length;
                const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
                
                clientPerformance.push({
                    name: `${client.firstName} ${client.lastName}`,
                    company: company.name,
                    completionRate: completionRate,
                    sessionsCompleted: client.completedSessions,
                    totalSessions: client.plannedSessions
                });
            });
        });
        
        // Ordina per tasso di completamento
        clientPerformance.sort((a, b) => b.completionRate - a.completionRate);
        
        // Mostra top 5
        const top5 = clientPerformance.slice(0, 5);
        
        if (top5.length > 0) {
            topPerformanceDiv.innerHTML = top5.map((client, index) => `
                <div class="performance-item">
                    <div>
                        <strong>${index + 1}. ${client.name}</strong>
                        <small>${client.company}</small>
                    </div>
                    <div class="performance-stats">
                        <span class="completion-rate">${client.completionRate.toFixed(1)}%</span>
                        <small>${client.sessionsCompleted}/${client.totalSessions} sessioni</small>
                    </div>
                </div>
            `).join('');
        } else {
            topPerformanceDiv.innerHTML = '<p class="text-muted">Nessun dato di performance disponibile.</p>';
        }
    }
}

// Funzioni per la sezione Tools
function loadToolsSection() {
    console.log('🛠️ Caricamento sezione strumenti...');
    // Placeholder per future implementazioni
}

function openAssessmentTool() {
    showTemporaryMessage('📋 Assessment Tool - Funzionalità in sviluppo', 3000);
}

function openGoalTracker() {
    showTemporaryMessage('🎯 Goal Tracker - Funzionalità in sviluppo', 3000);
}

function openFeedbackForm() {
    showTemporaryMessage('💬 Feedback 360° - Funzionalità in sviluppo', 3000);
}

function openActionPlan() {
    showTemporaryMessage('📝 Action Plan - Funzionalità in sviluppo', 3000);
}

function openWheelOfLife() {
    showTemporaryMessage('🎡 Wheel of Life - Funzionalità in sviluppo', 3000);
}

function openSWOTAnalysis() {
    showTemporaryMessage('⚖️ Analisi SWOT - Funzionalità in sviluppo', 3000);
}

function downloadTemplate(type) {
    showTemporaryMessage(`📄 Download template ${type} - Funzionalità in sviluppo`, 3000);
}

function generateAnalyticsReport() {
    showTemporaryMessage('📊 Generazione report analytics - Funzionalità in sviluppo', 3000);
}

// Funzione per aggiornare le barre di progresso
function updateProgress() {
    const companyId = appData.currentCompanyId;
    const clientId = appData.currentClientId;
    
    if (!companyId || !clientId) return;
    
    const company = appData.companies.find(c => c.id === companyId);
    const client = company?.clients.find(c => c.id === clientId);
    
    if (!client) return;
    
    // Progresso sessioni
    const sessionProgress = Math.min((client.completedSessions / client.plannedSessions) * 100, 100);
    const sessionProgressBar = document.getElementById('sessionProgress');
    const progressText = document.getElementById('progressText');
    
    if (sessionProgressBar) {
        sessionProgressBar.style.width = sessionProgress + '%';
    }
    if (progressText) {
        progressText.textContent = 
            `${client.completedSessions}/${client.plannedSessions} sessioni (${sessionProgress.toFixed(1)}%)`;
    }
    
    // Progresso coaching
    let totalObjectives = client.masterElements.length;
    let completedObjectives = client.masterElements.filter(master => 
        master.subElements.length > 0 && master.subElements.every(sub => sub.completed)
    ).length;
    
    const coachingProgress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;
    const coachingProgressBar = document.getElementById('coachingProgress');
    const coachingProgressText = document.getElementById('coachingProgressText');
    
    if (coachingProgressBar) {
        coachingProgressBar.style.width = coachingProgress + '%';
    }
    if (coachingProgressText) {
        coachingProgressText.textContent = 
            `${completedObjectives}/${totalObjectives} obiettivi (${coachingProgress.toFixed(1)}%)`;
    }
}

// Utility function: debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Funzione per mostrare messaggi temporanei
function showTemporaryMessage(message, duration = 3000) {
    // Rimuovi messaggi esistenti
    const existingMessages = document.querySelectorAll('.temporary-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'temporary-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        font-weight: 500;
        font-size: 0.9rem;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                document.body.removeChild(messageDiv);
            }
        }, 400);
    }, duration);
}

// Funzione per debugging
function debugNavigation() {
    console.log('🔍 Debug Navigazione:');
    console.log('- isNavigationSetup:', isNavigationSetup);
    console.log('- currentSection:', currentSection);
    console.log('- Nav tabs trovati:', document.querySelectorAll('.nav-tab').length);
    console.log('- Sezioni trovate:', document.querySelectorAll('.content-section').length);
    
    document.querySelectorAll('.nav-tab').forEach((tab, index) => {
        console.log(`  Tab ${index + 1}: ${tab.dataset.section} - ${tab.classList.contains('active') ? 'ATTIVO' : 'inattivo'}`);
    });
    
    document.querySelectorAll('.content-section').forEach((section, index) => {
        console.log(`  Sezione ${index + 1}: ${section.id} - ${section.classList.contains('active') ? 'ATTIVA' : 'inattiva'}`);
    });
}

// Event listener per il caricamento della pagina
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Esporta funzioni per uso globale
window.showSection = showSection;
window.debugNavigation = debugNavigation;
window.showTemporaryMessage = showTemporaryMessage;

// Log di caricamento
console.log('📱 Mental Coach Pro - Sistema di navigazione caricato');

// CSS per le animazioni dei messaggi temporanei
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .performance-item {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        transition: all 0.3s ease;
    }
    
    .performance-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .performance-stats {
        text-align: right;
    }
    
    .completion-rate {
        font-size: 1.2rem;
        font-weight: 700;
        color: #667eea;
        display: block;
    }
    
    .performance-stats small {
        color: #64748b;
        font-size: 0.8rem;
    }
`;

if (!document.querySelector('#navigation-styles')) {
    style.id = 'navigation-styles';
    document.head.appendChild(style);
}