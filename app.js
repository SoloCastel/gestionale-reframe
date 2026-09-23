const STORAGE_KEY = "reframe-live-v1";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const uid = prefix => prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = value => new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Number(value)||0);
const todayIso = () => new Date().toISOString().slice(0,10);
const dateLabel = value => value ? new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"short",year:"numeric"}).format(new Date(value+"T12:00:00")) : "Senza scadenza";
const initials = name => (name||"?").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();

const emptyState = {activeMemberId:null,team:[],clients:[],services:[],opportunities:[],projects:[]};
function load(){
  try{
    const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!parsed) return structuredClone(emptyState);
    return {...structuredClone(emptyState),...parsed,team:parsed.team||[],clients:parsed.clients||[],services:parsed.services||[],opportunities:parsed.opportunities||[],projects:parsed.projects||[]};
  }catch{return structuredClone(emptyState)}
}
let state=load(), currentView=(location.hash.slice(1)||"today"), projectScope="all", projectStatus="open", opportunityFilter="all", myFilter="all";
const labels={today:"Oggi",mywork:"Il mio lavoro",opportunities:"Opportunità",projects:"Progetti",calendar:"Calendario",clients:"Clienti",team:"Team",services:"Servizi e listini",finance:"Amministrazione",insights:"Insight"};
const stages=["Da qualificare","In proposta","In attesa cliente","Confermata"];
const statusMap={open:"Aperto",review:"In revisione",blocked:"Bloccato",done:"Concluso"};
const taskStatuses=["Da fare","In lavorazione","In revisione","Bloccata","Completata"];
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function member(id){return state.team.find(x=>x.id===id)}
function client(id){return state.clients.find(x=>x.id===id)}
function service(id){return state.services.find(x=>x.id===id)}
function project(id){return state.projects.find(x=>x.id===id)}
function activeMember(){return member(state.activeMemberId)}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
function btn(label,action,kind="primary"){return `<button class="button ${kind}" data-action="${action}">${label}</button>`}
function avatar(person){return `<span class="avatar">${esc(person?.initials||initials(person?.name))}</span>`}
function empty(title,text,action,label){return `<div class="empty"><b>${title}</b><span>${text}</span>${action?btn(label,action):""}</div>`}
function heading(kicker,title,subtitle,action,label){return `<div class="heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${subtitle}</p></div>${action?btn(label,action):""}</div>`}
function options(items,current,placeholder="Seleziona"){return `<option value="">${placeholder}</option>`+items.map(x=>`<option value="${x.id}" ${x.id===current?"selected":""}>${esc(x.name)}</option>`).join("")}
function formActions(deleteAction){return `<div class="form-actions">${deleteAction?`<button type="button" class="button danger" data-action="${deleteAction}">Elimina</button>`:""}<button type="button" class="button secondary" data-action="close-sheet">Annulla</button><button class="button primary">Salva</button></div>`}

function profileRender(){
  const person=activeMember();
  $("#profileAvatar").textContent=$("#topAvatar").textContent=person?.initials||initials(person?.name);
  $("#profileName").textContent=person?.name||"Configura profilo";
  $("#profileRole").textContent=person?.role||"Nessuna persona selezionata";
  $("#topName").textContent=person?.name?.split(" ")[0]||"Profilo";
  $("#profileOptions").innerHTML=state.team.length?state.team.map(x=>`<button data-profile="${x.id}">${avatar(x)}<span><strong>${esc(x.name)}</strong><small>${esc(x.role||"Membro del team")}</small></span></button>`).join(""):`<button data-action="new-member">＋ Crea la prima persona</button>`;
  $("#myCount").textContent=myItems().length;
}
function navRender(){
  const keys=["today","mywork","opportunities","projects","calendar","clients","team","services","finance","insights"];
  $("#mobileNav").innerHTML=keys.slice(0,8).map(k=>`<button data-view="${k}" class="${k===currentView?"active":""}">${labels[k]}</button>`).join("");
  $$('[data-view]').forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
}
function showView(view){
  if(!labels[view]) view="today";
  currentView=view; location.hash=view;
  $$(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+view));
  $("#viewLabel").textContent=labels[view];
  navRender(); renderView(view); window.scrollTo({top:0,behavior:"smooth"});
}
function renderAll(){profileRender();navRender();renderView(currentView)}
function renderView(view){
  ({today:renderToday,mywork:renderMyWork,opportunities:renderOpportunities,projects:renderProjects,calendar:renderCalendar,clients:renderClients,team:renderTeam,services:renderServices,finance:renderFinance,insights:renderInsights}[view]||renderToday)();
}

