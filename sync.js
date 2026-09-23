const SUPABASE_URL = "https://iogjxedwlnepyuxavvsu.supabase.co";
const SUPABASE_KEY = "sb_publishable_fcd1oNX1g5e5xtqyYH_Bow_hJbP-c-k";
const dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const localSubmitForm = submitForm;
const localRemove = remove;
let accessRow = null;
let remoteRows = {};

const opportunityFromDb = {
  lead: "Da qualificare",
  discussione_interna: "Da qualificare",
  negoziazione: "In proposta",
  proposta: "In proposta",
  attesa_cliente: "In attesa cliente",
  confermata: "Confermata"
};
const opportunityToDb = {
  "Da qualificare": "lead",
  "In proposta": "proposta",
  "In attesa cliente": "attesa_cliente",
  "Confermata": "confermata"
};
const projectFromDb = {
  opportunita: "open",
  confermata: "open",
  in_lavorazione: "open",
  in_revisione: "review",
  bloccata: "blocked",
  consegnata: "done",
  chiusa: "done",
  annullata: "done"
};
const projectToDb = { open: "in_lavorazione", review: "in_revisione", blocked: "bloccata", done: "consegnata" };
const taskFromDb = {
  da_confermare: "Da fare",
  da_fare: "Da fare",
  in_lavorazione: "In lavorazione",
  in_revisione: "In revisione",
  bloccata: "Bloccata",
  consegnata: "Completata",
  completata: "Completata"
};
const taskToDb = {
  "Da fare": "da_fare",
  "In lavorazione": "in_lavorazione",
  "In revisione": "in_revisione",
  "Bloccata": "bloccata",
  "Completata": "consegnata"
};

function showAuthMessage(message, ok=false) {
  const el = document.querySelector("#authMessage");
  el.textContent = message;
  el.style.color = ok ? "#2f9b70" : "#d95665";
}

function dbError(error) {
  console.error(error);
  toast(error?.message || "Errore di sincronizzazione");
  throw error;
}

