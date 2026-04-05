const STORAGE_KEY = 'affixo_medcontrol_standard_v3';
const DEFAULT_GRACE_MINUTES = 30;

const SUPPORTED_LANGUAGES = [
  ['ru', 'Русский'],
  ['en', 'English'],
  ['hy', 'Հայերեն'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['ar', 'العربية'],
  ['zh', '中文'],
  ['ja', '日本語']
];

const COUNTRY_OPTIONS = [
  'Armenia','Argentina','Australia','Austria','Belgium','Brazil','Canada','China','Egypt','France','Germany','India','Italy','Japan','Mexico','Netherlands','Russia','Spain','Sweden','Switzerland','United Arab Emirates','United Kingdom','United States'
];

const WEEKDAYS = [
  ['Mon','Пн'],['Tue','Вт'],['Wed','Ср'],['Thu','Чт'],['Fri','Пт'],['Sat','Сб'],['Sun','Вс']
];

const SCHEDULE_TYPES = {
  daily: 'Каждый день',
  weekdays: 'Дни недели',
  explicit_dates: 'Даты'
};

const TRANSLATIONS = {
  ru: {
    nav_input: 'Ввод', nav_dashboard: 'Табло', nav_action: 'Принятие', nav_settings: 'Настройки',
    title_input: 'MedControl — Ввод', title_dashboard: 'MedControl — Табло', title_action: 'MedControl — Принятие', title_settings: 'MedControl — Настройки',
    current_date: 'Текущая дата', current_time: 'Текущее время', timezone: 'Часовой пояс',
    language: 'Язык интерфейса', auto_detected_language: 'Автоопределённый язык устройства', country: 'Страна',
    interface_logic: 'Логика интерфейса', auto_logic: 'Что делает автоматика',
    medication: 'Препарат', dose: 'Доза', schedule: 'Расписание', time_slots: 'Время', start_date: 'Дата начала', end_date: 'Дата окончания', mode: 'Режим',
    active: 'Активно', passive: 'Пассивно', add_medication: 'Добавить препарат', edit: 'Изменить', history: 'История',
    every_day: 'Каждый день', weekdays: 'Дни недели', explicit_dates: 'Даты',
    weekdays_hint: 'Например: Пн, Ср, Пт', explicit_dates_hint: 'Например: 2026-04-10, 2026-04-20', times_hint: 'Например: 09:00, 14:30, 21:00',
    name_hint: 'Название препарата', dose_hint: 'Например: 500 мг / 1 таблетка / Vitamin D 2000 IU',
    add: 'Добавить', close: 'Закрыть', save: 'Сохранить', cancel: 'Отменить', take: 'Принял', correct: 'Исправить',
    expected: 'Ожидается', upcoming: 'Предстоит', overdue: 'Просрочено',
    taken_on_time: 'Вовремя', taken_early: 'Досрочно', taken_late: 'С опозданием', cancelled: 'Отменено',
    no_items: 'На сегодня активных позиций нет.', no_history: 'История для выбранной строки пока пуста.',
    today_overview: 'Текущее состояние на день', history_title: 'История выбранной строки', row_history_title: 'История изменений строки',
    planned_time: 'Назначенное время', actual_time: 'Фактическое время', result: 'Результат', status: 'Статус',
    history_period: 'Период истории', period_today: 'Сегодня', period_7: 'Последние 7 дней', period_30: 'Последние 30 дней', period_all: 'Весь период',
    settings_intro: 'Интерфейс запускается на языке устройства, если этот язык подготовлен в системе. В Настройках язык можно изменить вручную в любой момент.',
    settings_help_1: 'Язык интерфейса — заранее подготовленный перевод текста разделов, кнопок и названий полей.',
    settings_help_2: 'Названия препаратов вводятся пользователем вручную. Можно использовать алфавит любого языка и смешанные записи.',
    settings_help_3: 'Часовой пояс определяется устройством автоматически. При его изменении система сразу пересчитывает состояния Ожидается / Предстоит / Просрочено.',
    settings_help_4: 'В рабочем режиме удаление данных не используется. Для отключения препарата применяется режим Пассивно.',
    settings_help_5: 'Дата начала и дата окончания ограничивают период действия расписания. До начала препарат не участвует, после окончания больше не формируется.',
    input_intro: 'Во Вводе создаётся правило приёма: название, доза, расписание, время, дата начала, дата окончания и режим Активно / Пассивно.',
    input_help_1: 'Каждый день — препарат формируется ежедневно в заданное время.',
    input_help_2: 'Дни недели — выбираются конкретные дни недели и одно или несколько времён.',
    input_help_3: 'Даты — задаются конкретные календарные даты. Для этого варианта даты начала и окончания не требуются.',
    input_help_4: 'Если препарат отменён врачом или больше не используется, переведите его в Пассивно. Он не будет отображаться в Табло и Принятии.',
    dashboard_intro: 'Табло показывает только текущий день. История и прошлые записи здесь не отображаются.',
    action_intro: 'В Принятии фиксируется фактический результат. После действия система сразу сохраняет время отметки и обновляет Табло.',
    settings_title_1: 'Параметры устройства и интерфейса', settings_title_2: 'Пояснения по работе системы',
    input_title_1: 'Новый препарат', input_title_2: 'Список препаратов', input_title_3: 'Варианты заполнения',
    dashboard_title_1: 'Состояния текущего дня', action_title_1: 'Фиксация результата',
    row: 'Строка', actions: 'Действия', details: 'Детали', state: 'Состояние',
    starts_after: 'Начинается с', ends_after: 'Заканчивается', dates: 'Даты', weekdays_selected: 'Дни недели',
    mark_time: 'Время отметки', choose_action: 'Действие', apply_correction: 'Применить исправление',
    correction_help: 'Исправление относится только к записи о приёме выбранной строки.',
    schedule_rule: 'Правило приёма', selected_row: 'Выбранная строка',
    unsupported_language: 'Для языка устройства подготовленный интерфейс не найден. Использован английский.',
    patient_data: 'Рабочий режим', patient_data_value: 'Локальные данные текущего устройства',
    expected_at: 'Ожидается', upcoming_at: 'Предстоит', overdue_at: 'Просрочено',
    yes: 'Да', no: 'Нет'
  },
  en: {
    nav_input: 'Input', nav_dashboard: 'Board', nav_action: 'Intake', nav_settings: 'Settings',
    title_input: 'MedControl — Input', title_dashboard: 'MedControl — Board', title_action: 'MedControl — Intake', title_settings: 'MedControl — Settings',
    current_date: 'Current date', current_time: 'Current time', timezone: 'Time zone', language: 'Interface language', auto_detected_language: 'Detected device language', country: 'Country', interface_logic: 'Interface logic', auto_logic: 'What automation does', medication: 'Medication', dose: 'Dose', schedule: 'Schedule', time_slots: 'Time', start_date: 'Start date', end_date: 'End date', mode: 'Mode', active: 'Active', passive: 'Passive', add_medication: 'Add medication', edit: 'Edit', history: 'History', every_day: 'Every day', weekdays: 'Weekdays', explicit_dates: 'Dates', weekdays_hint: 'Example: Mon, Wed, Fri', explicit_dates_hint: 'Example: 2026-04-10, 2026-04-20', times_hint: 'Example: 09:00, 14:30, 21:00', name_hint: 'Medication name', dose_hint: 'Example: 500 mg / 1 tablet / Vitamin D 2000 IU', add: 'Add', close: 'Close', save: 'Save', cancel: 'Cancel', take: 'Taken', correct: 'Correct', expected: 'Expected', upcoming: 'Upcoming', overdue: 'Overdue', taken_on_time: 'On time', taken_early: 'Early', taken_late: 'Late', cancelled: 'Cancelled', no_items: 'No active items for today.', no_history: 'No history yet for this row.', today_overview: 'Today overview', history_title: 'History for selected row', row_history_title: 'Row change history', planned_time: 'Planned time', actual_time: 'Actual time', result: 'Result', status: 'Status', history_period: 'History period', period_today: 'Today', period_7: 'Last 7 days', period_30: 'Last 30 days', period_all: 'All time', settings_intro: 'The interface starts in the device language when that language is prepared in the system. You can switch language manually at any time in Settings.', settings_help_1: 'Interface language is a prebuilt translation of section names, buttons and field names.', settings_help_2: 'Medication names are typed by the user manually. Any alphabet and mixed writing are allowed.', settings_help_3: 'The time zone is detected from the device automatically. When it changes, the system recalculates Expected / Upcoming / Overdue immediately.', settings_help_4: 'In working mode data deletion is not used. To disable a medication use Passive mode.', settings_help_5: 'Start date and end date limit the period where the schedule works. Before the start the medication is inactive; after the end it stops generating.', input_intro: 'Input creates the intake rule: name, dose, schedule, time, start date, end date and Active / Passive mode.', input_help_1: 'Every day — the medication is generated daily at the selected time.', input_help_2: 'Weekdays — choose specific weekdays and one or more times.', input_help_3: 'Dates — choose exact calendar dates. Start and end dates are not required for this option.', input_help_4: 'If a medication is stopped by a doctor or no longer used, switch it to Passive. It will disappear from Board and Intake.', dashboard_intro: 'Board shows only the current day. History and past records are not shown here.', action_intro: 'Intake stores the factual result. After any action the system saves the timestamp immediately and refreshes the Board.', settings_title_1: 'Device and interface parameters', settings_title_2: 'How the system works', input_title_1: 'New medication', input_title_2: 'Medication list', input_title_3: 'Fill-in options', dashboard_title_1: 'Current day states', action_title_1: 'Result capture', row: 'Row', actions: 'Actions', details: 'Details', state: 'State', starts_after: 'Starts from', ends_after: 'Ends on', dates: 'Dates', weekdays_selected: 'Weekdays', mark_time: 'Mark time', choose_action: 'Action', apply_correction: 'Apply correction', correction_help: 'Correction affects only the intake record of the selected row.', schedule_rule: 'Intake rule', selected_row: 'Selected row', unsupported_language: 'No prepared interface was found for the device language. English has been used.', patient_data: 'Working mode', patient_data_value: 'Local data on the current device', expected_at: 'Expected', upcoming_at: 'Upcoming', overdue_at: 'Overdue', yes: 'Yes', no: 'No'
  }
};

function tr(key) {
  const lang = getState().settings.interfaceLanguage;
  const table = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return table[key] || TRANSLATIONS.en[key] || key;
}

function detectLanguage() {
  const langs = [];
  if (Array.isArray(navigator.languages)) langs.push(...navigator.languages);
  if (navigator.language) langs.push(navigator.language);
  const normalized = langs.map(x => String(x || '').toLowerCase());
  for (const item of normalized) {
    const code = item.split('-')[0];
    if (SUPPORTED_LANGUAGES.some(([id]) => id === code) && TRANSLATIONS[code]) return code;
  }
  return 'en';
}

function inferCountryFromLocale() {
  const locale = navigator.language || 'en-US';
  const region = (locale.split('-')[1] || '').toUpperCase();
  const map = {
    AM: 'Armenia', AR: 'Argentina', AU: 'Australia', AT: 'Austria', BE: 'Belgium', BR: 'Brazil', CA: 'Canada', CN: 'China', EG: 'Egypt', FR: 'France', DE: 'Germany', IN: 'India', IT: 'Italy', JP: 'Japan', MX: 'Mexico', NL: 'Netherlands', RU: 'Russia', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', AE: 'United Arab Emirates', GB: 'United Kingdom', US: 'United States'
  };
  return map[region] || 'United States';
}

function nowISO() {
  return new Date().toISOString();
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeDefaultState() {
  const detected = detectLanguage();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return {
    settings: {
      detectedLanguage: detected,
      interfaceLanguage: TRANSLATIONS[detected] ? detected : 'en',
      country: inferCountryFromLocale(),
      timezone,
      locale: navigator.language || 'en-US',
      infoDismissed: false
    },
    medications: [],
    intakeLogs: []
  };
}

function getState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      parsed.settings = parsed.settings || {};
      parsed.medications = Array.isArray(parsed.medications) ? parsed.medications : [];
      parsed.intakeLogs = Array.isArray(parsed.intakeLogs) ? parsed.intakeLogs : [];
      if (!parsed.settings.detectedLanguage) parsed.settings.detectedLanguage = detectLanguage();
      if (!parsed.settings.interfaceLanguage) parsed.settings.interfaceLanguage = TRANSLATIONS[parsed.settings.detectedLanguage] ? parsed.settings.detectedLanguage : 'en';
      if (!parsed.settings.country) parsed.settings.country = inferCountryFromLocale();
      if (!parsed.settings.timezone) parsed.settings.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      return parsed;
    } catch (err) {}
  }
  const initial = makeDefaultState();
  saveState(initial);
  return initial;
}

