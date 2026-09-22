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

const opportunityData = {
  garda:{client:"Garda Sailing",service:"Foto + video regata",stage:"Da qualificare",owner:"Andrea",estimate:"€1.400–2.600",next:"Ricontattare il cliente",date:"Oggi",contact:"Giulia Rinaldi",notes:"Richiesta nata dopo un incontro al circolo. Da definire numero di giornate e utilizzo drone.",clientKey:"garda"},
  officina:{client:"Officina Maffei",service:"Nuova identità visiva",stage:"Da qualificare",owner:"Simone",estimate:"€2.800–4.200",next:"Capire perimetro e tempi",date:"Domani",contact:"Marco Maffei",notes:"Rebranding completo con possibile estensione al sito web.",clientKey:"officina"},
  pasta:{client:"Pasta Lab",service:"Campagna lancio + contenuti",stage:"In proposta",owner:"Andrea",estimate:"€1.800–2.400",next:"Call di allineamento",date:"Oggi · 14:00",contact:"Elena Rossi",notes:"Proposta quasi completa. Da validare il numero di reel e il coinvolgimento di Martina.",clientKey:"pasta"},
  vela:{client:"La Vela Resort",service:"Shooting stagionale",stage:"In proposta",owner:"Martina",estimate:"€2.200",next:"Inviare proposta finale",date:"Mercoledì",contact:"Francesca Lodi",notes:"Fotografia lifestyle e ambienti per campagna estiva.",clientKey:"vela"},
  lumea:{client:"Lumea",service:"Video prodotto + 3D",stage:"In attesa cliente",owner:"Simone",estimate:"€4.600",next:"Follow-up decisione",date:"Venerdì",contact:"Davide Conti",notes:"Proposta inviata. Il progetto operativo è bloccato in attesa dei file CAD.",clientKey:"lumea"}
};

const clientData = {
  artluce:{name:"Artluce Service",sector:"Eventi e service",owner:"Andrea Castellazzo",contact:"Paolo Bianchi",email:"produzione@artluce.it",value:"€18.600",jobs:"8",agreement:"5% commerciale sulle produzioni acquisite",projects:["artluce"],opportunities:[]},
  pasta:{name:"Pasta Lab",sector:"Food & hospitality",owner:"Simone Maffessoni",contact:"Elena Rossi",email:"marketing@pastalab.it",value:"€4.800",jobs:"2",agreement:"Nessun accordo permanente",projects:[],opportunities:["pasta"]},
  lumea:{name:"Lumea",sector:"Design prodotto",owner:"Simone Maffessoni",contact:"Davide Conti",email:"design@lumea.it",value:"€12.200",jobs:"4",agreement:"Listino 3D concordato per varianti prodotto",projects:["lumea"],opportunities:["lumea"]},
  vela:{name:"La Vela Resort",sector:"Hospitality",owner:"Martina Riva",contact:"Francesca Lodi",email:"marketing@lavelarestort.it",value:"€9.100",jobs:"5",agreement:"Produzione stagionale primavera/estate",projects:[],opportunities:["vela"]},
  garda:{name:"Garda Sailing",sector:"Sport e vela",owner:"Andrea Castellazzo",contact:"Giulia Rinaldi",email:"eventi@gardasailing.it",value:"€0",jobs:"0",agreement:"Nuovo contatto",projects:[],opportunities:["garda"]},
  officina:{name:"Officina Maffei",sector:"Industria",owner:"Simone Maffessoni",contact:"Marco Maffei",email:"info@officinamaffei.it",value:"€0",jobs:"0",agreement:"Nuovo contatto",projects:[],opportunities:["officina"]}
};

const memberData = {
  andrea:{name:"Andrea Castellazzo",initials:"AC",tone:"lilac",skills:"Visual designer · Foto · Video · 3D",availability:"Disponibile",load:"82%",capacity:"32 ore disponibili",projects:["artluce","barcolana","studio","lumea"]},
  luca:{name:"Luca Moretti",initials:"LM",tone:"peach",skills:"Videomaker · Montaggio · Motion",availability:"Sovraccarico",load:"128%",capacity:"Conflitto su 2 consegne",projects:["artluce","lumea"]},
  martina:{name:"Martina Riva",initials:"MR",tone:"mint",skills:"Graphic design · Branding",availability:"Disponibile",load:"54%",capacity:"18 ore disponibili",projects:["studio"]},
  simone:{name:"Simone Maffessoni",initials:"SM",tone:"dark",skills:"Direzione · Commerciale · PM",availability:"Limitato",load:"76%",capacity:"7 decisioni aperte",projects:["artluce","barcolana"]}
};

