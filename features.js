// enhanced-features.js
// Funzionalità avanzate per Mental Coach Pro

// Gestione migliorata del rendering delle aziende con filtri
function renderCompanies(searchTerm = '', filterType = '') {
    const grid = document.getElementById('companyGrid');
    grid.innerHTML = '';

    if (appData.companies.length === 0) {
        grid.innerHTML = `
            <div class="text-center text-muted" style="grid-column: 1 / -1;">
                <div style="padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🏢</div>
                    <h3>Nessuna azienda aggiunta</h3>
                    <p>Clicca "Aggiungi Azienda" per iniziare.</p>
                </div>
            </div>
        `;
        return;
    }

    // Filtra le aziende
    let filteredCompanies = appData.companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesFilter = true;
        if (filterType) {
            const clientCount = company.clients.length;
            switch(filterType) {
                case 'small':
                    matchesFilter = clientCount <= 10;
                    break;
                case 'medium':
                    matchesFilter = clientCount > 10 && clientCount <= 50;
                    break;
                case 'large':
                    matchesFilter = clientCount > 50;
                    break;
            }
        }
        
        return matchesSearch && matchesFilter;
    });

    if (filteredCompanies.length === 0) {
        grid.innerHTML = `
            <div class="text-center text-muted" style="grid-column: 1 / -1;">
                <div style="padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
                    <h3>Nessun risultato trovato</h3>
                    <p>Prova a modificare i criteri di ricerca.</p>
                </div>
            </div>
        `;
        return;
    }

    filteredCompanies.forEach(company => {
        const totalSessions = company.clients.reduce((sum, client) => sum + client.completedSessions, 0);
        const totalHours = company.clients.reduce((sum, client) => sum + (client.completedSessions * client.hoursPerSession), 0);
        
        const card = document.createElement('div');
        card.className = 'company-card';
        card.innerHTML = `
            <button class="delete-btn" onclick="event.stopPropagation(); deleteCompany(${company.id})" title="Elimina azienda">×</button>
            <h3>${company.name}</h3>
            <p><strong>👥 Clienti:</strong> ${company.clients.length}</p>
            <p><strong>📅 Sessioni:</strong> ${totalSessions}</p>
            <p><strong>⏱️ Ore totali:</strong> ${totalHours.toFixed(1)}h</p>
            <div class="tags-container mt-2">
                <span class="tag">${getCompanySize(company.clients.length)}</span>
            </div>
        `;
        card.onclick = () => showCompanyDetails(company.id);
        grid.appendChild(card);
    });
}

// Funzione helper per determinare la dimensione dell'azienda
function getCompanySize(clientCount) {
    if (clientCount <= 10) return 'Piccola';
    if (clientCount <= 50) return 'Media';
    return 'Grande';
}