async function loadRemoteState() {
  const tables = ["persone","servizi","persone_servizi","clienti","trattative","commesse","prestazioni","commessa_ruoli"];
  const results = await Promise.all(tables.map(name => dbClient.from(name).select("*")));
  const failed = results.find(result => result.error);
  if (failed) dbError(failed.error);
  remoteRows = Object.fromEntries(tables.map((name,index) => [name,results[index].data || []]));

  const savedProfile = localStorage.getItem("reframe-active-person");
  const people = remoteRows.persone.map(row => ({
    id: row.id,
    name: [row.nome,row.cognome].filter(Boolean).join(" "),
    initials: initials([row.nome,row.cognome].filter(Boolean).join(" ")),
    role: row.ruolo_breve || "",
    email: row.email || "",
    skills: row.note || "",
    availability: row.attivo ? "Disponibile" : "Non disponibile"
  }));
  const pricesByService = remoteRows.persone_servizi.reduce((all,row) => {
    (all[row.servizio_id] ||= []).push({ memberId: row.persona_id, price: Number(row.prezzo_base) || 0, rowId: row.id });
    return all;
  },{});
  const clients = remoteRows.clienti.map(row => ({
    id: row.id,
    name: row.ragione_sociale,
    sector: "",
    contact: row.referente_cliente || "",
    email: row.email || "",
    vat: row.partita_iva || "",
    taxCode: row.codice_fiscale || "",
    address: [row.indirizzo,row.cap,row.citta].filter(Boolean).join(", "),
    notes: row.note || ""
  }));
  const services = remoteRows.servizi.map(row => ({
    id: row.id,
    name: row.nome,
    category: row.categoria || "",
    unit: row.unita_default || "",
    description: row.descrizione || "",
    prices: pricesByService[row.id] || []
  }));
  const opportunities = remoteRows.trattative.map(row => ({
    id: row.id,
    clientId: row.cliente_id || "",
    clientName: row.cliente_nome_provvisorio || "",
    serviceId: "",
    ownerId: row.commerciale_id || "",
    stage: opportunityFromDb[row.stato] || "Da qualificare",
    budget: Number(row.budget_cliente) || 0,
    followup: row.data_prossima_azione || "",
    nextAction: row.prossima_azione || "",
    request: row.brief || row.note_interne || "",
    title: row.titolo,
    createdAt: row.created_at?.slice(0,10)
  }));
  const rolesByProject = remoteRows.commessa_ruoli.reduce((all,row) => {
    (all[row.commessa_id] ||= []).push(row.persona_id);
    return all;
  },{});
  const tasksByProject = remoteRows.prestazioni.reduce((all,row) => {
    (all[row.commessa_id] ||= []).push({
      id: row.id,
      title: row.titolo || row.descrizione || "Lavorazione",
      phase: row.output_atteso || "",
      status: taskFromDb[row.stato] || "Da fare",
      assigneeId: row.persona_id || "",
      serviceId: row.servizio_id || "",
      due: row.scadenza || "",
      description: row.descrizione || "",
      checklist: Array.isArray(row.checklist) ? row.checklist : [],
      comments: Array.isArray(row.commenti) ? row.commenti : []
    });
    return all;
  },{});
  const projects = remoteRows.commesse.map(row => {
    const taskPeople = (tasksByProject[row.id] || []).map(task => task.assigneeId).filter(Boolean);
    return {
      id: row.id,
      title: row.titolo,
      clientId: row.cliente_id || "",
      status: projectFromDb[row.stato] || "open",
      start: row.data_apertura || "",
      due: row.scadenza_generale || "",
      budget: Number(row.valore_concordato) || 0,
      description: row.descrizione || row.note_interne || "",
      memberIds: [...new Set([...(rolesByProject[row.id] || []),...taskPeople,row.commerciale_id,row.project_manager_id].filter(Boolean))],
      tasks: tasksByProject[row.id] || []
    };
  });

  state = {
    activeMemberId: people.some(person => person.id === savedProfile)
      ? savedProfile
      : (accessRow?.persona_id && people.some(person => person.id === accessRow.persona_id) ? accessRow.persona_id : people[0]?.id || null),
    team: people,
    clients,
    services,
    opportunities,
    projects
  };
  if (state.activeMemberId) localStorage.setItem("reframe-active-person",state.activeMemberId);
  renderAll();
}

async function verifyAccess(session) {
  const { data, error } = await dbClient.from("accessi_utente").select("*").eq("email",session.user.email).eq("attivo",true).maybeSingle();
  if (error) dbError(error);
  if (!data) {
    await dbClient.auth.signOut();
    throw new Error("Questo account non è abilitato al gestionale ReFrame.");
  }
  accessRow = data;
}

async function enterWorkspace(session) {
  await verifyAccess(session);
  await loadRemoteState();
  document.querySelector("#authGate").classList.add("is-ready");
  const topActions = document.querySelector(".topbar > div:last-child");
  if (!document.querySelector("#syncIndicator")) {
    topActions.insertAdjacentHTML("afterbegin",'<span class="sync-indicator" id="syncIndicator">Online</span>');
    document.querySelector("#profileOptions").insertAdjacentHTML("beforeend",'<button data-sign-out>Esci dal gestionale</button>');
  }
}

async function bootRemote() {
  try {
    const { data:{ session } } = await dbClient.auth.getSession();
    if (session) await enterWorkspace(session);
  } catch (error) {
    showAuthMessage(error.message);
  }
}

document.querySelector("#loginForm").addEventListener("submit",async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  showAuthMessage("Accesso in corso…",true);
  const { data:login, error } = await dbClient.auth.signInWithPassword({ email:data.email, password:data.password });
  if (error) return showAuthMessage("Email o password non corretti.");
  try { await enterWorkspace(login.session); } catch (accessError) { showAuthMessage(accessError.message); }
});