const taskDestinations = {
  "Selezione fotografie evento Artluce":["artluce","art-03"], "Inviare seconda versione homepage":["studio","stu-02"], "Preparare moodboard lancio prodotto":["lumea","lum-03"], "Montare teaser Artluce":["artluce","art-04"], "Esportare Barcolana v03":["barcolana","bar-02"], "Backup riprese Artluce":["artluce","art-02"], "Preparare animatic Lumea":["lumea","lum-04"], "Revisionare montaggio Barcolana":["barcolana","bar-02"], "Assegnare montaggio Artluce":["artluce","art-04"], "Aggiornare componenti Studio Nord":["studio","stu-02"]
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
let entityEdits = saved.entityEdits || {};
let activeTaskFilter = "today";
let activeProjectKey = "artluce";
let activeProjectTaskId = null;
let pendingFiles = [];

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: currentRole, opportunities, completedTasks, projectTasks, entityEdits }));
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
  closeEntityPanel();
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
  $$('.task-row .task-main').forEach(element => element.addEventListener("click", event => {
    const title = element.querySelector("strong").textContent;
    const destination = taskDestinations[title];
    if (destination) { event.preventDefault(); event.stopPropagation(); openProjectTaskDirect(destination[0], destination[1]); return; }
    if (title.includes("Garda Sailing")) { event.preventDefault(); event.stopPropagation(); openOpportunity("garda"); }
    else if (title.includes("Martina")) { event.preventDefault(); event.stopPropagation(); openOpportunity("pasta"); }
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
    const opportunityKey = `created-${item.createdAt}`;
    opportunityData[opportunityKey] = {client:item.client,service:item.request||item.service||"Da definire",stage:"Da qualificare",owner:(item.owner||"Da assegnare").split(" ")[0],estimate:item.budget||"Da stimare",next:"Qualificare l'opportunità",date:item.followup||"Da pianificare",contact:"Da inserire",notes:item.request||"",clientKey:opportunityKey};
    clientData[opportunityKey] = clientData[opportunityKey] || {name:item.client,sector:"Da definire",owner:item.owner||"Da assegnare",contact:"Da inserire",email:"",value:"€0",jobs:"0",agreement:"Nuovo contatto",projects:[],opportunities:[opportunityKey]};
    const article = document.createElement("article");
    article.className = "opportunity-card is-created";
    article.dataset.opportunity = opportunityKey;
    article.dataset.owner = item.owner.split(" ")[0];
    const initials = item.client.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    const followup = item.followup ? new Date(item.followup + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "Da pianificare";
    article.innerHTML = `<div class="card-top"><span class="client-logo purple">${escapeText(initials)}</span><small>Creata ora</small></div><h3>${escapeText(item.client)}</h3><p>${escapeText(item.request || item.service || "Richiesta da definire")}</p><div class="estimate"><small>Budget percepito</small><strong>${escapeText(item.budget || "Da stimare")}</strong></div><div class="next-action"><span>→</span><div><small>${escapeText(followup)}</small><strong>Qualificare l’opportunità</strong></div></div><footer><span class="mini-avatar lilac">${escapeText(roles[currentRole].initials)}</span><span>2/8 dati</span></footer>`;
    target.prepend(article);
  });
  const total = $$(".opportunity-card").length;
  const badge = $('[data-view="opportunities"] b');
  if (badge) badge.textContent = total;
  wireConnectedSurfaces();
}

function closeEntityPanel() {
  $("#entityPanel").classList.remove("is-open");
  $("#entityPanel").setAttribute("aria-hidden", "true");
}

function openEntityPanel(eyebrow, title, body) {
  $("#entityEyebrow").textContent = eyebrow;
  $("#entityTitle").textContent = title;
  $("#entityPanelBody").innerHTML = body;
  $("#entityPanel").classList.add("is-open");
  $("#entityPanel").setAttribute("aria-hidden", "false");
}

function linkedProjectButton(key) {
  const project = projects[key];
  return `<button class="linked-item" data-open-project="${key}"><span><strong>${escapeText(project.title)}</strong><small>${escapeText(project.client)} · ${escapeText(project.state)}</small></span><em>→</em></button>`;
}

function linkedOpportunityButton(key) {
  const item = {...opportunityData[key], ...(entityEdits[`opp-${key}`] || {})};
  return `<button class="linked-item" data-open-opportunity="${key}"><span><strong>${escapeText(item.client)}</strong><small>${escapeText(item.service)} · ${escapeText(item.stage)}</small></span><em>→</em></button>`;
}

function bindEntityLinks() {
  $$('[data-open-project]', $("#entityPanel")).forEach(button => button.addEventListener("click", () => openProjectDirect(button.dataset.openProject)));
  $$('[data-open-opportunity]', $("#entityPanel")).forEach(button => button.addEventListener("click", () => openOpportunity(button.dataset.openOpportunity)));
  $$('[data-open-member]', $("#entityPanel")).forEach(button => button.addEventListener("click", () => openMember(button.dataset.openMember)));
}

function openOpportunity(key) {
  const original = opportunityData[key];
  if (!original) return;
  const item = {...original, ...(entityEdits[`opp-${key}`] || {})};
  openEntityPanel("Opportunità commerciale", item.client, `<div class="entity-summary"><div><span>Fase</span><strong>${escapeText(item.stage)}</strong></div><div><span>Stima</span><strong>${escapeText(item.estimate)}</strong></div><div><span>Referente</span><strong>${escapeText(item.owner)}</strong></div></div><section class="entity-section"><h3>Dati e prossima azione</h3><form class="entity-form" id="opportunityDetailForm"><label>Fase<select name="stage">${["Da qualificare","In proposta","In attesa cliente","Confermata","Persa"].map(value=>`<option${value===item.stage?" selected":""}>${value}</option>`).join("")}</select></label><label>Referente<select name="owner">${["Andrea","Simone","Martina","Luca","Da assegnare"].map(value=>`<option${value===item.owner?" selected":""}>${value}</option>`).join("")}</select></label><label>Stima<input name="estimate" value="${escapeText(item.estimate)}"></label><label>Data azione<input name="date" value="${escapeText(item.date)}"></label><label class="full-field">Prossima azione<input name="next" value="${escapeText(item.next)}"></label><label class="full-field">Note<textarea name="notes">${escapeText(item.notes)}</textarea></label><button class="primary-button" type="submit">Salva opportunità</button></form></section><section class="entity-section"><h3>Cliente</h3><div class="linked-list"><button class="linked-item" data-open-client="${item.clientKey}"><span><strong>${escapeText(item.client)}</strong><small>${escapeText(item.contact)} · apri storico cliente</small></span><em>→</em></button></div></section>${key==="lumea"?`<section class="entity-section"><h3>Progetto collegato</h3><div class="linked-list">${linkedProjectButton("lumea")}</div></section>`:""}`);
  $("#opportunityDetailForm").addEventListener("submit", event => { event.preventDefault(); entityEdits[`opp-${key}`] = Object.fromEntries(new FormData(event.currentTarget)); persist(); toast("Opportunità aggiornata"); openOpportunity(key); });
  $('[data-open-client]', $("#entityPanel")).addEventListener("click", event => openClient(event.currentTarget.dataset.openClient));
  bindEntityLinks();
}

function openClient(key) {
  const client = clientData[key];
  if (!client) return;
  Object.assign(client, entityEdits[`client-${key}`] || {});
  openEntityPanel("Cliente", client.name, `<div class="entity-summary"><div><span>Valore storico</span><strong>${client.value}</strong></div><div><span>Lavori</span><strong>${client.jobs}</strong></div><div><span>Referente</span><strong>${client.owner.split(" ")[0]}</strong></div></div><section class="entity-section"><h3>Anagrafica e accordi</h3><form class="entity-form" id="clientDetailForm"><label>Contatto<input name="contact" value="${escapeText(client.contact)}"></label><label>Email<input name="email" value="${escapeText(client.email)}"></label><label class="full-field">Accordo permanente<textarea name="agreement">${escapeText(client.agreement)}</textarea></label><button type="submit" class="primary-button">Salva cliente</button></form></section><section class="entity-section"><h3>Progetti</h3><div class="linked-list">${client.projects.length?client.projects.map(linkedProjectButton).join(""):`<div class="activity-note">Nessun progetto attivo.</div>`}</div></section><section class="entity-section"><h3>Opportunità</h3><div class="linked-list">${client.opportunities.length?client.opportunities.map(linkedOpportunityButton).join(""):`<div class="activity-note">Nessuna opportunità aperta.</div>`}</div></section>`);
  $("#clientDetailForm").addEventListener("submit", event => { event.preventDefault(); Object.assign(clientData[key],Object.fromEntries(new FormData(event.currentTarget))); entityEdits[`client-${key}`]={contact:clientData[key].contact,email:clientData[key].email,agreement:clientData[key].agreement}; persist(); toast("Dati cliente salvati"); });
  bindEntityLinks();
}

function openMember(key) {
  const member = memberData[key];
  if (!member) return;
  const memberTasks = Object.entries(projectTasks).flatMap(([projectKey,tasks]) => tasks.filter(task => task.assignee === member.name.split(" ")[0]).map(task => ({...task,projectKey})));
  openEntityPanel("Membro del team", member.name, `<div class="entity-summary"><div><span>Disponibilità</span><strong>${member.availability}</strong></div><div><span>Carico</span><strong>${member.load}</strong></div><div><span>Capacità</span><strong>${member.capacity}</strong></div></div><section class="entity-section"><h3>Competenze</h3><div class="activity-note">${escapeText(member.skills)}</div></section><section class="entity-section"><h3>Lavorazioni assegnate</h3><div class="linked-list">${memberTasks.map(task=>`<button class="linked-item" data-direct-project="${task.projectKey}" data-direct-task="${task.id}"><span><strong>${escapeText(task.title)}</strong><small>${escapeText(projects[task.projectKey].client)} · ${escapeText(task.status)}</small></span><em>→</em></button>`).join("") || `<div class="activity-note">Nessuna lavorazione aperta.</div>`}</div></section><section class="entity-section"><h3>Progetti coinvolti</h3><div class="linked-list">${member.projects.map(linkedProjectButton).join("")}</div></section>`);
  $$('[data-direct-project]', $("#entityPanel")).forEach(button => button.addEventListener("click", () => openProjectTaskDirect(button.dataset.directProject, button.dataset.directTask)));
  bindEntityLinks();
}

function openProjectDirect(projectKey) {
  closeEntityPanel();
  showView("projects");
  activeProjectKey = projectKey;
  openProjectWorkspace();
}

function openProjectTaskDirect(projectKey, taskId) {
  closeEntityPanel();
  showView("projects");
  activeProjectKey = projectKey;
  openProjectWorkspace();
  if ((projectTasks[projectKey] || []).some(task => task.id === taskId)) activeProjectTaskId = taskId;
  renderProjectWorkspace(); renderTaskEditor();
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
  showWorkspaceTab("tasks");
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

function showWorkspaceTab(tabName) {
  $$('[data-workspace-tab]').forEach(button => button.classList.toggle("is-active", button.dataset.workspaceTab === tabName));
  $("#addTaskButton").style.display = tabName === "tasks" ? "block" : "none";
  if (tabName === "tasks") { renderProjectWorkspace(); renderTaskEditor(); return; }
  const tasks = projectTasks[activeProjectKey] || [];
  $("#phaseList").innerHTML = `<section class="phase"><header><strong>Riepilogo progetto</strong><span>${tasks.length}</span></header>${tasks.map(task=>`<button class="phase-task" data-summary-task="${task.id}"><span class="task-dot ${task.status==="Completata"?"done":""}"></span><span><strong>${escapeText(task.title)}</strong><small>${escapeText(task.phase)}</small></span></button>`).join("")}</section>`;
  $$('[data-summary-task]').forEach(button => button.addEventListener("click", () => { activeProjectTaskId=button.dataset.summaryTask; showWorkspaceTab("tasks"); }));
  if (tabName === "timeline") {
    const ordered = [...tasks].sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999"));
    $("#taskEditor").innerHTML = `<div class="workspace-overview"><h3>Timeline delle lavorazioni</h3><p class="subtitle">Sequenza delle scadenze e stato corrente.</p><div class="timeline-list">${ordered.map(task=>`<button class="timeline-item" data-overview-task="${task.id}"><strong>${escapeText(task.title)}</strong><small>${escapeText(task.due||"Senza scadenza")} · ${escapeText(task.assignee)} · ${escapeText(task.status)}</small></button>`).join("")}</div></div>`;
  } else if (tabName === "files") {
    const files = tasks.flatMap(task => (task.comments||[]).flatMap(comment => (comment.files||[]).map(file=>({file,task}))));
    $("#taskEditor").innerHTML = `<div class="workspace-overview"><h3>File del progetto</h3><p class="subtitle">Allegati raccolti automaticamente dalle conversazioni.</p><div class="file-grid">${files.length?files.map(item=>`<button class="file-card" data-overview-task="${item.task.id}"><span>▧</span><strong>${escapeText(item.file)}</strong><small>${escapeText(item.task.title)}</small></button>`).join(""):`<p>Nessun file allegato.</p>`}</div></div>`;
  } else {
    const project = projects[activeProjectKey];
    $("#taskEditor").innerHTML = `<div class="workspace-overview"><h3>Economia del progetto</h3><p class="subtitle">Compensi dichiarati e valore operativo dimostrativo.</p><div class="economy-grid">${project.people.map(person=>`<div class="economy-card"><span>${escapeText(person[1])} · ${escapeText(person[2])}</span><strong>${escapeText(person[3])}</strong></div>`).join("")}<div class="economy-card"><span>Avanzamento task</span><strong>${tasks.filter(task=>task.status==="Completata").length}/${tasks.length}</strong></div></div></div>`;
  }
  $("#commentList").innerHTML = `<div class="task-empty"><p>Seleziona una lavorazione per aprire la conversazione.</p></div>`;
  $$('[data-overview-task]').forEach(button => button.addEventListener("click", () => { activeProjectTaskId=button.dataset.overviewTask; showWorkspaceTab("tasks"); }));
}

function openQuickSearch() {
  openEntityPanel("Ricerca globale", "Cerca nel gestionale", `<section class="entity-section"><form class="entity-form" id="globalSearchForm"><label class="full-field">Cliente, progetto o persona<input id="globalSearchInput" placeholder="Es. Artluce, Luca, Barcolana" autofocus></label></form><div class="linked-list" id="globalSearchResults"></div></section>`);
  const input = $("#globalSearchInput");
  const render = () => {
    const query = input.value.trim().toLowerCase();
    const results = [];
    Object.entries(projects).forEach(([key,item]) => { if (`${item.client} ${item.title}`.toLowerCase().includes(query)) results.push(linkedProjectButton(key)); });
    Object.entries(clientData).forEach(([key,item]) => { if (`${item.name} ${item.sector}`.toLowerCase().includes(query)) results.push(`<button class="linked-item" data-open-client="${key}"><span><strong>${escapeText(item.name)}</strong><small>Cliente · ${escapeText(item.sector)}</small></span><em>→</em></button>`); });
    Object.entries(memberData).forEach(([key,item]) => { if (`${item.name} ${item.skills}`.toLowerCase().includes(query)) results.push(`<button class="linked-item" data-open-member="${key}"><span><strong>${escapeText(item.name)}</strong><small>Team · ${escapeText(item.skills)}</small></span><em>→</em></button>`); });
    $("#globalSearchResults").innerHTML = query ? results.slice(0,8).join("") || `<div class="activity-note">Nessun risultato.</div>` : `<div class="activity-note">Scrivi almeno una parola per iniziare.</div>`;
    $$('[data-open-client]', $("#entityPanel")).forEach(button=>button.addEventListener("click",()=>openClient(button.dataset.openClient))); bindEntityLinks();
  };
  input.addEventListener("input", render); render(); input.focus();
}

function openNewClientForm() {
  openEntityPanel("Nuovo cliente", "Crea anagrafica", `<section class="entity-section"><form class="entity-form" id="newClientForm"><label>Nome cliente<input name="name" required></label><label>Settore<input name="sector" required></label><label>Contatto<input name="contact"></label><label>Email<input name="email" type="email"></label><label>Referente<select name="owner"><option>Andrea Castellazzo</option><option>Simone Maffessoni</option><option>Martina Riva</option><option>Luca Moretti</option></select></label><label class="full-field">Accordi o note<textarea name="agreement"></textarea></label><button class="primary-button" type="submit">Crea cliente</button></form></section>`);
  $("#newClientForm").addEventListener("submit", event => {
    event.preventDefault(); const data=Object.fromEntries(new FormData(event.currentTarget)); const key=`created-${Date.now()}`;
    clientData[key]={...data,value:"€0",jobs:"0",projects:[],opportunities:[]};
    const row=document.createElement("button"); row.className="table-row"; row.dataset.client=key; row.innerHTML=`<span class="entity"><i class="client-logo blue">${escapeText(data.name.split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase())}</i><span><strong>${escapeText(data.name)}</strong><small>${escapeText(data.sector)}</small></span></span><span>${escapeText(data.owner)}</span><span>0</span><span>€0</span><span>Nuovo cliente</span>`;
    row.addEventListener("click",()=>openClient(key)); $(".client-table").append(row); closeEntityPanel(); toast(`${data.name} aggiunto ai clienti`);
  });
}

function wireConnectedSurfaces() {
  const opportunityKeys=["garda","officina","pasta","vela","lumea"];
  $$('.opportunity-card:not(.is-created)').forEach((card,index)=>{ card.dataset.opportunity=opportunityKeys[index] || "project-artluce"; if(!card.dataset.bound){card.dataset.bound="1";card.addEventListener("click",()=>card.dataset.opportunity==="project-artluce"?openProjectDirect("artluce"):openOpportunity(card.dataset.opportunity));}});
  $$('.opportunity-card.is-created').forEach(card=>{if(!card.dataset.bound){card.dataset.bound="1";card.addEventListener("click",()=>openOpportunity(card.dataset.opportunity));}});
  const clientKeys=["artluce","pasta","lumea","vela"];
  $$('.client-table .table-row').forEach((row,index)=>{row.dataset.client=row.dataset.client||clientKeys[index];if(!row.dataset.bound){row.dataset.bound="1";row.addEventListener("click",()=>openClient(row.dataset.client));}});
  const memberKeys=["andrea","luca","martina","simone"];
  $$('.member-card').forEach((card,index)=>{card.dataset.member=memberKeys[index];if(!card.dataset.bound){card.dataset.bound="1";card.addEventListener("click",()=>openMember(card.dataset.member));}});
  const calendarActions=[()=>showView("team"),()=>openOpportunity("pasta"),()=>openProjectTaskDirect("artluce","art-03"),()=>openProjectTaskDirect("studio","stu-02"),()=>openProjectTaskDirect("barcolana","bar-02"),()=>openOpportunity("vela"),()=>openOpportunity("lumea"),()=>openProjectTaskDirect("artluce","art-05")];
  $$('.calendar-event').forEach((event,index)=>{event.dataset.category=["team","commercial","work","delivery","work","commercial","commercial","delivery"][index];event.tabIndex=0;if(!event.dataset.bound){event.dataset.bound="1";event.addEventListener("click",calendarActions[index]);event.addEventListener("keydown",e=>{if(e.key==="Enter")calendarActions[index]();});}});
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

$("#searchButton").replaceWith($("#searchButton").cloneNode(true));
$("#searchButton").addEventListener("click", openQuickSearch);
$("#closeEntityPanel").addEventListener("click", closeEntityPanel);
$("#newClientButton").addEventListener("click", openNewClientForm);
$("#availabilityButton").addEventListener("click", () => openMember(currentRole));
$("#findPersonButton").addEventListener("click", () => { showView("team"); openMember("luca"); });
$('[data-decision="pasta"]').addEventListener("click", () => openOpportunity("pasta"));
$('[data-decision="barcolana"]').addEventListener("click", () => openProjectTaskDirect("barcolana","bar-02"));
$('[data-decision="luca"]').addEventListener("click", () => openMember("luca"));
$$('[data-workspace-tab]').forEach(button => button.addEventListener("click", () => showWorkspaceTab(button.dataset.workspaceTab)));

const projectFilterModes=["all","review","blocked","archive"];
$$('.project-filters button').forEach((button,index)=>button.addEventListener("click",()=>{
  $$('.project-filters button').forEach(item=>item.classList.toggle("is-active",item===button));
  const mode=projectFilterModes[index];
  $$('.project-row').forEach(row=>{ const key=row.dataset.project; const visible=mode==="all"||(mode==="review"&&projects[key].stateClass==="review")||(mode==="blocked"&&projects[key].stateClass==="blocked"); row.classList.toggle("is-filtered",!visible); });
  if(mode==="archive") toast("Nessun progetto concluso in questa demo");
}));
$("#projectArchive").addEventListener("click",()=>$$('.project-filters button')[3].click());

const calendarModes=["all","delivery","team","commercial"];
$$('.calendar-mode button').forEach((button,index)=>button.addEventListener("click",()=>{
  $$('.calendar-mode button').forEach(item=>item.classList.toggle("is-active",item===button));
  const mode=calendarModes[index]; $$('.calendar-event').forEach(event=>event.style.display=mode==="all"||event.dataset.category===mode?"block":"none");
}));
let calendarOffset=0;
const calendarControlButtons=$$('.calendar-controls button');
function updateCalendarWeek(){ const days=$$('.day-column header strong'); days.forEach((day,index)=>day.textContent=String(21+index+calendarOffset*7)); $$('.calendar-event').forEach(event=>event.style.opacity=calendarOffset===0?"1":".16"); calendarControlButtons[1].textContent=calendarOffset===0?"Questa settimana":calendarOffset<0?"Settimana precedente":"Settimana successiva"; }
calendarControlButtons[0].addEventListener("click",()=>{calendarOffset--;updateCalendarWeek();}); calendarControlButtons[1].addEventListener("click",()=>{calendarOffset=0;updateCalendarWeek();}); calendarControlButtons[2].addEventListener("click",()=>{calendarOffset++;updateCalendarWeek();});

const notificationActions=[()=>openProjectTaskDirect("artluce","art-04"),()=>openProjectTaskDirect("barcolana","bar-02"),()=>openOpportunity("vela")];
$$('#notifications>button').forEach((button,index)=>button.addEventListener("click",()=>{ $("#notifications").hidden=true; notificationActions[index](); }));
const financeActions=[()=>openProjectDirect("artluce"),()=>openProjectDirect("studio"),()=>openProjectDirect("barcolana")];
$$('.finance-list button').forEach((button,index)=>button.addEventListener("click",financeActions[index]));
$("#exportFinance").addEventListener("click",()=>{ const csv="Voce,Importo\nConcordato,31900\nFatturato,25100\nIncassato,18300\nDistribuito,11840"; const link=document.createElement("a"); link.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); link.download="reframe-riepilogo-economico.csv"; link.click(); URL.revokeObjectURL(link.href); toast("Riepilogo CSV esportato"); });
$(".period-select").addEventListener("change",event=>{ const values={"Ultimi 6 mesi":["€92.400","38%","86%","41%"],"Questo mese":["€18.300","42%","91%","46%"],"Quest'anno":["€146.800","39%","84%","43%"]}; $$("#view-insights .metric-row strong").forEach((item,index)=>item.textContent=values[event.target.value][index]); toast(`Insight aggiornati: ${event.target.value.toLowerCase()}`); });

const clientSearch=$("#view-clients .search-field input");
clientSearch.addEventListener("input",()=>{const q=clientSearch.value.toLowerCase();$$('.client-table .table-row').forEach(row=>row.style.display=row.textContent.toLowerCase().includes(q)?"grid":"none");});
$$('#view-clients .filter-button').forEach((button,index)=>button.addEventListener("click",()=>{ $$('#view-clients .filter-button').forEach(item=>item.classList.toggle("is-active",item===button)); $$('.client-table .table-row').forEach((row,rowIndex)=>row.style.display=index===0||(index===1&&rowIndex!==1)||(index===2&&(rowIndex===0||rowIndex===2||rowIndex===3))?"grid":"none"); }));

wireConnectedSurfaces();

updateClock();
setInterval(updateClock, 60000);
applyRole(currentRole, false);
const initialView = location.hash.slice(1);
if (labels[initialView]) showView(initialView);
