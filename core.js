const STORAGE_KEY = "affixo_medcontrol_standard_final_v1";
const EARLY_THRESHOLD_MIN = 15;
const ONTIME_THRESHOLD_MIN = 10;

const I18N = {
  ru: {
    input:"Ввод", board:"Табло", action:"Принятие", settings:"Настройки", standard:"Standard", patient:"Пациент",
    currentDate:"Дата", currentTime:"Время", medication:"Препарат", dose:"Доза", schedule:"Режим", daysDates:"Дни / даты",
    slots:"Слоты", startDate:"Начало", endDate:"Окончание", actions:"Действия", status:"Статус", active:"Активен", passive:"Пассивен",
    daily:"Ежедневно", weekdays:"По дням недели", calendar:"По календарным датам", addRow:"Добавить строку", save:"Сохранить", close:"Закрыть",
    edit:"Изменить", extend:"Продлить 30 дней", history:"История", take:"Принял", cancel:"Отменить", correct:"Исправить", export:"Экспорт JSON", import:"Импорт JSON",
    resetDemo:"Сбросить демо", analytics:"Сводка на сегодня", overdue:"Просрочено", waiting:"Ожидание", onTime:"Принял вовремя", late:"Принял поздно", early:"Принял досрочно", cancelled:"Отменено",
    taken:"Принято", todayEmpty:"На сегодня активных задач нет.", actualAction:"Фактическое действие", rowHistory:"История строки", intakeHistory:"История приема",
    country:"Страна", language:"Язык интерфейса", timezone:"Часовой пояс", email:"Email", role:"Роль", account:"Аккаунт", regional:"Региональные настройки",
    createRow:"Новая строка препарата", saveSettings:"Сохранить настройки", plannedSlot:"Плановый слот", notes:"Примечание", onlyOverdue:"Только просроченные",
    all:"Все", search:"Поиск", onlyActive:"Только активные", disclaimer:"MedControl помогает фиксировать прием и не заменяет медицинскую консультацию.",
    controlCenter:"Центр контроля", dashboardEmpty:"Все задачи на сегодня закрыты.", actionEmpty:"Нет действий для фиксации.", commercialReady:"Commerce Ready",
    quickStats:"Ключевые показатели", useCase:"Сценарий", standardMode:"Режим Standard", manualTime:"Указать фактическое время", apply:"Применить", clear:"Очистить",
    nextDue:"Следующий слот", intakeComment:"Комментарий", importDone:"Данные импортированы.", settingsSaved:"Настройки сохранены.", rowAdded:"Строка добавлена.", rowSaved:"Изменения сохранены.",
    notesPlaceholder:"Например: принимать после еды", searchPlaceholder:"Название, примечание или режим", medicalDisclaimerTitle:"Важно", modeHelp:"Standard рассчитан на одного пользователя и локальное управление режимом приема.",
    salesReadyTitle:"Готово к показу и продаже", salesReadyText:"Включены отдельные страницы, устойчивое локальное хранение, контроль статусов, история, ручная коррекция времени, экспорт / импорт, демо-сброс и базовые защитные проверки.",
    noResults:"Ничего не найдено.", filters:"Фильтры", syncNow:"Обновить", changedAt:"Изменено", stateReady:"Состояние системы", patientProfile:"Профиль пациента", exportHint:"Экспортируйте демо-состояние перед показом клиенту."
  }
};

const COUNTRIES = ["Armenia","France","Germany","Russia","United States","United Kingdom","Japan","China","United Arab Emirates"];
const LANGUAGES = [["ru","Русский"],["en","English"],["hy","Հայերեն"],["fr","Français"],["de","Deutsch"],["ar","العربية"],["zh","中文"],["ja","日本語"]];
const UNITS = ["mg","g","ml","tablet","capsule","drops","sachet","puff","injection","unit"];
const UNIT_LABELS = {mg:"мг",g:"г",ml:"мл",tablet:"таблетка",capsule:"капсула",drops:"капли",sachet:"саше",puff:"впрыск",injection:"инъекция",unit:"единица"};
const WEEKDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const WEEKDAYS_MAP = {Mon:"Пн",Tue:"Вт",Wed:"Ср",Thu:"Чт",Fri:"Пт",Sat:"Сб",Sun:"Вс"};