document.querySelector("#magicLinkButton").addEventListener("click",async () => {
  const email = document.querySelector('#loginForm [name="email"]').value;
  if (!email) return showAuthMessage("Inserisci prima la tua email.");
  const { error } = await dbClient.auth.signInWithOtp({ email, options:{ emailRedirectTo:location.origin } });
  if (error) return showAuthMessage(error.message);
  showAuthMessage("Link inviato. Controlla la tua email.",true);
});

document.addEventListener("click",async event => {
  if (event.target.closest("[data-sign-out]")) {
    await dbClient.auth.signOut();
    location.reload();
  }
  const profile = event.target.closest("[data-profile]");
  if (profile) localStorage.setItem("reframe-active-person",profile.dataset.profile);
});

async function persistProjectRoles(projectId,memberIds) {
  const existing = remoteRows.commessa_ruoli.filter(row => row.commessa_id === projectId);
  const existingIds = new Set(existing.map(row => row.persona_id));
  const wanted = new Set(memberIds);
  const removeIds = existing.filter(row => !wanted.has(row.persona_id)).map(row => row.id);
  if (removeIds.length) {
    const { error } = await dbClient.from("commessa_ruoli").delete().in("id",removeIds);
    if (error) dbError(error);
  }
  const additions = memberIds.filter(id => !existingIds.has(id)).map(persona_id => ({commessa_id:projectId,persona_id,ruolo:"operativo"}));
  if (additions.length) {
    const { error } = await dbClient.from("commessa_ruoli").insert(additions);
    if (error) dbError(error);
  }
}

