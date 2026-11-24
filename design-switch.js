/* KADR — floating design switcher: Current site · V1 · V2 · V3. Self-contained, no dependencies. */
(function () {
  if (window.__kadrSwitch) return; window.__kadrSwitch = 1;
  var path = location.pathname;
  var m = path.match(/\/(v[1-4])\.html$/); var cur = m ? m[1] : 'cur';
  var lang = (document.documentElement.lang || 'uk').slice(0, 2);
  try { var q = new URLSearchParams(location.search).get('lang'); if (q) lang = q; } catch (e) {}
  var curPage = { uk: '/', ru: '/landing.html', en: '/landing-en.html', es: '/landing-es.html', de: '/landing-de.html' }[lang] || '/';
  var label = { uk: 'Дизайн', ru: 'Дизайн', en: 'Design', es: 'Diseño', de: 'Design' }[lang] || 'Design';
  var nowLabel = { uk: 'Поточний', ru: 'Текущий', en: 'Current', es: 'Actual', de: 'Aktuell' }[lang] || 'Current';
  var items = [['cur', nowLabel, curPage], ['v1', 'V1', '/v1.html?lang=' + lang], ['v2', 'V2', '/v2.html?lang=' + lang], ['v3', 'V3', '/v3.html?lang=' + lang], ['v4', 'V4', '/v4.html?lang=' + lang]];

  var css = '' +
    '.kds{position:fixed;z-index:2147483000;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);' +
    'display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;font:600 12px/1 Manrope,system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.02em;' +
    'color:#f4f1ea;background:linear-gradient(180deg in oklch,rgba(38,36,44,.78),rgba(16,15,20,.86));' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 0 0 1px rgba(255,255,255,.07),0 10px 30px -8px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.3);' +
    '-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);transition:opacity .3s,transform .3s}' +
    '.kds b{padding:0 10px 0 12px;font-weight:600;opacity:.55;white-space:nowrap}' +
    '.kds a{position:relative;display:block;padding:9px 13px;border-radius:999px;color:inherit;text-decoration:none;white-space:nowrap;opacity:.72;transition:opacity .2s,background .25s}' +
    '.kds a:hover{opacity:1;background:rgba(255,255,255,.07)}' +
    '.kds a:focus-visible{outline:2px solid #e9c98b;outline-offset:1px;opacity:1}' +
    '.kds a[aria-current]{opacity:1;color:#17130c;background:linear-gradient(160deg in oklch,#fff3d6 0%,#e9c98b 38%,#c99a55 72%,#f0d9a6 100%);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 2px 10px -2px rgba(233,201,139,.55)}' +
    '.kds button{all:unset;cursor:pointer;padding:9px 10px;opacity:.5;border-radius:999px}.kds button:hover{opacity:1}' +
    '.kds.min a,.kds.min b{display:none}.kds.min button{padding:9px 14px;opacity:.9}' +
    '@media (max-width:760px){.kds{bottom:calc(84px + env(safe-area-inset-bottom));font-size:11.5px}.kds b{display:none}.kds a{padding:9px 11px}}' +
    '@media (prefers-reduced-motion:reduce){.kds,.kds a{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var nav = document.createElement('nav'); nav.className = 'kds'; nav.setAttribute('aria-label', label);
  var b = document.createElement('b'); b.textContent = label; nav.appendChild(b);
  items.forEach(function (it) {
    var a = document.createElement('a'); a.href = it[2]; a.textContent = it[1];
    if (it[0] === cur) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });
  var t = document.createElement('button'); t.type = 'button'; t.setAttribute('aria-label', '—');
  var min = false; try { min = localStorage.getItem('kds-min') === '1'; } catch (e) {}
  function sync() { nav.classList.toggle('min', min); t.textContent = min ? label : '×'; t.setAttribute('aria-expanded', String(!min)); }
  t.onclick = function () { min = !min; try { localStorage.setItem('kds-min', min ? '1' : '0'); } catch (e) {} sync(); };
  nav.appendChild(t); sync();
  (document.body ? Promise.resolve() : new Promise(function (r) { document.addEventListener('DOMContentLoaded', r); }))
    .then(function () { document.body.appendChild(nav); });
})();
