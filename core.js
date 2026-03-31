const STORAGE_KEY="medcontrol_standard_local_v1";

const I18N={
  ru:{
    input:"Ввод",board:"Табло",action:"Принятие",settings:"Настройки",
    patient:"Пациент",mode:"Режим",standard:"Standard",
    currentDate:"Текущая дата",currentTime:"Текущее время",
    status:"Статус",active:"Активен",passive:"Пассивен",
    medication:"Препарат",dose:"Доза",schedule:"Режим",
    daysDates:"Дни / Даты",slots:"Слоты",startDate:"Дата начала",endDate:"Дата окончания",
    actions:"Управление",changedAt:"Фактическая дата и время ввода / изменения данных",
    addRow:"Добавить строку",edit:"Изменить",extend:"Продлить",history:"История",
    activate:"Активировать",deactivate:"Пассив",daily:"Ежедневно",weekdays:"По дням недели",calendar:"По конкретным календарным датам",
    none:"—",take:"Принял",cancel:"Отменить",correct:"Исправить",
    waiting:"Ожидание",overdue:"Просрочено",takenOnTime:"Принял вовремя",takenLate:"Принял поздно",takenEarly:"Принял досрочно",cancelled:"Отменено",
    save:"Сохранить",close:"Закрыть",account:"Аккаунт",regional:"Региональные настройки",
    country:"Страна",language:"Язык интерфейса",timezone:"Часовой пояс",localDate:"Текущая локальная дата",localTime:"Текущее локальное время",
    rowHistory:"История строки",intakeHistory:"История приёма",email:"Email",role:"Роль",
    medRule:"Правило именования препарата",medRule1:"Язык интерфейса выбирается отдельно от страны.",
    medRule2:"Название препарата можно вводить на любом языке.",medRule3:"Custom dose можно вводить на любом языке.",
    medRule4:"Страна, язык интерфейса и часовой пояс не должны смешиваться.",
    todayEmpty:"Сегодня активных задач нет.",createRow:"Новая строка препарата",customDose:"Своя дозировка",unit:"Единица",rowNo:"№",actualAction:"Фактическая дата и время действия",plannedSlot:"Плановый слот"
  }
};

const COUNTRIES=["Armenia","France","Germany","Russia","United States","United Kingdom","Japan","China","United Arab Emirates"];
const LANGUAGES=[["ru","Русский"],["en","English"],["hy","Հայերեն"],["fr","Français"],["de","Deutsch"],["ar","العربية"],["zh","中文"],["ja","日本語"]];
const UNITS=["mg","g","ml","tablet","capsule","drops","sachet","puff","injection","unit"];
const UNIT_LABELS={ru:{mg:"мг",g:"г",ml:"мл",tablet:"таблетка",capsule:"капсула",drops:"капли",sachet:"саше",puff:"впрыск",injection:"инъекция",unit:"единица"}};

function t(k){return I18N.ru[k]||k}
function unitLabel(v){return (UNIT_LABELS.ru&&UNIT_LABELS.ru[v])||v||""}

