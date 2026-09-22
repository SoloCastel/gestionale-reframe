const STORAGE_KEY = "reframe-prototype-v2";

const roles = {
  andrea: { name: "Andrea", full: "Andrea Castellazzo", initials: "AC", role: "Operativo · commerciale", summary: "Hai 5 cose che richiedono attenzione. Partiamo da quelle importanti.", tone: "lilac", finance: true, insights: false, focus: "Conferma la squadra per Artluce", focusText: "Il lavoro è confermato dal cliente, ma manca ancora chi si occuperà del montaggio." },
  simone: { name: "Simone", full: "Simone Maffessoni", initials: "SM", role: "Direzione · amministratore", summary: "Hai 7 decisioni e 3 anomalie da risolvere. Il lavoro operativo resta in secondo piano.", tone: "dark", finance: true, insights: true, focus: "Sblocca le decisioni della squadra", focusText: "Tre progetti attendono una tua approvazione economica o organizzativa." },
  martina: { name: "Martina", full: "Martina Riva", initials: "MR", role: "Operativa · graphic designer", summary: "Hai 4 attività, una consegna e una nuova revisione da gestire.", tone: "mint", finance: false, insights: false, focus: "Chiudi la revisione di Pasta Lab", focusText: "Il cliente ha lasciato quattro note sulla proposta visiva. La consegna è domani." },
  luca: { name: "Luca", full: "Luca Moretti", initials: "LM", role: "Operativo · videomaker", summary: "Il tuo carico è oltre la capacità: prima risolviamo il conflitto, poi il resto.", tone: "peach", finance: false, insights: false, focus: "Segnala quale consegna spostare", focusText: "Questa settimana sei al 128% della capacità. Due consegne occupano la stessa giornata." }
};

const labels = { today: "Oggi", opportunities: "Opportunità", projects: "Progetti", calendar: "Calendario", clients: "Clienti", team: "Team", finance: "Amministrazione", insights: "Insight" };

const taskSets = {
  andrea: [
    ["Selezione fotografie evento Artluce", "Artluce · Consegna 01", "12:30", "today", "high"],
    ["Chiamare Martina per disponibilità", "Pasta Lab · Opportunità", "14:00", "today", "medium"],
    ["Inviare seconda versione homepage", "Studio Nord · Sito web", "17:00", "today", "medium"],
    ["Confermare preventivo stampa", "ReFrame interno", "18:30", "today", "low"],
    ["Ricontattare Garda Sailing", "Opportunità · Follow-up cliente", "Ieri", "late", "high"],
    ["Preparare moodboard lancio prodotto", "Lumea · Direzione creativa", "Gio", "week", "low"]
  ],
  simone: [
    ["Approvare stima Pasta Lab", "Decisione commerciale", "11:30", "today", "high"],
    ["Assegnare montaggio Artluce", "Produzione · Blocco", "14:00", "today", "high"],
    ["Revisionare montaggio Barcolana", "Round finale", "16:30", "today", "medium"],
    ["Verificare fattura Artluce", "Amministrazione", "18:00", "today", "medium"],
    ["Rispondere a Officina Maffei", "Opportunità senza prossima azione", "Ieri", "late", "high"],
    ["Rivedere capacità team ottobre", "Pianificazione", "Ven", "week", "low"]
  ],
  martina: [
    ["Integrare feedback Pasta Lab", "Branding · Revisione 02", "13:00", "today", "high"],
    ["Esportare presentazione cliente", "La Vela Resort", "16:00", "today", "medium"],
    ["Aggiornare componenti Studio Nord", "Sito web", "17:30", "today", "low"],
    ["Caricare font definitivi", "Pasta Lab", "18:00", "today", "low"],
    ["Confermare disponibilità shooting", "La Vela Resort", "Ieri", "late", "medium"],
    ["Preparare proposta Officina Maffei", "Branding", "Ven", "week", "low"]
  ],
  luca: [
    ["Montare teaser Artluce", "Video · Prima versione", "12:00", "today", "high"],
    ["Esportare Barcolana v03", "Film di bordo", "15:00", "today", "high"],
    ["Backup riprese Artluce", "Produzione", "17:00", "today", "medium"],
    ["Segnalare conflitto di carico", "Team", "17:30", "today", "high"],
    ["Inviare proxy al team", "Artluce", "Ieri", "late", "high"],
    ["Preparare animatic Lumea", "Video prodotto + 3D", "Gio", "week", "medium"]
  ]
};