// Rendering migliorato dei clienti con ricerca
function renderClientsInModal(company, searchTerm = '') {
    const grid = document.getElementById('clientGrid');
    grid.innerHTML = '';

    let filteredClients = company.clients;
    if (searchTerm) {
        filteredClients = company.clients.filter(client => 
            `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.role && client.role.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    if (filteredClients.length === 0) {
        const message = searchTerm ? 
            '<p class="text-center text-muted">Nessun cliente trovato con questi criteri.</p>' :
            '<p class="text-center text-muted">Nessun cliente aggiunto per questa azienda. Clicca "Aggiungi Cliente".</p>';
        grid.innerHTML = message;
        return;
    }

    filteredClients.forEach(client => {
        const progressPercentage = (client.completedSessions / client.plannedSessions) * 100;
        const completedGoals = client.masterElements.filter(m => 
            m.subElements.every(s => s.completed)
        ).length;
        
        const card = document.createElement('div');
        card.className = 'client-card';
        card.innerHTML = `
            <button class="delete-btn" onclick="event.stopPropagation(); deleteClient(${client.id})" title="Elimina cliente">×</button>
            <h3>${client.firstName} ${client.lastName}</h3>
            ${client.role ? `<p><strong>🎯 Ruolo:</strong> ${client.role}</p>` : ''}
            <p><strong>📅 Sessioni:</strong> ${client.completedSessions}/${client.plannedSessions}</p>
            <p><strong>⏱️ Ore per sessione:</strong> ${client.hoursPerSession}h</p>
            <p><strong>🎯 Obiettivi completati:</strong> ${completedGoals}</p>
            <div class="progress-bar mt-2">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-text">${progressPercentage.toFixed(1)}% completato</div>
        `;
        grid.appendChild(card);
    });
}

// Aggiornamento avanzato della dashboard con più metriche
function updateDashboard() {
    let totalClients = 0;
    let totalHours = 0;
    let todaySessions = 0;
    let totalGoals = 0;
    let completedGoals = 0;
    let upcomingDeadlines = 0;
    
    const today = new Date().toDateString();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    appData.companies.forEach(company => {
        totalClients += company.clients.length;
        company.clients.forEach(client => {
            totalHours += client.completedSessions * client.hoursPerSession;
            
            // Conta sessioni di oggi
            client.sessionHistory.forEach(session => {
                if (new Date(session.date).toDateString() === today) {
                    todaySessions++;
                }
            });
            
            // Conta obiettivi
            client.masterElements.forEach(master => {
                totalGoals++;
                if (master.subElements.every(sub => sub.completed)) {
                    completedGoals++;
                }
            });
            
            // Conta TODO con scadenze vicine
            client.todos.forEach(todo => {
                if (todo.deadline && new Date(todo.deadline) <= nextWeek && !todo.completed) {
                    upcomingDeadlines++;
                }
            });
        });
    });
    
    document.getElementById('totalCompanies').textContent = appData.companies.length;
    document.getElementById('activeClients').textContent = totalClients;
    document.getElementById('todaySessions').textContent = todaySessions;
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    
    // Aggiorna notifiche se ci sono scadenze vicine
    updateNotificationBadges(upcomingDeadlines);
}

// Sistema di notifiche
function updateNotificationBadges(count) {
    const dashboardTab = document.querySelector('.nav-tab[data-section="dashboard"]');
    let badge = dashboardTab.querySelector('.notification-badge');
    
    if (count > 0) {
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'notification-badge';
            dashboardTab.style.position = 'relative';
            dashboardTab.appendChild(badge);
        }
        badge.textContent = count;
        badge.style.display = 'flex';
    } else if (badge) {
        badge.style.display = 'none';
    }
}

// Gestione avanzata dei clienti con più informazioni
function loadClientSession(clientId) {
    const companyId = appData.currentCompanyId;
    
    if (!companyId || !clientId) {
        document.getElementById('clientSessionView').style.display = 'none';
        return;
    }
    
    appData.currentClientId = clientId;
    
    const company = appData.companies.find(c => c.id === companyId);
    const client = company ? company.clients.find(c => c.id === clientId) : null;
    
    if (!client) {
        alert('Cliente non trovato. Assicurati che l\'azienda e il cliente siano selezionati correttamente.');
        document.getElementById('clientSessionView').style.display = 'none';
        return;
    }

    displayClientInfo(client);
    displayClientProfile(client);
    displayMasterElements(client);
    displayClientTodos(client);
    displaySessionHistory(client);
    updateProgress(); // Aggiorna le barre di progresso
    
    // Imposta ore sessione predefinite
    document.getElementById('sessionHours').value = client.hoursPerSession;
    
    // Carica note generali se esistono
    if (client.notes) {
        document.getElementById('clientNotes').value = client.notes;
    }
    
    document.getElementById('clientSessionView').style.display = 'block';
    document.getElementById('sessionClientSelectionCard').style.display = 'none';
}

// Funzione per salvare le note del cliente
function saveClientNotes() {
    const notes = document.getElementById('clientNotes').value;
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    client.notes = notes;
    saveDataToLocalStorage();
}

// Aggiunta campo note al blur dell'textarea
document.addEventListener('DOMContentLoaded', function() {
    const clientNotes = document.getElementById('clientNotes');
    if (clientNotes) {
        clientNotes.addEventListener('blur', saveClientNotes);
    }
});

// Gestione avanzata dei valori personali
function addValue() {
    const name = prompt('Nome del valore personale:');
    if (!name) return;
    
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    if (!client.profile.values) {
        client.profile.values = [];
    }
    
    client.profile.values.push(name);
    saveDataToLocalStorage();
    displayClientProfile(client);
}

function removeValue(index) {
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    if (confirm('Sei sicuro di voler rimuovere questo valore?')) {
        client.profile.values.splice(index, 1);
        saveDataToLocalStorage();
        displayClientProfile(client);
    }
}

// Aggiornamento display profilo cliente per includere valori
function displayClientProfileEnhanced(client) {
    // Existing profile display code...
    
    // Valori Personali
    const valuesDiv = document.getElementById('valuesSection');
    if (valuesDiv) {
        valuesDiv.innerHTML = '';
        if (!client.profile.values || client.profile.values.length === 0) {
            valuesDiv.innerHTML = '<p class="text-muted">Nessun valore personale aggiunto.</p>';
        } else {
            client.profile.values.forEach((value, index) => {
                const valueDiv = document.createElement('div');
                valueDiv.innerHTML = `
                    <span>💎 ${value}</span>
                    <button class="btn btn-danger btn-sm" onclick="removeValue(${index})">×</button>
                `;
                valuesDiv.appendChild(valueDiv);
            });
        }
    }
}

// Sistema di auto-salvataggio
let autosaveInterval;

function setupAutosave() {
    const autosaveMinutes = parseInt(document.getElementById('autosave')?.value || 5);
    
    if (autosaveInterval) {
        clearInterval(autosaveInterval);
    }
    
    if (autosaveMinutes > 0) {
        autosaveInterval = setInterval(() => {
            saveDataToLocalStorage();
            showTemporaryMessage('💾 Dati salvati automaticamente', 2000);
        }, autosaveMinutes * 60 * 1000);
    }
}

// Mostra messaggi temporanei
function showTemporaryMessage(message, duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'temporary-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, duration);
}

// Gestione avanzata TODO con scadenze
function addClientTodoWithDeadline() {
    const text = prompt('Inserisci il promemoria per questo cliente:');
    if (!text) return;
    
    const deadline = prompt('Inserisci una scadenza (formato: YYYY-MM-DD) - opzionale:');
    const priority = prompt('Priorità (alta/media/bassa):', 'media');
    
    const tagsInput = prompt('Inserisci i tag per questo To-Do (separati da virgola):', '');
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    const todo = {
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        tags: tags,
        priority: priority,
    };
    
    if (deadline && isValidDate(deadline)) {
        todo.deadline = deadline;
    }
    
    client.todos.push(todo);
    saveDataToLocalStorage();
    displayClientTodos(client);
}

// Validazione data
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Esportazione avanzata con opzioni
function exportDataAdvanced() {
    const format = document.getElementById('exportFormat')?.value || 'json';
    
    switch(format) {
        case 'json':
            exportAllData(); // Funzione esistente
            break;
        case 'csv':
            exportToCSV();
            break;
        case 'pdf':
            exportToPDF();
            break;
        default:
            exportAllData();
    }
}

// Esportazione CSV
function exportToCSV() {
    let csvContent = 'Azienda,Cliente,Email,Ruolo,Sessioni Completate,Sessioni Pianificate,Ore per Sessione,Obiettivi Completati\n';
    
    appData.companies.forEach(company => {
        company.clients.forEach(client => {
            const completedGoals = client.masterElements.filter(m => 
                m.subElements.every(s => s.completed)
            ).length;
            
            csvContent += `"${company.name}","${client.firstName} ${client.lastName}","${client.email || ''}","${client.role || ''}",${client.completedSessions},${client.plannedSessions},${client.hoursPerSession},${completedGoals}\n`;
        });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MentalCoaching_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showTemporaryMessage('📊 Dati esportati in CSV', 3000);
}

// Esportazione PDF generale
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Mental Coach Pro - Report Generale', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 20, 35);
    
    let yPos = 50;
    
    // Statistiche generali
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Statistiche Generali', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    doc.text(`Aziende totali: ${appData.companies.length}`, 25, yPos);
    yPos += 10;
    
    const totalClients = appData.companies.reduce((sum, company) => sum + company.clients.length, 0);
    doc.text(`Clienti totali: ${totalClients}`, 25, yPos);
    yPos += 10;
    
    const totalHours = appData.companies.reduce((sum, company) => 
        sum + company.clients.reduce((clientSum, client) => 
            clientSum + (client.completedSessions * client.hoursPerSession), 0), 0);
    doc.text(`Ore totali erogate: ${totalHours.toFixed(1)}`, 25, yPos);
    yPos += 20;
    
    // Dettagli per azienda
    appData.companies.forEach(company => {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text(`Azienda: ${company.name}`, 20, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setTextColor(52, 73, 94);
        doc.text(`Clienti: ${company.clients.length}`, 25, yPos);
        yPos += 10;
        
        company.clients.forEach(client => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(`• ${client.firstName} ${client.lastName} - ${client.completedSessions}/${client.plannedSessions} sessioni`, 30, yPos);
            yPos += 8;
        });
        
        yPos += 10;
    });
    
    doc.save(`MentalCoaching_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    showTemporaryMessage('📄 Report PDF generato', 3000);
}

// Funzioni per la gestione delle preferenze
function savePreferences() {
    const preferences = {
        emailNotifications: document.getElementById('emailNotifications')?.checked || false,
        pushNotifications: document.getElementById('pushNotifications')?.checked || false,
        timezone: document.getElementById('timezone')?.value || 'Europe/Rome',
        autosave: document.getElementById('autosave')?.value || '5'
    };
    
    localStorage.setItem('mentalCoachPreferences', JSON.stringify(preferences));
    setupAutosave(); // Riavvia autosalvataggio con nuove impostazioni
    showTemporaryMessage('⚙️ Preferenze salvate', 2000);
}

function loadPreferences() {
    const saved = localStorage.getItem('mentalCoachPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        
        if (document.getElementById('emailNotifications')) {
            document.getElementById('emailNotifications').checked = preferences.emailNotifications;
        }
        if (document.getElementById('pushNotifications')) {
            document.getElementById('pushNotifications').checked = preferences.pushNotifications;
        }
        if (document.getElementById('timezone')) {
            document.getElementById('timezone').value = preferences.timezone;
        }
        if (document.getElementById('autosave')) {
            document.getElementById('autosave').value = preferences.autosave;
        }
    }
}

// Ricerca globale
function globalSearch(query) {
    const results = [];
    
    appData.companies.forEach(company => {
        // Cerca nelle aziende
        if (company.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                type: 'company',
                item: company,
                title: company.name,
                subtitle: `Azienda con ${company.clients.length} clienti`
            });
        }
        
        // Cerca nei clienti
        company.clients.forEach(client => {
            const fullName = `${client.firstName} ${client.lastName}`;
            if (fullName.toLowerCase().includes(query.toLowerCase()) ||
                (client.email && client.email.toLowerCase().includes(query.toLowerCase())) ||
                (client.role && client.role.toLowerCase().includes(query.toLowerCase()))) {
                results.push({
                    type: 'client',
                    item: client,
                    company: company,
                    title: fullName,
                    subtitle: `Cliente di ${company.name}${client.role ? ` - ${client.role}` : ''}`
                });
            }
        });
    });
    
    return results;
}