function saveState(state) {
  state.settings.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function localDateFromISO(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function currentLocalDate() {
  return localDateFromISO(nowISO());
}

function formatDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(getState().settings.interfaceLanguage === 'ru' ? 'ru-RU' : 'en-US', { day:'2-digit', month:'2-digit', year:'numeric' }).format(d);
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(getState().settings.interfaceLanguage === 'ru' ? 'ru-RU' : 'en-US', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:false }).format(d);
}

function parseWeekdays(text) {
  const map = {
    'пн':'Mon','mon':'Mon', 'monday':'Mon',
    'вт':'Tue','tue':'Tue', 'tuesday':'Tue',
    'ср':'Wed','wed':'Wed', 'wednesday':'Wed',
    'чт':'Thu','thu':'Thu', 'thursday':'Thu',
    'пт':'Fri','fri':'Fri', 'friday':'Fri',
    'сб':'Sat','sat':'Sat', 'saturday':'Sat',
    'вс':'Sun','sun':'Sun', 'sunday':'Sun'
  };
  return text.split(',').map(x => x.trim().toLowerCase()).filter(Boolean).map(x => map[x]).filter(Boolean);
}

function parseCSV(text) {
  return text.split(',').map(x => x.trim()).filter(Boolean);
}

function parseTimes(text) {
  return parseCSV(text).filter(x => /^\d{2}:\d{2}$/.test(x)).sort();
}