const projects = {
  artluce: { client: "Artluce Service", title: "Evento corporate — settembre", state: "In produzione", stateClass: "production", progress: 64, deliveryLabel: "OGGI · 17:00", delivery: "Selezione fotografica", detail: "46 fotografie post-prodotte", people: [["AC", "Andrea", "Fotografia · consegna", "€820", "lilac"], ["LM", "Luca", "Riprese video", "€650", "peach"]], missing: "Montaggio da assegnare", missingText: "Blocca la consegna video" },
  barcolana: { client: "ReFrame Original", title: "Barcolana — film di bordo", state: "In revisione", stateClass: "review", progress: 84, deliveryLabel: "DOMANI · SIMONE", delivery: "Approvazione montaggio", detail: "Versione 03 · 4 feedback aperti", people: [["AC", "Andrea", "Riprese · montaggio", "€1.100", "lilac"], ["SM", "Simone", "Revisione finale", "Gestione", "dark"]], missing: "Quattro feedback aperti", missingText: "Serve approvazione prima della consegna" },
  studio: { client: "Studio Nord", title: "Nuovo sito corporate", state: "In produzione", stateClass: "production", progress: 46, deliveryLabel: "OGGI · 17:00", delivery: "Homepage v02", detail: "Desktop, tablet e mobile", people: [["AC", "Andrea", "Design · sviluppo", "€1.450", "lilac"], ["MR", "Martina", "Identità visiva", "€520", "mint"]], missing: "Testi della pagina servizi", missingText: "In attesa del cliente" },
  lumea: { client: "Lumea", title: "Visualizzazione prodotto 3D", state: "Bloccato", stateClass: "blocked", progress: 22, deliveryLabel: "DA 3 GIORNI", delivery: "File CAD definitivi", detail: "Il lavoro riparte alla ricezione", people: [["AC", "Andrea", "Modellazione · render", "€1.200", "lilac"], ["LM", "Luca", "Animazione prodotto", "€780", "peach"]], missing: "Materiali cliente mancanti", missingText: "CAD e finiture non ancora ricevuti" }
};