function t(key){ return I18N.ru[key] || key; }
function unitLabel(v){ return UNIT_LABELS[v] || v || ""; }
function esc(v){ return String(v ?? "").replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s])); }
function uid(){ return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); }
function pad2(v){ return String(v).padStart(2, "0"); }
function localDateParts(date = new Date()){ return { y: date.getFullYear(), m: date.getMonth()+1, d: date.getDate() }; }
function todayIso(){ const p = localDateParts(); return `${p.y}-${pad2(p.m)}-${pad2(p.d)}`; }
function nowIso(){ return new Date().toISOString(); }
function localDateTimeIso(date = new Date()){ return `${todayIso()}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:00`; }
function parseLocalDate(dateStr){ const [y,m,d] = String(dateStr || "").split("-").map(Number); return (y && m && d) ? new Date(y, m-1, d, 0, 0, 0, 0) : null; }
function parseLocalDateTime(dateStr, timeStr){ const [y,m,d] = String(dateStr || "").split("-").map(Number); const [hh,mm] = String(timeStr || "").split(":").map(Number); return (y && m && d >= 1 && Number.isInteger(hh) && Number.isInteger(mm)) ? new Date(y, m-1, d, hh, mm, 0, 0) : null; }
function fmtDate(value){ const d = parseLocalDate(value); return d ? new Intl.DateTimeFormat("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d) : "—"; }
function fmtDateTime(value){ if(!value) return "—"; const d = new Date(value); return isNaN(d) ? "—" : new Intl.DateTimeFormat("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).format(d); }
function fmtSlot(slot){ return /^\d{2}:\d{2}$/.test(slot) ? slot : "—"; }
function isValidTime(slot){ return /^([01]\d|2[0-3]):[0-5]\d$/.test(slot); }
function unique(arr){ return [...new Set(arr)]; }
function parseList(text){ return unique(String(text || "").split(",").map(x => x.trim()).filter(Boolean)); }
function weekdayCode(date){ return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]; }
function inputValue(id){ return document.getElementById(id)?.value?.trim() || ""; }
function textValue(id){ return document.getElementById(id)?.value || ""; }
function showNotice(message){ alert(message); }

function defaultState(){
  const now = nowIso();
  const thisMonthStart = todayIso().slice(0,8) + "01";
  const thisMonthEnd = todayIso().slice(0,8) + "30";
  return {
    meta: { version: 1, generatedAt: now },
    settings: {
      country: "Armenia",
      interfaceLanguage: "ru",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      email: "affixooperations@gmail.com",
      role: "admin",
      patient: "Myself"
    },
    ui: { onlyOverdue: false, onlyActive: false, search: "" },
    medications: [
      { id: uid(), no: 1, active: true, name: "Амоксициллин", doseValue: "500", doseUnit: "mg", doseCustom: "", notes: "После еды", mode: "daily", weekdays: [], dates: [], slots: ["08:30","13:45","21:10"], startDate: thisMonthStart, endDate: thisMonthEnd, changedAt: now, rowHistory: [{at:now, action:"created"}] },
      { id: uid(), no: 2, active: true, name: "Парацетамол", doseValue: "1", doseUnit: "tablet", doseCustom: "", notes: "По необходимости", mode: "weekdays", weekdays: ["Mon","Wed","Fri"], dates: [], slots: ["09:00","22:00"], startDate: thisMonthStart, endDate: thisMonthEnd, changedAt: now, rowHistory: [{at:now, action:"created"}] },
      { id: uid(), no: 3, active: false, name: "Витамин D", doseValue: "1", doseUnit: "capsule", doseCustom: "", notes: "", mode: "calendar", weekdays: [], dates: [todayIso()], slots: ["10:00"], startDate: "", endDate: "", changedAt: now, rowHistory: [{at:now, action:"created"},{at:now, action:"deactivated"}] }
    ],
    intakeLogs: []
  };
}

function normalizeMedication(raw, index){
  const now = nowIso();
  const slots = unique(Array.isArray(raw?.slots) ? raw.slots.filter(isValidTime).sort() : []);
  const weekdays = unique(Array.isArray(raw?.weekdays) ? raw.weekdays.filter(x => WEEKDAYS.includes(x)) : []);
  const dates = unique(Array.isArray(raw?.dates) ? raw.dates.filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x)).sort() : []);
  return {
    id: raw?.id || uid(),
    no: Number(raw?.no) || index + 1,
    active: Boolean(raw?.active),
    name: String(raw?.name || ""),
    doseValue: String(raw?.doseValue || ""),
    doseUnit: String(raw?.doseUnit || ""),
    doseCustom: String(raw?.doseCustom || ""),
    notes: String(raw?.notes || ""),
    mode: ["daily","weekdays","calendar"].includes(raw?.mode) ? raw.mode : "daily",
    weekdays,
    dates,
    slots,
    startDate: /^\d{4}-\d{2}-\d{2}$/.test(raw?.startDate || "") ? raw.startDate : "",
    endDate: /^\d{4}-\d{2}-\d{2}$/.test(raw?.endDate || "") ? raw.endDate : "",
    changedAt: raw?.changedAt || now,
    rowHistory: Array.isArray(raw?.rowHistory) ? raw.rowHistory.map(h => ({at: h?.at || now, action: String(h?.action || "changed")})) : [{at: now, action: "created"}]
  };
}

function normalizeState(raw){
  const fallback = defaultState();
  if(!raw || typeof raw !== "object") return fallback;
  const medications = Array.isArray(raw.medications) ? raw.medications.map(normalizeMedication).sort((a,b) => a.no - b.no) : fallback.medications;
  return {
    meta: { ...fallback.meta, ...(raw.meta || {}) },
    settings: { ...fallback.settings, ...(raw.settings || {}) },
    ui: { ...fallback.ui, ...(raw.ui || {}) },
    medications,
    intakeLogs: Array.isArray(raw.intakeLogs) ? raw.intakeLogs.filter(x => x && x.medicationId && x.scheduledAt).map(x => ({
      id: x.id || uid(),
      medicationId: x.medicationId,
      scheduledAt: x.scheduledAt,
      actualAt: x.actualAt || nowIso(),
      status: x.status === "cancelled" ? "cancelled" : "taken",
      note: String(x.note || "")
    })) : []
  };
}

function state(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return normalizeState(JSON.parse(raw)); } catch(e) {}
  }
  const fresh = defaultState();
  save(fresh);
  return fresh;
}
function save(next){ localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(next))); }