function allTasks(){return state.projects.flatMap(p=>(p.tasks||[]).map(t=>({...t,projectId:p.id,projectTitle:p.title,clientId:p.clientId})))}
function myItems(){
  if(!state.activeMemberId)return[];
  const tasks=allTasks().filter(t=>t.assigneeId===state.activeMemberId&&t.status!=="Completata").map(t=>({...t,type:"task"}));
  const opps=state.opportunities.filter(o=>o.ownerId===state.activeMemberId&&o.stage!=="Confermata").map(o=>({id:o.id,title:o.nextAction||"Aggiorna opportunità",due:o.followup,status:o.stage,type:"opportunity",clientId:o.clientId}));
  return [...tasks,...opps].sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999"));
}
function renderToday(){
  const root=$("#view-today"), person=activeMember(), open=state.projects.filter(p=>p.status!=="done"), mine=myItems();
  if(!state.team.length&&!state.clients.length&&!state.services.length){
    root.innerHTML=heading("Primo accesso","Costruiamo ReFrame.","La struttura è pronta e completamente vuota. Inserisci i dati reali nell’ordine più naturale per iniziare.",null)+`<div class="setup-grid">
      <button class="setup-card" data-action="new-member"><b>1</b><strong>Crea il team</strong><small>Inserisci le persone, i ruoli e le competenze.</small></button>
      <button class="setup-card" data-action="new-service"><b>2</b><strong>Definisci i servizi</strong><small>Aggiungi il catalogo e il prezzo di ogni persona.</small></button>
      <button class="setup-card" data-action="new-client"><b>3</b><strong>Registra un cliente</strong><small>Puoi partire anche da poche informazioni.</small></button>
      <button class="setup-card" data-action="new-opportunity"><b>4</b><strong>Apri un’opportunità</strong><small>Trasformala poi in un progetto operativo.</small></button>
    </div>`;
    return;
  }
  const greeting=new Date().getHours()>=4&&new Date().getHours()<18?"Buongiorno":"Buonasera";
  root.innerHTML=heading(new Intl.DateTimeFormat("it-IT",{weekday:"long",day:"numeric",month:"long"}).format(new Date()),`${greeting}${person?", "+esc(person.name.split(" ")[0]):""}.`,person?"Qui trovi ciò che richiede la tua attenzione, con accesso diretto al contesto.":"Seleziona un profilo per attivare la vista personale.","new-opportunity","＋ Nuova opportunità")+`
  <div class="metrics"><article class="metric"><span>Progetti aperti</span><strong>${open.length}</strong><small>Visibili a tutto il team</small></article><article class="metric"><span>Le mie attività</span><strong>${mine.length}</strong><small>Task e follow-up aperti</small></article><article class="metric"><span>Opportunità</span><strong>${state.opportunities.filter(o=>o.stage!=="Confermata").length}</strong><small>Pipeline attiva</small></article><article class="metric"><span>Clienti</span><strong>${state.clients.length}</strong><small>Anagrafiche registrate</small></article></div>
  <div class="grid-2"><article class="panel"><div class="panel-head"><div><h2>Il mio lavoro</h2><p>Solo ciò in cui sei personalmente coinvolto</p></div><button class="button secondary" data-view="mywork">Apri il feed</button></div>${feedHtml(mine.slice(0,6),true)}</article>
  <article class="panel"><div class="panel-head"><div><h2>Agenda e scadenze</h2><p>Le prossime attività</p></div><button class="button secondary" data-view="calendar">Calendario</button></div>${feedHtml(allTasks().filter(t=>t.status!=="Completata").sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")).slice(0,6),false)}</article></div>`;
}
function feedHtml(items,personal){
  if(!items.length)return empty(personal?"Nessuna attività personale":"Nessuna scadenza",personal?"Le task assegnate a te compariranno qui.":"Le task dei progetti compariranno qui.",null);
  return `<div class="feed">`+items.map(x=>`<article class="feed-item" data-open-${x.type==="opportunity"?"opportunity":"task"}="${x.type==="opportunity"?x.id:x.projectId+":"+x.id}"><span class="check"></span><div><h3>${esc(x.title)}</h3><p>${x.type==="opportunity"?"Opportunità · "+esc(client(x.clientId)?.name||"Cliente"):esc(x.projectTitle||project(x.projectId)?.title||"Progetto")+" · "+esc(x.status)}</p></div><time>${dateLabel(x.due)}</time></article>`).join("")+`</div>`;
}
function renderMyWork(){
  const root=$("#view-mywork"),person=activeMember(),items=myItems();
  const filtered=items.filter(x=>myFilter==="all"||(myFilter==="late"&&x.due&&x.due<todayIso())||(myFilter==="today"&&x.due===todayIso())||x.type===myFilter);
  root.innerHTML=heading("Spazio personale","Il mio lavoro",person?`Tutto ciò che riguarda ${esc(person.name)}, in un unico feed ordinato per scadenza.`:"Seleziona una persona per vedere la sua vista personale.",null)+`
  <div class="toolbar"><div class="scope"><button data-my-filter="all" class="${myFilter==="all"?"active":""}">Tutto</button><button data-my-filter="late" class="${myFilter==="late"?"active":""}">In ritardo</button><button data-my-filter="today" class="${myFilter==="today"?"active":""}">Oggi</button><button data-my-filter="task" class="${myFilter==="task"?"active":""}">Task</button><button data-my-filter="opportunity" class="${myFilter==="opportunity"?"active":""}">Commerciale</button></div></div>
  ${person?feedHtml(filtered,true):empty("Profilo personale non selezionato","Scegli il tuo nome dal selettore in alto per attivare questa vista.","new-member","Gestisci il team")}`;
}
function estimateFor(serviceId){
  const s=service(serviceId),values=(s?.prices||[]).map(p=>Number(p.price)).filter(Boolean);
  if(!values.length)return"Da stimare";
  return values.length===1?money(values[0]):money(Math.min(...values))+" – "+money(Math.max(...values));
}
function renderOpportunities(){
  const root=$("#view-opportunities");
  const filtered=state.opportunities.filter(o=>opportunityFilter==="all"||(opportunityFilter==="mine"&&o.ownerId===state.activeMemberId)||(opportunityFilter==="late"&&o.followup&&o.followup<todayIso()));
  root.innerHTML=heading("Commerciale","Opportunità","Ogni possibilità ha un referente, una stima e una prossima azione.","new-opportunity","＋ Nuova opportunità")+`
  <div class="metrics"><article class="metric"><span>Pipeline</span><strong>${money(state.opportunities.reduce((s,o)=>s+(Number(o.budget)||0),0))}</strong><small>Valore indicativo</small></article><article class="metric"><span>Aperte</span><strong>${state.opportunities.filter(o=>o.stage!=="Confermata").length}</strong><small>Da seguire</small></article><article class="metric"><span>Da sollecitare</span><strong>${state.opportunities.filter(o=>o.followup&&o.followup<todayIso()&&o.stage!=="Confermata").length}</strong><small>Follow-up scaduti</small></article><article class="metric"><span>Confermate</span><strong>${state.opportunities.filter(o=>o.stage==="Confermata").length}</strong><small>Pronte per il progetto</small></article></div>
  <div class="toolbar"><div class="scope"><button data-opp-filter="all" class="${opportunityFilter==="all"?"active":""}">Tutte</button><button data-opp-filter="mine" class="${opportunityFilter==="mine"?"active":""}">Solo mie</button><button data-opp-filter="late" class="${opportunityFilter==="late"?"active":""}">Da sollecitare</button></div></div>
  <div class="kanban">${stages.map(stage=>{const list=filtered.filter(o=>o.stage===stage);return `<section class="column"><header><span>${stage}</span><b>${list.length}</b></header>${list.map(o=>`<article class="opportunity" data-open-opportunity="${o.id}"><small>${esc(member(o.ownerId)?.name||"Da assegnare")}</small><h3>${esc(client(o.clientId)?.name||o.clientName||"Nuovo cliente")}</h3><p>${esc(service(o.serviceId)?.name||o.request||"Servizio da definire")}</p><strong>${o.budget?money(o.budget):estimateFor(o.serviceId)}</strong><footer><span>${esc(o.nextAction||"Nessuna azione")}</span><span>${dateLabel(o.followup)}</span></footer></article>`).join("")||`<div class="empty"><span>Nessuna opportunità</span></div>`}</section>`}).join("")}</div>`;
}
function projectRelevant(p){return(p.memberIds||[]).includes(state.activeMemberId)||(p.tasks||[]).some(t=>t.assigneeId===state.activeMemberId)}
function renderProjects(){
  const root=$("#view-projects"),counts={open:0,review:0,blocked:0,done:0};state.projects.forEach(p=>counts[p.status||"open"]++);
  const filtered=state.projects.filter(p=>(p.status||"open")===projectStatus&&(projectScope==="all"||projectRelevant(p)));
  root.innerHTML=heading("Produzione","Progetti","Tutti vedono i progetti aperti. Il filtro personale riduce la vista a ciò che ti riguarda.","new-project","＋ Nuovo progetto")+`
  <div class="toolbar"><div class="scope"><button data-project-scope="all" class="${projectScope==="all"?"active":""}">Tutti i progetti</button><button data-project-scope="mine" class="${projectScope==="mine"?"active":""}">Solo i miei</button></div><div class="filters">${Object.entries(statusMap).map(([k,v])=>`<button data-project-status="${k}" class="${projectStatus===k?"active":""}">${v} · ${counts[k]}</button>`).join("")}</div></div>
  <div class="list">${filtered.map(p=>{const tasks=p.tasks||[],done=tasks.filter(t=>t.status==="Completata").length;return `<article class="record" data-open-project="${p.id}"><div class="identity"><span class="logo">${initials(client(p.clientId)?.name||p.title)}</span><div><small>${esc(client(p.clientId)?.name||"Senza cliente")}</small><strong>${esc(p.title)}</strong></div></div><div><span class="pill ${p.status==="blocked"?"red":p.status==="done"?"green":""}">${statusMap[p.status||"open"]}</span></div><div><small>Avanzamento</small><strong>${done}/${tasks.length} task</strong></div><button class="icon">→</button></article>`}).join("")||empty("Nessun progetto in questa vista",projectScope==="mine"?"Non risultano progetti che coinvolgono il profilo selezionato.":"Crea il primo progetto o cambia filtro.","new-project","Nuovo progetto")}</div>`;
}
function renderCalendar(){
  const root=$("#view-calendar"),events=allTasks().filter(t=>t.due);
  const start=new Date();start.setDate(start.getDate()-((start.getDay()+6)%7));
  const days=[...Array(28)].map((_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d});
  root.innerHTML=heading("Pianificazione","Calendario","Ogni scadenza apre direttamente la task nel suo progetto.",null)+`<div class="calendar">${days.map(d=>{const iso=d.toISOString().slice(0,10),list=events.filter(e=>e.due===iso);return `<div class="day"><small>${new Intl.DateTimeFormat("it-IT",{weekday:"short",day:"numeric"}).format(d)}</small>${list.map(e=>`<button class="event" data-open-task="${e.projectId}:${e.id}">${esc(e.title)}</button>`).join("")}</div>`}).join("")}</div>`;
}
function renderClients(){
  const root=$("#view-clients");
  root.innerHTML=heading("Anagrafiche","Clienti","Contatti, dati fiscali, progetti e opportunità nello stesso posto.","new-client","＋ Nuovo cliente")+`<div class="list">${state.clients.map(c=>`<article class="record" data-open-client="${c.id}"><div class="identity"><span class="logo">${initials(c.name)}</span><div><strong>${esc(c.name)}</strong><small>${esc(c.sector||"Settore non indicato")}</small></div></div><div><small>Referente</small><strong>${esc(c.contact||"—")}</strong></div><div><small>Attività</small><strong>${state.projects.filter(p=>p.clientId===c.id).length} progetti · ${state.opportunities.filter(o=>o.clientId===c.id).length} opportunità</strong></div><button class="icon">→</button></article>`).join("")||empty("Nessun cliente","Aggiungi anche un’anagrafica minima; potrai completarla in seguito.","new-client","Nuovo cliente")}</div>`;
}
function renderTeam(){
  const root=$("#view-team");
  root.innerHTML=heading("Persone","Team","Ogni persona ha ruolo, competenze e un listino individuale.","new-member","＋ Nuova persona")+`<div class="cards">${state.team.map(p=>`<article class="person" data-open-member="${p.id}"><div class="person-head">${avatar(p)}<div><h3>${esc(p.name)}</h3><small>${esc(p.role||"Ruolo da definire")}</small></div></div><p>${esc(p.skills||"Competenze da inserire")}</p><span class="pill ${p.id===state.activeMemberId?"green":""}">${p.id===state.activeMemberId?"Profilo attivo":p.availability||"Disponibilità non indicata"}</span></article>`).join("")||empty("Nessuna persona","Inserisci i membri dell’hub per assegnare lavori e definire i listini.","new-member","Crea la prima persona")}</div>`;
}
function renderServices(){
  const root=$("#view-services");
  root.innerHTML=heading("Catalogo","Servizi e listini","Uno stesso servizio può avere prezzi diversi per ogni professionista.","new-service","＋ Nuovo servizio")+`<div class="cards">${state.services.map(s=>`<article class="service" data-open-service="${s.id}"><small>${esc(s.category||"Senza categoria")}</small><h3>${esc(s.name)}</h3><p>${esc(s.description||"Nessuna descrizione")}</p><div class="prices">${(s.prices||[]).filter(p=>Number(p.price)).map(p=>`<div class="price-row"><span>${esc(member(p.memberId)?.name||"Persona rimossa")}</span><strong>${money(p.price)} ${s.unit?"/ "+esc(s.unit):""}</strong></div>`).join("")||"<small>Nessun prezzo inserito</small>"}</div></article>`).join("")||empty("Nessun servizio","Crea il catalogo e assegna un prezzo diverso a ogni persona.","new-service","Nuovo servizio")}</div>`;
}
function renderFinance(){
  const root=$("#view-finance"),projects=state.projects.filter(p=>p.status==="done"||p.budget);
  root.innerHTML=heading("Economia","Amministrazione","Valori economici derivati dai progetti reali inseriti.",null)+`<div class="metrics"><article class="metric"><span>Valore progetti</span><strong>${money(state.projects.reduce((s,p)=>s+(Number(p.budget)||0),0))}</strong><small>Totale concordato</small></article><article class="metric"><span>Conclusi</span><strong>${state.projects.filter(p=>p.status==="done").length}</strong><small>Pronti per la fatturazione</small></article><article class="metric"><span>In corso</span><strong>${state.projects.filter(p=>p.status!=="done").length}</strong><small>Progetti operativi</small></article><article class="metric"><span>Collaboratori</span><strong>${state.team.length}</strong><small>Persone registrate</small></article></div>${projects.length?`<div class="list">${projects.map(p=>`<article class="record" data-open-project="${p.id}"><div class="identity"><span class="logo">€</span><div><strong>${esc(p.title)}</strong><small>${esc(client(p.clientId)?.name||"Senza cliente")}</small></div></div><div><span class="pill">${statusMap[p.status]}</span></div><div><strong>${money(p.budget)}</strong></div><button class="icon">→</button></article>`).join("")}</div>`:empty("Nessun dato economico","I valori compariranno quando inserirai budget nei progetti.",null)}`;
}
function renderInsights(){
  const root=$("#view-insights"),done=state.projects.filter(p=>p.status==="done"),serviceCounts=state.services.map(s=>({name:s.name,count:state.opportunities.filter(o=>o.serviceId===s.id).length})).sort((a,b)=>b.count-a.count);
  root.innerHTML=heading("Analisi","Insight","Una lettura semplice dei dati reali accumulati nel tempo.",null)+`<div class="metrics"><article class="metric"><span>Tasso di conferma</span><strong>${state.opportunities.length?Math.round(state.opportunities.filter(o=>o.stage==="Confermata").length/state.opportunities.length*100):0}%</strong><small>Opportunità confermate</small></article><article class="metric"><span>Valore medio progetto</span><strong>${money(state.projects.length?state.projects.reduce((s,p)=>s+(Number(p.budget)||0),0)/state.projects.length:0)}</strong><small>Su ${state.projects.length} progetti</small></article><article class="metric"><span>Task completate</span><strong>${allTasks().filter(t=>t.status==="Completata").length}</strong><small>Su ${allTasks().length} totali</small></article><article class="metric"><span>Lavori conclusi</span><strong>${done.length}</strong><small>Storico operativo</small></article></div><article class="panel"><div class="panel-head"><div><h2>Servizi più richiesti</h2><p>In base alle opportunità registrate</p></div></div>${serviceCounts.some(x=>x.count)?`<div class="list">${serviceCounts.filter(x=>x.count).map(x=>`<div class="price-row"><span>${esc(x.name)}</span><strong>${x.count}</strong></div>`).join("")}</div>`:empty("Dati non ancora sufficienti","Gli insight si costruiranno man mano che userete il gestionale.",null)}</article>`;
}