function medicationRuleSummary(med) {
  const base = med.scheduleType === 'daily' ? tr('every_day') : med.scheduleType === 'weekdays' ? tr('weekdays') : tr('explicit_dates');
  const detail = med.scheduleType === 'weekdays'
    ? med.weekdays.map(code => WEEKDAYS.find(x => x[0] === code)?.[1] || code).join(', ')
    : med.scheduleType === 'explicit_dates'
      ? med.explicitDates.map(formatDate).join(', ')
      : '—';
  const period = med.scheduleType === 'explicit_dates'
    ? '—'
    : `${med.startDate ? formatDate(med.startDate) : '—'} → ${med.endDate ? formatDate(med.endDate) : '—'}`;
  return `${base}; ${tr('time_slots')}: ${med.times.join(', ') || '—'}; ${tr('details')}: ${detail}; ${tr('schedule_rule')}: ${period}`;
}

function isMedicationApplicableOnDate(med, dateISO) {
  if (!med.active) return false;
  if (med.scheduleType === 'explicit_dates') {
    return med.explicitDates.includes(dateISO);
  }
  if (med.startDate && dateISO < med.startDate) return false;
  if (med.endDate && dateISO > med.endDate) return false;
  if (med.scheduleType === 'daily') return true;
  if (med.scheduleType === 'weekdays') {
    const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(dateISO + 'T00:00:00').getDay()];
    return med.weekdays.includes(weekday);
  }
  return false;
}

function getScheduledDateTime(dateISO, time) {
  return new Date(`${dateISO}T${time}:00`).toISOString();
}

function computeStatusForLog(plannedISO, actualISO, action) {
  if (action === 'cancelled') return 'cancelled';
  const planned = new Date(plannedISO).getTime();
  const actual = new Date(actualISO).getTime();
  if (actual < planned) return 'taken_early';
  if (actual <= planned + DEFAULT_GRACE_MINUTES * 60 * 1000) return 'taken_on_time';
  return 'taken_late';
}

function getLogForSchedule(medicationId, plannedISO) {
  return getState().intakeLogs.find(log => log.medicationId === medicationId && log.plannedAt === plannedISO) || null;
}

function buildTodayEntries() {
  const dateISO = currentLocalDate();
  const now = Date.now();
  const entries = [];
  const state = getState();
  state.medications.forEach(med => {
    if (!isMedicationApplicableOnDate(med, dateISO)) return;
    med.times.forEach(time => {
      const plannedAt = getScheduledDateTime(dateISO, time);
      const plannedMs = new Date(plannedAt).getTime();
      const log = getLogForSchedule(med.id, plannedAt);
      let boardState = null;
      if (!log) {
        if (plannedMs <= now) boardState = 'expected';
        if (plannedMs > now) boardState = 'upcoming';
        if (plannedMs + DEFAULT_GRACE_MINUTES * 60 * 1000 < now) boardState = 'overdue';
      }
      entries.push({
        medication: med,
        plannedTime: time,
        plannedAt,
        log,
        boardState,
        displayStatus: log ? computeStatusForLog(plannedAt, log.actualAt, log.action) : boardState
      });
    });
  });
  return entries.sort((a, b) => a.plannedAt.localeCompare(b.plannedAt));
}

function recordRowHistory(med, action, payload) {
  med.rowHistory = Array.isArray(med.rowHistory) ? med.rowHistory : [];
  med.rowHistory.unshift({ at: nowISO(), action, payload });
}