const defaultProjectTasks = {
  artluce: [
    { id:"art-01", phase:"Pre-produzione", title:"Confermare scaletta e call sheet", status:"Completata", assignee:"Simone", due:"2026-09-20", description:"Validare orari, accessi, referenti e momenti chiave dell'evento con il cliente.", checklist:[["Call sheet condivisa",true],["Referente tecnico confermato",true]], comments:[{author:"Simone",initials:"SM",tone:"dark",time:"Ieri · 18:06",text:"Scaletta confermata con Artluce. Ho aggiunto 20 minuti per il setup luci.",files:[]}] },
    { id:"art-02", phase:"Produzione", title:"Shooting fotografico evento", status:"Completata", assignee:"Andrea", due:"2026-09-21", description:"Copertura fotografica completa: allestimento, ospiti, interventi e dettagli tecnici.", checklist:[["Backup schede",true],["Selezione iniziale",true],["Liberatorie verificate",true]], comments:[{author:"Andrea",initials:"AC",tone:"lilac",time:"Oggi · 11:42",text:"Backup completato in doppia copia. La selezione iniziale contiene 186 scatti.",files:["selezione-contatti.pdf"]}] },
    { id:"art-03", phase:"Post-produzione", title:"Selezione e color fotografia", status:"In lavorazione", assignee:"Andrea", due:"2026-09-22", description:"Preparare 46 fotografie post-prodotte, coerenti per colore e pronte in alta e web.", checklist:[["Selezione 46 scatti",true],["Color correction",true],["Controllo pelle e loghi",false],["Export alta + web",false]], comments:[{author:"Simone",initials:"SM",tone:"dark",time:"Oggi · 12:18",text:"@Andrea il cliente chiede di dare priorità alle fotografie del palco e dello sponsor principale.",files:["reference-cliente.jpg"]}] },
    { id:"art-04", phase:"Post-produzione", title:"Montaggio video recap", status:"Da assegnare", assignee:"Da assegnare", due:"2026-09-25", description:"Montaggio recap da 60–75 secondi con versione verticale e orizzontale.", checklist:[["Assegnare montatore",false],["Selezione musica",false],["Prima versione",false],["Revisione cliente",false]], comments:[] },
    { id:"art-05", phase:"Consegna", title:"Consegna pacchetto finale", status:"In attesa", assignee:"Andrea", due:"2026-09-26", description:"Raccogliere fotografie e video approvati nella cartella cliente e inviare il link finale.", checklist:[["Cartelle nominate",false],["Link verificato",false],["Consegna registrata",false]], comments:[] }
  ],
  barcolana: [
    { id:"bar-01", phase:"Produzione", title:"Backup e sincronizzazione riprese", status:"Completata", assignee:"Andrea", due:"2026-09-18", description:"Ordinare camera, drone e audio per giornata e timecode.", checklist:[["Backup doppio",true],["Proxy generati",true]], comments:[] },
    { id:"bar-02", phase:"Montaggio", title:"Montaggio film di bordo v03", status:"In revisione", assignee:"Andrea", due:"2026-09-22", description:"Integrare ritmo della partenza, audio ambiente e passaggio finale sull'equipaggio.", checklist:[["Feedback round 2",true],["Mix audio",true],["Titoli finali",false]], comments:[{author:"Simone",initials:"SM",tone:"dark",time:"Oggi · 10:20",text:"Il ritmo ora funziona. Restano quattro note puntuali prima dell'approvazione.",files:["feedback-v03.pdf"]}] },
    { id:"bar-03", phase:"Revisione", title:"Approvazione montaggio finale", status:"In attesa", assignee:"Simone", due:"2026-09-23", description:"Controllo editoriale finale prima dell'invio all'equipaggio.", checklist:[["Controllo nomi",false],["Approvazione musica",false]], comments:[] },
    { id:"bar-04", phase:"Consegna", title:"Master e versioni social", status:"Non iniziata", assignee:"Luca", due:"2026-09-24", description:"Esportare master 4K e adattamenti 16:9, 9:16 e 1:1.", checklist:[["Master 4K",false],["Reel 9:16",false],["Cover",false]], comments:[] }
  ],
  studio: [
    { id:"stu-01", phase:"UX e contenuti", title:"Architettura pagine", status:"Completata", assignee:"Andrea", due:"2026-09-17", description:"Definire navigazione, gerarchie e contenuti necessari.", checklist:[["Sitemap",true],["Wireframe",true]], comments:[] },
    { id:"stu-02", phase:"Design", title:"Homepage responsive v02", status:"In lavorazione", assignee:"Andrea", due:"2026-09-22", description:"Rifinire homepage su desktop, tablet e mobile con componenti definitivi.", checklist:[["Desktop",true],["Tablet",true],["Mobile",false],["Accessibilità",false]], comments:[{author:"Martina",initials:"MR",tone:"mint",time:"Oggi · 09:14",text:"Ho caricato il logotipo corretto e le varianti cromatiche definitive.",files:["brand-assets.zip"]}] },
    { id:"stu-03", phase:"Design", title:"Componenti pagina servizi", status:"Bloccata", assignee:"Martina", due:"2026-09-24", description:"Progettare cards e sezioni servizi. In attesa dei testi dal cliente.", checklist:[["Ricevere testi",false],["Disegnare cards",false]], comments:[] },
    { id:"stu-04", phase:"Sviluppo", title:"Implementazione frontend", status:"Non iniziata", assignee:"Andrea", due:"2026-09-29", description:"Sviluppare le pagine approvate e collegare i moduli.", checklist:[["Setup",false],["Componenti",false],["QA responsive",false]], comments:[] }
  ],
  lumea: [
    { id:"lum-01", phase:"Preparazione", title:"Ricezione e verifica file CAD", status:"Bloccata", assignee:"Andrea", due:"2026-09-19", description:"Verificare geometrie, scala e nomenclatura dei file ricevuti.", checklist:[["File CAD ricevuti",false],["Materiali definiti",false]], comments:[{author:"Andrea",initials:"AC",tone:"lilac",time:"3 giorni fa",text:"Il file ricevuto è una preview senza geometrie modificabili. Ho richiesto STEP o IGES.",files:["preview-prodotto.jpg"]}] },
    { id:"lum-02", phase:"3D", title:"Pulizia e modellazione", status:"In attesa", assignee:"Andrea", due:"2026-09-26", description:"Ottimizzare il modello e ricostruire i dettagli non presenti nel CAD.", checklist:[["Pulizia mesh",false],["Dettagli",false]], comments:[] },
    { id:"lum-03", phase:"Lookdev", title:"Materiali e illuminazione", status:"Non iniziata", assignee:"Andrea", due:"2026-09-29", description:"Creare materiali prodotto e set luce coerente con il brand.", checklist:[["Materiali",false],["Lighting",false],["Test render",false]], comments:[] },
    { id:"lum-04", phase:"Animazione", title:"Animazione prodotto", status:"Non iniziata", assignee:"Luca", due:"2026-10-02", description:"Animare esploso, rotazione e dettaglio funzionale.", checklist:[["Animatic",false],["Movimenti finali",false]], comments:[] }
  ]
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

const saved = loadState();
let currentRole = roles[saved.role] ? saved.role : "andrea";
let opportunities = Array.isArray(saved.opportunities) ? saved.opportunities : [];
let completedTasks = saved.completedTasks || {};
let projectTasks = saved.projectTasks || structuredClone(defaultProjectTasks);
let activeTaskFilter = "today";
let activeProjectKey = "artluce";
let activeProjectTaskId = null;
let pendingFiles = [];

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: currentRole, opportunities, completedTasks, projectTasks }));
}