function openSheet(eyebrow,title,html){
  $("#sheetEyebrow").textContent=eyebrow;$("#sheetTitle").textContent=title;$("#sheetBody").innerHTML=html;
  $("#backdrop").hidden=false;$("#sheet").classList.add("open");$("#sheet").setAttribute("aria-hidden","false");
}
function closeSheet(){$("#sheet").classList.remove("open");$("#sheet").setAttribute("aria-hidden","true");setTimeout(()=>$("#backdrop").hidden=true,220)}
function openModal(title,html){$("#modalTitle").textContent=title;$("#modalBody").innerHTML=html;$("#modalWrap").hidden=false}
function closeModal(){$("#modalWrap").hidden=true}
function memberForm(item={}){
  openSheet("Team",item.id?"Modifica persona":"Nuova persona",`<form class="form" data-form="member" data-id="${item.id||""}"><div class="form-grid"><label>Nome e cognome<input required name="name" value="${esc(item.name||"")}"></label><label>Ruolo<input name="role" value="${esc(item.role||"")}" placeholder="es. Videomaker, commerciale"></label></div><label>Email<input type="email" name="email" value="${esc(item.email||"")}"></label><label>Competenze<textarea name="skills" placeholder="Foto, video, montaggio…">${esc(item.skills||"")}</textarea></label><label>Disponibilità<select name="availability"><option>Disponibile</option><option>Limitata</option><option>Non disponibile</option></select></label>${formActions(item.id?"delete-member:"+item.id:"")}</form>`);
  if(item.availability)$('[name="availability"]').value=item.availability;
}
function clientForm(item={}){
  openSheet("Clienti",item.id?"Modifica cliente":"Nuovo cliente",`<form class="form" data-form="client" data-id="${item.id||""}"><div class="form-grid"><label>Ragione sociale / nome<input required name="name" value="${esc(item.name||"")}"></label><label>Settore<input name="sector" value="${esc(item.sector||"")}"></label><label>Referente<input name="contact" value="${esc(item.contact||"")}"></label><label>Email<input type="email" name="email" value="${esc(item.email||"")}"></label><label>Partita IVA<input name="vat" value="${esc(item.vat||"")}"></label><label>Codice fiscale<input name="taxCode" value="${esc(item.taxCode||"")}"></label></div><label>Indirizzo<input name="address" value="${esc(item.address||"")}"></label><label>Note<textarea name="notes">${esc(item.notes||"")}</textarea></label>${formActions(item.id?"delete-client:"+item.id:"")}</form>`);
}
function serviceForm(item={}){
  openSheet("Catalogo",item.id?"Modifica servizio":"Nuovo servizio",`<form class="form" data-form="service" data-id="${item.id||""}"><div class="form-grid"><label>Nome servizio<input required name="name" value="${esc(item.name||"")}"></label><label>Categoria<input name="category" value="${esc(item.category||"")}"></label><label>Unità di prezzo<input name="unit" value="${esc(item.unit||"")}" placeholder="servizio, giornata, ora…"></label></div><label>Descrizione<textarea name="description">${esc(item.description||"")}</textarea></label><h3>Listino per persona</h3>${state.team.length?`<div class="form-grid">${state.team.map(p=>`<label>${esc(p.name)}<input type="number" min="0" step="10" name="price-${p.id}" value="${(item.prices||[]).find(x=>x.memberId===p.id)?.price||""}" placeholder="€"></label>`).join("")}</div>`:`<div class="empty"><span>Inserisci prima le persone del team per creare i listini individuali.</span></div>`}${formActions(item.id?"delete-service:"+item.id:"")}</form>`);
}
function opportunityForm(item={}){
  const isEdit=!!item.id;
  openModal(isEdit?"Modifica opportunità":"Nuova opportunità",`<form class="form" data-form="opportunity" data-id="${item.id||""}"><div class="form-grid"><label>Cliente<select name="clientId">${options(state.clients,item.clientId,"Nuovo cliente rapido")}</select></label><label>Nuovo cliente<input name="clientName" value="${esc(item.clientName||"")}" placeholder="Usa se non è già registrato"></label><label>Servizio<select name="serviceId">${options(state.services,item.serviceId,"Da definire")}</select></label><label>Referente interno<select name="ownerId">${options(state.team,item.ownerId,"Da assegnare")}</select></label><label>Fase<select name="stage">${stages.map(s=>`<option ${s===(item.stage||stages[0])?"selected":""}>${s}</option>`).join("")}</select></label><label>Budget indicativo (€)<input type="number" min="0" name="budget" value="${item.budget||""}"></label><label>Follow-up<input type="date" name="followup" value="${item.followup||""}"></label><label>Prossima azione<input name="nextAction" value="${esc(item.nextAction||"")}"></label></div><label>Richiesta / note<textarea name="request">${esc(item.request||"")}</textarea></label><div class="form-actions">${isEdit?`<button type="button" class="button danger" data-action="delete-opportunity:${item.id}">Elimina</button>`:""}<button type="button" class="button secondary" data-action="close-modal">Annulla</button>${isEdit&&item.stage==="Confermata"?`<button type="button" class="button secondary" data-action="convert-opportunity:${item.id}">Crea progetto</button>`:""}<button class="button primary">Salva</button></div></form>`);
}
function projectForm(item={}){
  openSheet("Progetti",item.id?"Modifica progetto":"Nuovo progetto",`<form class="form" data-form="project" data-id="${item.id||""}"><label>Titolo<input required name="title" value="${esc(item.title||"")}"></label><div class="form-grid"><label>Cliente<select name="clientId" required>${options(state.clients,item.clientId,"Seleziona cliente")}</select></label><label>Stato<select name="status">${Object.entries(statusMap).map(([k,v])=>`<option value="${k}" ${(item.status||"open")===k?"selected":""}>${v}</option>`).join("")}</select></label><label>Inizio<input type="date" name="start" value="${item.start||""}"></label><label>Consegna<input type="date" name="due" value="${item.due||""}"></label><label>Budget concordato (€)<input type="number" min="0" name="budget" value="${item.budget||""}"></label></div><label>Descrizione<textarea name="description">${esc(item.description||"")}</textarea></label><h3>Persone coinvolte</h3><div class="check-grid">${state.team.map(p=>`<label><input type="checkbox" name="memberIds" value="${p.id}" ${(item.memberIds||[]).includes(p.id)?"checked":""}>${esc(p.name)}</label>`).join("")||"<small>Nessuna persona registrata</small>"}</div>${formActions(item.id?"delete-project:"+item.id:"")}</form>`);
}
function openProject(id,taskId){
  const p=project(id);if(!p)return;
  const tasks=p.tasks||[], selected=tasks.find(t=>t.id===taskId)||tasks[0];
  openSheet("Progetto",p.title,`<div class="toolbar"><div><span class="pill">${statusMap[p.status||"open"]}</span> <small>${esc(client(p.clientId)?.name||"Senza cliente")} · ${dateLabel(p.due)}</small></div><button class="button secondary" data-action="edit-project:${p.id}">Modifica progetto</button></div><div class="task-board"><div class="task-list"><button class="button primary" data-action="new-task:${p.id}">＋ Nuova task</button>${tasks.map(t=>`<button class="task-button ${selected?.id===t.id?"active":""}" data-open-task="${p.id}:${t.id}"><strong>${esc(t.title)}</strong><small>${esc(t.status)}</small></button>`).join("")||`<div class="empty"><span>Nessuna task</span></div>`}</div><div id="taskDetail">${selected?taskEditor(p,selected):empty("Progetto pronto","Aggiungi la prima lavorazione per iniziare.","new-task:"+p.id,"Nuova task")}</div></div>`);
}
function taskEditor(p,t){
  return `<form class="form task-editor" data-form="task" data-project="${p.id}" data-id="${t.id}"><label>Titolo<input required name="title" value="${esc(t.title)}"></label><div class="form-grid"><label>Fase<input name="phase" value="${esc(t.phase||"")}"></label><label>Stato<select name="status">${taskStatuses.map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select></label><label>Assegnata a<select name="assigneeId">${options(state.team,t.assigneeId,"Da assegnare")}</select></label><label>Scadenza<input type="date" name="due" value="${t.due||""}"></label></div><label>Descrizione<textarea name="description">${esc(t.description||"")}</textarea></label><label>Checklist <small>(una voce per riga)</small><textarea name="checklist">${esc((t.checklist||[]).map(x=>x.text).join("\n"))}</textarea></label><div class="comments"><h3>Commenti</h3>${(t.comments||[]).map(c=>`<div class="comment"><strong>${esc(member(c.authorId)?.name||c.author||"Membro del team")}</strong><small> · ${esc(c.createdAt||"")}</small><p>${esc(c.text)}</p></div>`).join("")||"<small>Nessun commento</small>"}<label>Nuovo commento<textarea name="newComment" placeholder="Scrivi un aggiornamento…"></textarea></label></div><div class="form-actions"><button type="button" class="button danger" data-action="delete-task:${p.id}:${t.id}">Elimina task</button><button class="button primary">Salva task</button></div></form>`;
}
function taskForm(projectId){
  openModal("Nuova task",`<form class="form" data-form="new-task" data-project="${projectId}"><label>Titolo<input required name="title"></label><div class="form-grid"><label>Fase<input name="phase" placeholder="es. Pre-produzione"></label><label>Assegnata a<select name="assigneeId">${options(state.team,null,"Da assegnare")}</select></label><label>Scadenza<input type="date" name="due"></label><label>Stato<select name="status">${taskStatuses.map(s=>`<option>${s}</option>`).join("")}</select></label></div><label>Descrizione<textarea name="description"></textarea></label><div class="form-actions"><button type="button" class="button secondary" data-action="close-modal">Annulla</button><button class="button primary">Crea task</button></div></form>`);
}

