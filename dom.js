// dom-enhancements.js
// Miglioramenti completi al DOM per Mental Coach Pro

// Override completo della funzione displayClientProfile
function displayClientProfile(client) {
    // Habits
    const habitsDiv = document.getElementById('habitsSection');
    if (habitsDiv) {
        habitsDiv.innerHTML = '';
        if (client.profile.habits.length === 0) {
            habitsDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔄</div>
                    <p class="text-muted">Nessuna abitudine aggiunta.</p>
                </div>
            `;
        } else {
            client.profile.habits.forEach((habit, index) => {
                const habitDiv = document.createElement('div');
                habitDiv.className = 'habit-tracker';
                habitDiv.innerHTML = `
                    <div class="habit-content">
                        <span class="habit-name">🔄 ${habit.name}</span>
                        <div class="habit-category ${habit.category}">
                            ${habit.category === 'positive' ? '✅ Positiva' : '⚠️ Da migliorare'}
                        </div>
                    </div>
                    <div class="habit-actions">
                        <select onchange="updateHabitCategory(${index}, this.value)" class="form-select btn-sm">
                            <option value="positive" ${habit.category === 'positive' ? 'selected' : ''}>✅ Positiva</option>
                            <option value="improve" ${habit.category === 'improve' ? 'selected' : ''}>⚠️ Da migliorare</option>
                        </select>
                        <button class="btn btn-danger btn-sm" onclick="removeHabit(${index})" title="Rimuovi abitudine">×</button>
                    </div>
                `;
                habitsDiv.appendChild(habitDiv);
            });
        }
    }

    // Strengths (Punti di Forza)
    const strengthsDiv = document.getElementById('strengthsSection');
    if (strengthsDiv) {
        strengthsDiv.innerHTML = '';
        if (client.profile.strengths.length === 0) {
            strengthsDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💪</div>
                    <p class="text-muted">Nessun punto di forza aggiunto.</p>
                </div>
            `;
        } else {
            client.profile.strengths.forEach((strength, index) => {
                const strengthDiv = document.createElement('div');
                strengthDiv.className = 'profile-item strength-item';
                strengthDiv.innerHTML = `
                    <div class="item-content">
                        <span class="item-icon">💪</span>
                        <span class="item-text">${strength}</span>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeStrength(${index})" title="Rimuovi punto di forza">×</button>
                `;
                strengthsDiv.appendChild(strengthDiv);
            });
        }
    }

    // Improvement Areas (Aree di Miglioramento)
    const improvementsDiv = document.getElementById('improvementsSection');
    if (improvementsDiv) {
        improvementsDiv.innerHTML = '';
        if (client.profile.improvementAreas.length === 0) {
            improvementsDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📈</div>
                    <p class="text-muted">Nessuna area di miglioramento aggiunta.</p>
                </div>
            `;
        } else {
            client.profile.improvementAreas.forEach((area, index) => {
                const improvementDiv = document.createElement('div');
                improvementDiv.className = 'profile-item improvement-item';
                improvementDiv.innerHTML = `
                    <div class="item-content">
                        <span class="item-icon">📈</span>
                        <span class="item-text">${area.name}</span>
                        <div class="tags-container">
                            ${area.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeImprovementArea(${index})" title="Rimuovi area">×</button>
                `;
                improvementsDiv.appendChild(improvementDiv);
            });
        }
    }

    // Values (Valori Personali)
    const valuesDiv = document.getElementById('valuesSection');
    if (valuesDiv) {
        valuesDiv.innerHTML = '';
        if (!client.profile.values || client.profile.values.length === 0) {
            valuesDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💎</div>
                    <p class="text-muted">Nessun valore personale aggiunto.</p>
                </div>
            `;
        } else {
            client.profile.values.forEach((value, index) => {
                const valueDiv = document.createElement('div');
                valueDiv.className = 'profile-item value-item';
                valueDiv.innerHTML = `
                    <div class="item-content">
                        <span class="item-icon">💎</span>
                        <span class="item-text">${value}</span>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeValue(${index})" title="Rimuovi valore">×</button>
                `;
                valuesDiv.appendChild(valueDiv);
            });
        }
    }
}

// Override completo della funzione displayClientInfo
function displayClientInfo(client) {
    const infoDiv = document.getElementById('clientInfoDisplay');
    const clientNameDisplay = document.getElementById('clientNameDisplay');
    const complianceIndicator = document.getElementById('complianceIndicator');

    if (clientNameDisplay) {
        clientNameDisplay.textContent = `${client.firstName} ${client.lastName}`;
    }

    // Nasconde l'indicatore di compliance
    if (complianceIndicator) {
        complianceIndicator.style.display = 'none';
    }

    if (infoDiv) {
        const completedHours = client.completedSessions * client.hoursPerSession;
        const totalPlannedHours = client.plannedSessions * client.hoursPerSession;
        const progressPercentage = (client.completedSessions / client.plannedSessions) * 100;
        const completedGoals = client.masterElements.filter(m => 
            m.subElements.length > 0 && m.subElements.every(s => s.completed)
        ).length;
        const activeTodos = client.todos.filter(t => !t.completed).length;

        infoDiv.innerHTML = `
            <div class="client-info-grid">
                <div class="client-details">
                    <div class="detail-item">
                        <span class="detail-icon">📅</span>
                        <div class="detail-content">
                            <strong>Sessioni</strong>
                            <span>${client.completedSessions}/${client.plannedSessions} completate</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⏱️</span>
                        <div class="detail-content">
                            <strong>Ore di coaching</strong>
                            <span>${completedHours.toFixed(1)}h / ${totalPlannedHours.toFixed(1)}h totali</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🕐</span>
                        <div class="detail-content">
                            <strong>Durata sessione</strong>
                            <span>${client.hoursPerSession}h per sessione</span>
                        </div>
                    </div>
                    ${client.email ? `
                        <div class="detail-item">
                            <span class="detail-icon">📧</span>
                            <div class="detail-content">
                                <strong>Email</strong>
                                <span>${client.email}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${client.role ? `
                        <div class="detail-item">
                            <span class="detail-icon">🎯</span>
                            <div class="detail-content">
                                <strong>Ruolo</strong>
                                <span>${client.role}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-icon">📅</span>
                        <div class="detail-content">
                            <strong>Sessione odierna</strong>
                            <span>${new Date().toLocaleDateString('it-IT')}</span>
                        </div>
                    </div>
                </div>
                
                <div class="client-stats-grid">
                    <div class="stat-mini">
                        <div class="stat-value">${progressPercentage.toFixed(1)}%</div>
                        <div class="stat-label">Progresso Sessioni</div>
                    </div>
                    <div class="stat-mini">
                        <div class="stat-value">${completedGoals}</div>
                        <div class="stat-label">Obiettivi Completati</div>
                    </div>
                    <div class="stat-mini">
                        <div class="stat-value">${activeTodos}</div>
                        <div class="stat-label">TODO Attivi</div>
                    </div>
                    <div class="stat-mini">
                        <div class="stat-value">${client.sessionHistory.length}</div>
                        <div class="stat-label">Sessioni Totali</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Aggiorna le barre di progresso
    setTimeout(updateProgress, 100);
}

// Override completo della funzione displayMasterElements
function displayMasterElements(client) {
    const elementsDiv = document.getElementById('masterElementsSection');
    if (!elementsDiv) return;
    
    elementsDiv.innerHTML = '';

    if (client.masterElements.length === 0) {
        elementsDiv.innerHTML = `
            <div class="empty-state-large">
                <div class="empty-icon-large">🎯</div>
                <h3>Nessun obiettivo nel percorso</h3>
                <p>Aggiungi il primo obiettivo per iniziare il percorso di coaching strutturato.</p>
                <button class="btn btn-primary" onclick="addMasterElement()">
                    🎯 Aggiungi Primo Obiettivo
                </button>
            </div>
        `;
        return;
    }

    client.masterElements.forEach((master, masterIndex) => {
        const allSubCompleted = master.subElements.length > 0 && master.subElements.every(sub => sub.completed);
        const completedSubs = master.subElements.filter(sub => sub.completed).length;
        const totalSubs = master.subElements.length;
        const progressPercentage = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;
        
        const masterDiv = document.createElement('div');
        masterDiv.className = `master-element ${allSubCompleted ? 'completed' : ''} ${totalSubs === 0 ? 'no-subs' : ''}`;

        masterDiv.innerHTML = `
            <div class="master-header">
                <div class="master-title">
                    <h3>
                        <span class="master-icon">${allSubCompleted ? '✅' : '🎯'}</span>
                        ${master.name}
                    </h3>
                    <div class="master-status">
                        ${totalSubs === 0 ? 
                            '<span class="status-badge no-subs">📝 Nessun micro obiettivo</span>' :
                            `<span class="status-badge ${allSubCompleted ? 'completed' : 'in-progress'}">
                                ${allSubCompleted ? '✅ Completato' : '🔄 In corso'}
                            </span>`
                        }
                    </div>
                </div>
                <div class="master-progress-container">
                    <div class="progress-info">
                        <span class="progress-text">${completedSubs}/${totalSubs} micro obiettivi</span>
                        <span class="progress-percentage">${progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="sub-elements">
                ${totalSubs === 0 ? 
                    `<div class="no-subs-message">
                        <p class="text-muted">
                            <span class="icon">📝</span>
                            Nessun micro obiettivo definito. Aggiungi dei micro obiettivi per strutturare il percorso.
                        </p>
                    </div>` : 
                    master.subElements.map((sub, subIndex) => `
                        <div class="sub-element ${sub.completed ? 'completed' : ''}" onclick="toggleSubElement(${masterIndex}, ${subIndex})">
                            <div class="sub-element-container">
                                <div class="sub-status-icon">
                                    ${sub.completed ? '✅' : '⏳'}
                                </div>
                                <div class="sub-content">
                                    <div class="sub-main-content">
                                        <strong class="sub-title">${sub.name}</strong>
                                        ${sub.notes ? `<p class="sub-notes">💭 ${sub.notes}</p>` : ''}
                                        <div class="sub-meta">
                                            <small class="sub-status-text">
                                                ${sub.completed ? '✅ Completato' : '🔄 In corso'}
                                            </small>
                                            ${sub.tags.length > 0 ? `
                                                <div class="tags-container">
                                                    ${sub.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="sub-actions">
                                    <button class="btn-icon edit" onclick="event.stopPropagation(); editSubElement(${masterIndex}, ${subIndex})" title="Modifica micro obiettivo">✏️</button>
                                    <button class="btn-icon delete" onclick="event.stopPropagation(); removeSubElement(${masterIndex}, ${subIndex})" title="Rimuovi micro obiettivo">🗑️</button>
                                </div>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
            
            <div class="master-actions">
                <button class="btn btn-primary btn-sm" onclick="addSubElement(${masterIndex})">
                    ➕ Aggiungi Micro Obiettivo
                </button>
                <button class="btn btn-info btn-sm" onclick="editMasterElement(${masterIndex})">
                    ✏️ Modifica Obiettivo
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeMasterElement(${masterIndex})">
                    🗑️ Rimuovi Obiettivo
                </button>
            </div>
        `;

        elementsDiv.appendChild(masterDiv);
    });
}

// Override completo della funzione displayClientTodos
function displayClientTodos(client) {
    const todosDiv = document.getElementById('clientTodos');
    if (!todosDiv) return;
    
    todosDiv.innerHTML = '';

    if (client.todos.length === 0) {
        todosDiv.innerHTML = `
            <div class="empty-state-large">
                <div class="empty-icon-large">✅</div>
                <h3>Nessun To-Do per questo cliente</h3>
                <p>Aggiungi promemoria e attività da completare per organizzare il lavoro.</p>
                <button class="btn btn-primary" onclick="addClientTodo()">
                    ➕ Aggiungi Primo To-Do
                </button>
            </div>
        `;
        return;
    }

    // Raggruppa e ordina i TODO
    const activeTodos = client.todos.filter(t => !t.completed);
    const completedTodos = client.todos.filter(t => t.completed);
    
    // Ordina per priorità e scadenza
    activeTodos.sort((a, b) => {
        const priorityOrder = { 'alta': 0, 'media': 1, 'bassa': 2 };
        const aPriority = priorityOrder[a.priority] || 1;
        const bPriority = priorityOrder[b.priority] || 1;
        
        if (aPriority !== bPriority) return aPriority - bPriority;
        
        if (a.deadline && b.deadline) {
            return new Date(a.deadline) - new Date(b.deadline);
        }
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Renderizza TODO attivi
    if (activeTodos.length > 0) {
        const activeSection = document.createElement('div');
        activeSection.className = 'todos-section active-todos';
        activeSection.innerHTML = `
            <h4 class="todos-section-title">
                <span class="section-icon">🔄</span>
                To-Do Attivi (${activeTodos.length})
            </h4>
        `;
        
        activeTodos.forEach(todo => {
            const originalIndex = client.todos.indexOf(todo);
            activeSection.appendChild(createTodoElement(todo, originalIndex, 'client'));
        });
        
        todosDiv.appendChild(activeSection);
    }

    // Renderizza TODO completati (se ce ne sono)
    if (completedTodos.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.className = 'todos-section completed-todos';
        completedSection.innerHTML = `
            <h4 class="todos-section-title">
                <span class="section-icon">✅</span>
                Completati (${completedTodos.length})
                <button class="btn-toggle" onclick="toggleCompletedTodos(this)">👁️ Mostra/Nascondi</button>
            </h4>
            <div class="completed-todos-list" style="display: none;">
        `;
        
        completedTodos.slice(0, 5).forEach(todo => { // Mostra solo gli ultimi 5 completati
            const originalIndex = client.todos.indexOf(todo);
            const todoElement = createTodoElement(todo, originalIndex, 'client');
            completedSection.querySelector('.completed-todos-list').appendChild(todoElement);
        });
        
        completedSection.innerHTML += '</div>';
        todosDiv.appendChild(completedSection);
    }
}

// Override completo della funzione displaySessionHistory
function displaySessionHistory(client) {
    const historyDiv = document.getElementById('sessionHistory');
    if (!historyDiv) return;
    
    historyDiv.innerHTML = '';

    if (client.sessionHistory.length === 0) {
        historyDiv.innerHTML = `
            <div class="empty-state-large">
                <div class="empty-icon-large">📚</div>
                <h3>Nessuna sessione registrata</h3>
                <p>Le sessioni completate e registrate appariranno qui con tutti i dettagli.</p>
            </div>
        `;
        return;
    }

    const sortedSessions = [...client.sessionHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Statistiche veloci
    const totalSessions = sortedSessions.length;
    const totalHours = sortedSessions.reduce((sum, session) => {
        const hours = parseFloat(session.duration.replace('h', '').replace(' ore', '')) || 0;
        return sum + hours;
    }, 0);
    const avgSessionsPerMonth = totalSessions / Math.max(1, 
        Math.ceil((new Date() - new Date(sortedSessions[sortedSessions.length - 1].date)) / (30 * 24 * 60 * 60 * 1000))
    );

    // Header con statistiche
    const statsHeader = document.createElement('div');
    statsHeader.className = 'session-stats-header';
    statsHeader.innerHTML = `
        <div class="session-stats-grid">
            <div class="session-stat">
                <span class="stat-value">${totalSessions}</span>
                <span class="stat-label">Sessioni Totali</span>
            </div>
            <div class="session-stat">
                <span class="stat-value">${totalHours.toFixed(1)}h</span>
                <span class="stat-label">Ore Totali</span>
            </div>
            <div class="session-stat">
                <span class="stat-value">${avgSessionsPerMonth.toFixed(1)}</span>
                <span class="stat-label">Media/Mese</span>
            </div>
            <div class="session-stat">
                <span class="stat-value">${new Date(sortedSessions[0].date).toLocaleDateString('it-IT')}</span>
                <span class="stat-label">Ultima Sessione</span>
            </div>
        </div>
    `;
    historyDiv.appendChild(statsHeader);

    // Lista sessioni
    const sessionsList = document.createElement('div');
    sessionsList.className = 'sessions-list';
    
    sortedSessions.forEach((session, index) => {
        const sessionDate = new Date(session.date);
        const isRecent = (new Date() - sessionDate) < (7 * 24 * 60 * 60 * 1000);
        const isToday = sessionDate.toDateString() === new Date().toDateString();
        
        const sessionDiv = document.createElement('div');
        sessionDiv.className = `session-entry ${isRecent ? 'recent' : ''} ${isToday ? 'today' : ''}`;
        sessionDiv.innerHTML = `
            <div class="session-header">
                <div class="session-date-info">
                    <div class="session-date">
                        <span class="date-icon">📅</span>
                        <strong>${sessionDate.toLocaleDateString('it-IT', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</strong>
                    </div>
                    <div class="session-badges">
                        ${isToday ? '<span class="session-badge today">Oggi</span>' : ''}
                        ${isRecent && !isToday ? '<span class="session-badge recent">Recente</span>' : ''}
                        <span class="session-badge duration">⏱️ ${session.duration}</span>
                    </div>
                </div>
                <div class="session-number">#${totalSessions - index}</div>
            </div>
            <div class="session-content">
                <div class="session-notes">
                    <strong class="notes-label">📝 Note della sessione:</strong>
                    <p class="notes-text">${session.notes || 'Nessuna nota registrata per questa sessione.'}</p>
                </div>
                ${session.elementsCompleted ? `
                    <div class="session-achievements">
                        <strong class="achievements-label">🎯 Risultati:</strong>
                        <p class="achievements-text">${session.elementsCompleted} obiettivi completati durante la sessione</p>
                    </div>
                ` : ''}
                <div class="session-meta">
                    <small class="session-time">
                        🕐 Registrata: ${sessionDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </small>
                </div>
            </div>
        `;
        sessionsList.appendChild(sessionDiv);
    });
    
    historyDiv.appendChild(sessionsList);
}

// Override completo della funzione renderGlobalTodos
function renderGlobalTodos() {
    const todosDiv = document.getElementById('globalTodos');
    if (!todosDiv) return;
    
    todosDiv.innerHTML = '';

    if (appData.globalTodos.length === 0) {
        todosDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🌐</div>
                <h4>Nessun promemoria globale</h4>
                <p>Aggiungi promemoria che si applicano a tutte le tue attività di coaching.</p>
            </div>
        `;
        return;
    }

    // Raggruppa TODO globali
    const activeTodos = appData.globalTodos.filter(t => !t.completed);
    const completedTodos = appData.globalTodos.filter(t => t.completed);

    // Ordina TODO attivi per data di creazione (più recenti prima)
    activeTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Renderizza TODO attivi
    if (activeTodos.length > 0) {
        const activeSection = document.createElement('div');
        activeSection.className = 'todos-section active-todos global';
        activeSection.innerHTML = `
            <h4 class="todos-section-title">
                <span class="section-icon">🌐</span>
                Promemoria Attivi (${activeTodos.length})
            </h4>
        `;
        
        activeTodos.forEach(todo => {
            const originalIndex = appData.globalTodos.indexOf(todo);
            activeSection.appendChild(createTodoElement(todo, originalIndex, 'global'));
        });
        
        todosDiv.appendChild(activeSection);
    }

    // Renderizza TODO completati (se ce ne sono, mostra solo gli ultimi 3)
    if (completedTodos.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.className = 'todos-section completed-todos global';
        completedSection.innerHTML = `
            <h4 class="todos-section-title">
                <span class="section-icon">✅</span>
                Completati di recente (${Math.min(completedTodos.length, 3)})
            </h4>
        `;
        
        completedTodos
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .forEach(todo => {
                const originalIndex = appData.globalTodos.indexOf(todo);
                completedSection.appendChild(createTodoElement(todo, originalIndex, 'global'));
            });
        
        todosDiv.appendChild(completedSection);
    }
}

// Funzione helper per creare elementi TODO
function createTodoElement(todo, originalIndex, type) {
    const createdDate = new Date(todo.createdAt);
    const isRecent = (new Date() - createdDate) < (24 * 60 * 60 * 1000);
    const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed;
    
    const priorityConfig = {
        'alta': { icon: '🔴', class: 'high' },
        'media': { icon: '🟡', class: 'medium' },
        'bassa': { icon: '🟢', class: 'low' }
    };
    
    const priority = priorityConfig[todo.priority] || priorityConfig['media'];
    
    const todoDiv = document.createElement('div');
    todoDiv.className = `todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${priority.class}`;
    
    todoDiv.innerHTML = `
        <div class="todo-content">
            <div class="todo-main">
                <div class="todo-checkbox-container">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}
                           onchange="toggleTodo('${type}', ${originalIndex})" 
                           title="${todo.completed ? 'Segna come non completato' : 'Segna come completato'}">
                </div>
                <div class="todo-text-container">
                    <div class="todo-text">
                        ${type === 'global' ? '🌐' : '👤'} ${todo.text}
                    </div>
                    <div class="todo-meta">
                        <span class="todo-created">
                            📅 ${createdDate.toLocaleDateString('it-IT')}
                        </span>
                        ${todo.deadline ? `
                            <span class="todo-deadline ${isOverdue ? 'overdue' : ''}">
                                ⏰ Scadenza: ${new Date(todo.deadline).toLocaleDateString('it-IT')}
                            </span>
                        ` : ''}
                        ${todo.priority ? `
                            <span class="todo-priority ${priority.class}">
                                ${priority.icon} ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="todo-actions">
                <div class="tags-container">
                    ${todo.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${isRecent ? '<span class="tag tag-info">🆕 Nuovo</span>' : ''}
                    ${isOverdue ? '<span class="tag tag-danger">⚠️ Scaduto</span>' : ''}
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeTodo('${type}', ${originalIndex})" title="Rimuovi">🗑️</button>
            </div>
        </div>
    `;
    
    return todoDiv;
}

// Funzioni helper per le nuove funzionalità
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
        sessionProgressBar.style.backgroundColor = sessionProgress === 100 ? '#4facfe' : '#667eea';
    }
    if (progressText) {
        progressText.textContent = 
            `${client.completedSessions}/${client.plannedSessions} sessioni completate (${sessionProgress.toFixed(1)}%)`;
    }
    
    // Progresso coaching (obiettivi)
    let totalObjectives = client.masterElements.length;
    let completedObjectives = client.masterElements.filter(master => 
        master.subElements.length > 0 && master.subElements.every(sub => sub.completed)
    ).length;
    
    const coachingProgress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;
    const coachingProgressBar = document.getElementById('coachingProgress');
    const coachingProgressText = document.getElementById('coachingProgressText');
    
    if (coachingProgressBar) {
        coachingProgressBar.style.width = coachingProgress + '%';
        coachingProgressBar.style.backgroundColor = coachingProgress === 100 ? '#4facfe' : '#667eea';
    }
    if (coachingProgressText) {
        coachingProgressText.textContent = 
            `${completedObjectives}/${totalObjectives} obiettivi principali completati (${coachingProgress.toFixed(1)}%)`;
    }
}

// Funzione per modificare un master element
function editMasterElement(masterIndex) {
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    const master = client.masterElements[masterIndex];
    
    const newName = prompt('Modifica il nome dell\'obiettivo:', master.name);
    if (newName && newName.trim() !== '' && newName !== master.name) {
        master.name = newName.trim();
        saveDataToLocalStorage();
        displayMasterElements(client);
        showTemporaryMessage('✏️ Obiettivo modificato con successo', 2000);
    }
}

// Funzione per modificare un sub element
function editSubElement(masterIndex, subIndex) {
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    const subElement = client.masterElements[masterIndex].subElements[subIndex];
    
    const newName = prompt('Modifica il nome del micro obiettivo:', subElement.name);
    if (newName && newName.trim() !== '' && newName !== subElement.name) {
        subElement.name = newName.trim();
        
        const newNotes = prompt('Modifica le note (opzionale):', subElement.notes || '');
        subElement.notes = newNotes || '';
        
        saveDataToLocalStorage();
        displayMasterElements(client);
        showTemporaryMessage('✏️ Micro obiettivo modificato con successo', 2000);
    }
}

// Funzione per aggiungere valori personali
function addValue() {
    const name = prompt('Nome del valore personale:');
    if (!name || name.trim() === '') return;
    
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    if (!client.profile.values) {
        client.profile.values = [];
    }
    
    // Controlla se il valore esiste già
    if (client.profile.values.includes(name.trim())) {
        alert('Questo valore è già presente nella lista.');
        return;
    }
    
    client.profile.values.push(name.trim());
    saveDataToLocalStorage();
    displayClientProfile(client);
    showTemporaryMessage('💎 Valore aggiunto con successo', 2000);
}

// Funzione per rimuovere valori personali
function removeValue(index) {
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    if (confirm('Sei sicuro di voler rimuovere questo valore personale?')) {
        client.profile.values.splice(index, 1);
        saveDataToLocalStorage();
        displayClientProfile(client);
        showTemporaryMessage('🗑️ Valore rimosso', 2000);
    }
}

// Funzione per mostrare/nascondere TODO completati
function toggleCompletedTodos(button) {
    const completedList = button.parentElement.nextElementSibling;
    if (completedList.style.display === 'none') {
        completedList.style.display = 'block';
        button.textContent = '👁️ Nascondi';
    } else {
        completedList.style.display = 'none';
        button.textContent = '👁️ Mostra';
    }
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

// CSS per tutti i nuovi stili
const enhancedCSS = `
/* Animazioni */
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

/* Empty States */
.empty-state {
    text-align: center;
    padding: 30px 20px;
    color: #64748b;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    border: 2px dashed #cbd5e1;
}

.empty-state-large {
    text-align: center;
    padding: 50px 30px;
    color: #64748b;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 16px;
    border: 2px dashed #cbd5e1;
}

.empty-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
    display: block;
}

.empty-icon-large {
    font-size: 4rem;
    margin-bottom: 25px;
    display: block;
}

.empty-state h3, .empty-state-large h3 {
    color: #374151;
    margin-bottom: 10px;
    font-weight: 600;
}

.empty-state h4 {
    color: #374151;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 1.1rem;
}

/* Client Info Grid */
.client-info-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 25px;
    align-items: start;
}

.client-details {
    display: grid;
    gap: 12px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 10px;
    border-left: 3px solid #667eea;
}

.detail-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
}

.detail-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.detail-content strong {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
}

.detail-content span {
    color: #64748b;
    font-size: 0.85rem;
}

.client-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.stat-mini {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    padding: 20px 15px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-mini .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 5px;
}

.stat-mini .stat-label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Profile Items */
.profile-item {
    background: #ffffff;
    padding: 15px 18px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.item-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
}

.item-text {
    font-weight: 500;
    color: #374151;
    flex: 1;
}

.strength-item {
    border-left: 3px solid #4facfe;
}

.improvement-item {
    border-left: 3px solid #f093fb;
}

.value-item {
    border-left: 3px solid #43e97b;
}

/* Habit Tracker Styles */
.habit-tracker {
    background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
    border: 1px solid #b3e5fc;
    padding: 15px 18px;
    margin-bottom: 8px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.habit-tracker:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(179, 229, 252, 0.3);
}

.habit-content {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
}

.habit-name {
    font-weight: 500;
    color: #374151;
}

.habit-category {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.habit-category.positive {
    background: #d1f2eb;
    color: #0d7050;
}

.habit-category.improve {
    background: #ffeaa7;
    color: #b8860b;
}

.habit-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Master Element Styles */
.master-element {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 25px;
    border-radius: 16px;
    margin-bottom: 20px;
    border-left: 4px solid #667eea;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.master-element:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.master-element.completed {
    border-left-color: #4facfe;
    background: linear-gradient(135deg, #e6f7ff 0%, #d1f2eb 100%);
}

.master-element.no-subs {
    border-left-color: #f093fb;
}

.master-header {
    margin-bottom: 20px;
}

.master-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.master-title h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    color: #1e293b;
}

.master-icon {
    font-size: 1.4rem;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.completed {
    background: #d1f2eb;
    color: #0d7050;
}

.status-badge.in-progress {
    background: #fff3cd;
    color: #856404;
}

.status-badge.no-subs {
    background: #f3e5f5;
    color: #7b1fa2;
}

.master-progress-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.progress-text {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
}

.progress-percentage {
    font-size: 0.9rem;
    color: #667eea;
    font-weight: 600;
}

.no-subs-message {
    background: rgba(240, 147, 251, 0.1);
    padding: 20px;
    border-radius: 12px;
    border: 1px dashed #f093fb;
    margin: 15px 0;
}

.no-subs-message .icon {
    font-size: 1.5rem;
    margin-right: 8px;
}

/* Sub Element Styles */
.sub-element {
    background: #ffffff;
    padding: 0;
    margin: 8px 0 8px 20px;
    border-radius: 12px;
    border-left: 3px solid #f093fb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
}

.sub-element:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.sub-element.completed {
    border-left-color: #4facfe;
    background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
    opacity: 0.9;
}

.sub-element-container {
    display: flex;
    align-items: center;
    padding: 15px 18px;
    gap: 15px;
}

.sub-status-icon {
    font-size: 1.3rem;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
}

.sub-content {
    flex: 1;
    min-width: 0;
}

.sub-main-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sub-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.4;
}

.sub-element.completed .sub-title {
    text-decoration: line-through;
    color: #64748b;
}

.sub-notes {
    font-size: 0.85rem;
    color: #64748b;
    font-style: italic;
    margin: 5px 0;
    line-height: 1.4;
}

.sub-meta {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.sub-status-text {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 500;
}

.sub-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.btn-icon {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-icon.edit:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: scale(1.1);
}

.btn-icon.delete:hover {
    background: rgba(250, 112, 154, 0.1);
    transform: scale(1.1);
}

.master-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
}

/* TODO Styles */
.todos-section {
    margin-bottom: 25px;
}

.todos-section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 15px;
    padding: 12px 15px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%);
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
}

.section-icon {
    font-size: 1.2rem;
}

.btn-toggle {
    background: none;
    border: none;
    font-size: 0.8rem;
    color: #667eea;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.btn-toggle:hover {
    background: rgba(102, 126, 234, 0.1);
}

.todo-item {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    overflow: hidden;
}

.todo-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
    opacity: 0.7;
    background: #f8f9fa;
}

.todo-item.overdue {
    border-left: 4px solid #fa709a;
    background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%);
}

.todo-item.high {
    border-left: 4px solid #ef4444;
}

.todo-item.medium {
    border-left: 4px solid #f59e0b;
}

.todo-item.low {
    border-left: 4px solid #10b981;
}

.todo-content {
    padding: 15px 18px;
}

.todo-main {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
}

.todo-checkbox-container {
    padding-top: 2px;
}

.todo-item input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #667eea;
    cursor: pointer;
}

.todo-text-container {
    flex: 1;
    min-width: 0;
}

.todo-text {
    font-size: 0.95rem;
    font-weight: 500;
    color: #374151;
    line-height: 1.5;
    margin-bottom: 8px;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #64748b;
}

.todo-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.8rem;
}

.todo-created, .todo-deadline, .todo-priority {
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.todo-created {
    background: #f1f5f9;
    color: #64748b;
}

.todo-deadline {
    background: #e0f2fe;
    color: #0369a1;
}

.todo-deadline.overdue {
    background: #fee2e2;
    color: #dc2626;
}

.todo-priority.high {
    background: #fee2e2;
    color: #dc2626;
}

.todo-priority.medium {
    background: #fef3c7;
    color: #d97706;
}

.todo-priority.low {
    background: #d1fae5;
    color: #059669;
}

.todo-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

/* Session History Styles */
.session-stats-header {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
}

.session-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
}

.session-stat {
    text-align: center;
}

.session-stat .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
    display: block;
    margin-bottom: 5px;
}

.session-stat .stat-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.sessions-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.session-entry {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    overflow: hidden;
}

.session-entry:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.session-entry.recent {
    border-left: 4px solid #4facfe;
}

.session-entry.today {
    border-left: 4px solid #43e97b;
    background: linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%);
}

.session-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
}