function appShell(title, activePage, body) {
  const tz = escapeHtml(getState().settings.timezone);
  return `<!doctype html><html lang="${escapeHtml(getState().settings.interfaceLanguage)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>
    :root{--fg:#111827;--muted:#6b7280;--bd:#e5e7eb;--bg:#f8fafc;--card:#ffffff;--soft:#f3f4f6;--ok:#ecfdf5;--warn:#fff7ed;--bad:#fef2f2}
    *{box-sizing:border-box} body{margin:0;font-family:Arial,sans-serif;background:var(--bg);color:var(--fg);line-height:1.45}
    .wrap{max-width:1380px;margin:0 auto;padding:20px 16px 48px}.topbar,.card{background:var(--card);border:1px solid var(--bd);border-radius:16px}
    .topbar{padding:14px;margin-bottom:16px}.nav{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.nav a,.nav button{display:inline-flex;align-items:center;gap:6px;text-decoration:none;padding:10px 14px;border-radius:12px;border:1px solid var(--bd);background:#fff;color:var(--fg);cursor:pointer;font:inherit}
    .nav .active{border-color:#111827;background:#111827;color:#fff}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.pill{display:inline-flex;gap:6px;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid var(--bd);background:#fff;font-size:12px}
    .card{padding:18px;margin-bottom:16px}.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
    .muted{color:var(--muted)} h1,h2,h3{margin:0 0 12px} p{margin:0 0 12px} ul{margin:8px 0 0 18px;padding:0} li{margin:6px 0}
    table{width:100%;border-collapse:collapse} th,td{padding:10px 8px;border-bottom:1px solid var(--bd);text-align:left;vertical-align:top} th{font-size:13px;background:#fafafa}
    .status{display:inline-flex;padding:4px 10px;border-radius:999px;border:1px solid var(--bd);font-size:12px}.expected{background:var(--warn)}.upcoming{background:#eff6ff}.overdue{background:var(--bad)}.success{background:var(--ok)}
    label{display:block;font-weight:bold;margin-bottom:6px} input,select,textarea,button{font:inherit} input,select,textarea{width:100%;padding:10px 12px;border:1px solid var(--bd);border-radius:12px;background:#fff}
    textarea{min-height:88px;resize:vertical}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.full{grid-column:1 / -1}.inline{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.slot{padding:10px;border:1px solid var(--bd);border-radius:12px;background:#fff;margin-bottom:10px}
    dialog{border:1px solid var(--bd);border-radius:16px;padding:18px;max-width:820px;width:calc(100% - 24px)} dialog::backdrop{background:rgba(0,0,0,.3)} .right{text-align:right}
    .small{font-size:12px}.mono{font-family:ui-monospace,Consolas,monospace}.help{padding:12px;border-radius:12px;background:#fafafa;border:1px solid var(--bd)}
    @media(max-width:960px){.grid2,.grid3,.form-grid{grid-template-columns:1fr}}
  </style></head><body><div class="wrap">
    <section class="topbar"><div class="nav">
      <a class="${activePage==='input'?'active':''}" href="input.html">${escapeHtml(tr('nav_input'))}</a>
      <a class="${activePage==='dashboard'?'active':''}" href="dashboard.html">${escapeHtml(tr('nav_dashboard'))}</a>
      <a class="${activePage==='action'?'active':''}" href="action.html">${escapeHtml(tr('nav_action'))}</a>
      <a class="${activePage==='settings'?'active':''}" href="settings.html">${escapeHtml(tr('nav_settings'))}</a>
    </div>
    <div class="meta">
      <span class="pill">${escapeHtml(tr('current_date'))}: <strong id="topCurrentDate"></strong></span>
      <span class="pill">${escapeHtml(tr('current_time'))}: <strong id="topCurrentTime"></strong></span>
      <span class="pill">${escapeHtml(tr('timezone'))}: <strong class="mono">${tz}</strong></span>
      <span class="pill">${escapeHtml(tr('language'))}: <strong>${escapeHtml((SUPPORTED_LANGUAGES.find(x=>x[0]===getState().settings.interfaceLanguage)||['en','English'])[1])}</strong></span>
    </div></section>
    ${body}
  </div></body></html>`;
}

function updateTopClock() {
  const state = getState();
  const lang = state.settings.interfaceLanguage === 'ru' ? 'ru-RU' : 'en-US';
  const now = new Date();
  const dateText = new Intl.DateTimeFormat(lang, { day:'2-digit', month:'2-digit', year:'numeric' }).format(now);
  const timeText = new Intl.DateTimeFormat(lang, { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }).format(now);
  const dateEl = document.getElementById('topCurrentDate');
  const timeEl = document.getElementById('topCurrentTime');
  if (dateEl) dateEl.textContent = dateText;
  if (timeEl) timeEl.textContent = timeText;
}

function scheduleClock() {
  updateTopClock();
  clearInterval(window.__medcontrolClock);
  window.__medcontrolClock = setInterval(updateTopClock, 1000);
}

function createMedicationFromForm(prefix) {
  const name = document.getElementById(`${prefix}name`).value.trim();
  const dose = document.getElementById(`${prefix}dose`).value.trim();
  const scheduleType = document.getElementById(`${prefix}scheduleType`).value;
  const times = parseTimes(document.getElementById(`${prefix}times`).value);
  const startDate = document.getElementById(`${prefix}startDate`).value;
  const endDate = document.getElementById(`${prefix}endDate`).value;
  const active = document.getElementById(`${prefix}active`).checked;
  const weekdays = scheduleType === 'weekdays' ? parseWeekdays(document.getElementById(`${prefix}weekdays`).value) : [];
  const explicitDates = scheduleType === 'explicit_dates' ? parseCSV(document.getElementById(`${prefix}explicitDates`).value) : [];

  if (!name) throw new Error('name');
  if (!dose) throw new Error('dose');
  if (!times.length) throw new Error('times');
  if (scheduleType === 'weekdays' && !weekdays.length) throw new Error('weekdays');
  if (scheduleType === 'explicit_dates' && !explicitDates.length) throw new Error('dates');
  if (scheduleType !== 'explicit_dates' && startDate && endDate && startDate > endDate) throw new Error('period');

  return { name, dose, scheduleType, times, startDate: scheduleType === 'explicit_dates' ? '' : startDate, endDate: scheduleType === 'explicit_dates' ? '' : endDate, active, weekdays, explicitDates };
}

