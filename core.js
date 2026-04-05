
const LANG_PATH = './lang/';
const LANG_KEY = 'lang';

let dict = {};
let available = [];

async function loadLang(code){
  const res = await fetch(LANG_PATH + code + '.json');
  if(!res.ok) return null;
  return await res.json();
}

function keys(obj){ return Object.keys(obj).sort().join('|'); }

async function init(){
  const en = await loadLang('en');
  const ru = await loadLang('ru');

  const masterKeys = keys(en);

  if(keys(ru) === masterKeys) available.push({code:'ru', data:ru});
  if(keys(en) === masterKeys) available.push({code:'en', data:en});

  let saved = localStorage.getItem(LANG_KEY);
  let lang = available.find(l=>l.code===saved);

  if(!lang){
    let nav = (navigator.language||'en').slice(0,2);
    lang = available.find(l=>l.code===nav) || available[0];
  }

  dict = lang.data;
  localStorage.setItem(LANG_KEY, lang.code);
}

function t(k){ return dict[k] || k; }

function mount(screen){
  init().then(()=>{
    document.body.innerHTML = `
      <h1>${t("app.name")}</h1>
      <nav>
        <a href="index.html">${t("nav.home")}</a>
        <a href="input.html">${t("nav.input")}</a>
        <a href="dashboard.html">${t("nav.dashboard")}</a>
        <a href="action.html">${t("nav.action")}</a>
        <a href="settings.html">${t("nav.settings")}</a>
      </nav>
      <div id="app"></div>
    `;

    if(screen === "settings"){
      renderSettings();
    }
  });
}

function renderSettings(){
  let html = `<h2>${t("settings.title")}</h2>
              <button onclick="chooseLang()">${t("settings.choose")}</button>`;
  document.getElementById("app").innerHTML = html;
}

function chooseLang(){
  let html = "<div>";
  available.forEach(l=>{
    html += `<button onclick="setLang('${l.code}')">${l.code}</button>`;
  });
  html += "</div>";
  document.body.innerHTML = html;
}

function setLang(code){
  localStorage.setItem(LANG_KEY, code);
  location.reload();
}