function submitForm(form){
  const data=Object.fromEntries(new FormData(form));
  if(form.dataset.form==="member"){
    const existing=member(form.dataset.id),obj={...(existing||{}),id:existing?.id||uid("mem"),name:data.name,initials:initials(data.name),role:data.role,email:data.email,skills:data.skills,availability:data.availability};
    if(existing)Object.assign(existing,obj);else{state.team.push(obj);if(!state.activeMemberId)state.activeMemberId=obj.id}
  }else if(form.dataset.form==="client"){
    const existing=client(form.dataset.id),obj={...(existing||{}),id:existing?.id||uid("cli"),...data};
    if(existing)Object.assign(existing,obj);else state.clients.push(obj);
  }else if(form.dataset.form==="service"){
    const existing=service(form.dataset.id),prices=state.team.map(p=>({memberId:p.id,price:Number(data["price-"+p.id])||0}));
    const obj={...(existing||{}),id:existing?.id||uid("srv"),name:data.name,category:data.category,unit:data.unit,description:data.description,prices};
    if(existing)Object.assign(existing,obj);else state.services.push(obj);
  }else if(form.dataset.form==="opportunity"){
    let clientId=data.clientId;
    if(!clientId&&data.clientName){const c={id:uid("cli"),name:data.clientName,sector:"",contact:"",email:"",notes:"Creato da opportunità"};state.clients.push(c);clientId=c.id}
    if(!clientId){toast("Seleziona o crea un cliente");return}
    const existing=state.opportunities.find(x=>x.id===form.dataset.id),obj={...(existing||{}),id:existing?.id||uid("opp"),clientId,serviceId:data.serviceId,ownerId:data.ownerId,stage:data.stage,budget:Number(data.budget)||0,followup:data.followup,nextAction:data.nextAction,request:data.request,createdAt:existing?.createdAt||todayIso()};
    if(existing)Object.assign(existing,obj);else state.opportunities.push(obj);closeModal();
  }else if(form.dataset.form==="project"){
    const existing=project(form.dataset.id),memberIds=[...form.querySelectorAll('[name="memberIds"]:checked')].map(x=>x.value),obj={...(existing||{}),id:existing?.id||uid("prj"),title:data.title,clientId:data.clientId,status:data.status,start:data.start,due:data.due,budget:Number(data.budget)||0,description:data.description,memberIds,tasks:existing?.tasks||[]};
    if(existing)Object.assign(existing,obj);else state.projects.push(obj);
  }else if(form.dataset.form==="new-task"){
    const p=project(form.dataset.project);p.tasks=p.tasks||[];p.tasks.push({id:uid("tsk"),title:data.title,phase:data.phase,status:data.status,assigneeId:data.assigneeId,due:data.due,description:data.description,checklist:[],comments:[]});closeModal();save();renderAll();openProject(p.id);toast("Task creata");return;
  }else if(form.dataset.form==="task"){
    const p=project(form.dataset.project),t=p.tasks.find(x=>x.id===form.dataset.id);
    Object.assign(t,{title:data.title,phase:data.phase,status:data.status,assigneeId:data.assigneeId,due:data.due,description:data.description,checklist:(data.checklist||"").split("\n").filter(Boolean).map(text=>({text,done:(t.checklist||[]).find(x=>x.text===text)?.done||false}))});
    if(data.newComment)t.comments=[...(t.comments||[]),{authorId:state.activeMemberId,text:data.newComment,createdAt:new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date())}];
    save();renderAll();openProject(p.id,t.id);toast("Task aggiornata");return;
  }
  save();closeSheet();renderAll();toast("Salvato");
}
function remove(kind,id,extra){
  if(!confirm("Vuoi davvero eliminare questo elemento?"))return;
  if(kind==="member"){state.team=state.team.filter(x=>x.id!==id);if(state.activeMemberId===id)state.activeMemberId=state.team[0]?.id||null}
  if(kind==="client")state.clients=state.clients.filter(x=>x.id!==id);
  if(kind==="service")state.services=state.services.filter(x=>x.id!==id);
  if(kind==="opportunity"){state.opportunities=state.opportunities.filter(x=>x.id!==id);closeModal()}
  if(kind==="project")state.projects=state.projects.filter(x=>x.id!==id);
  if(kind==="task"){const p=project(id);p.tasks=p.tasks.filter(x=>x.id!==extra)}
  save();closeSheet();renderAll();toast("Elemento eliminato");
}
function convertOpportunity(id){
  const o=state.opportunities.find(x=>x.id===id);if(!o)return;
  closeModal();projectForm({title:(client(o.clientId)?.name||"Nuovo")+" — "+(service(o.serviceId)?.name||o.request||"Progetto"),clientId:o.clientId,status:"open",budget:o.budget,memberIds:o.ownerId?[o.ownerId]:[],tasks:[]});
}
function globalSearch(){
  openModal("Cerca",`<div class="form"><label>Cerca in tutto ReFrame<input id="globalSearch" autofocus placeholder="Cliente, progetto, persona…"></label><div id="searchResults"></div></div>`);
  setTimeout(()=>$("#globalSearch")?.focus(),50);
}
function searchResults(q){
  q=q.toLowerCase();const results=[
    ...state.projects.filter(x=>x.title.toLowerCase().includes(q)).map(x=>({type:"project",id:x.id,label:x.title})),
    ...state.clients.filter(x=>x.name.toLowerCase().includes(q)).map(x=>({type:"client",id:x.id,label:x.name})),
    ...state.team.filter(x=>x.name.toLowerCase().includes(q)).map(x=>({type:"member",id:x.id,label:x.name})),
    ...state.opportunities.filter(x=>(client(x.clientId)?.name||"").toLowerCase().includes(q)).map(x=>({type:"opportunity",id:x.id,label:"Opportunità · "+client(x.clientId)?.name}))
  ];$("#searchResults").innerHTML=q?results.map(r=>`<button class="button secondary" style="width:100%;text-align:left" data-search-type="${r.type}" data-search-id="${r.id}">${esc(r.label)}</button>`).join("")||empty("Nessun risultato","Prova con un altro termine.",null):"";
}