function defaultState(){
  const now=new Date().toISOString();
  return {
    settings:{
      country:"Armenia",
      interfaceLanguage:"ru",
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC",
      email:"affixooperations@gmail.com",
      role:"admin",
      patient:"Myself"
    },
    medications:[
      {id:crypto.randomUUID(),no:1,active:true,name:"Амокси",doseValue:"500",doseUnit:"mg",doseCustom:"",mode:"daily",weekdays:[],dates:[],slots:["08:30","13:45","21:10"],startDate:"2026-04-01",endDate:"2026-04-30",changedAt:now,rowHistory:[{at:now,action:"created"}]},
      {id:crypto.randomUUID(),no:2,active:false,name:"Парацетамол",doseValue:"1",doseUnit:"tablet",doseCustom:"",mode:"weekdays",weekdays:["Mon","Wed","Fri"],dates:[],slots:["09:00","14:00","22:00"],startDate:"2026-04-01",endDate:"2026-04-30",changedAt:now,rowHistory:[{at:now,action:"created"},{at:now,action:"deactivated"}]}
    ],
    intakeLogs:[]
  };
}
function state(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw){try{return JSON.parse(raw)}catch(e){}}
  const s=defaultState(); localStorage.setItem(STORAGE_KEY,JSON.stringify(s)); return s;
}
function save(s){localStorage.setItem(STORAGE_KEY,JSON.stringify(s))}
function fmtDateTime(v){if(!v)return "—"; const d=new Date(v); if(isNaN(d)) return "—"; return new Intl.DateTimeFormat("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).format(d)}
function fmtDate(v){if(!v)return "—"; const d=new Date(v+"T00:00:00"); if(isNaN(d)) return "—"; return new Intl.DateTimeFormat("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d)}
function todayIso(){const d=new Date(); return d.toISOString().slice(0,10)}
function weekdayCode(date){return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]}
function applicable(m){
  if(!m.active) return false;
  const today=new Date(todayIso()+"T00:00:00");
  if(m.mode==="calendar") return (m.dates||[]).includes(todayIso());
  const start=m.startDate?new Date(m.startDate+"T00:00:00"):null;
  const end=m.endDate?new Date(m.endDate+"T00:00:00"):null;
  if(start&&today<start) return false;
  if(end&&today>end) return false;
  if(m.mode==="daily") return true;
  if(m.mode==="weekdays") return (m.weekdays||[]).includes(weekdayCode(today));
  return false;
}
function scheduledIso(slot){return new Date(todayIso()+"T"+slot+":00").toISOString()}
function intakeFor(mid,slot){return state().intakeLogs.find(x=>x.medicationId===mid&&x.scheduledAt===scheduledIso(slot))||null}
function statusFor(m,slot){
  const log=intakeFor(m.id,slot);
  if(log){
    if(log.status==="cancelled") return t("cancelled");
    const actual=new Date(log.actualAt).getTime();
    const planned=new Date(todayIso()+"T"+slot+":00").getTime();
    if(actual<planned) return t("takenEarly");
    if(actual<=planned+10*60*1000) return t("takenOnTime");
    return t("takenLate");
  }
  const planned=new Date(todayIso()+"T"+slot+":00").getTime();
  return Date.now()<planned?t("waiting"):t("overdue");
}
function unresolvedSlots(m){return m.slots.filter(slot=>!intakeFor(m.id,slot))}
function doseText(m){if(m.doseCustom&&m.doseCustom.trim()) return m.doseCustom.trim(); return [m.doseValue,unitLabel(m.doseUnit)].filter(Boolean).join(" ")}
function daysText(m){
  if(m.mode==="daily") return t("none");
  if(m.mode==="weekdays"){const map={Mon:"Пн",Tue:"Вт",Wed:"Ср",Thu:"Чт",Fri:"Пт",Sat:"Сб",Sun:"Вс"}; return (m.weekdays||[]).map(x=>map[x]||x).join(" ")}
  return (m.dates||[]).map(fmtDate).join(", ")
}
function tick(){
  const now=new Date();
  const date=new Intl.DateTimeFormat("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric"}).format(now);
  const time=new Intl.DateTimeFormat("ru-RU",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
  ["currentDate","localDate"].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent=date;});
  ["currentTime","localTime"].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent=time;});
  const tz=document.getElementById("timezone"); if(tz) tz.value=Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC";
}
function shell(title,active){
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
  body{font-family:Arial,sans-serif;max-width:1400px;margin:24px auto;padding:0 16px;color:#111;line-height:1.4}
  h1,h2{margin:0 0 12px}.topbar,.card{border:1px solid #ddd;border-radius:12px;background:#fff}.topbar{padding:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
  .card{padding:14px;margin-bottom:16px}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #eee;padding:10px 8px;text-align:left;vertical-align:top}th{background:#fafafa}
  .pill{display:inline-block;padding:4px 8px;border:1px solid #ddd;border-radius:999px;font-size:12px;background:#fafafa}.btn{text-decoration:none;color:inherit;border:1px solid #ddd;border-radius:8px;padding:8px 12px;display:inline-block}
  .btn.active{background:#f5f5f5;border-color:#111}input,select,textarea,button{font:inherit}input,select,textarea{padding:8px 10px}button{padding:7px 10px;cursor:pointer}.muted{color:#666}.small{font-size:12px}
  .inline{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.slot-block{border:1px solid #ddd;border-radius:10px;padding:10px;margin:6px 0}.grid{display:grid;grid-template-columns:240px 1fr;gap:12px 16px;align-items:center}
  dialog{border:1px solid #ccc;border-radius:12px;padding:18px;max-width:760px;width:90%}dialog::backdrop{background:rgba(0,0,0,.25)}@media(max-width:860px){.grid{grid-template-columns:1fr}}
  </style></head><body>
  <h1>${title}</h1>
  <div class="topbar">
    <a class="btn ${active==="input"?"active":""}" href="input.html">${t("input")}</a>
    <a class="btn ${active==="board"?"active":""}" href="dashboard.html">${t("board")}</a>
    <a class="btn ${active==="action"?"active":""}" href="action.html">${t("action")}</a>
    <a class="btn ${active==="settings"?"active":""}" href="settings.html">${t("settings")}</a>
    <span class="pill">${t("patient")}: <strong>${state().settings.patient}</strong></span>
    <span class="pill">${t("mode")}: ${t("standard")}</span>
    <span class="pill">${t("currentDate")}: <strong id="currentDate"></strong></span>
    <span class="pill">${t("currentTime")}: <strong id="currentTime"></strong></span>
  </div>`;
}
function attachCommon(){tick(); clearInterval(window.__medTick); window.__medTick=setInterval(tick,1000)}

window.addRow=function(){
  const s=state();
  const unit=document.getElementById("newDoseUnit").value;
  const mode=document.getElementById("newMode").value;
  const med={
    id:crypto.randomUUID(),
    no:s.medications.length?Math.max(...s.medications.map(x=>x.no))+1:1,
    active:true,
    name:document.getElementById("newName").value.trim(),
    doseValue:document.getElementById("newDoseValue").value.trim(),
    doseUnit:unit==="custom"?"":unit,
    doseCustom:unit==="custom"?document.getElementById("newDoseCustom").value.trim():"",
    mode:mode,
    weekdays:mode==="weekdays"?document.getElementById("newWeekdays").value.split(",").map(x=>x.trim()).filter(Boolean):[],
    dates:mode==="calendar"?document.getElementById("newDates").value.split(",").map(x=>x.trim()).filter(Boolean):[],
    slots:document.getElementById("newSlots").value.split(",").map(x=>x.trim()).filter(Boolean),
    startDate:mode==="calendar"?"":document.getElementById("newStartDate").value,
    endDate:mode==="calendar"?"":document.getElementById("newEndDate").value,
    changedAt:new Date().toISOString(),
    rowHistory:[{at:new Date().toISOString(),action:"created"}]
  };
  if(!med.name) return alert("Введите название препарата");
  if(!med.slots.length) return alert("Введите хотя бы один слот");
  s.medications.push(med); save(s); mount("input");
};
window.toggleActive=function(id){
  const s=state(), m=s.medications.find(x=>x.id===id); if(!m) return;
  m.active=!m.active; m.changedAt=new Date().toISOString(); m.rowHistory.push({at:new Date().toISOString(),action:m.active?"activated":"deactivated"}); save(s); mount("input");
};
window.extendRow=function(id){
  const s=state(), m=s.medications.find(x=>x.id===id); if(!m) return;
  if(m.mode==="calendar") return alert("Для календарных дат продление делается через Изменить");
  const d=new Date((m.endDate||todayIso())+"T00:00:00"); d.setDate(d.getDate()+30);
  m.endDate=d.toISOString().slice(0,10); m.changedAt=new Date().toISOString(); m.rowHistory.push({at:new Date().toISOString(),action:"extended"}); save(s); mount("input");
};
window.showRowHistory=function(id){
  const m=state().medications.find(x=>x.id===id); if(!m) return;
  document.getElementById("rowHistoryBody").innerHTML=m.rowHistory.length?"<ul>"+m.rowHistory.map(h=>`<li>${fmtDateTime(h.at)} — ${h.action}</li>`).join("")+"</ul>":"—";
  document.getElementById("rowHistoryDialog").showModal();
};
let editingId=null;
window.openEditRow=function(id){
  const m=state().medications.find(x=>x.id===id); if(!m) return; editingId=id;
  document.getElementById("editRowBody").innerHTML=`<div class="inline" style="margin-bottom:8px"><input id="editName" value="${m.name}" style="width:220px"><input id="editDoseValue" value="${m.doseValue}" style="width:110px"><input id="editDoseCustom" value="${m.doseCustom||""}" placeholder="${t("customDose")}" style="width:180px"></div><div class="inline" style="margin-bottom:8px"><select id="editMode" style="width:240px"><option value="daily" ${m.mode==="daily"?"selected":""}>${t("daily")}</option><option value="weekdays" ${m.mode==="weekdays"?"selected":""}>${t("weekdays")}</option><option value="calendar" ${m.mode==="calendar"?"selected":""}>${t("calendar")}</option></select><input id="editWeekdays" value="${(m.weekdays||[]).join(",")}" style="width:180px"><textarea id="editDates" style="width:280px;height:40px">${(m.dates||[]).join(", ")}</textarea></div><div class="inline"><input id="editSlots" value="${m.slots.join(", ")}" style="width:220px"><input id="editStartDate" type="date" value="${m.startDate||""}" style="width:160px"><input id="editEndDate" type="date" value="${m.endDate||""}" style="width:160px"></div>`;
  document.getElementById("editRowDialog").showModal();
};
window.saveEditedRow=function(){
  const s=state(), m=s.medications.find(x=>x.id===editingId); if(!m) return;
  m.name=document.getElementById("editName").value.trim();
  m.doseValue=document.getElementById("editDoseValue").value.trim();
  m.doseCustom=document.getElementById("editDoseCustom").value.trim();
  m.mode=document.getElementById("editMode").value;
  m.weekdays=m.mode==="weekdays"?document.getElementById("editWeekdays").value.split(",").map(x=>x.trim()).filter(Boolean):[];
  m.dates=m.mode==="calendar"?document.getElementById("editDates").value.split(",").map(x=>x.trim()).filter(Boolean):[];
  m.slots=document.getElementById("editSlots").value.split(",").map(x=>x.trim()).filter(Boolean);
  m.startDate=m.mode==="calendar"?"":document.getElementById("editStartDate").value;
  m.endDate=m.mode==="calendar"?"":document.getElementById("editEndDate").value;
  m.changedAt=new Date().toISOString(); m.rowHistory.push({at:new Date().toISOString(),action:"edited"}); save(s);
  document.getElementById("editRowDialog").close(); mount("input");
};
window.takeSlot=function(mid,slot){
  const s=state(); s.intakeLogs=s.intakeLogs.filter(x=>!(x.medicationId===mid&&x.scheduledAt===scheduledIso(slot)));
  s.intakeLogs.push({id:crypto.randomUUID(),medicationId:mid,scheduledAt:scheduledIso(slot),actualAt:new Date().toISOString(),status:"taken"}); save(s); mount("action");
};
window.cancelSlot=function(mid,slot){
  const s=state(); s.intakeLogs=s.intakeLogs.filter(x=>!(x.medicationId===mid&&x.scheduledAt===scheduledIso(slot)));
  s.intakeLogs.push({id:crypto.randomUUID(),medicationId:mid,scheduledAt:scheduledIso(slot),actualAt:new Date().toISOString(),status:"cancelled"}); save(s); mount("action");
};
window.correctSlot=function(mid,slot){
  const s=state(); s.intakeLogs=s.intakeLogs.filter(x=>!(x.medicationId===mid&&x.scheduledAt===scheduledIso(slot))); save(s); mount("action");
};
window.showIntakeHistory=function(mid){
  const items=state().intakeLogs.filter(x=>x.medicationId===mid).sort((a,b)=>new Date(b.actualAt)-new Date(a.actualAt));
  document.getElementById("intakeHistoryBody").innerHTML=items.length?"<ul>"+items.map(x=>`<li>${fmtDateTime(x.actualAt)} — ${x.status} — ${t("plannedSlot")}: ${fmtDateTime(x.scheduledAt)}</li>`).join("")+"</ul>":"—";
  document.getElementById("intakeHistoryDialog").showModal();
};
window.saveSettings=function(){
  const s=state(); s.settings.country=document.getElementById("country").value; s.settings.interfaceLanguage=document.getElementById("interfaceLanguage").value;
  s.settings.timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"; save(s); mount("settings");
};
function attachInputEvents(){
  const unit=document.getElementById("newDoseUnit"), custom=document.getElementById("newDoseCustom"), mode=document.getElementById("newMode"), weekdays=document.getElementById("newWeekdays"), dates=document.getElementById("newDates"), start=document.getElementById("newStartDate"), end=document.getElementById("newEndDate");
  function sync(){custom.style.display=unit.value==="custom"?"inline-block":"none"; const m=mode.value; weekdays.style.display=m==="weekdays"?"inline-block":"none"; dates.style.display=m==="calendar"?"inline-block":"none"; start.disabled=m==="calendar"; end.disabled=m==="calendar"}
  unit.onchange=sync; mode.onchange=sync; sync();
}
window.mount=function(page){
  if(page==="input"){
    const rows=state().medications.sort((a,b)=>a.no-b.no).map(m=>`<tr><td><strong>${m.no}</strong></td><td><span class="pill">${m.active?t("active"):t("passive")}</span></td><td>${m.name}</td><td>${doseText(m)}</td><td>${m.mode==="daily"?t("daily"):m.mode==="weekdays"?t("weekdays"):t("calendar")}</td><td>${daysText(m)}</td><td>${m.slots.join(" | ")}</td><td>${m.mode==="calendar"?t("none"):fmtDate(m.startDate)}</td><td>${m.mode==="calendar"?t("none"):fmtDate(m.endDate)}</td><td><button onclick="toggleActive('${m.id}')">${m.active?t("deactivate"):t("activate")}</button> <button onclick="openEditRow('${m.id}')">${t("edit")}</button> <button onclick="extendRow('${m.id}')">${t("extend")}</button> <button onclick="showRowHistory('${m.id}')">${t("history")}</button></td><td>${fmtDateTime(m.changedAt)}</td></tr>`).join("");
    document.body.innerHTML=shell("MedControl Standard — 1. "+t("input"),"input")+`<section class="card"><h2>${t("createRow")}</h2><div class="inline" style="margin-bottom:8px"><input id="newName" placeholder="${t("medication")}" style="width:220px"><input id="newDoseValue" placeholder="${t("dose")}" style="width:110px"><select id="newDoseUnit" style="width:150px"><option value="">${t("unit")}</option>${UNITS.map(u=>`<option value="${u}">${unitLabel(u)}</option>`).join("")}<option value="custom">${t("customDose")}</option></select><input id="newDoseCustom" placeholder="${t("customDose")}" style="width:180px;display:none"></div><div class="inline" style="margin-bottom:8px"><select id="newMode" style="width:240px"><option value="daily">${t("daily")}</option><option value="weekdays">${t("weekdays")}</option><option value="calendar">${t("calendar")}</option></select><input id="newWeekdays" placeholder="Mon,Wed,Fri" style="width:180px;display:none"><textarea id="newDates" placeholder="2026-04-01, 2026-04-10, 2026-06-05" style="width:280px;height:40px;display:none"></textarea><input id="newSlots" placeholder="08:30, 13:45, 21:10" style="width:220px"><input id="newStartDate" type="date" style="width:160px"><input id="newEndDate" type="date" style="width:160px"><button onclick="addRow()">${t("addRow")}</button></div><div class="small muted">${t("medRule2")} ${t("medRule3")}</div></section><section class="card"><table><thead><tr><th>${t("rowNo")}</th><th>${t("status")}</th><th>${t("medication")}</th><th>${t("dose")}</th><th>${t("schedule")}</th><th>${t("daysDates")}</th><th>${t("slots")}</th><th>${t("startDate")}</th><th>${t("endDate")}</th><th>${t("actions")}</th><th>${t("changedAt")}</th></tr></thead><tbody>${rows||`<tr><td colspan="11">—</td></tr>`}</tbody></table></section><dialog id="rowHistoryDialog"><h2>${t("rowHistory")}</h2><div id="rowHistoryBody"></div><div style="margin-top:12px"><button onclick="document.getElementById('rowHistoryDialog').close()">${t("close")}</button></div></dialog><dialog id="editRowDialog"><h2>${t("edit")}</h2><div id="editRowBody"></div><div style="margin-top:12px"><button onclick="saveEditedRow()">${t("save")}</button> <button onclick="document.getElementById('editRowDialog').close()">${t("close")}</button></div></dialog></body></html>`;
    attachCommon(); attachInputEvents(); return;
  }
  if(page==="board"){
    const rows=state().medications.filter(m=>applicable(m)).map(m=>{const slots=unresolvedSlots(m); if(!slots.length) return ""; return `<tr><td><strong>${m.no}</strong></td><td>${m.name}</td><td>${doseText(m)}</td><td>${slots.map(slot=>`<div class="slot-block"><strong>${slot}</strong> — ${statusFor(m,slot)}</div>`).join("")}</td></tr>`}).join("");
    document.body.innerHTML=shell("MedControl Standard — 2. "+t("board"),"board")+`<section class="card"><table><thead><tr><th>${t("rowNo")}</th><th>${t("medication")}</th><th>${t("dose")}</th><th>${t("slots")}</th></tr></thead><tbody>${rows||`<tr><td colspan="4">${t("todayEmpty")}</td></tr>`}</tbody></table></section></body></html>`;
    attachCommon(); return;
  }
  if(page==="action"){
    const rows=state().medications.filter(m=>applicable(m)).map(m=>`<tr><td><strong>${m.no}</strong></td><td>${m.name}</td><td>${doseText(m)}</td><td>${m.slots.map(slot=>`<div class="slot-block"><strong>${slot}</strong></div>`).join("")}</td><td>${m.slots.map(slot=>`<div class="slot-block">${statusFor(m,slot)}</div>`).join("")}</td><td>${m.slots.map(slot=>{const log=intakeFor(m.id,slot); if(!log) return `<div class="slot-block"><button onclick="takeSlot('${m.id}','${slot}')">${t("take")}</button> <button onclick="cancelSlot('${m.id}','${slot}')">${t("cancel")}</button></div>`; if(log.status==="cancelled") return `<div class="slot-block"><button onclick="correctSlot('${m.id}','${slot}')">${t("correct")}</button></div>`; return `<div class="slot-block"><button onclick="cancelSlot('${m.id}','${slot}')">${t("cancel")}</button> <button onclick="correctSlot('${m.id}','${slot}')">${t("correct")}</button></div>`}).join("")}</td><td>${m.slots.map(slot=>`<div class="slot-block">${fmtDateTime(intakeFor(m.id,slot)?.actualAt)}</div>`).join("")}</td><td><button onclick="showIntakeHistory('${m.id}')">${t("history")}</button></td></tr>`).join("");
    document.body.innerHTML=shell("MedControl Standard — 3. "+t("action"),"action")+`<section class="card"><table><thead><tr><th>${t("rowNo")}</th><th>${t("medication")}</th><th>${t("dose")}</th><th>${t("slots")}</th><th>${t("status")}</th><th>${t("actions")}</th><th>${t("actualAction")}</th><th>${t("history")}</th></tr></thead><tbody>${rows||`<tr><td colspan="8">${t("todayEmpty")}</td></tr>`}</tbody></table></section><dialog id="intakeHistoryDialog"><h2>${t("intakeHistory")}</h2><div id="intakeHistoryBody"></div><div style="margin-top:12px"><button onclick="document.getElementById('intakeHistoryDialog').close()">${t("close")}</button></div></dialog></body></html>`;
    attachCommon(); return;
  }
  if(page==="settings"){
    document.body.innerHTML=shell("MedControl Standard — 4. "+t("settings"),"settings")+`<section class="card"><h2>${t("account")}</h2><div class="grid"><div class="muted">${t("email")}</div><div>${state().settings.email}</div><div class="muted">${t("role")}</div><div>${state().settings.role}</div></div></section><section class="card"><h2>${t("regional")}</h2><div class="grid"><div class="muted">${t("country")}</div><div><select id="country">${COUNTRIES.map(c=>`<option value="${c}" ${c===state().settings.country?"selected":""}>${c}</option>`).join("")}</select></div><div class="muted">${t("language")}</div><div><select id="interfaceLanguage">${LANGUAGES.map(l=>`<option value="${l[0]}" ${l[0]===state().settings.interfaceLanguage?"selected":""}>${l[1]}</option>`).join("")}</select></div><div class="muted">${t("timezone")}</div><div><input id="timezone" readonly></div><div class="muted">${t("localDate")}</div><div id="localDate">—</div><div class="muted">${t("localTime")}</div><div id="localTime">—</div></div><div style="margin-top:12px"><button onclick="saveSettings()">${t("save")}</button></div></section><section class="card"><h2>${t("medRule")}</h2><div class="small"><div>1. ${t("medRule1")}</div><div>2. ${t("medRule2")}</div><div>3. ${t("medRule3")}</div><div>4. ${t("medRule4")}</div></div></section></body></html>`;
    attachCommon(); return;
  }
};