function doseText(m){ return m.doseCustom?.trim() ? m.doseCustom.trim() : [m.doseValue, unitLabel(m.doseUnit)].filter(Boolean).join(" "); }
function daysText(m){
  if(m.mode === "daily") return "Каждый день";
  if(m.mode === "weekdays") return (m.weekdays || []).map(x => WEEKDAYS_MAP[x] || x).join(", ") || "—";
  return (m.dates || []).map(fmtDate).join(", ") || "—";
}
function matchesSearch(m, search){
  const hay = [m.name, m.notes, doseText(m), m.mode, daysText(m)].join(" ").toLowerCase();
  return hay.includes(search.toLowerCase());
}
function scheduledKey(date, slot){ return `${date}T${slot}:00`; }
function intakeFor(mid, slot, date = todayIso()){ return state().intakeLogs.find(x => x.medicationId === mid && x.scheduledAt === scheduledKey(date, slot)) || null; }
function classifyLog(log){
  if(!log) return null;
  if(log.status === "cancelled") return "cancelled";
  const actual = new Date(log.actualAt).getTime();
  const planned = new Date(log.scheduledAt).getTime();
  const delta = actual - planned;
  if(delta < -EARLY_THRESHOLD_MIN * 60 * 1000) return "early";
  if(delta <= ONTIME_THRESHOLD_MIN * 60 * 1000) return "onTime";
  return "late";
}
function applicableToday(m){
  if(!m.active) return false;
  const today = parseLocalDate(todayIso());
  if(!today) return false;
  if(m.mode === "calendar") return (m.dates || []).includes(todayIso());
  const start = m.startDate ? parseLocalDate(m.startDate) : null;
  const end = m.endDate ? parseLocalDate(m.endDate) : null;
  if(start && today < start) return false;
  if(end && today > end) return false;
  if(m.mode === "daily") return true;
  if(m.mode === "weekdays") return (m.weekdays || []).includes(weekdayCode(today));
  return false;
}
function unresolvedSlots(m){ return (m.slots || []).filter(slot => !intakeFor(m.id, slot)); }
function statusCode(m, slot, date = todayIso()){
  const log = intakeFor(m.id, slot, date);
  if(log) return classifyLog(log);
  const planned = parseLocalDateTime(date, slot)?.getTime();
  if(!planned) return "waiting";
  return Date.now() < planned ? "waiting" : "overdue";
}
function statusText(code){ return ({waiting:t("waiting"), overdue:t("overdue"), onTime:t("onTime"), late:t("late"), early:t("early"), cancelled:t("cancelled")})[code] || code; }
function nextDueSlot(){
  const items = [];
  state().medications.filter(applicableToday).forEach(m => {
    (m.slots || []).forEach(slot => {
      const code = statusCode(m, slot);
      if(["waiting","overdue"].includes(code)){
        items.push({ name: m.name, slot, planned: parseLocalDateTime(todayIso(), slot)?.getTime() || Infinity, code });
      }
    });
  });
  items.sort((a,b) => a.planned - b.planned);
  return items[0] || null;
}
function todayMetrics(){
  const meds = state().medications.filter(applicableToday);
  const slots = meds.flatMap(m => (m.slots || []).map(slot => ({m, slot, code: statusCode(m, slot)})));
  return {
    total: slots.length,
    overdue: slots.filter(x => x.code === "overdue").length,
    waiting: slots.filter(x => x.code === "waiting").length,
    taken: slots.filter(x => ["onTime","late","early"].includes(x.code)).length,
    cancelled: slots.filter(x => x.code === "cancelled").length,
    activeRows: meds.length
  };
}