document.addEventListener("click",e=>{
  const view=e.target.closest("[data-view]");if(view){showView(view.dataset.view);return}
  const action=e.target.closest("[data-action]")?.dataset.action;
  if(action){
    if(action==="new-member")memberForm();
    else if(action==="new-client")clientForm();
    else if(action==="new-service")serviceForm();
    else if(action==="new-opportunity")opportunityForm();
    else if(action==="new-project")projectForm();
    else if(action==="close-sheet")closeSheet();
    else if(action==="close-modal")closeModal();
    else if(action.startsWith("edit-project:"))projectForm(project(action.split(":")[1]));
    else if(action.startsWith("new-task:"))taskForm(action.split(":")[1]);
    else if(action.startsWith("convert-opportunity:"))convertOpportunity(action.split(":")[1]);
    else if(action.startsWith("delete-")){const [kind,id,extra]=action.slice(7).split(":");remove(kind,id,extra)}
    return;
  }
  const profile=e.target.closest("[data-profile]");if(profile){state.activeMemberId=profile.dataset.profile;save();$("#profileMenu").hidden=true;renderAll();toast("Vista personale aggiornata");return}
  const openP=e.target.closest("[data-open-project]");if(openP){openProject(openP.dataset.openProject);return}
  const openT=e.target.closest("[data-open-task]");if(openT){const [p,t]=openT.dataset.openTask.split(":");openProject(p,t);return}
  const openO=e.target.closest("[data-open-opportunity]");if(openO){opportunityForm(state.opportunities.find(x=>x.id===openO.dataset.openOpportunity));return}
  const openC=e.target.closest("[data-open-client]");if(openC){clientForm(client(openC.dataset.openClient));return}
  const openM=e.target.closest("[data-open-member]");if(openM){memberForm(member(openM.dataset.openMember));return}
  const openS=e.target.closest("[data-open-service]");if(openS){serviceForm(service(openS.dataset.openService));return}
  const scope=e.target.closest("[data-project-scope]");if(scope){projectScope=scope.dataset.projectScope;renderProjects();return}
  const status=e.target.closest("[data-project-status]");if(status){projectStatus=status.dataset.projectStatus;renderProjects();return}
  const opp=e.target.closest("[data-opp-filter]");if(opp){opportunityFilter=opp.dataset.oppFilter;renderOpportunities();return}
  const my=e.target.closest("[data-my-filter]");if(my){myFilter=my.dataset.myFilter;renderMyWork();return}
  const result=e.target.closest("[data-search-type]");if(result){closeModal();({project:()=>openProject(result.dataset.searchId),client:()=>clientForm(client(result.dataset.searchId)),member:()=>memberForm(member(result.dataset.searchId)),opportunity:()=>opportunityForm(state.opportunities.find(x=>x.id===result.dataset.searchId))}[result.dataset.searchType])();return}
});
document.addEventListener("submit",e=>{if(e.target.matches("[data-form]")){e.preventDefault();submitForm(e.target)}});
document.addEventListener("input",e=>{if(e.target.id==="globalSearch")searchResults(e.target.value)});
$("#quickOpportunity").onclick=()=>opportunityForm();
$("#profileButton").onclick=()=>$("#profileMenu").hidden=!$("#profileMenu").hidden;
$("#topProfile").onclick=()=>$("#profileMenu").hidden=!$("#profileMenu").hidden;
$("#searchButton").onclick=globalSearch;
$("#closeSheet").onclick=closeSheet;$("#backdrop").onclick=closeSheet;$("#closeModal").onclick=closeModal;
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSheet();closeModal()}});
showView(currentView);