function rowHistoryHtml(entries) {
  if (!entries || !entries.length) return `<p class="muted">${escapeHtml(tr('no_history'))}</p>`;
  return `<table><thead><tr><th>${escapeHtml(tr('actual_time'))}</th><th>${escapeHtml(tr('result'))}</th><th>${escapeHtml(tr('details'))}</th></tr></thead><tbody>${entries.map(entry => `<tr><td>${escapeHtml(formatDateTime(entry.at))}</td><td>${escapeHtml(entry.action)}</td><td>${escapeHtml(entry.payload || '—')}</td></tr>`).join('')}</tbody></table>`;
}

function intakeHistoryRows(medId, period) {
  const logs = getState().intakeLogs.filter(log => log.medicationId === medId).filter(log => {
    if (period === 'all') return true;
    const actual = new Date(log.actualAt).getTime();
    const now = Date.now();
    if (period === 'today') return localDateFromISO(log.actualAt) === currentLocalDate();
    if (period === '7') return actual >= now - 7 * 24 * 60 * 60 * 1000;
    if (period === '30') return actual >= now - 30 * 24 * 60 * 60 * 1000;
    return true;
  }).sort((a,b) => new Date(b.actualAt) - new Date(a.actualAt));
  if (!logs.length) return `<p class="muted">${escapeHtml(tr('no_history'))}</p>`;
  return `<table><thead><tr><th>${escapeHtml(tr('planned_time'))}</th><th>${escapeHtml(tr('actual_time'))}</th><th>${escapeHtml(tr('result'))}</th><th>${escapeHtml(tr('status'))}</th></tr></thead><tbody>${logs.map(log => `<tr><td>${escapeHtml(formatDateTime(log.plannedAt))}</td><td>${escapeHtml(formatDateTime(log.actualAt))}</td><td>${escapeHtml(log.action === 'taken' ? tr('take') : tr('cancel'))}</td><td>${escapeHtml(statusLabel(log.status))}</td></tr>`).join('')}</tbody></table>`;
}

function statusLabel(code) {
  const map = {
    expected: tr('expected'),
    upcoming: tr('upcoming'),
    overdue: tr('overdue'),
    taken_on_time: tr('taken_on_time'),
    taken_early: tr('taken_early'),
    taken_late: tr('taken_late'),
    cancelled: tr('cancelled')
  };
  return map[code] || code;
}

function statusClass(code) {
  if (code === 'expected') return 'status expected';
  if (code === 'upcoming') return 'status upcoming';
  if (code === 'overdue') return 'status overdue';
  return 'status success';
}

function renderInputPage() {
  const state = getState();
  const rows = state.medications.slice().sort((a,b) => a.order - b.order).map(med => `
    <tr>
      <td>${med.order}</td>
      <td>${escapeHtml(med.name)}</td>
      <td>${escapeHtml(med.dose)}</td>
      <td>${escapeHtml(med.scheduleType === 'daily' ? tr('every_day') : med.scheduleType === 'weekdays' ? tr('weekdays') : tr('explicit_dates'))}</td>
      <td>${escapeHtml(med.scheduleType === 'weekdays' ? med.weekdays.map(code => WEEKDAYS.find(x=>x[0]===code)?.[1] || code).join(', ') : med.scheduleType === 'explicit_dates' ? med.explicitDates.join(', ') : '—')}</td>
      <td>${escapeHtml(med.times.join(', '))}</td>
      <td>${med.scheduleType === 'explicit_dates' ? '—' : escapeHtml(formatDate(med.startDate))}</td>
      <td>${med.scheduleType === 'explicit_dates' ? '—' : escapeHtml(formatDate(med.endDate))}</td>
      <td><span class="status ${med.active ? 'success' : 'upcoming'}">${escapeHtml(med.active ? tr('active') : tr('passive'))}</span></td>
      <td>
        <div class="inline">
          <button onclick="openEditMedication('${med.id}')">${escapeHtml(tr('edit'))}</button>
          <button onclick="toggleMedicationMode('${med.id}')">${escapeHtml(med.active ? tr('passive') : tr('active'))}</button>
          <button onclick="showRowHistory('${med.id}')">${escapeHtml(tr('history'))}</button>
        </div>
      </td>
    </tr>`).join('');

  const body = `
    <section class="card"><h1>${escapeHtml(tr('title_input'))}</h1><p>${escapeHtml(tr('input_intro'))}</p></section>
    <section class="grid2">
      <div class="card">
        <h2>${escapeHtml(tr('input_title_1'))}</h2>
        <div class="form-grid">
          <div><label>${escapeHtml(tr('medication'))}</label><input id="create_name" placeholder="${escapeHtml(tr('name_hint'))}"></div>
          <div><label>${escapeHtml(tr('dose'))}</label><input id="create_dose" placeholder="${escapeHtml(tr('dose_hint'))}"></div>
          <div><label>${escapeHtml(tr('schedule'))}</label><select id="create_scheduleType" onchange="syncCreateScheduleFields()"><option value="daily">${escapeHtml(tr('every_day'))}</option><option value="weekdays">${escapeHtml(tr('weekdays'))}</option><option value="explicit_dates">${escapeHtml(tr('explicit_dates'))}</option></select></div>
          <div><label>${escapeHtml(tr('time_slots'))}</label><input id="create_times" placeholder="${escapeHtml(tr('times_hint'))}"></div>
          <div id="create_weekdays_wrap" style="display:none"><label>${escapeHtml(tr('weekdays_selected'))}</label><input id="create_weekdays" placeholder="${escapeHtml(tr('weekdays_hint'))}"></div>
          <div id="create_dates_wrap" style="display:none"><label>${escapeHtml(tr('dates'))}</label><textarea id="create_explicitDates" placeholder="${escapeHtml(tr('explicit_dates_hint'))}"></textarea></div>
          <div id="create_start_wrap"><label>${escapeHtml(tr('start_date'))}</label><input id="create_startDate" type="date"></div>
          <div id="create_end_wrap"><label>${escapeHtml(tr('end_date'))}</label><input id="create_endDate" type="date"></div>
          <div><label>${escapeHtml(tr('mode'))}</label><div class="inline"><label><input id="create_active" type="checkbox" checked> ${escapeHtml(tr('active'))}</label></div></div>
          <div class="full right"><button onclick="createMedication()">${escapeHtml(tr('add'))}</button></div>
        </div>
      </div>
      <div class="card">
        <h2>${escapeHtml(tr('input_title_3'))}</h2>
        <div class="help"><ul>
          <li>${escapeHtml(tr('input_help_1'))}</li>
          <li>${escapeHtml(tr('input_help_2'))}</li>
          <li>${escapeHtml(tr('input_help_3'))}</li>
          <li>${escapeHtml(tr('input_help_4'))}</li>
        </ul></div>
      </div>
    </section>
    <section class="card"><h2>${escapeHtml(tr('input_title_2'))}</h2><table><thead><tr><th>${escapeHtml(tr('row'))}</th><th>${escapeHtml(tr('medication'))}</th><th>${escapeHtml(tr('dose'))}</th><th>${escapeHtml(tr('schedule'))}</th><th>${escapeHtml(tr('details'))}</th><th>${escapeHtml(tr('time_slots'))}</th><th>${escapeHtml(tr('start_date'))}</th><th>${escapeHtml(tr('end_date'))}</th><th>${escapeHtml(tr('mode'))}</th><th>${escapeHtml(tr('actions'))}</th></tr></thead><tbody>${rows || `<tr><td colspan="10">—</td></tr>`}</tbody></table></section>
    <dialog id="rowHistoryDialog"><h2>${escapeHtml(tr('row_history_title'))}</h2><div id="rowHistoryContent"></div><div class="right" style="margin-top:14px"><button onclick="document.getElementById('rowHistoryDialog').close()">${escapeHtml(tr('close'))}</button></div></dialog>
    <dialog id="editDialog"><h2>${escapeHtml(tr('edit'))}</h2><div id="editDialogContent"></div></dialog>`;
  document.body.innerHTML = appShell(tr('title_input'), 'input', body);
  scheduleClock();
  syncCreateScheduleFields();
}

