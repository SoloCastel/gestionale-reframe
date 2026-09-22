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

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

const saved = loadState();
let currentRole = roles[saved.role] ? saved.role : "andrea";
let opportunities = Array.isArray(saved.opportunities) ? saved.opportunities : [];
let completedTasks = saved.completedTasks || {};
let activeTaskFilter = "today";

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: currentRole, opportunities, completedTasks }));
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
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeModal(); $("#projectDrawer").classList.remove("is-open"); rolePopover.hidden = true; $("#notifications").hidden = true; }
});
$("#searchButton").addEventListener("click", () => toast("Ricerca globale prevista nella prossima iterazione"));

updateClock();
setInterval(updateClock, 60000);
applyRole(currentRole, false);
const initialView = location.hash.slice(1);
if (labels[initialView]) showView(initialView);