submitForm = async function(form) {
  const data = Object.fromEntries(new FormData(form));
  try {
    if (form.dataset.form === "member") {
      const parts=data.name.trim().split(/\s+/), payload={nome:parts.shift(),cognome:parts.join(" "),email:data.email||null,ruolo_breve:data.role||null,note:data.skills||null,attivo:data.availability!=="Non disponibile"};
      const query=form.dataset.id?dbClient.from("persone").update(payload).eq("id",form.dataset.id):dbClient.from("persone").insert(payload);
      const {error}=await query;if(error)dbError(error);
    } else if (form.dataset.form === "client") {
      const payload={ragione_sociale:data.name,referente_cliente:data.contact||null,email:data.email||null,partita_iva:data.vat||null,codice_fiscale:data.taxCode||null,indirizzo:data.address||null,note:data.notes||null};
      const query=form.dataset.id?dbClient.from("clienti").update(payload).eq("id",form.dataset.id):dbClient.from("clienti").insert(payload);
      const {error}=await query;if(error)dbError(error);
    } else if (form.dataset.form === "service") {
      const payload={nome:data.name,categoria:data.category||null,unita_default:data.unit||null,descrizione:data.description||null};
      const result=form.dataset.id?await dbClient.from("servizi").update(payload).eq("id",form.dataset.id).select().single():await dbClient.from("servizi").insert(payload).select().single();
      if(result.error)dbError(result.error);
      const serviceId=result.data.id;
      for (const person of state.team) {
        const price=Number(data["price-"+person.id])||0;
        const existing=remoteRows.persone_servizi.find(row=>row.servizio_id===serviceId&&row.persona_id===person.id);
        if(existing&&price){const {error}=await dbClient.from("persone_servizi").update({prezzo_base:price,unita:data.unit||"servizio",attivo:true}).eq("id",existing.id);if(error)dbError(error)}
        else if(!existing&&price){const {error}=await dbClient.from("persone_servizi").insert({servizio_id:serviceId,persona_id:person.id,prezzo_base:price,unita:data.unit||"servizio"});if(error)dbError(error)}
      }
    } else if (form.dataset.form === "opportunity") {
      let clientId=data.clientId||null;
      if(!clientId&&data.clientName){const {data:newClient,error}=await dbClient.from("clienti").insert({ragione_sociale:data.clientName}).select().single();if(error)dbError(error);clientId=newClient.id}
      if(!clientId)return toast("Seleziona o crea un cliente");
      const title=form.dataset.id?state.opportunities.find(item=>item.id===form.dataset.id)?.title:(service(data.serviceId)?.name||data.request||"Nuova opportunità");
      const payload={titolo:title,cliente_id:clientId,commerciale_id:data.ownerId||null,stato:opportunityToDb[data.stage]||"lead",budget_cliente:Number(data.budget)||null,data_prossima_azione:data.followup||null,prossima_azione:data.nextAction||null,brief:data.request||null};
      const query=form.dataset.id?dbClient.from("trattative").update(payload).eq("id",form.dataset.id):dbClient.from("trattative").insert(payload);
      const {error}=await query;if(error)dbError(error);closeModal();
    } else if (form.dataset.form === "project") {
      const memberIds=[...form.querySelectorAll('[name="memberIds"]:checked')].map(input=>input.value);
      const payload={titolo:data.title,cliente_id:data.clientId||null,stato:projectToDb[data.status]||"in_lavorazione",data_apertura:data.start||todayIso(),scadenza_generale:data.due||null,valore_concordato:Number(data.budget)||null,descrizione:data.description||null,attiva:data.status!=="done"};
      const result=form.dataset.id?await dbClient.from("commesse").update(payload).eq("id",form.dataset.id).select().single():await dbClient.from("commesse").insert(payload).select().single();
      if(result.error)dbError(result.error);await persistProjectRoles(result.data.id,memberIds);
    } else if (form.dataset.form === "new-task") {
      const payload={commessa_id:form.dataset.project,titolo:data.title,descrizione:data.description||null,output_atteso:data.phase||null,persona_id:data.assigneeId||null,scadenza:data.due||null,stato:taskToDb[data.status]||"da_fare",prezzo_unitario:0,unita:"Progetto",quantita:1,origine:"gestionale"};
      const {error}=await dbClient.from("prestazioni").insert(payload);if(error)dbError(error);closeModal();
    } else if (form.dataset.form === "task") {
      const current=project(form.dataset.project)?.tasks.find(task=>task.id===form.dataset.id);
      const comments=[...(current?.comments||[])];
      if(data.newComment)comments.push({authorId:state.activeMemberId,text:data.newComment,createdAt:new Intl.DateTimeFormat("it-IT",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date())});
      const checklist=(data.checklist||"").split("\n").filter(Boolean).map(text=>({text,done:(current?.checklist||[]).find(item=>item.text===text)?.done||false}));
      const payload={titolo:data.title,descrizione:data.description||null,output_atteso:data.phase||null,persona_id:data.assigneeId||null,scadenza:data.due||null,stato:taskToDb[data.status]||"da_fare",checklist,commenti:comments};
      const {error}=await dbClient.from("prestazioni").update(payload).eq("id",form.dataset.id);if(error)dbError(error);
    }
    await loadRemoteState();
    closeSheet();
    if(form.dataset.form==="task")openProject(form.dataset.project,form.dataset.id);
    toast("Salvato online");
  } catch(error) {
    showAuthMessage(error.message);
  }
};

remove = async function(kind,id,extra) {
  if(!confirm("Vuoi davvero eliminare questo elemento?"))return;
  const table={member:"persone",client:"clienti",service:"servizi",opportunity:"trattative",project:"commesse",task:"prestazioni"}[kind];
  const rowId=kind==="task"?extra:id;
  const {error}=await dbClient.from(table).delete().eq("id",rowId);
  if(error)return toast(error.message);
  closeModal();closeSheet();await loadRemoteState();toast("Elemento eliminato");
};

save = function() {
  if (state.activeMemberId) localStorage.setItem("reframe-active-person",state.activeMemberId);
};

bootRemote();