function escapeText(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function toast(message) {
  $("#toastText").textContent = message;
  $("#toast").classList.add("is-visible");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => $("#toast").classList.remove("is-visible"), 2400);
}

function showView(view) {
  if (!$("#view-" + view)) return;
  $$('[data-view-panel]').forEach(panel => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
  $$('[data-view]').forEach(button => button.classList.toggle("is-active", button.dataset.view === view));
  $("#currentViewLabel").textContent = labels[view];
  history.replaceState(null, "", "#" + view);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTasks() {
  const tasks = taskSets[currentRole];
  $("#taskList").innerHTML = tasks.map((task, index) => {
    const [title, context, time, state, priority] = task;
    const id = `${currentRole}-${index}`;
    const checked = completedTasks[id] ? " checked" : "";
    const visible = state === activeTaskFilter ? "grid" : "none";
    return `<label class="task-row" data-task-state="${state}" style="display:${visible}"><input type="checkbox" data-task-id="${id}"${checked} /><span class="custom-check"></span><span class="task-main"><strong>${escapeText(title)}</strong><small>${escapeText(context)}</small></span><time>${escapeText(time)}</time><i class="priority ${priority}"></i></label>`;
  }).join("");
  const counts = { today: 0, late: 0, week: 0 };
  tasks.forEach(task => counts[task[3]]++);
  $$('[data-task-filter]').forEach(button => {
    button.classList.toggle("is-active", button.dataset.taskFilter === activeTaskFilter);
    const count = button.querySelector("span");
    if (count) count.textContent = counts[button.dataset.taskFilter];
  });
  $$('.task-row input').forEach(input => input.addEventListener("change", () => {
    completedTasks[input.dataset.taskId] = input.checked;
    persist();
    toast(input.checked ? "Attività completata" : "Attività riaperta");
  }));
}

function applyRole(key, notify = true) {
  const role = roles[key];
  currentRole = key;
  $$('[data-person-name]').forEach(element => element.textContent = role.name);
  $$('[data-person-role]').forEach(element => element.textContent = role.role);
  $$('[data-avatar]').forEach(element => {
    const small = element.classList.contains("small") ? " small" : "";
    element.textContent = role.initials;
    element.className = "avatar" + small + " " + role.tone;
  });
  $("#roleSummary").textContent = role.summary;
  $(".accent-card h2").textContent = role.focus;
  $(".accent-card > p").textContent = role.focusText;
  $$('[data-permission="finance"]').forEach(element => element.classList.toggle("role-restricted", !role.finance));
  $$('[data-permission="insights"]').forEach(element => element.classList.toggle("role-restricted", !role.insights));
  $$('#rolePopover [data-role]').forEach(button => button.querySelector("b").textContent = button.dataset.role === key ? "✓" : "");
  $("#rolePopover").hidden = true;
  if ((!role.finance && location.hash === "#finance") || (!role.insights && location.hash === "#insights")) showView("today");
  activeTaskFilter = "today";
  renderTasks();
  renderOpportunities();
  persist();
  if (notify) toast(`Vista aggiornata per ${role.full}`);
}

function renderOpportunities() {
  $$(".opportunity-card.is-created").forEach(card => card.remove());
  const target = $(".kanban-column .kanban-cards");
  opportunities.forEach(item => {
    const article = document.createElement("article");
    article.className = "opportunity-card is-created";
    article.dataset.owner = item.owner.split(" ")[0];
    const initials = item.client.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    const followup = item.followup ? new Date(item.followup + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "Da pianificare";
    article.innerHTML = `<div class="card-top"><span class="client-logo purple">${escapeText(initials)}</span><small>Creata ora</small></div><h3>${escapeText(item.client)}</h3><p>${escapeText(item.request || item.service || "Richiesta da definire")}</p><div class="estimate"><small>Budget percepito</small><strong>${escapeText(item.budget || "Da stimare")}</strong></div><div class="next-action"><span>→</span><div><small>${escapeText(followup)}</small><strong>Qualificare l’opportunità</strong></div></div><footer><span class="mini-avatar lilac">${escapeText(roles[currentRole].initials)}</span><span>2/8 dati</span></footer>`;
    target.prepend(article);
  });
  const total = $$(".opportunity-card").length;
  const badge = $('[data-view="opportunities"] b');
  if (badge) badge.textContent = total;
}

function openProject(projectKey) {
  const project = projects[projectKey];
  if (!project) return;
  const drawer = $("#projectDrawer");
  $("#projectDrawer header small").textContent = project.client;
  $("#projectDrawer header h2").textContent = project.title;
  const state = $("#projectDrawer .drawer-status .state-tag");
  state.textContent = project.state;
  state.className = `state-tag ${project.stateClass}`;
  $("#projectDrawer .drawer-status span:last-child").textContent = `${project.progress}% completato`;
  $("#projectDrawer .delivery-card small").textContent = project.deliveryLabel;
  $("#projectDrawer .delivery-card strong").textContent = project.delivery;
  $("#projectDrawer .delivery-card span").textContent = project.detail;
  $("#projectDrawer .delivery-card > i").textContent = `${project.progress}%`;
  const responsibilitySection = $$("#projectDrawer section")[1];
  responsibilitySection.innerHTML = `<h3>Responsabilità</h3>${project.people.map(person => `<div class="responsibility"><span class="avatar ${person[4]}">${person[0]}</span><span><strong>${escapeText(person[1])}</strong><small>${escapeText(person[2])}</small></span><em>${escapeText(person[3])}</em></div>`).join("")}<div class="responsibility missing"><span class="avatar">!</span><span><strong>${escapeText(project.missing)}</strong><small>${escapeText(project.missingText)}</small></span><em>!</em></div>`;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  activeProjectKey = projectKey;
}

function getActiveProjectTask() {
  return (projectTasks[activeProjectKey] || []).find(task => task.id === activeProjectTaskId);
}

function statusClass(status) {
  if (status === "Completata") return "done";
  if (status === "Bloccata" || status === "Da assegnare") return "blocked";
  if (status === "In revisione") return "review";
  return "production";
}

function renderProjectWorkspace() {
  const project = projects[activeProjectKey];
  const tasks = projectTasks[activeProjectKey] || [];
  const done = tasks.filter(task => task.status === "Completata").length;
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  $("#workspaceClient").textContent = project.client;
  $("#workspaceTitle").textContent = project.title;
  $("#workspaceState").textContent = project.state;
  $("#workspaceState").className = `state-tag ${project.stateClass}`;
  $("#workspaceProgress").textContent = `${progress}% task completate`;
  $("#workspaceTaskCount").textContent = `${tasks.length} task`;
  const phases = [...new Set(tasks.map(task => task.phase))];
  $("#phaseList").innerHTML = phases.map(phase => {
    const items = tasks.filter(task => task.phase === phase);
    const complete = items.filter(task => task.status === "Completata").length;
    return `<section class="phase"><header><strong>${escapeText(phase)}</strong><span>${complete}/${items.length}</span></header>${items.map(task => `<button class="phase-task${task.id === activeProjectTaskId ? " is-active" : ""}" data-project-task="${task.id}"><span class="task-dot ${task.status === "Completata" ? "done" : ""}"></span><span><strong>${escapeText(task.title)}</strong><small>${escapeText(task.assignee)} · ${escapeText(task.due || "Senza scadenza")}</small></span><em>${escapeText(task.status)}</em></button>`).join("")}</section>`;
  }).join("");
  $$('[data-project-task]').forEach(button => button.addEventListener("click", () => {
    activeProjectTaskId = button.dataset.projectTask;
    renderProjectWorkspace();
    renderTaskEditor();
  }));
  renderComments();
}

function renderTaskEditor() {
  const task = getActiveProjectTask();
  if (!task) {
    $("#taskEditor").innerHTML = `<div class="task-empty"><span>✓</span><h3>Seleziona una lavorazione</h3><p>Qui puoi gestire stato, responsabilità, scadenza, descrizione e checklist.</p></div>`;
    return;
  }
  const statusOptions = ["Non iniziata","In attesa","Da assegnare","In lavorazione","In revisione","Bloccata","Completata"];
  const assignees = ["Andrea","Simone","Martina","Luca","Da assegnare"];
  $("#taskEditor").innerHTML = `<div class="task-headline"><button class="complete-task ${task.status === "Completata" ? "is-done" : ""}" id="completeProjectTask" aria-label="Completa task">${task.status === "Completata" ? "✓" : ""}</button><div><input id="projectTaskTitle" value="${escapeText(task.title)}" aria-label="Titolo task"><div class="task-code">${escapeText(task.id.toUpperCase())} · ${escapeText(task.phase)}</div></div></div><div class="task-fields"><label>Stato<select id="projectTaskStatus">${statusOptions.map(item => `<option${item === task.status ? " selected" : ""}>${item}</option>`).join("")}</select></label><label>Responsabile<select id="projectTaskAssignee">${assignees.map(item => `<option${item === task.assignee ? " selected" : ""}>${item}</option>`).join("")}</select></label><label>Scadenza<input id="projectTaskDue" type="date" value="${escapeText(task.due)}"></label></div><div class="task-description"><label>Descrizione<textarea id="projectTaskDescription">${escapeText(task.description)}</textarea></label></div><section class="task-editor-section"><div class="checklist-head"><span>Checklist</span><button id="addChecklistItem">＋ Aggiungi step</button></div><div class="checklist">${task.checklist.map((item,index) => `<label class="check-item ${item[1] ? "done" : ""}"><input type="checkbox" data-check-index="${index}"${item[1] ? " checked" : ""}><span>${escapeText(item[0])}</span></label>`).join("")}</div></section><div class="task-save-line"><small>Le modifiche vengono salvate in questa demo.</small><span><button class="secondary-button" id="openConversation">Commenti (${task.comments.length})</button> <button class="primary-button" id="saveProjectTask">Salva modifiche</button></span></div>`;
  $("#saveProjectTask").addEventListener("click", saveActiveTask);
  $("#openConversation").addEventListener("click", () => $(".task-conversation").classList.toggle("has-content"));
  $("#completeProjectTask").addEventListener("click", () => { task.status = task.status === "Completata" ? "In lavorazione" : "Completata"; persist(); renderProjectWorkspace(); renderTaskEditor(); toast(task.status === "Completata" ? "Task completata" : "Task riaperta"); });
  $$('[data-check-index]').forEach(input => input.addEventListener("change", () => { task.checklist[Number(input.dataset.checkIndex)][1] = input.checked; persist(); renderTaskEditor(); }));
  $("#addChecklistItem").addEventListener("click", () => { const title = prompt("Nome del nuovo step"); if (title?.trim()) { task.checklist.push([title.trim(), false]); persist(); renderTaskEditor(); } });
}

function saveActiveTask() {
  const task = getActiveProjectTask();
  task.title = $("#projectTaskTitle").value.trim() || task.title;
  task.status = $("#projectTaskStatus").value;
  task.assignee = $("#projectTaskAssignee").value;
  task.due = $("#projectTaskDue").value;
  task.description = $("#projectTaskDescription").value.trim();
  persist();
  renderProjectWorkspace();
  renderTaskEditor();
  toast("Lavorazione aggiornata");
}

function renderComments() {
  const task = getActiveProjectTask();
  const comments = task?.comments || [];
  $("#commentCount").textContent = comments.length;
  $("#commentList").innerHTML = task ? (comments.length ? comments.map(comment => `<article class="comment"><span class="avatar ${comment.tone}">${escapeText(comment.initials)}</span><div class="comment-body"><div class="comment-meta"><strong>${escapeText(comment.author)}</strong><time>${escapeText(comment.time)}</time></div><p>${escapeText(comment.text)}</p>${(comment.files || []).map(file => `<div class="attachment-card"><i>▧</i><span><strong>${escapeText(file)}</strong><small>Allegato dimostrativo</small></span></div>`).join("")}</div></article>`).join("") : `<div class="task-empty"><p>Nessun commento. Inizia la conversazione su questa lavorazione.</p></div>`) : `<div class="task-empty"><p>Seleziona una lavorazione per vedere commenti e allegati.</p></div>`;
}

function openProjectWorkspace() {
  $("#projectDrawer").classList.remove("is-open");
  const tasks = projectTasks[activeProjectKey] || [];
  activeProjectTaskId = tasks.find(task => task.status !== "Completata")?.id || tasks[0]?.id || null;
  $("#projectWorkspace").classList.add("is-open");
  $("#projectWorkspace").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderProjectWorkspace();
  renderTaskEditor();
}

function closeProjectWorkspace() {
  $("#projectWorkspace").classList.remove("is-open");
  $("#projectWorkspace").setAttribute("aria-hidden", "true");
  $(".task-conversation").classList.remove("has-content");
  document.body.style.overflow = "";
}

function showNewTaskForm() {
  $("#taskEditor").innerHTML = `<div class="new-task-card"><h3>Nuova task</h3><label>Titolo<input id="newTaskTitle" placeholder="Es. Esportare versione verticale"></label><label>Fase<select id="newTaskPhase"><option>Pre-produzione</option><option>Produzione</option><option>Post-produzione</option><option>Revisione</option><option>Consegna</option></select></label><label>Responsabile<select id="newTaskAssignee"><option>Andrea</option><option>Simone</option><option>Martina</option><option>Luca</option><option>Da assegnare</option></select></label><div class="new-task-actions"><button class="secondary-button" id="cancelNewTask">Annulla</button><button class="primary-button" id="createProjectTask">Crea task</button></div></div>`;
  $("#cancelNewTask").addEventListener("click", renderTaskEditor);
  $("#createProjectTask").addEventListener("click", () => {
    const title = $("#newTaskTitle").value.trim();
    if (!title) return toast("Inserisci un titolo");
    const task = { id:`${activeProjectKey.slice(0,3)}-${Date.now().toString().slice(-4)}`, phase:$("#newTaskPhase").value, title, status:"Non iniziata", assignee:$("#newTaskAssignee").value, due:"", description:"", checklist:[], comments:[] };
    projectTasks[activeProjectKey].push(task); activeProjectTaskId = task.id; persist(); renderProjectWorkspace(); renderTaskEditor(); toast("Nuova task creata");
  });
}

function closeModal() {
  $("#opportunityModal").hidden = true;
  document.body.style.overflow = "";
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  $("#greeting").textContent = hour >= 4 && hour < 18 ? "Buongiorno" : "Buonasera";
  $("#liveTime").textContent = now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  $("#todayDate").textContent = now.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

$$('[data-view]').forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
$$('[data-view-jump]').forEach(button => button.addEventListener("click", () => showView(button.dataset.viewJump)));

const rolePopover = $("#rolePopover");
function toggleRoles(event) { event.stopPropagation(); rolePopover.hidden = !rolePopover.hidden; $("#notifications").hidden = true; }
$("#roleSwitch").addEventListener("click", toggleRoles);
$("#profileButton").addEventListener("click", toggleRoles);
$$('[data-role]').forEach(button => button.addEventListener("click", () => applyRole(button.dataset.role)));

$("#notificationButton").addEventListener("click", event => { event.stopPropagation(); const panel = $("#notifications"); panel.hidden = !panel.hidden; rolePopover.hidden = true; });
$("#closeNotifications").addEventListener("click", () => $("#notifications").hidden = true);
document.addEventListener("click", event => {
  if (!event.target.closest(".popover") && !event.target.closest("#roleSwitch") && !event.target.closest("#profileButton") && !event.target.closest("#notificationButton")) {
    rolePopover.hidden = true;
    $("#notifications").hidden = true;
  }
});

const modal = $("#opportunityModal");
$$('[data-open-modal]').forEach(button => button.addEventListener("click", () => { modal.hidden = false; document.body.style.overflow = "hidden"; setTimeout(() => modal.querySelector("input").focus(), 50); }));
$$('[data-close-modal]').forEach(button => button.addEventListener("click", closeModal));
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
$("#advancedToggle").addEventListener("click", () => {
  const fields = $("#advancedFields");
  fields.hidden = !fields.hidden;
  $("#advancedToggle").textContent = fields.hidden ? "＋ Aggiungi stima o servizi" : "− Nascondi dettagli aggiuntivi";
});
$("#opportunityForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const item = Object.fromEntries(form.entries());
  opportunities.unshift({ ...item, createdAt: Date.now() });
  persist();
  renderOpportunities();
  closeModal();
  event.currentTarget.reset();
  $("#advancedFields").hidden = true;
  $("#advancedToggle").textContent = "＋ Aggiungi stima o servizi";
  showView("opportunities");
  toast(`${item.client} aggiunto alle opportunità`);
});

$$('[data-toast]').forEach(button => button.addEventListener("click", () => toast(button.dataset.toast)));
$$('[data-task-filter]').forEach(button => button.addEventListener("click", () => { activeTaskFilter = button.dataset.taskFilter; renderTasks(); }));
$$('[data-pipeline-filter]').forEach(button => button.addEventListener("click", () => {
  const filter = button.dataset.pipelineFilter;
  $$('[data-pipeline-filter]').forEach(item => item.classList.toggle("is-active", item === button));
  $$('.opportunity-card').forEach(card => card.style.display = filter === "all" || (filter === "mine" && card.dataset.owner === roles[currentRole].name) || (filter === "late" && card.dataset.late === "true") ? "block" : "none");
}));
$("#opportunitySearch").addEventListener("input", event => {
  const query = event.target.value.toLowerCase();
  $$('.opportunity-card').forEach(card => card.style.display = card.textContent.toLowerCase().includes(query) ? "block" : "none");
});
$$('.project-row').forEach(row => row.addEventListener("click", () => openProject(row.dataset.project)));
$("#closeDrawer").addEventListener("click", () => { $("#projectDrawer").classList.remove("is-open"); $("#projectDrawer").setAttribute("aria-hidden", "true"); });
$("#openProjectWorkspace").addEventListener("click", openProjectWorkspace);
$("#closeProjectWorkspace").addEventListener("click", closeProjectWorkspace);
$("#addTaskButton").addEventListener("click", showNewTaskForm);
$("#attachmentInput").addEventListener("change", event => {
  pendingFiles = [...event.target.files].map(file => file.name);
  const existing = $(".pending-files");
  if (existing) existing.remove();
  if (pendingFiles.length) event.target.closest("div").insertAdjacentHTML("beforebegin", `<p class="pending-files">${pendingFiles.map(escapeText).join(" · ")}</p>`);
});
$("#commentForm").addEventListener("submit", event => {
  event.preventDefault();
  const task = getActiveProjectTask();
  if (!task) return toast("Seleziona prima una lavorazione");
  const field = event.currentTarget.elements.comment;
  const text = field.value.trim();
  if (!text) return;
  const role = roles[currentRole];
  task.comments.push({ author:role.name, initials:role.initials, tone:role.tone, time:"Adesso", text, files:[...pendingFiles] });
  field.value = ""; pendingFiles = []; $("#attachmentInput").value = ""; $(".pending-files")?.remove();
  persist(); renderComments(); toast("Commento pubblicato");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeModal(); closeProjectWorkspace(); $("#projectDrawer").classList.remove("is-open"); rolePopover.hidden = true; $("#notifications").hidden = true; }
});
$("#searchButton").addEventListener("click", () => toast("Ricerca globale prevista nella prossima iterazione"));

updateClock();
setInterval(updateClock, 60000);
applyRole(currentRole, false);
const initialView = location.hash.slice(1);
if (labels[initialView]) showView(initialView);