function renderDashboardPage() {
  const entries = buildTodayEntries().filter(item => !item.log);
  const rows = entries.map(item => {
    const label = item.boardState === 'expected' ? tr('expected_at') : item.boardState === 'upcoming' ? tr('upcoming_at') : tr('overdue_at');
    return `<tr><td>${item.medication.order}</td><td>${escapeHtml(item.medication.name)}</td><td>${escapeHtml(item.medication.dose)}</td><td>${escapeHtml(medicationRuleSummary(item.medication))}</td><td><span class="${statusClass(item.boardState)}">${escapeHtml(label)} — ${escapeHtml(item.plannedTime)}</span></td></tr>`;
  }).join('');
  const body = `
    <section class="card"><h1>${escapeHtml(tr('title_dashboard'))}</h1><p>${escapeHtml(tr('dashboard_intro'))}</p></section>
    <section class="card"><h2>${escapeHtml(tr('dashboard_title_1'))}</h2><table><thead><tr><th>${escapeHtml(tr('row'))}</th><th>${escapeHtml(tr('medication'))}</th><th>${escapeHtml(tr('dose'))}</th><th>${escapeHtml(tr('schedule_rule'))}</th><th>${escapeHtml(tr('state'))}</th></tr></thead><tbody>${rows || `<tr><td colspan="5">${escapeHtml(tr('no_items'))}</td></tr>`}</tbody></table></section>`;
  document.body.innerHTML = appShell(tr('title_dashboard'), 'dashboard', body);
  scheduleClock();
}

function renderActionPage() {
  const entries = buildTodayEntries();
  const rows = entries.map(item => {
    const log = item.log;
    const actionButtons = !log
      ? `<button onclick="markTaken('${item.medication.id}','${item.plannedAt}')">${escapeHtml(tr('take'))}</button> <button onclick="markCancelled('${item.medication.id}','${item.plannedAt}')">${escapeHtml(tr('cancel'))}</button>`
      : `<button onclick="openCorrection('${item.medication.id}','${item.plannedAt}')">${escapeHtml(tr('correct'))}</button> <button onclick="showIntakeHistory('${item.medication.id}')">${escapeHtml(tr('history'))}</button>`;
    return `<tr><td>${item.medication.order}</td><td>${escapeHtml(item.medication.name)}</td><td>${escapeHtml(item.medication.dose)}</td><td>${escapeHtml(item.plannedTime)}</td><td><span class="${statusClass(item.displayStatus)}">${escapeHtml(statusLabel(item.displayStatus))}</span></td><td>${log ? escapeHtml(formatDateTime(log.actualAt)) : '—'}</td><td>${actionButtons}</td><td><button onclick="showIntakeHistory('${item.medication.id}')">${escapeHtml(tr('history'))}</button></td></tr>`;
  }).join('');
  const body = `
    <section class="card"><h1>${escapeHtml(tr('title_action'))}</h1><p>${escapeHtml(tr('action_intro'))}</p></section>
    <section class="card"><h2>${escapeHtml(tr('action_title_1'))}</h2><table><thead><tr><th>${escapeHtml(tr('row'))}</th><th>${escapeHtml(tr('medication'))}</th><th>${escapeHtml(tr('dose'))}</th><th>${escapeHtml(tr('planned_time'))}</th><th>${escapeHtml(tr('status'))}</th><th>${escapeHtml(tr('actual_time'))}</th><th>${escapeHtml(tr('actions'))}</th><th>${escapeHtml(tr('history'))}</th></tr></thead><tbody>${rows || `<tr><td colspan="8">${escapeHtml(tr('no_items'))}</td></tr>`}</tbody></table></section>
    <dialog id="intakeHistoryDialog"><h2>${escapeHtml(tr('history_title'))}</h2><div class="inline" style="margin-bottom:12px"><label>${escapeHtml(tr('history_period'))}</label><select id="historyPeriodSelect" onchange="refreshIntakeHistory()"><option value="today">${escapeHtml(tr('period_today'))}</option><option value="7">${escapeHtml(tr('period_7'))}</option><option value="30">${escapeHtml(tr('period_30'))}</option><option value="all">${escapeHtml(tr('period_all'))}</option></select></div><div id="intakeHistoryContent"></div><div class="right" style="margin-top:14px"><button onclick="document.getElementById('intakeHistoryDialog').close()">${escapeHtml(tr('close'))}</button></div></dialog>
    <dialog id="correctionDialog"><h2>${escapeHtml(tr('correct'))}</h2><div id="correctionContent"></div></dialog>`;
  document.body.innerHTML = appShell(tr('title_action'), 'action', body);
  scheduleClock();
}