.session-date-info {
    flex: 1;
}

.session-date {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.date-icon {
    font-size: 1.1rem;
}

.session-date strong {
    color: #374151;
    font-weight: 600;
}

.session-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.session-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.session-badge.today {
    background: #d1fae5;
    color: #059669;
}

.session-badge.recent {
    background: #dbeafe;
    color: #1d4ed8;
}

.session-badge.duration {
    background: #f3e8ff;
    color: #7c3aed;
}

.session-number {
    font-size: 1.2rem;
    font-weight: 700;
    color: #667eea;
    background: #f1f5f9;
    padding: 8px 12px;
    border-radius: 8px;
}

.session-content {
    padding: 20px;
}

.session-notes, .session-achievements {
    margin-bottom: 15px;
}

.notes-label, .achievements-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #374151;
    font-weight: 600;
    margin-bottom: 8px;
}

.notes-text, .achievements-text {
    color: #64748b;
    line-height: 1.5;
    margin: 0;
    padding-left: 24px;
}

.session-meta {
    border-top: 1px solid #f1f5f9;
    padding-top: 15px;
    margin-top: 15px;
}

.session-time {
    color: #94a3b8;
    font-size: 0.8rem;
}

/* Tag Styles */
.tag {
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 6px;
    margin-bottom: 6px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
}

.tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.tag-info {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.tag-danger {
    background: linear-gradient(135deg, #fa709a, #fee140);
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

/* Responsive Design */
@media (max-width: 768px) {
    .client-info-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .client-stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    
    .stat-mini {
        padding: 15px 12px;
    }
    
    .stat-mini .stat-value {
        font-size: 1.5rem;
    }
    
    .detail-item {
        padding: 10px;
        gap: 10px;
    }
    
    .master-title {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .master-title h3 {
        font-size: 1.1rem;
    }
    
    .sub-element {
        margin: 6px 0 6px 15px;
    }
    
    .sub-element-container {
        padding: 12px 15px;
        gap: 12px;
    }
    
    .sub-actions {
        flex-direction: column;
        gap: 5px;
    }
    
    .master-actions {
        flex-direction: column;
        gap: 8px;
    }
    
    .master-actions .btn {
        width: 100%;
        justify-content: center;
    }
    
    .session-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .session-stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .session-content {
        padding: 15px;
    }
    
    .todo-main {
        gap: 10px;
    }
    
    .todo-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .todo-meta {
        gap: 8px;
    }
    
    .todos-section-title {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .empty-state, .empty-state-large {
        padding: 30px 20px;
    }
    
    .empty-icon-large {
        font-size: 3rem;
        margin-bottom: 20px;
    }
    
    .master-element {
        padding: 20px 15px;
    }
    
    .master-header {
        margin-bottom: 15px;
    }
    
    .master-title h3 {
        font-size: 1rem;
        gap: 8px;
    }
    
    .sub-element-container {
        padding: 10px 12px;
        gap: 10px;
    }
    
    .sub-title {
        font-size: 0.9rem;
    }
    
    .session-stats-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .session-stat .stat-value {
        font-size: 1.3rem;
    }
    
    .session-content {
        padding: 12px;
    }
    
    .session-header {
        padding: 12px 15px;
    }
    
    .todo-content {
        padding: 12px 15px;
    }
    
    .client-stats-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
}
`;

// Aggiungi gli stili al documento
const styleElement = document.createElement('style');
styleElement.textContent = enhancedCSS;
document.head.appendChild(styleElement);

// Funzioni aggiuntive per migliorare l'esperienza utente
function addClientTodoWithDeadline() {
    const text = prompt('Inserisci il promemoria per questo cliente:');
    if (!text || text.trim() === '') return;
    
    const deadline = prompt('Inserisci una scadenza (formato: YYYY-MM-DD) - opzionale:');
    let priority = prompt('Priorità (alta/media/bassa):', 'media');
    
    // Valida la priorità
    if (!['alta', 'media', 'bassa'].includes(priority)) {
        priority = 'media';
    }
    
    const tagsInput = prompt('Inserisci i tag per questo To-Do (separati da virgola):', '');
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company.clients.find(c => c.id === appData.currentClientId);
    
    const todo = {
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        tags: tags,
        priority: priority,
    };
    
    // Valida e aggiungi la scadenza se fornita
    if (deadline && isValidDate(deadline)) {
        todo.deadline = deadline;
    }
    
    client.todos.push(todo);
    saveDataToLocalStorage();
    displayClientTodos(client);
    showTemporaryMessage('✅ To-Do aggiunto con successo', 2000);
}

// Funzione per validare le date
function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date instanceof Date && !isNaN(date) && date >= today;
}

// Override della funzione addClientTodo per usare la versione migliorata
function addClientTodo() {
    addClientTodoWithDeadline();
}

// Funzione per salvare le note del cliente quando si perde il focus
function saveClientNotes() {
    const notesTextarea = document.getElementById('clientNotes');
    if (notesTextarea && appData.currentCompanyId && appData.currentClientId) {
        const company = appData.companies.find(c => c.id === appData.currentCompanyId);
        const client = company?.clients.find(c => c.id === appData.currentClientId);
        
        if (client) {
            client.notes = notesTextarea.value;
            saveDataToLocalStorage();
            
            // Mostra un feedback visivo
            notesTextarea.style.borderColor = '#4facfe';
            setTimeout(() => {
                notesTextarea.style.borderColor = '';
            }, 1000);
        }
    }
}

// Aggiungi event listener per il salvataggio automatico delle note
document.addEventListener('DOMContentLoaded', function() {
    const setupNotesAutosave = () => {
        const clientNotes = document.getElementById('clientNotes');
        if (clientNotes) {
            clientNotes.addEventListener('blur', saveClientNotes);
            
            // Salvataggio automatico durante la digitazione (con debounce)
            let saveTimeout;
            clientNotes.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(saveClientNotes, 2000); // Salva dopo 2 secondi di inattività
            });
        }
    };
    
    // Setup immediato e ri-setup quando la sezione sessions viene caricata
    setupNotesAutosave();
    
    // Observer per rilevare quando vengono aggiunti nuovi elementi al DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                setupNotesAutosave();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Funzione per esportare i dati di un singolo cliente
function exportClientData(clientId, companyId) {
    const company = appData.companies.find(c => c.id === companyId);
    const client = company?.clients.find(c => c.id === clientId);
    
    if (!client) {
        alert('Cliente non trovato');
        return;
    }
    
    const clientData = {
        company: company.name,
        client: {
            ...client,
            exportDate: new Date().toISOString(),
            exportVersion: '2.0'
        }
    };
    
    const dataStr = JSON.stringify(clientData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cliente_${client.firstName}_${client.lastName}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showTemporaryMessage('📤 Dati cliente esportati', 2000);
}

// Funzione per calcolare statistiche avanzate del cliente
function getClientAdvancedStats(client) {
    const stats = {
        completionRate: 0,
        averageSessionDuration: 0,
        goalCompletionRate: 0,
        todoCompletionRate: 0,
        habitPositiveRate: 0,
        lastSessionDate: null,
        sessionsThisMonth: 0,
        totalHours: 0
    };
    
    // Tasso di completamento sessioni
    stats.completionRate = (client.completedSessions / client.plannedSessions) * 100;
    
    // Ore totali
    stats.totalHours = client.completedSessions * client.hoursPerSession;
    
    // Durata media delle sessioni (dal campo duration)
    if (client.sessionHistory.length > 0) {
        const totalDuration = client.sessionHistory.reduce((sum, session) => {
            const duration = parseFloat(session.duration.replace(/[^\d.]/g, '')) || 0;
            return sum + duration;
        }, 0);
        stats.averageSessionDuration = totalDuration / client.sessionHistory.length;
        
        // Ultima sessione
        const sortedSessions = [...client.sessionHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        stats.lastSessionDate = sortedSessions[0]?.date;
        
        // Sessioni questo mese
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        stats.sessionsThisMonth = client.sessionHistory.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
        }).length;
    }
    
    // Tasso di completamento obiettivi
    if (client.masterElements.length > 0) {
        const completedGoals = client.masterElements.filter(master => 
            master.subElements.length > 0 && master.subElements.every(sub => sub.completed)
        ).length;
        stats.goalCompletionRate = (completedGoals / client.masterElements.length) * 100;
    }
    
    // Tasso di completamento TODO
    if (client.todos.length > 0) {
        const completedTodos = client.todos.filter(todo => todo.completed).length;
        stats.todoCompletionRate = (completedTodos / client.todos.length) * 100;
    }
    
    // Tasso di abitudini positive
    if (client.profile.habits.length > 0) {
        const positiveHabits = client.profile.habits.filter(habit => habit.category === 'positive').length;
        stats.habitPositiveRate = (positiveHabits / client.profile.habits.length) * 100;
    }
    
    return stats;
}

// Funzione per mostrare statistiche avanzate del cliente
function showClientAdvancedStats() {
    if (!appData.currentCompanyId || !appData.currentClientId) return;
    
    const company = appData.companies.find(c => c.id === appData.currentCompanyId);
    const client = company?.clients.find(c => c.id === appData.currentClientId);
    
    if (!client) return;
    
    const stats = getClientAdvancedStats(client);
    
    const statsHTML = `
        <div class="advanced-stats-modal">
            <h3>📊 Statistiche Avanzate - ${client.firstName} ${client.lastName}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.completionRate.toFixed(1)}%</div>
                    <div class="stat-label">Completamento Sessioni</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.goalCompletionRate.toFixed(1)}%</div>
                    <div class="stat-label">Obiettivi Completati</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.todoCompletionRate.toFixed(1)}%</div>
                    <div class="stat-label">TODO Completati</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.averageSessionDuration.toFixed(1)}h</div>
                    <div class="stat-label">Durata Media Sessioni</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.sessionsThisMonth}</div>
                    <div class="stat-label">Sessioni Questo Mese</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.totalHours.toFixed(1)}h</div>
                    <div class="stat-label">Ore Totali di Coaching</div>
                </div>
            </div>
            ${stats.lastSessionDate ? `
                <p class="last-session">
                    🕐 Ultima sessione: ${new Date(stats.lastSessionDate).toLocaleDateString('it-IT')}
                </p>
            ` : ''}
        </div>
    `;
    
    // Crea e mostra un modal temporaneo
    const modal = document.createElement('div');
    modal.className = 'temp-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = statsHTML + `
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn btn-primary" onclick="this.closest('.temp-modal').remove()">
                Chiudi
            </button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Chiudi cliccando fuori
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Aggiungi CSS per le statistiche avanzate
const advancedStatsCSS = `
.advanced-stats-modal h3 {
    text-align: center;
    margin-bottom: 25px;
    color: #374151;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.stat-item {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

.stat-item .stat-value {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 8px;
}

.stat-item .stat-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.last-session {
    text-align: center;
    color: #64748b;
    font-style: italic;
}
`;

const advancedStatsStyle = document.createElement('style');
advancedStatsStyle.textContent = advancedStatsCSS;
document.head.appendChild(advancedStatsStyle);