function shell(title, active){
  const s = state();
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>
  :root{--bg:#f4f7fb;--card:#fff;--text:#101828;--muted:#667085;--line:#dbe0ea;--accent:#1d2939;--accent-2:#344054;--ok:#067647;--warn:#b54708;--danger:#b42318;--soft:#eef4ff;--good-bg:#f6fef9;--warn-bg:#fffaeb;--danger-bg:#fff5f5;--purple-bg:#f9f5ff}
  *{box-sizing:border-box} body{margin:0;background:linear-gradient(180deg,#f7f9fc 0%,#eff4fb 100%);font-family:Inter,Arial,sans-serif;color:var(--text);line-height:1.45}
  .wrap{max-width:1480px;margin:0 auto;padding:20px 16px 40px}.topbar,.card,.stat,.slot,.panel,.hero-mini,.notice{background:var(--card);border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 26px rgba(16,24,40,.05)}
  .topbar{padding:14px 16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin-bottom:16px}.top-left,.top-right{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  .card,.panel,.hero-mini,.notice{padding:18px;margin-bottom:16px}.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:16px}.info-grid{display:grid;grid-template-columns:1.4fr .8fr;gap:16px;margin-bottom:16px}
  .stat{padding:16px}.stat b{display:block;font-size:30px;margin-top:6px}.nav{display:flex;gap:8px;flex-wrap:wrap}.btn,a.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--text);text-decoration:none;font-weight:700;cursor:pointer}
  .btn:hover,a.btn:hover{transform:translateY(-1px)} .btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)} .btn.secondary{background:var(--soft);border-color:#c6d4ff}.btn.active{background:var(--soft);border-color:var(--accent)} .btn.danger{border-color:#f3c2bf;background:#fff7f6;color:var(--danger)}
  .pill{display:inline-flex;align-items:center;padding:6px 10px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:12px;font-weight:600}.muted{color:var(--muted)} .small{font-size:12px} h1,h2,h3{margin:0 0 10px}.sub{font-size:14px;color:var(--muted)}
  table{width:100%;border-collapse:collapse} th,td{padding:10px 8px;border-bottom:1px solid #edf0f5;text-align:left;vertical-align:top} th{background:#fafbff;font-size:13px;position:sticky;top:0}.slot{padding:10px;margin:6px 0}.badge{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:12px;border:1px solid var(--line);background:#fff;font-weight:700}
  .badge.waiting{color:#344054}.badge.overdue{color:var(--danger);background:var(--danger-bg);border-color:#fecaca}.badge.onTime{color:var(--ok);background:var(--good-bg);border-color:#abefc6}.badge.late,.badge.early{color:var(--warn);background:var(--warn-bg);border-color:#fedf89}.badge.cancelled{color:#6941c6;background:var(--purple-bg);border-color:#d9d6fe}
  .inline{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:12px}.col-3{grid-column:span 3}.col-4{grid-column:span 4}.col-5{grid-column:span 5}.col-6{grid-column:span 6}.col-7{grid-column:span 7}.col-8{grid-column:span 8}.col-12{grid-column:span 12}
  input,select,textarea{width:100%;min-height:42px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff;font:inherit} textarea{min-height:88px;resize:vertical} dialog{border:1px solid var(--line);border-radius:18px;padding:18px;max-width:860px;width:min(860px,92vw)} dialog::backdrop{background:rgba(0,0,0,.28)}
  .label{font-size:13px;color:var(--muted);margin-bottom:6px}.sticky-tools{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-bottom:12px}.nowrap{white-space:nowrap}.kpi{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.hero-mini{background:linear-gradient(135deg,#fff 0%,#f9fbff 100%)}
  .split{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:flex-start}.disclaimer{font-size:13px;color:var(--muted);padding-top:10px;border-top:1px dashed var(--line);margin-top:12px}.table-scroll{overflow:auto;max-height:65vh}.footer-note{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--muted)}
  @media (max-width:1100px){.col-3,.col-4,.col-5,.col-6,.col-7,.col-8{grid-column:span 12}.info-grid{grid-template-columns:1fr}.wrap{padding-inline:12px}}
  </style></head><body><div class="wrap">
    <div class="topbar">
      <div class="top-left">
        <div class="nav">
          <a class="btn ${active === "input" ? "active" : ""}" href="input.html">${t("input")}</a>
          <a class="btn ${active === "board" ? "active" : ""}" href="dashboard.html">${t("board")}</a>
          <a class="btn ${active === "action" ? "active" : ""}" href="action.html">${t("action")}</a>
          <a class="btn ${active === "settings" ? "active" : ""}" href="settings.html">${t("settings")}</a>
        </div>
      </div>
      <div class="top-right">
        <span class="pill">${t("patient")}: <b>${esc(s.settings.patient)}</b></span>
        <span class="pill">${t("standardMode")}</span>
        <span class="pill">${t("currentDate")}: <b id="currentDate"></b></span>
        <span class="pill">${t("currentTime")}: <b id="currentTime"></b></span>
      </div>
    </div>
    <section class="hero-mini">
      <div class="split">
        <div>
          <h1>${esc(title)}</h1>
          <div class="sub">${t("salesReadyText")}</div>
        </div>
        <div class="inline">
          <span class="pill">${t("commercialReady")}</span>
          <span class="pill">Local-first</span>
          <span class="pill">Offline demo</span>
        </div>
      </div>
      <div class="disclaimer"><b>${t("medicalDisclaimerTitle")}:</b> ${t("disclaimer")}</div>
    </section>`;
}

function footerHtml(){
  return `<div class="footer-note"><span>${t("modeHelp")}</span><span>${t("exportHint")}</span></div></div></body></html>`;
}

function attachClock(){
  function tick(){
    const now = new Date();
    const date = new Intl.DateTimeFormat("ru-RU", {day:"2-digit", month:"2-digit", year:"numeric"}).format(now);
    const time = new Intl.DateTimeFormat("ru-RU", {hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false}).format(now);
    const d = document.getElementById("currentDate"); if(d) d.textContent = date;
    const tEl = document.getElementById("currentTime"); if(tEl) tEl.textContent = time;
    const localDate = document.getElementById("localDate"); if(localDate) localDate.value = date;
    const localTime = document.getElementById("localTime"); if(localTime) localTime.value = time;
    const tz = document.getElementById("timezone"); if(tz) tz.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }
  tick();
  clearInterval(window.__medTick);
  window.__medTick = setInterval(tick, 1000);
}

function collectMedication(prefix){
  const unit = inputValue(prefix + "DoseUnit");
  const mode = inputValue(prefix + "Mode");
  const name = inputValue(prefix + "Name");
  const doseValue = inputValue(prefix + "DoseValue");
  const doseCustom = unit === "custom" ? inputValue(prefix + "DoseCustom") : "";
  const slots = parseList(inputValue(prefix + "Slots")).sort();
  const weekdays = mode === "weekdays" ? parseList(inputValue(prefix + "Weekdays")) : [];
  const dates = mode === "calendar" ? parseList(inputValue(prefix + "Dates")).sort() : [];
  const startDate = mode === "calendar" ? "" : inputValue(prefix + "StartDate");
  const endDate = mode === "calendar" ? "" : inputValue(prefix + "EndDate");
  const notes = textValue(prefix + "Notes").trim();

  if(!name) throw new Error("Введите название препарата.");
  if(name.length > 120) throw new Error("Название слишком длинное.");
  if(!slots.length) throw new Error("Добавьте хотя бы один слот.");
  if(slots.some(x => !isValidTime(x))) throw new Error("Слоты должны быть в формате HH:MM.");
  if(unique(slots).length !== slots.length) throw new Error("Одинаковые слоты повторяются.");
  if(unit === "custom" && !doseCustom) throw new Error("Для своей дозировки заполните текстовое значение.");
  if(unit !== "custom" && !doseValue) throw new Error("Укажите дозу.");
  if(mode === "weekdays" && !weekdays.length) throw new Error("Для режима по дням недели укажите хотя бы один день.");
  if(mode === "weekdays" && weekdays.some(x => !WEEKDAYS.includes(x))) throw new Error("Используйте коды Mon,Tue,Wed,Thu,Fri,Sat,Sun.");
  if(mode === "calendar" && !dates.length) throw new Error("Для режима по календарным датам укажите хотя бы одну дату.");
  if(mode === "calendar" && dates.some(x => !/^\d{4}-\d{2}-\d{2}$/.test(x))) throw new Error("Календарные даты должны быть в формате YYYY-MM-DD.");
  if(mode !== "calendar" && !startDate) throw new Error("Укажите дату начала.");
  if(mode !== "calendar" && !endDate) throw new Error("Укажите дату окончания.");
  if(startDate && endDate && startDate > endDate) throw new Error("Дата начала не может быть позже даты окончания.");

  return {name, doseValue, doseUnit: unit === "custom" ? "" : unit, doseCustom, mode, weekdays, dates, slots, startDate, endDate, notes};
}

function syncUi(partial){
  const s = state();
  s.ui = { ...s.ui, ...partial };
  save(s);
}

window.addRow = function(){
  try{
    const data = collectMedication("new");
    const s = state();
    const now = nowIso();
    const nextNo = s.medications.length ? Math.max(...s.medications.map(x => Number(x.no) || 0)) + 1 : 1;
    s.medications.push({ id: uid(), no: nextNo, active: true, changedAt: now, rowHistory: [{at:now, action:"created"}], ...data });
    save(s);
    mount("input");
    showNotice(t("rowAdded"));
  }catch(err){ alert(err.message); }
};

window.toggleActive = function(id){
  const s = state();
  const m = s.medications.find(x => x.id === id);
  if(!m) return;
  m.active = !m.active;
  m.changedAt = nowIso();
  m.rowHistory = m.rowHistory || [];
  m.rowHistory.push({at:m.changedAt, action:m.active ? "activated" : "deactivated"});
  save(s);
  mount("input");
};

window.extendRow = function(id){
  const s = state();
  const m = s.medications.find(x => x.id === id);
  if(!m) return;
  if(m.mode === "calendar") return alert("Для календарных дат используйте Изменить.");
  const end = parseLocalDate(m.endDate || todayIso()) || parseLocalDate(todayIso());
  end.setDate(end.getDate() + 30);
  m.endDate = `${end.getFullYear()}-${pad2(end.getMonth()+1)}-${pad2(end.getDate())}`;
  m.changedAt = nowIso();
  m.rowHistory.push({at:m.changedAt, action:"extended_30d"});
  save(s);
  mount("input");
};

window.showRowHistory = function(id){
  const m = state().medications.find(x => x.id === id);
  if(!m) return;
  const body = document.getElementById("rowHistoryBody");
  body.innerHTML = (m.rowHistory || []).length ? `<ul>${m.rowHistory.map(h => `<li>${fmtDateTime(h.at)} — ${esc(h.action)}</li>`).join("")}</ul>` : "—";
  document.getElementById("rowHistoryDialog").showModal();
};

let editingId = null;
window.openEditRow = function(id){
  const m = state().medications.find(x => x.id === id);
  if(!m) return;
  editingId = id;
  document.getElementById("editRowBody").innerHTML = `
    <div class="grid">
      <div class="col-6"><div class="label">${t("medication")}</div><input id="editName" value="${esc(m.name)}"></div>
      <div class="col-3"><div class="label">${t("dose")}</div><input id="editDoseValue" value="${esc(m.doseValue)}"></div>
      <div class="col-3"><div class="label">Единица</div><select id="editDoseUnit">${[...UNITS, "custom"].map(u => `<option value="${u}" ${(m.doseUnit || "custom") === u ? "selected" : ""}>${u === "custom" ? "Своя дозировка" : unitLabel(u)}</option>`).join("")}</select></div>
      <div class="col-6"><div class="label">Своя дозировка</div><input id="editDoseCustom" value="${esc(m.doseCustom || "")}"></div>
      <div class="col-6"><div class="label">${t("notes")}</div><input id="editNotes" value="${esc(m.notes || "")}"></div>
      <div class="col-4"><div class="label">${t("schedule")}</div><select id="editMode"><option value="daily" ${m.mode === "daily" ? "selected" : ""}>${t("daily")}</option><option value="weekdays" ${m.mode === "weekdays" ? "selected" : ""}>${t("weekdays")}</option><option value="calendar" ${m.mode === "calendar" ? "selected" : ""}>${t("calendar")}</option></select></div>
      <div class="col-4"><div class="label">Дни недели</div><input id="editWeekdays" value="${esc((m.weekdays || []).join(","))}" placeholder="Mon,Wed,Fri"></div>
      <div class="col-4"><div class="label">Календарные даты</div><input id="editDates" value="${esc((m.dates || []).join(", "))}" placeholder="2026-04-10, 2026-04-15"></div>
      <div class="col-4"><div class="label">${t("slots")}</div><input id="editSlots" value="${esc((m.slots || []).join(", "))}" placeholder="08:30, 13:45"></div>
      <div class="col-4"><div class="label">${t("startDate")}</div><input id="editStartDate" type="date" value="${esc(m.startDate || "")}"></div>
      <div class="col-4"><div class="label">${t("endDate")}</div><input id="editEndDate" type="date" value="${esc(m.endDate || "")}"></div>
    </div>`;
  const dialog = document.getElementById("editRowDialog");
  dialog.showModal();
};

window.saveEditedRow = function(){
  try{
    const s = state();
    const m = s.medications.find(x => x.id === editingId);
    if(!m) return;
    const data = collectMedication("edit");
    Object.assign(m, data, {changedAt: nowIso()});
    m.rowHistory = m.rowHistory || [];
    m.rowHistory.push({at:m.changedAt, action:"edited"});
    save(s);
    document.getElementById("editRowDialog").close();
    mount("input");
    showNotice(t("rowSaved"));
  }catch(err){ alert(err.message); }
};

function upsertIntakeLog(mid, slot, actualAt, status, note = ""){
  const s = state();
  const key = scheduledKey(todayIso(), slot);
  s.intakeLogs = s.intakeLogs.filter(x => !(x.medicationId === mid && x.scheduledAt === key));
  s.intakeLogs.push({id: uid(), medicationId: mid, scheduledAt: key, actualAt, status, note});
  save(s);
}

window.takeSlot = function(mid, slot){
  upsertIntakeLog(mid, slot, nowIso(), "taken", "");
  mount("action");
};
window.cancelSlot = function(mid, slot){
  upsertIntakeLog(mid, slot, nowIso(), "cancelled", "");
  mount("action");
};
window.correctSlot = function(mid, slot){
  const existing = intakeFor(mid, slot);
  document.getElementById("correctBody").innerHTML = `
    <div class="grid">
      <div class="col-6"><div class="label">${t("plannedSlot")}</div><input value="${esc(todayIso())} ${esc(slot)}" readonly></div>
      <div class="col-6"><div class="label">${t("status")}</div><input value="${esc(existing ? statusText(classifyLog(existing)) : t("waiting"))}" readonly></div>
      <div class="col-6"><div class="label">Дата</div><input id="correctDate" type="date" value="${todayIso()}"></div>
      <div class="col-6"><div class="label">Время</div><input id="correctTime" type="time" value="${existing ? new Date(existing.actualAt).toISOString().slice(11,16) : slot}"></div>
      <div class="col-12"><div class="label">${t("intakeComment")}</div><textarea id="correctNote" placeholder="${t("notesPlaceholder")}">${esc(existing?.note || "")}</textarea></div>
    </div>
    <div class="inline" style="margin-top:12px">
      <button class="btn primary" onclick="applyCorrection('${mid}','${slot}')">${t("apply")}</button>
      <button class="btn" onclick="clearCorrection('${mid}','${slot}')">${t("clear")}</button>
    </div>`;
  document.getElementById("correctDialog").showModal();
};
window.applyCorrection = function(mid, slot){
  const date = inputValue("correctDate") || todayIso();
  const time = inputValue("correctTime");
  const note = textValue("correctNote").trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return alert("Укажите корректную дату.");
  if(!isValidTime(time)) return alert("Укажите корректное время.");
  const actual = parseLocalDateTime(date, time);
  if(!actual) return alert("Не удалось разобрать дату и время.");
  upsertIntakeLog(mid, slot, actual.toISOString(), "taken", note);
  document.getElementById("correctDialog").close();
  mount("action");
};
window.clearCorrection = function(mid, slot){
  const s = state();
  const key = scheduledKey(todayIso(), slot);
  s.intakeLogs = s.intakeLogs.filter(x => !(x.medicationId === mid && x.scheduledAt === key));
  save(s);
  document.getElementById("correctDialog").close();
  mount("action");
};
window.showIntakeHistory = function(mid){
  const items = state().intakeLogs.filter(x => x.medicationId === mid).sort((a,b) => new Date(b.actualAt) - new Date(a.actualAt));
  const body = document.getElementById("intakeHistoryBody");
  body.innerHTML = items.length ? `<ul>${items.map(x => `<li>${fmtDateTime(x.actualAt)} — ${esc(statusText(classifyLog(x)))} — ${t("plannedSlot")}: ${esc(x.scheduledAt.replace("T", " ").slice(0,16))}${x.note ? ` — ${esc(x.note)}` : ""}</li>`).join("")}</ul>` : "—";
  document.getElementById("intakeHistoryDialog").showModal();
};

window.saveSettings = function(){
  const s = state();
  s.settings.country = inputValue("country") || s.settings.country;
  s.settings.interfaceLanguage = inputValue("interfaceLanguage") || s.settings.interfaceLanguage;
  s.settings.patient = inputValue("patient") || s.settings.patient;
  s.settings.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  save(s);
  mount("settings");
  showNotice(t("settingsSaved"));
};

window.exportData = function(){
  const snapshot = { ...state(), meta: { version: 1, exportedAt: nowIso() } };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `medcontrol-standard-${todayIso()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
};
window.triggerImport = function(){ document.getElementById("importFile")?.click(); };
window.importData = function(event){
  const file = event.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = normalizeState(JSON.parse(String(reader.result)));
      save(parsed);
      mount("input");
      showNotice(t("importDone"));
    } catch(e){
      alert("Не удалось импортировать JSON.");
    }
  };
  reader.readAsText(file, "utf-8");
};
window.resetDemo = function(){ if(confirm("Сбросить данные к демо-состоянию?")){ save(defaultState()); mount("input"); } };
window.toggleOnlyOverdue = function(){ const s = state(); s.ui.onlyOverdue = !s.ui.onlyOverdue; save(s); mount(location.pathname.includes("dashboard") ? "board" : "action"); };
window.setSearch = function(value){ syncUi({ search: value || "" }); mount("input"); };
window.toggleOnlyActive = function(){ const s = state(); s.ui.onlyActive = !s.ui.onlyActive; save(s); mount("input"); };

function metricsHtml(){
  const m = todayMetrics();
  const nextDue = nextDueSlot();
  return `<section class="info-grid">
    <div>
      <section class="stat-grid">
        <div class="stat"><div class="kpi">Всего слотов</div><b>${m.total}</b></div>
        <div class="stat"><div class="kpi">${t("waiting")}</div><b>${m.waiting}</b></div>
        <div class="stat"><div class="kpi">${t("overdue")}</div><b>${m.overdue}</b></div>
        <div class="stat"><div class="kpi">${t("taken")}</div><b>${m.taken}</b></div>
        <div class="stat"><div class="kpi">${t("cancelled")}</div><b>${m.cancelled}</b></div>
      </section>
    </div>
    <section class="panel">
      <h3>${t("controlCenter")}</h3>
      <div class="small muted">${t("stateReady")}</div>
      <div style="margin:10px 0 4px"><b>Активных строк сегодня:</b> ${m.activeRows}</div>
      <div><b>${t("nextDue")}:</b> ${nextDue ? `${esc(nextDue.name)} — ${esc(nextDue.slot)} (${esc(statusText(nextDue.code))})` : "—"}</div>
      <div class="disclaimer">${t("disclaimer")}</div>
    </section>
  </section>`;
}
function statusBadge(code){ return `<span class="badge ${code}">${statusText(code)}</span>`; }

function renderInput(){
  const s = state();
  const search = s.ui.search || "";
  const rows = s.medications
    .filter(m => !s.ui.onlyActive || m.active)
    .filter(m => !search || matchesSearch(m, search))
    .sort((a,b) => a.no - b.no)
    .map(m => `<tr>
      <td><b>${m.no}</b></td>
      <td>${m.active ? `<span class="badge onTime">${t("active")}</span>` : `<span class="badge cancelled">${t("passive")}</span>`}</td>
      <td><b>${esc(m.name)}</b>${m.notes ? `<div class="small muted">${esc(m.notes)}</div>` : ""}</td>
      <td>${esc(doseText(m))}</td>
      <td>${esc(m.mode === "daily" ? t("daily") : m.mode === "weekdays" ? t("weekdays") : t("calendar"))}</td>
      <td>${esc(daysText(m))}</td>
      <td>${(m.slots || []).map(fmtSlot).join(", ") || "—"}</td>
      <td>${fmtDate(m.startDate)}</td>
      <td>${fmtDate(m.endDate)}</td>
      <td>
        <div class="inline">
          <button class="btn" onclick="openEditRow('${m.id}')">${t("edit")}</button>
          <button class="btn" onclick="extendRow('${m.id}')">${t("extend")}</button>
          <button class="btn ${m.active ? "danger" : "secondary"}" onclick="toggleActive('${m.id}')">${m.active ? t("passive") : t("active")}</button>
          <button class="btn" onclick="showRowHistory('${m.id}')">${t("history")}</button>
        </div>
      </td>
      <td>${fmtDateTime(m.changedAt)}</td>
    </tr>`).join("");

  document.body.innerHTML = shell("MedControl Standard — Ввод", "input") + `
    ${metricsHtml()}
    <div class="sticky-tools">
      <button class="btn" onclick="exportData()">${t("export")}</button>
      <button class="btn" onclick="triggerImport()">${t("import")}</button>
      <button class="btn danger" onclick="resetDemo()">${t("resetDemo")}</button>
      <input id="importFile" type="file" accept="application/json" style="display:none" onchange="importData(event)">
    </div>
    <section class="card">
      <div class="split">
        <div>
          <h2>${t("createRow")}</h2>
          <div class="sub">Добавление новой строки препарата с защитой от пустых и некорректных данных.</div>
        </div>
        <span class="pill">${t("commercialReady")}</span>
      </div>
      <div class="grid">
        <div class="col-4"><div class="label">${t("medication")}</div><input id="newName" placeholder="Например: Амоксициллин"></div>
        <div class="col-2"><div class="label">${t("dose")}</div><input id="newDoseValue" placeholder="500"></div>
        <div class="col-2"><div class="label">Единица</div><select id="newDoseUnit"><option value="mg">мг</option>${UNITS.map(u => `<option value="${u}">${unitLabel(u)}</option>`).join("")}<option value="custom">Своя дозировка</option></select></div>
        <div class="col-4"><div class="label">Своя дозировка</div><input id="newDoseCustom" placeholder="1/2 таблетки утром" style="display:none"></div>
        <div class="col-4"><div class="label">${t("schedule")}</div><select id="newMode"><option value="daily">${t("daily")}</option><option value="weekdays">${t("weekdays")}</option><option value="calendar">${t("calendar")}</option></select></div>
        <div class="col-4"><div class="label">Дни недели</div><input id="newWeekdays" placeholder="Mon,Wed,Fri" style="display:none"></div>
        <div class="col-4"><div class="label">Календарные даты</div><input id="newDates" placeholder="2026-04-10, 2026-04-12" style="display:none"></div>
        <div class="col-4"><div class="label">${t("slots")}</div><input id="newSlots" placeholder="08:30, 13:45, 21:10"></div>
        <div class="col-4"><div class="label">${t("startDate")}</div><input id="newStartDate" type="date" value="${todayIso()}"></div>
        <div class="col-4"><div class="label">${t("endDate")}</div><input id="newEndDate" type="date" value="${todayIso().slice(0,8)}30"></div>
        <div class="col-12"><div class="label">${t("notes")}</div><textarea id="newNotes" placeholder="${t("notesPlaceholder")}"></textarea></div>
      </div>
      <div class="inline" style="margin-top:12px"><button class="btn primary" onclick="addRow()">${t("addRow")}</button></div>
    </section>
    <section class="card">
      <div class="split" style="margin-bottom:10px">
        <div>
          <h2>Все строки</h2>
          <div class="sub">Фильтрация и быстрый обзор всех препаратов.</div>
        </div>
        <div class="inline">
          <input style="width:260px" placeholder="${t("searchPlaceholder")}" value="${esc(search)}" oninput="setSearch(this.value)">
          <button class="btn ${s.ui.onlyActive ? "active" : ""}" onclick="toggleOnlyActive()">${t("onlyActive")}</button>
        </div>
      </div>
      <div class="table-scroll"><table><thead><tr><th>№</th><th>${t("status")}</th><th>${t("medication")}</th><th>${t("dose")}</th><th>${t("schedule")}</th><th>${t("daysDates")}</th><th>${t("slots")}</th><th>${t("startDate")}</th><th>${t("endDate")}</th><th>${t("actions")}</th><th>${t("changedAt")}</th></tr></thead><tbody>${rows || `<tr><td colspan="11">${t("noResults")}</td></tr>`}</tbody></table></div>
    </section>
    <dialog id="rowHistoryDialog"><h2>${t("rowHistory")}</h2><div id="rowHistoryBody"></div><div style="margin-top:12px"><button class="btn" onclick="document.getElementById('rowHistoryDialog').close()">${t("close")}</button></div></dialog>
    <dialog id="editRowDialog"><h2>${t("edit")}</h2><div id="editRowBody"></div><div style="margin-top:12px" class="inline"><button class="btn primary" onclick="saveEditedRow()">${t("save")}</button><button class="btn" onclick="document.getElementById('editRowDialog').close()">${t("close")}</button></div></dialog>
    ${footerHtml()}`;
  attachClock();
  const unit = document.getElementById("newDoseUnit");
  const custom = document.getElementById("newDoseCustom");
  const mode = document.getElementById("newMode");
  const weekdays = document.getElementById("newWeekdays");
  const dates = document.getElementById("newDates");
  const start = document.getElementById("newStartDate");
  const end = document.getElementById("newEndDate");
  function sync(){
    custom.style.display = unit.value === "custom" ? "block" : "none";
    weekdays.style.display = mode.value === "weekdays" ? "block" : "none";
    dates.style.display = mode.value === "calendar" ? "block" : "none";
    start.disabled = mode.value === "calendar";
    end.disabled = mode.value === "calendar";
  }
  unit.onchange = sync;
  mode.onchange = sync;
  sync();
}

function renderBoard(){
  const onlyOverdue = !!state().ui.onlyOverdue;
  const rows = state().medications.filter(applicableToday).map(m => {
    const slots = unresolvedSlots(m).filter(slot => !onlyOverdue || statusCode(m, slot) === "overdue");
    if(!slots.length) return "";
    return `<tr><td><b>${m.no}</b></td><td><b>${esc(m.name)}</b>${m.notes ? `<div class="small muted">${esc(m.notes)}</div>` : ""}</td><td>${esc(doseText(m))}</td><td>${slots.map(slot => `<div class="slot"><div class="inline"><b>${fmtSlot(slot)}</b>${statusBadge(statusCode(m, slot))}</div></div>`).join("")}</td></tr>`;
  }).join("");
  document.body.innerHTML = shell("MedControl Standard — Табло", "board") + `
    ${metricsHtml()}
    <section class="card">
      <div class="split" style="margin-bottom:8px"><div><h2>Активные задачи на сегодня</h2><div class="sub">Показываются только невыполненные или неотмененные слоты.</div></div><div class="inline"><button class="btn ${onlyOverdue ? "active" : ""}" onclick="toggleOnlyOverdue()">${t("onlyOverdue")}</button><button class="btn" onclick="mount('board')">${t("syncNow")}</button></div></div>
      <div class="table-scroll"><table><thead><tr><th>№</th><th>${t("medication")}</th><th>${t("dose")}</th><th>${t("slots")}</th></tr></thead><tbody>${rows || `<tr><td colspan="4">${onlyOverdue ? t("todayEmpty") : t("dashboardEmpty")}</td></tr>`}</tbody></table></div>
    </section>
    ${footerHtml()}`;
  attachClock();
}

function renderAction(){
  const onlyOverdue = !!state().ui.onlyOverdue;
  const rows = state().medications.filter(applicableToday).map(m => {
    const slots = (m.slots || []).filter(slot => !onlyOverdue || statusCode(m, slot) === "overdue");
    if(!slots.length) return "";
    return `<tr>
      <td><b>${m.no}</b></td>
      <td><b>${esc(m.name)}</b>${m.notes ? `<div class="small muted">${esc(m.notes)}</div>` : ""}</td>
      <td>${esc(doseText(m))}</td>
      <td>${slots.map(slot => `<div class="slot"><b>${fmtSlot(slot)}</b></div>`).join("")}</td>
      <td>${slots.map(slot => `<div class="slot">${statusBadge(statusCode(m, slot))}</div>`).join("")}</td>
      <td>${slots.map(slot => { const log = intakeFor(m.id, slot); if(!log) return `<div class="slot inline"><button class="btn primary" onclick="takeSlot('${m.id}','${slot}')">${t("take")}</button><button class="btn" onclick="cancelSlot('${m.id}','${slot}')">${t("cancel")}</button><button class="btn secondary" onclick="correctSlot('${m.id}','${slot}')">${t("manualTime")}</button></div>`; if(log.status === "cancelled") return `<div class="slot inline"><button class="btn secondary" onclick="correctSlot('${m.id}','${slot}')">${t("correct")}</button></div>`; return `<div class="slot inline"><button class="btn" onclick="cancelSlot('${m.id}','${slot}')">${t("cancel")}</button><button class="btn secondary" onclick="correctSlot('${m.id}','${slot}')">${t("correct")}</button></div>`; }).join("")}</td>
      <td>${slots.map(slot => { const log = intakeFor(m.id, slot); return `<div class="slot">${fmtDateTime(log?.actualAt)}${log?.note ? `<div class="small muted">${esc(log.note)}</div>` : ""}</div>`; }).join("")}</td>
      <td><button class="btn" onclick="showIntakeHistory('${m.id}')">${t("history")}</button></td>
    </tr>`;
  }).join("");
  document.body.innerHTML = shell("MedControl Standard — Принятие", "action") + `
    ${metricsHtml()}
    <section class="card">
      <div class="split" style="margin-bottom:8px"><div><h2>Фиксация приема</h2><div class="sub">Можно отметить прием сразу, отменить его или внести корректировку фактического времени.</div></div><div class="inline"><button class="btn ${onlyOverdue ? "active" : ""}" onclick="toggleOnlyOverdue()">${t("onlyOverdue")}</button><button class="btn" onclick="mount('action')">${t("syncNow")}</button></div></div>
      <div class="table-scroll"><table><thead><tr><th>№</th><th>${t("medication")}</th><th>${t("dose")}</th><th>${t("slots")}</th><th>${t("status")}</th><th>${t("actions")}</th><th>${t("actualAction")}</th><th>${t("history")}</th></tr></thead><tbody>${rows || `<tr><td colspan="8">${t("actionEmpty")}</td></tr>`}</tbody></table></div>
    </section>
    <dialog id="intakeHistoryDialog"><h2>${t("intakeHistory")}</h2><div id="intakeHistoryBody"></div><div style="margin-top:12px"><button class="btn" onclick="document.getElementById('intakeHistoryDialog').close()">${t("close")}</button></div></dialog>
    <dialog id="correctDialog"><h2>${t("correct")}</h2><div id="correctBody"></div><div style="margin-top:12px"><button class="btn" onclick="document.getElementById('correctDialog').close()">${t("close")}</button></div></dialog>
    ${footerHtml()}`;
  attachClock();
}

function renderSettings(){
  const s = state();
  document.body.innerHTML = shell("MedControl Standard — Настройки", "settings") + `
    <section class="card"><h2>${t("patientProfile")}</h2><div class="grid"><div class="col-4"><div class="label">${t("email")}</div><input value="${esc(s.settings.email)}" disabled></div><div class="col-4"><div class="label">${t("role")}</div><input value="${esc(s.settings.role)}" disabled></div><div class="col-4"><div class="label">${t("patient")}</div><input id="patient" value="${esc(s.settings.patient)}"></div></div></section>
    <section class="card"><h2>${t("regional")}</h2><div class="grid"><div class="col-4"><div class="label">${t("country")}</div><select id="country">${COUNTRIES.map(c => `<option value="${c}" ${c === s.settings.country ? "selected" : ""}>${c}</option>`).join("")}</select></div><div class="col-4"><div class="label">${t("language")}</div><select id="interfaceLanguage">${LANGUAGES.map(([code,label]) => `<option value="${code}" ${code === s.settings.interfaceLanguage ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="col-4"><div class="label">${t("timezone")}</div><input id="timezone" readonly></div><div class="col-6"><div class="label">Локальная дата</div><input id="localDate" readonly></div><div class="col-6"><div class="label">Локальное время</div><input id="localTime" readonly></div></div><div class="inline" style="margin-top:12px"><button class="btn primary" onclick="saveSettings()">${t("saveSettings")}</button></div></section>
    <section class="notice"><h3>${t("salesReadyTitle")}</h3><div class="sub">${t("salesReadyText")}</div><div class="disclaimer"><b>${t("medicalDisclaimerTitle")}:</b> ${t("disclaimer")}</div></section>
    ${footerHtml()}`;
  attachClock();
}

window.mount = function(page){
  if(page === "input") return renderInput();
  if(page === "board") return renderBoard();
  if(page === "action") return renderAction();
  if(page === "settings") return renderSettings();
};