// Inizializzazione avanzata
function initAppEnhanced() {
    loadDataFromLocalStorage();
    loadPreferences();
    setupAutosave();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    updateDashboard();
    updateAnalytics();
    renderGlobalTodos();
    renderCategories();
    renderTags();
    setupNavigation();
    setupSearchFilters();
    setupPreferenceListeners();
    
    // Nascondi tutti i modali all'avvio
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    showSection('dashboard');
}

// Setup listeners per le preferenze
function setupPreferenceListeners() {
    ['emailNotifications', 'pushNotifications', 'timezone', 'autosave'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', savePreferences);
        }
    });
}

// Aggiunge CSS per le animazioni
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
    
    .chart-placeholder {
        text-align: center;
        padding: 60px 20px;
        color: #64748b;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        border: 2px dashed #cbd5e1;
    }
    
    .chart-icon {
        font-size: 3rem;
        margin-bottom: 20px;
    }
    
    .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .resource-item {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
    }
    
    .resource-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .resource-item h4 {
        margin-bottom: 8px;
        color: #1e293b;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .resource-item p {
        margin-bottom: 15px;
        color: #64748b;
        font-size: 0.9rem;
    }
    
    .performance-list {
        display: grid;
        gap: 15px;
    }
    
    .performance-item {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: #374151;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #667eea;
    }
`;
document.head.appendChild(style);