function renderSettingsPage() {
  const state = getState();
  const detectedLabel = (SUPPORTED_LANGUAGES.find(x => x[0] === state.settings.detectedLanguage) || ['en','English'])[1];
  const activeLabel = (SUPPORTED_LANGUAGES.find(x => x[0] === state.settings.interfaceLanguage) || ['en','English'])[1];
  const body = `
    <section class="card"><h1>${escapeHtml(tr('title_settings'))}</h1><p>${escapeHtml(tr('settings_intro'))}</p></section>
    <section class="grid2">
      <div class="card"><h2>${escapeHtml(tr('settings_title_1'))}</h2>
        <div class="form-grid">
          <div><label>${escapeHtml(tr('auto_detected_language'))}</label><input readonly value="${escapeHtml(detectedLabel)}"></div>
          <div><label>${escapeHtml(tr('language'))}</label><select id="settingsInterfaceLanguage" onchange="changeInterfaceLanguage(this.value)">${SUPPORTED_LANGUAGES.filter(([id]) => !!TRANSLATIONS[id] || id === 'ru' || id === 'en').map(([id,label]) => `<option value="${id}" ${state.settings.interfaceLanguage === id ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select></div>
          <div><label>${escapeHtml(tr('country'))}</label><select id="settingsCountry" onchange="changeCountry(this.value)">${COUNTRY_OPTIONS.map(country => `<option value="${country}" ${state.settings.country === country ? 'selected' : ''}>${escapeHtml(country)}</option>`).join('')}</select></div>
          <div><label>${escapeHtml(tr('timezone'))}</label><input readonly value="${escapeHtml(state.settings.timezone)}"></div>
          <div><label>${escapeHtml(tr('patient_data'))}</label><input readonly value="${escapeHtml(tr('patient_data_value'))}"></div>
          <div><label>${escapeHtml(tr('language'))}</label><input readonly value="${escapeHtml(activeLabel)}"></div>
        </div>
      </div>
      <div class="card"><h2>${escapeHtml(tr('settings_title_2'))}</h2>
        <div class="help"><ul>
          <li>${escapeHtml(tr('settings_help_1'))}</li>
          <li>${escapeHtml(tr('settings_help_2'))}</li>
          <li>${escapeHtml(tr('settings_help_3'))}</li>
          <li>${escapeHtml(tr('settings_help_4'))}</li>
          <li>${escapeHtml(tr('settings_help_5'))}</li>
        </ul></div>
      </div>
    </section>`;
  document.body.innerHTML = appShell(tr('title_settings'), 'settings', body);
  scheduleClock();
}

function syncCreateScheduleFields() {
  const type = document.getElementById('create_scheduleType')?.value;
  const weekdaysWrap = document.getElementById('create_weekdays_wrap');
  const datesWrap = document.getElementById('create_dates_wrap');
  const startWrap = document.getElementById('create_start_wrap');
  const endWrap = document.getElementById('create_end_wrap');
  if (!type || !weekdaysWrap || !datesWrap || !startWrap || !endWrap) return;
  weekdaysWrap.style.display = type === 'weekdays' ? 'block' : 'none';
  datesWrap.style.display = type === 'explicit_dates' ? 'block' : 'none';
  startWrap.style.display = type === 'explicit_dates' ? 'none' : 'block';
  endWrap.style.display = type === 'explicit_dates' ? 'none' : 'block';
}

window.createMedication = function() {
  try {
    const state = getState();
    const med = createMedicationFromForm('create_');
    const item = {
      id: uid(),
      order: state.medications.length ? Math.max(...state.medications.map(x => x.order || 0)) + 1 : 1,
      ...med,
      rowHistory: []
    };
    recordRowHistory(item, 'created', medicationRuleSummary(item));
    state.medications.push(item);
    saveState(state);
    mount('input');
  } catch (err) {
    alert('Проверьте название, дозу, расписание, время и период.');
  }
};

window.toggleMedicationMode = function(id) {
  const state = getState();
  const med = state.medications.find(x => x.id === id);
  if (!med) return;
  med.active = !med.active;
  recordRowHistory(med, med.active ? 'active' : 'passive', med.active ? tr('active') : tr('passive'));
  saveState(state);
  mount('input');
};

window.openEditMedication = function(id) {
  const med = getState().medications.find(x => x.id === id);
  if (!med) return;
  const dialog = document.getElementById('editDialog');
  const content = document.getElementById('editDialogContent');
  content.innerHTML = `<div class="form-grid">
    <div><label>${escapeHtml(tr('medication'))}</label><input id="edit_name" value="${escapeHtml(med.name)}"></div>
    <div><label>${escapeHtml(tr('dose'))}</label><input id="edit_dose" value="${escapeHtml(med.dose)}"></div>
    <div><label>${escapeHtml(tr('schedule'))}</label><select id="edit_scheduleType" onchange="syncEditScheduleFields()"><option value="daily" ${med.scheduleType==='daily'?'selected':''}>${escapeHtml(tr('every_day'))}</option><option value="weekdays" ${med.scheduleType==='weekdays'?'selected':''}>${escapeHtml(tr('weekdays'))}</option><option value="explicit_dates" ${med.scheduleType==='explicit_dates'?'selected':''}>${escapeHtml(tr('explicit_dates'))}</option></select></div>
    <div><label>${escapeHtml(tr('time_slots'))}</label><input id="edit_times" value="${escapeHtml(med.times.join(', '))}"></div>
    <div id="edit_weekdays_wrap"><label>${escapeHtml(tr('weekdays_selected'))}</label><input id="edit_weekdays" value="${escapeHtml(med.weekdays.join(', '))}"></div>
    <div id="edit_dates_wrap"><label>${escapeHtml(tr('dates'))}</label><textarea id="edit_explicitDates">${escapeHtml(med.explicitDates.join(', '))}</textarea></div>
    <div id="edit_start_wrap"><label>${escapeHtml(tr('start_date'))}</label><input id="edit_startDate" type="date" value="${escapeHtml(med.startDate || '')}"></div>
    <div id="edit_end_wrap"><label>${escapeHtml(tr('end_date'))}</label><input id="edit_endDate" type="date" value="${escapeHtml(med.endDate || '')}"></div>
    <div><label>${escapeHtml(tr('mode'))}</label><label><input id="edit_active" type="checkbox" ${med.active ? 'checked' : ''}> ${escapeHtml(tr('active'))}</label></div>
    <div class="full right"><button onclick="saveMedicationEdit('${med.id}')">${escapeHtml(tr('save'))}</button> <button onclick="document.getElementById('editDialog').close()">${escapeHtml(tr('close'))}</button></div>
  </div>`;
  dialog.showModal();
  syncEditScheduleFields();
};

window.syncEditScheduleFields = function() {
  const type = document.getElementById('edit_scheduleType')?.value;
  const weekdaysWrap = document.getElementById('edit_weekdays_wrap');
  const datesWrap = document.getElementById('edit_dates_wrap');
  const startWrap = document.getElementById('edit_start_wrap');
  const endWrap = document.getElementById('edit_end_wrap');
  if (!type || !weekdaysWrap || !datesWrap || !startWrap || !endWrap) return;
  weekdaysWrap.style.display = type === 'weekdays' ? 'block' : 'none';
  datesWrap.style.display = type === 'explicit_dates' ? 'block' : 'none';
  startWrap.style.display = type === 'explicit_dates' ? 'none' : 'block';
  endWrap.style.display = type === 'explicit_dates' ? 'none' : 'block';
};

window.saveMedicationEdit = function(id) {
  try {
    const state = getState();
    const med = state.medications.find(x => x.id === id);
    if (!med) return;
    const updated = createMedicationFromForm('edit_');
    Object.assign(med, updated);
    recordRowHistory(med, 'edited', medicationRuleSummary(med));
    saveState(state);
    document.getElementById('editDialog').close();
    mount('input');
  } catch (err) {
    alert('Проверьте поля редактирования.');
  }
};

window.showRowHistory = function(id) {
  const med = getState().medications.find(x => x.id === id);
  if (!med) return;
  const content = document.getElementById('rowHistoryContent');
  content.innerHTML = rowHistoryHtml(med.rowHistory || []);
  document.getElementById('rowHistoryDialog').showModal();
};

function addOrReplaceLog(medicationId, plannedAt, action, actualAt) {
  const state = getState();
  state.intakeLogs = state.intakeLogs.filter(log => !(log.medicationId === medicationId && log.plannedAt === plannedAt));
  state.intakeLogs.push({
    id: uid(),
    medicationId,
    plannedAt,
    actualAt,
    action,
    status: computeStatusForLog(plannedAt, actualAt, action)
  });
  saveState(state);
}

window.markTaken = function(medicationId, plannedAt) {
  addOrReplaceLog(medicationId, plannedAt, 'taken', nowISO());
  mount('action');
};

window.markCancelled = function(medicationId, plannedAt) {
  addOrReplaceLog(medicationId, plannedAt, 'cancelled', nowISO());
  mount('action');
};

window.openCorrection = function(medicationId, plannedAt) {
  const existing = getLogForSchedule(medicationId, plannedAt);
  const dialog = document.getElementById('correctionDialog');
  const content = document.getElementById('correctionContent');
  const defaultValue = existing ? existing.actualAt.slice(0,16) : nowISO().slice(0,16);
  content.innerHTML = `<div class="form-grid"><div><label>${escapeHtml(tr('choose_action'))}</label><select id="correction_action"><option value="taken">${escapeHtml(tr('take'))}</option><option value="cancelled">${escapeHtml(tr('cancel'))}</option></select></div><div><label>${escapeHtml(tr('mark_time'))}</label><input id="correction_time" type="datetime-local" value="${escapeHtml(defaultValue)}"></div><div class="full"><p class="muted">${escapeHtml(tr('correction_help'))}</p></div><div class="full right"><button onclick="applyCorrection('${medicationId}','${plannedAt}')">${escapeHtml(tr('apply_correction'))}</button> <button onclick="document.getElementById('correctionDialog').close()">${escapeHtml(tr('close'))}</button></div></div>`;
  if (existing) {
    const select = content.querySelector('#correction_action');
    if (select) select.value = existing.action;
  }
  dialog.showModal();
};

window.applyCorrection = function(medicationId, plannedAt) {
  const action = document.getElementById('correction_action').value;
  const localValue = document.getElementById('correction_time').value;
  if (!localValue) return alert('Укажите время исправления.');
  addOrReplaceLog(medicationId, plannedAt, action, new Date(localValue).toISOString());
  document.getElementById('correctionDialog').close();
  mount('action');
};

window.showIntakeHistory = function(medicationId) {
  window.__historyMedicationId = medicationId;
  refreshIntakeHistory();
  document.getElementById('intakeHistoryDialog').showModal();
};

window.refreshIntakeHistory = function() {
  const medicationId = window.__historyMedicationId;
  if (!medicationId) return;
  const period = document.getElementById('historyPeriodSelect')?.value || 'today';
  const content = document.getElementById('intakeHistoryContent');
  content.innerHTML = intakeHistoryRows(medicationId, period);
};

window.changeInterfaceLanguage = function(language) {
  const state = getState();
  state.settings.interfaceLanguage = TRANSLATIONS[language] ? language : 'en';
  saveState(state);
  mount('settings');
};

window.changeCountry = function(country) {
  const state = getState();
  state.settings.country = country;
  saveState(state);
  mount('settings');
};

window.mount = function(page) {
  const state = getState();
  if (!TRANSLATIONS[state.settings.interfaceLanguage]) {
    state.settings.interfaceLanguage = 'en';
    saveState(state);
  }
  if (page === 'input') return renderInputPage();
  if (page === 'dashboard') return renderDashboardPage();
  if (page === 'action') return renderActionPage();
  if (page === 'settings') return renderSettingsPage();
};
