/* KADR Studio — AI-менеджер на сайте. Один файл, без зависимостей и внешних шрифтов; всё оформление — в Shadow DOM.
 * Подключение: <script src="/ai-manager.js" defer></script>
 * Сервер: Supabase Edge Function sales-chat (app/supabase/functions/sales-chat). Пока она не развёрнута или недоступна,
 * виджет вежливо отвечает почтой поддержки — страница от этого не ломается.
 * Язык: ?lang= → <html lang> (uk/ru/en/es/de). Тема: <html data-theme="dark"> → тёмная, иначе светлая (следит за сменой).
 * История диалога — только sessionStorage этой вкладки. */
(function () {
  'use strict';
  var ENDPOINT = 'https://pngkxjokbekecjzuymur.supabase.co/functions/v1/sales-chat';
  var SUPPORT_EMAIL = 'kadrstudia8@gmail.com';
  var SITE = 'https://kadrstudia8-hue.github.io/';
  var STORE = 'kadr-ai-manager:v1';
  var MAX_MESSAGES = 20, MAX_CHARS = 1500, TIMEOUT_MS = 45000;
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);

  function boot() {
    if (window.__kadrAiManager) return;
    window.__kadrAiManager = true;

    // ---------- язык и тексты ----------
    var LANGS = ['uk', 'ru', 'en', 'es', 'de'];
    function pageLang() {
      var q = '';
      try { q = (new URLSearchParams(location.search).get('lang') || '').slice(0, 2).toLowerCase(); } catch (e) {}
      if (LANGS.indexOf(q) >= 0) return q;
      var h = (document.documentElement.getAttribute('data-page-lang') || document.documentElement.lang || '').slice(0, 2).toLowerCase();
      return LANGS.indexOf(h) >= 0 ? h : 'uk';
    }
    var lang = pageLang();
    var T = {
      uk: { launcher: 'AI-менеджер', title: 'AI-менеджер KADR', status: 'Відповідає за кілька секунд', open: 'Відкрити чат з AI-менеджером',
        close: 'Закрити чат', reset: 'Новий діалог', send: 'Надіслати', placeholder: 'Напишіть питання…', typing: 'AI-менеджер друкує',
        hello: 'Вітаю! Я AI-менеджер KADR Studio. Підкажу, чи підійде програма для ваших відео, скільки це коштує і з чого почати. Що плануєте створювати?',
        chips: ['Скільки коштує?', 'Чи потрібна відеокарта?', 'Як купити?', 'Що таке Енергія ⚡?'],
        note: 'Відповідає ШІ, він може помилятися. Точні умови на сайті.',
        offline: 'Зараз я не можу відповісти: немає зв’язку із сервером. Напишіть нам на ' + SUPPORT_EMAIL + ', відповімо особисто. А поки можна безкоштовно спробувати 3 відео.',
        long: 'Діалог вийшов довгим. Почніть новий або напишіть нам на ' + SUPPORT_EMAIL + '.',
        tooLong: 'Повідомлення задовге: до ' + MAX_CHARS + ' знаків.', you: 'Ви', bot: 'AI-менеджер',
        btn: { download: 'Завантажити безкоштовно', trial: 'Спробувати 3 відео', pricing: 'Подивитися ціни', support: 'Написати в підтримку' } },
      ru: { launcher: 'AI-менеджер', title: 'AI-менеджер KADR', status: 'Отвечает за несколько секунд', open: 'Открыть чат с AI-менеджером',
        close: 'Закрыть чат', reset: 'Новый диалог', send: 'Отправить', placeholder: 'Напишите вопрос…', typing: 'AI-менеджер печатает',
        hello: 'Здравствуйте! Я AI-менеджер KADR Studio. Подскажу, подойдёт ли программа для ваших видео, сколько это стоит и с чего начать. Что планируете создавать?',
        chips: ['Сколько стоит?', 'Нужна ли видеокарта?', 'Как купить?', 'Что такое Энергия ⚡?'],
        note: 'Отвечает ИИ, он может ошибаться. Точные условия на сайте.',
        offline: 'Сейчас я не могу ответить: нет связи с сервером. Напишите нам на ' + SUPPORT_EMAIL + ', ответим лично. А пока можно бесплатно попробовать 3 видео.',
        long: 'Диалог получился длинным. Начните новый или напишите нам на ' + SUPPORT_EMAIL + '.',
        tooLong: 'Сообщение слишком длинное: до ' + MAX_CHARS + ' знаков.', you: 'Вы', bot: 'AI-менеджер',
        btn: { download: 'Скачать бесплатно', trial: 'Попробовать 3 видео', pricing: 'Посмотреть цены', support: 'Написать в поддержку' } },
      en: { launcher: 'AI manager', title: 'KADR AI manager', status: 'Replies in a few seconds', open: 'Open chat with the AI manager',
        close: 'Close chat', reset: 'New conversation', send: 'Send', placeholder: 'Type your question…', typing: 'The AI manager is typing',
        hello: 'Hello! I am the KADR Studio AI manager. I can tell you whether the app suits your videos, what it costs and how to start. What are you planning to make?',
        chips: ['How much is it?', 'Do I need a graphics card?', 'How do I buy?', 'What is Energy ⚡?'],
        note: 'Answers come from AI and may contain mistakes. Exact terms are on the website.',
        offline: 'I can’t answer right now: the server is unreachable. Write to us at ' + SUPPORT_EMAIL + ' and we will reply personally. Meanwhile you can try 3 videos for free.',
        long: 'This conversation is getting long. Start a new one or write to us at ' + SUPPORT_EMAIL + '.',
        tooLong: 'The message is too long: up to ' + MAX_CHARS + ' characters.', you: 'You', bot: 'AI manager',
        btn: { download: 'Download for free', trial: 'Try 3 videos', pricing: 'See prices', support: 'Contact support' } },
      es: { launcher: 'Asesor IA', title: 'Asesor IA de KADR', status: 'Responde en unos segundos', open: 'Abrir chat con el asesor IA',
        close: 'Cerrar chat', reset: 'Nueva conversación', send: 'Enviar', placeholder: 'Escribe tu pregunta…', typing: 'El asesor IA está escribiendo',
        hello: '¡Hola! Soy el asesor IA de KADR Studio. Te cuento si el programa encaja con tus vídeos, cuánto cuesta y cómo empezar. ¿Qué quieres crear?',
        chips: ['¿Cuánto cuesta?', '¿Necesito tarjeta gráfica?', '¿Cómo comprar?', '¿Qué es la Energía ⚡?'],
        note: 'Responde una IA y puede equivocarse. Las condiciones exactas están en la web.',
        offline: 'Ahora no puedo responder: no hay conexión con el servidor. Escríbenos a ' + SUPPORT_EMAIL + ' y te responderemos personalmente. Mientras tanto puedes probar 3 vídeos gratis.',
        long: 'La conversación es larga. Empieza una nueva o escríbenos a ' + SUPPORT_EMAIL + '.',
        tooLong: 'El mensaje es demasiado largo: hasta ' + MAX_CHARS + ' caracteres.', you: 'Tú', bot: 'Asesor IA',
        btn: { download: 'Descargar gratis', trial: 'Probar 3 vídeos', pricing: 'Ver precios', support: 'Escribir a soporte' } },
      de: { launcher: 'KI-Berater', title: 'KADR KI-Berater', status: 'Antwortet in wenigen Sekunden', open: 'Chat mit dem KI-Berater öffnen',
        close: 'Chat schließen', reset: 'Neues Gespräch', send: 'Senden', placeholder: 'Ihre Frage…', typing: 'Der KI-Berater schreibt',
        hello: 'Hallo! Ich bin der KI-Berater von KADR Studio. Ich sage Ihnen, ob das Programm zu Ihren Videos passt, was es kostet und wie Sie starten. Was möchten Sie erstellen?',
        chips: ['Was kostet es?', 'Brauche ich eine Grafikkarte?', 'Wie kaufe ich?', 'Was ist Energie ⚡?'],
        note: 'Antworten kommen von einer KI und können Fehler enthalten. Genaue Bedingungen auf der Website.',
        offline: 'Ich kann gerade nicht antworten: keine Verbindung zum Server. Schreiben Sie uns an ' + SUPPORT_EMAIL + ', wir antworten persönlich. Bis dahin können Sie 3 Videos kostenlos testen.',
        long: 'Das Gespräch ist lang geworden. Starten Sie ein neues oder schreiben Sie uns an ' + SUPPORT_EMAIL + '.',
        tooLong: 'Die Nachricht ist zu lang: höchstens ' + MAX_CHARS + ' Zeichen.', you: 'Sie', bot: 'KI-Berater',
        btn: { download: 'Kostenlos herunterladen', trial: '3 Videos testen', pricing: 'Preise ansehen', support: 'Support schreiben' } }
    };
    var t = T[lang];
    var SUPPORT_PAGE = { uk: 'support-uk.html', ru: 'support.html', en: 'support-en.html', es: 'support-es.html', de: 'support-de.html' };
    var LIGHT_PAGE = { uk: './', ru: 'landing.html', en: 'landing-en.html', es: 'landing-es.html', de: 'landing-de.html' };
    var DARK_PAGE = { uk: 'dark.html', ru: 'dark-ru.html', en: 'dark-en.html', es: 'dark-es.html', de: 'dark-de.html' };

    // ---------- хранилище (всё в try/catch: приватные окна, запреты) ----------
    function load() { try { var s = JSON.parse(sessionStorage.getItem(STORE) || 'null'); return s && Array.isArray(s.messages) ? s : null; } catch (e) { return null; } }
    function save() { try { sessionStorage.setItem(STORE, JSON.stringify({ messages: messages.filter(function (m) { return !m.pending; }), open: isOpen })); } catch (e) {} }
    var saved = load();
    var messages = saved ? saved.messages.filter(function (m) { return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'; }) : [];
    var isOpen = false, busy = false, controller = null;

    // ---------- разметка ----------
    var host = document.createElement('div');
    host.id = 'kadr-ai-manager';
    host.style.cssText = 'all:initial;position:fixed;z-index:2147483000;inset:auto 0 0 auto;width:0;height:0;';
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + css() + '</style>' +
      '<div class="km" part="root">' +
      '  <div class="pill" aria-hidden="true"><span class="pill-dot"></span><span class="pill-text"></span></div>' +
      '  <button class="launcher" type="button" aria-haspopup="dialog" aria-expanded="false">' + icon('spark') + icon('close') + '</button>' +
      '  <section class="panel" role="dialog" aria-modal="true" hidden>' +
      '    <header class="head">' +
      '      <div class="avatar" aria-hidden="true">' + icon('spark') + '</div>' +
      '      <div class="who"><h2 class="title"></h2><p class="status"><span class="live"></span><span class="status-text"></span></p></div>' +
      '      <button class="icon-btn reset" type="button">' + icon('reset') + '</button>' +
      '      <button class="icon-btn close" type="button">' + icon('close') + '</button>' +
      '    </header>' +
      '    <div class="log" role="log" aria-live="polite" aria-relevant="additions text" tabindex="-1"></div>' +
      '    <form class="composer" novalidate>' +
      '      <label class="sr" for="km-input"></label>' +
      '      <textarea id="km-input" rows="1" maxlength="' + MAX_CHARS + '" autocomplete="off"></textarea>' +
      '      <button class="send" type="submit">' + icon('send') + '</button>' +
      '    </form>' +
      '    <p class="note"></p>' +
      '  </section>' +
      '</div>';
    var $ = function (s) { return root.querySelector(s); };
    var chips = document.createElement('div'); chips.className = 'chips'; chips.setAttribute('role', 'group');
    var wrap = $('.km'), launcher = $('.launcher'), panel = $('.panel'), log = $('.log'),
        form = $('.composer'), input = $('textarea'), sendBtn = $('.send'), pill = $('.pill');
    $('.pill-text').textContent = t.launcher;
    launcher.setAttribute('aria-label', t.open);
    panel.setAttribute('aria-label', t.title);
    $('.title').textContent = t.title;
    $('.status-text').textContent = t.status;
    $('.reset').setAttribute('aria-label', t.reset); $('.reset').title = t.reset;
    $('.close').setAttribute('aria-label', t.close); $('.close').title = t.close;
    $('label.sr').textContent = t.placeholder;
    input.placeholder = t.placeholder;
    sendBtn.setAttribute('aria-label', t.send); sendBtn.title = t.send;
    $('.note').textContent = t.note;
    chips.setAttribute('aria-label', t.title);
    document.body.appendChild(host);

    // ---------- тема ----------
    function applyTheme() { wrap.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'); }
    applyTheme();
    try { new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) {}

    // ---------- подпись-пилюля при первом показе (один раз за сессию) ----------
    var pillSeen = false;
    try { pillSeen = sessionStorage.getItem(STORE + ':pill') === '1'; } catch (e) {}
    if (!pillSeen && !(saved && saved.messages.length)) {
      setTimeout(function () { if (!isOpen) wrap.classList.add('show-pill'); }, 1200);
      setTimeout(hidePill, 10000);
    }
    function hidePill() { wrap.classList.remove('show-pill'); try { sessionStorage.setItem(STORE + ':pill', '1'); } catch (e) {} }
    pill.addEventListener('click', function () { open(); });

    // ---------- отрисовка сообщений ----------
    var MARK = /\[\[(download|pricing|trial|support)\]\]/g;
    function tidy(text) {           // без маркеров и длинных тире (правило сайта)
      return String(text).replace(MARK, '').replace(/\[\[[a-z]*\]?$/, '').replace(/\s[—–]\s/g, ', ').replace(/[—–]/g, '-').replace(/[ \t]+\n/g, '\n')
        .replace(/(\d) (?=\d{3}\b)/g, '$1 ').replace(/(\d) (?=(грн|UAH|USDT|⚡))/g, '$1 ').trim();   // «1 999 грн» не рвётся
    }
    function actionsOf(text) {
      var out = [], m; MARK.lastIndex = 0;
      while ((m = MARK.exec(text))) if (out.indexOf(m[1]) < 0) out.push(m[1]);
      if (out.indexOf('download') >= 0 && out.indexOf('trial') >= 0) out.splice(out.indexOf('trial'), 1);
      return out.slice(0, 3);
    }
    function fillText(el, text) {  // только текст и mailto-ссылки, никакого HTML от модели
      el.textContent = '';
      var re = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, last = 0, m;
      while ((m = re.exec(text))) {
        if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
        var a = document.createElement('a'); a.href = 'mailto:' + m[0]; a.textContent = m[0]; el.appendChild(a);
        last = m.index + m[0].length;
      }
      if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
    }
    function bubble(role) {
      var row = document.createElement('div'); row.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
      var sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = (role === 'user' ? t.you : t.bot) + ': ';
      var b = document.createElement('div'); b.className = 'bubble';
      var tx = document.createElement('div'); tx.className = 'text';
      b.appendChild(sr); b.appendChild(tx); row.appendChild(b); log.appendChild(row);
      return row;
    }
    function setBubble(row, text, final) {
      fillText(row.querySelector('.text'), tidy(text));
      var old = row.querySelector('.actions'); if (old) old.remove();
      if (!final) return;
      var acts = actionsOf(text);
      if (!acts.length) return;
      var box = document.createElement('div'); box.className = 'actions';
      acts.forEach(function (a, i) {
        var link = document.createElement('a'); link.className = 'action' + (i === 0 && a !== 'support' ? ' primary' : '');
        link.textContent = t.btn[a]; link.href = actionHref(a);
        if (a === 'support') { link.target = '_blank'; link.rel = 'noopener'; }
        else link.addEventListener('click', function (e) { goSection(e, a === 'pricing' ? 'pricing' : 'download'); });
        box.appendChild(link);
      });
      row.querySelector('.bubble').appendChild(box);
    }
    function actionHref(a) {
      if (a === 'support') return SITE + SUPPORT_PAGE[lang];
      var id = a === 'pricing' ? 'pricing' : 'download';
      if (document.getElementById(id)) return '#' + id;
      var pages = wrap.getAttribute('data-theme') === 'dark' ? DARK_PAGE : LIGHT_PAGE;
      return pages[lang] + '#' + id;
    }
    function goSection(e, id) {
      var el = document.getElementById(id);
      if (!el) return;              // другая страница: обычный переход по ссылке
      e.preventDefault();
      if (window.matchMedia('(max-width: 760px)').matches) close(false);
      try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (x) { el.scrollIntoView(); }
      try { history.replaceState(null, '', '#' + id); } catch (x) {}
    }
    function scrollDown() { log.scrollTop = log.scrollHeight; requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; }); }
    function nearBottom() { return log.scrollHeight - log.scrollTop - log.clientHeight < 80; }
    function typingRow() {
      var row = bubble('assistant'); row.classList.add('typing');
      var tx = row.querySelector('.text'); tx.setAttribute('aria-label', t.typing);
      tx.innerHTML = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
      return row;
    }
    function renderAll() {
      log.textContent = '';
      var hello = bubble('assistant'); hello.classList.add('hello'); setBubble(hello, t.hello, true);
      log.appendChild(chips);
      messages.forEach(function (m) { var row = bubble(m.role); if (m.local && m.role === 'assistant') row.classList.add('local'); setBubble(row, m.content, true); });
      chips.hidden = messages.length > 0;
      scrollDown();
    }
    t.chips.forEach(function (q) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = q;
      b.addEventListener('click', function () { ask(q); });
      chips.appendChild(b);
    });
    renderAll();

    // ---------- открыть / закрыть, фокус ----------
    var lastFocus = null;
    function open() {
      if (isOpen) return;
      isOpen = true; hidePill(); lastFocus = document.activeElement;
      panel.hidden = false;
      requestAnimationFrame(function () { wrap.classList.add('open'); });
      launcher.setAttribute('aria-expanded', 'true'); launcher.setAttribute('aria-label', t.close);
      if (window.matchMedia('(max-width: 760px)').matches) lockScroll(true);
      scrollDown(); save();
      setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 60);
    }
    function close(restore) {
      if (!isOpen) return;
      isOpen = false; wrap.classList.remove('open');
      launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-label', t.open);
      lockScroll(false);
      setTimeout(function () { if (!isOpen) panel.hidden = true; }, 220);
      save();
      if (restore !== false) { try { launcher.focus(); } catch (e) {} }
      else if (lastFocus && lastFocus.focus && lastFocus !== document.body) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    }
    var prevOverflow = null;
    function lockScroll(on) {
      var s = document.documentElement.style;
      if (on && prevOverflow === null) { prevOverflow = s.overflow; s.overflow = 'hidden'; }
      else if (!on && prevOverflow !== null) { s.overflow = prevOverflow; prevOverflow = null; }
    }
    launcher.addEventListener('click', function () { if (isOpen) close(); else open(); });
    $('.close').addEventListener('click', function () { close(); });
    $('.reset').addEventListener('click', function () {
      if (controller) { var c = controller; controller = null; try { c.abort(); } catch (e) {} }
      messages = []; busy = false; setBusy(false); save(); renderAll(); input.value = ''; grow(); input.focus();
    });
    root.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(root.querySelectorAll('.launcher, .panel button, .panel a[href], .panel textarea'),
        function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1], active = root.activeElement;
      if (e.shiftKey && (active === first || !active)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', function () {
      if (isOpen) lockScroll(window.matchMedia('(max-width: 760px)').matches);
    });

    // ---------- ввод ----------
    function grow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; }
    input.addEventListener('input', grow);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    function submit() { var q = input.value.trim(); if (!q || busy) return; ask(q); }
    function setBusy(on) { busy = on; sendBtn.disabled = on; wrap.classList.toggle('busy', on); }

    // ---------- диалог с сервером ----------
    function localReply(text, acts) {     // ответ без сервера: в историю для модели не идёт
      var content = text + (acts || []).map(function (a) { return ' [[' + a + ']]'; }).join('');
      var row = bubble('assistant'); row.classList.add('local');
      setBubble(row, content, true);
      messages.push({ role: 'assistant', content: content, local: true }); save();   // видно после перезагрузки, модели не уходит
      scrollDown();
    }
    function payload() {                   // только настоящие пары «вопрос — ответ» (локальные ответы пропускаются)
      var out = [];
      messages.forEach(function (m) { if (!m.local) out.push({ role: m.role, content: m.content }); });
      return out;
    }
    function ask(q) {
      if (busy) return;
      q = String(q).trim();
      if (!q) return;
      if (q.length > MAX_CHARS) { localReply(t.tooLong); return; }
      if (payload().length + 1 > MAX_MESSAGES) { localReply(t.long, ['support']); return; }
      chips.hidden = true;
      var user = { role: 'user', content: q };
      messages.push(user); save();
      setBubble(bubble('user'), q, true);
      input.value = ''; grow();
      setBusy(true);
      var row = typingRow(); scrollDown();
      var text = '', started = false, finished = false;
      controller = typeof AbortController === 'function' ? new AbortController() : null;
      var myController = controller;
      var timer = setTimeout(function () { if (myController) myController.abort(); }, TIMEOUT_MS);
      function fail(msg, acts) {
        if (finished) return; finished = true;
        clearTimeout(timer);
        user.local = true;                 // вопрос без ответа не отправляем модели повторно
        if (text) {                        // часть ответа уже пришла: оставляем её, добавляем фразу поддержки
          var ans = { role: 'assistant', content: text, local: true }; messages.push(ans);
          setBubble(row, text, true); row.classList.remove('typing');
          localReply(msg, acts);
        } else { row.remove(); localReply(msg, acts); }
        save(); setBusy(false);
      }
      function done(extra) {
        if (finished) return; finished = true;
        clearTimeout(timer);
        var full = (text + (extra ? (text ? '\n\n' : '') + extra : '')).trim();
        if (!full) { finished = false; fail(t.offline, ['support', 'download']); return; }
        row.classList.remove('typing');
        messages.push({ role: 'assistant', content: full });
        setBubble(row, full, true); scrollDown(); save(); setBusy(false);
      }
      function onEvent(ev) {
        if (!ev || typeof ev !== 'object') return;
        if (ev.type === 'text' && typeof ev.text === 'string') {
          var stick = nearBottom();
          text += ev.text;
          if (!started) { started = true; row.classList.remove('typing'); }
          setBubble(row, text, false);
          if (stick) scrollDown();
        } else if (ev.type === 'refusal') {
          // полный отказ: частичный текст убираем, отвечаем вежливой фразой (она не уходит модели)
          text = ''; finished = true; clearTimeout(timer); row.remove(); user.local = true;
          localReply(String(ev.text || t.offline), ['support']); save(); setBusy(false);
        } else if (ev.type === 'error') fail(String(ev.text || t.offline), ['support']);
        else if (ev.type === 'done') done();
      }
      var opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: payload(), lang: lang }) };
      if (myController) opts.signal = myController.signal;
      var req;
      try { req = fetch(ENDPOINT + '?lang=' + lang, opts); } catch (e) { fail(t.offline, ['support', 'download']); return; }
      req.then(function (res) {
        var type = res.headers.get('Content-Type') || '';
        if (!res.ok || type.indexOf('text/event-stream') < 0) {
          // 4xx с понятным текстом от функции — показываем его; 404/5xx/чужая страница — общий вежливый ответ
          return res.json().then(function (j) {
            fail(res.status < 500 && res.status !== 404 && j && typeof j.error === 'string' ? j.error : t.offline, ['support', 'download']);
          }, function () { fail(t.offline, ['support', 'download']); });
        }
        if (!res.body || !res.body.getReader) {
          return res.text().then(function (all) { parse(all + '\n\n'); if (!finished) done(); });
        }
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
        function parse(chunk) {
          buf += chunk;
          var parts = buf.split(/\r?\n\r?\n/); buf = parts.pop();
          parts.forEach(function (block) {
            var data = block.split(/\r?\n/).filter(function (l) { return l.indexOf('data:') === 0; }).map(function (l) { return l.slice(5).replace(/^ /, ''); }).join('\n');
            if (!data) return;
            try { onEvent(JSON.parse(data)); } catch (e) {}
          });
        }
        function pump() {
          return reader.read().then(function (r) {
            if (finished && !busy) { try { reader.cancel(); } catch (e) {} return; }
            if (r.done) { parse(dec.decode() + '\n\n'); if (!finished) (text ? done() : fail(t.offline, ['support', 'download'])); return; }
            parse(dec.decode(r.value, { stream: true }));
            return pump();
          });
        }
        return pump();
      }).catch(function () {
        if (myController && myController.signal.aborted && controller !== myController) return;   // «новый диалог»
        fail(t.offline, ['support', 'download']);
      });
    }

    if (saved && saved.open && messages.length) open();

    // ---------- иконки и стили ----------
    function icon(name) {
      var p = {
        spark: '<path d="M12 2.5c.4 3.9 1.6 6.1 3.2 7.4 1.5 1.2 3.4 1.7 6.3 2.1-2.9.4-4.8.9-6.3 2.1-1.6 1.3-2.8 3.5-3.2 7.4-.4-3.9-1.6-6.1-3.2-7.4C7.3 12.9 5.4 12.4 2.5 12c2.9-.4 4.8-.9 6.3-2.1C10.4 8.6 11.6 6.4 12 2.5z" fill="currentColor"/><circle cx="19" cy="4.8" r="1.6" fill="currentColor" opacity=".7"/>',
        close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>',
        reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.3-5.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/><path d="M4 4.5v4h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        send: '<path d="M5 12h12.5M12.5 6.5L18 12l-5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
      }[name];
      return '<svg class="i i-' + name + '" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' + p + '</svg>';
    }
    function css() {
      return [
        ':host{all:initial}',
        '.km{--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-family:var(--font);font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased;',
        '  --gap:20px;--bottom:20px;--ease:cubic-bezier(.2,.8,.2,1)}',
        /* светлая тема (V2: фиолетовый, розовый, лайм на белом) */
        '.km[data-theme=light]{color-scheme:light;--fg:#0b0b12;--fg2:#4a4958;--fg3:#7d7b8a;',
        '  --glass:linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(251,250,255,.84) 38%,rgba(246,243,255,.80) 72%,rgba(243,240,255,.86) 100%);',
        '  --edge:rgba(20,12,60,.10);--edge-hi:rgba(255,255,255,.95);--line:rgba(20,12,60,.08);',
        '  --shadow:0 1px 0 rgba(255,255,255,.9) inset,0 24px 60px -18px rgba(40,20,110,.28),0 8px 24px -12px rgba(11,11,18,.18);',
        '  --accent:linear-gradient(135deg,#8f6bff 0%,#7a4dff 28%,#5d34e6 58%,#4b2bd6 82%,#3f22c2 100%);',
        '  --accent-glow:radial-gradient(120% 120% at 30% 20%,rgba(255,79,216,.55) 0%,rgba(122,77,255,.0) 55%);--on-accent:#fff;',
        '  --me:linear-gradient(140deg,#7f55ff 0%,#6a3ff2 40%,#5530dc 75%,#4b2bd6 100%);--me-fg:#fff;',
        '  --bot:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(250,249,255,.92) 60%,rgba(246,244,255,.94) 100%);--bot-edge:rgba(20,12,60,.08);',
        '  --chip:rgba(255,255,255,.75);--chip-edge:rgba(122,77,255,.22);--chip-fg:#3a2a9c;--chip-hover:rgba(122,77,255,.08);',
        '  --field:rgba(255,255,255,.92);--field-edge:rgba(20,12,60,.12);--focus:#7a4dff;--live:#2fbf71;--link:#5530dc;',
        '  --pill:linear-gradient(180deg,rgba(255,255,255,.98) 0%,rgba(248,246,255,.96) 100%);--pill-edge:rgba(122,77,255,.25)}',
        /* тёмная тема (V4: void, лайм, сирень, циан) */
        '.km[data-theme=dark]{color-scheme:dark;--fg:#edebe6;--fg2:#b4b2ba;--fg3:#8a8892;',
        '  --glass:linear-gradient(180deg,rgba(24,24,31,.80) 0%,rgba(16,16,22,.76) 34%,rgba(11,11,16,.78) 70%,rgba(8,8,11,.86) 100%);',
        '  --edge:rgba(237,235,230,.10);--edge-hi:rgba(237,235,230,.22);--line:rgba(237,235,230,.08);',
        '  --shadow:0 1px 0 rgba(255,255,255,.06) inset,0 30px 80px -20px rgba(0,0,0,.75),0 0 0 1px rgba(0,0,0,.4);',
        '  --accent:linear-gradient(135deg,#e6ff6a 0%,#d7ff1f 30%,#c2ec10 62%,#a9d40a 86%,#98c000 100%);',
        '  --accent-glow:radial-gradient(120% 120% at 30% 20%,rgba(125,227,255,.45) 0%,rgba(185,166,255,.18) 40%,rgba(0,0,0,0) 70%);--on-accent:#0a0a0d;',
        '  --me:linear-gradient(140deg,rgba(185,166,255,.30) 0%,rgba(150,128,255,.24) 45%,rgba(125,227,255,.16) 100%);--me-fg:#f4f2ff;',
        '  --bot:linear-gradient(180deg,rgba(237,235,230,.07) 0%,rgba(237,235,230,.045) 55%,rgba(237,235,230,.06) 100%);--bot-edge:rgba(237,235,230,.09);',
        '  --chip:rgba(237,235,230,.05);--chip-edge:rgba(215,255,31,.22);--chip-fg:#e9ffa0;--chip-hover:rgba(215,255,31,.08);',
        '  --field:rgba(0,0,0,.35);--field-edge:rgba(237,235,230,.14);--focus:#d7ff1f;--live:#d7ff1f;--link:#7de3ff;',
        '  --pill:linear-gradient(180deg,rgba(28,28,36,.92) 0%,rgba(14,14,19,.94) 100%);--pill-edge:rgba(237,235,230,.14)}',
        '.km *{box-sizing:border-box}',
        '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
        'button{font:inherit;color:inherit;cursor:pointer}',
        /* кнопка */
        '.launcher{position:fixed;right:var(--gap);bottom:var(--bottom);width:58px;height:58px;border-radius:50%;border:0;padding:0;display:grid;place-items:center;',
        '  color:var(--on-accent);background:var(--accent-glow),var(--accent);',
        '  box-shadow:0 0 0 1px rgba(255,255,255,.22) inset,0 -6px 14px rgba(0,0,0,.14) inset,0 14px 30px -10px rgba(75,43,214,.55),0 4px 10px -4px rgba(0,0,0,.3);',
        '  transition:transform .25s var(--ease),box-shadow .25s var(--ease)}',
        '.km[data-theme=dark] .launcher{box-shadow:0 0 0 1px rgba(255,255,255,.35) inset,0 -6px 14px rgba(0,0,0,.18) inset,0 14px 34px -10px rgba(215,255,31,.35),0 6px 16px -6px rgba(0,0,0,.7)}',
        '.launcher:hover{transform:translateY(-2px) scale(1.03)}',
        '.launcher:active{transform:scale(.97)}',
        '.launcher:focus-visible,.icon-btn:focus-visible,.send:focus-visible,.chip:focus-visible,.action:focus-visible,.pill:focus-visible{outline:2px solid var(--focus);outline-offset:3px}',
        '.launcher .i{position:absolute;transition:opacity .2s,transform .3s var(--ease)}',
        '.launcher .i-close{opacity:0;transform:rotate(-60deg) scale(.6)}',
        '.km.open .launcher .i-spark{opacity:0;transform:rotate(60deg) scale(.6)}',
        '.km.open .launcher .i-close{opacity:1;transform:none}',
        '.launcher::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1px solid var(--chip-edge);opacity:0;animation:ring 3.2s var(--ease) 1.5s 3}',
        '@keyframes ring{0%{opacity:.9;transform:scale(.9)}70%,100%{opacity:0;transform:scale(1.35)}}',
        /* пилюля */
        '.pill{position:fixed;right:calc(var(--gap) + 68px);bottom:calc(var(--bottom) + 12px);display:flex;align-items:center;gap:8px;height:34px;padding:0 14px 0 12px;',
        '  border-radius:999px;background:var(--pill);border:1px solid var(--pill-edge);color:var(--fg);font-size:14px;font-weight:600;letter-spacing:.01em;white-space:nowrap;cursor:pointer;',
        '  box-shadow:0 10px 28px -12px rgba(0,0,0,.35);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);',
        '  opacity:0;transform:translateX(8px);pointer-events:none;transition:opacity .35s var(--ease),transform .35s var(--ease)}',
        '.km.show-pill .pill{opacity:1;transform:none;pointer-events:auto}',
        '.pill-dot,.live{width:7px;height:7px;border-radius:50%;background:var(--live);box-shadow:0 0 0 3px color-mix(in srgb,var(--live) 22%,transparent);flex:none}',
        /* панель */
        '.panel{position:fixed;right:var(--gap);bottom:calc(var(--bottom) + 72px);width:392px;height:min(640px,calc(100vh - var(--bottom) - 104px));height:min(640px,calc(100dvh - var(--bottom) - 104px));',
        '  display:flex;flex-direction:column;border-radius:22px;color:var(--fg);background:var(--glass);border:1px solid var(--edge);box-shadow:var(--shadow);overflow:hidden;',
        '  -webkit-backdrop-filter:blur(26px) saturate(150%);backdrop-filter:blur(26px) saturate(150%);',
        '  opacity:0;transform:translateY(14px) scale(.98);transform-origin:100% 100%;transition:opacity .22s var(--ease),transform .28s var(--ease)}',
        '.panel::before{content:"";position:absolute;inset:0 0 auto 0;height:1px;background:linear-gradient(90deg,transparent 0%,var(--edge-hi) 22%,var(--edge-hi) 50%,var(--edge-hi) 78%,transparent 100%);pointer-events:none}',
        '.panel[hidden]{display:none}',
        '.km.open .panel{opacity:1;transform:none}',
        '.head{display:flex;align-items:center;gap:12px;padding:14px 12px 12px 16px;border-bottom:1px solid var(--line)}',
        '.avatar{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:var(--on-accent);background:var(--accent-glow),var(--accent);flex:none;',
        '  box-shadow:0 0 0 1px rgba(255,255,255,.25) inset}',
        '.avatar .i{width:20px;height:20px}',
        '.who{flex:1;min-width:0}',
        '.title{margin:0;font-size:15px;font-weight:700;letter-spacing:.005em;line-height:1.25}',
        '.status{margin:2px 0 0;display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--fg3)}',
        '.live{width:6px;height:6px}',
        '.icon-btn{width:36px;height:36px;border-radius:10px;border:1px solid transparent;background:transparent;display:grid;place-items:center;color:var(--fg2);transition:background .15s,color .15s,border-color .15s}',
        '.icon-btn:hover{background:var(--chip-hover);border-color:var(--line);color:var(--fg)}',
        '.icon-btn .i{width:19px;height:19px}',
        '.log{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:18px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;outline:none;',
        '  scrollbar-width:thin;scrollbar-color:var(--edge) transparent}',
        '.msg{display:flex}',
        '.msg.me{justify-content:flex-end}',
        '.bubble{max-width:86%;padding:10px 14px;border-radius:18px;font-size:14.5px;line-height:1.52;word-wrap:break-word;overflow-wrap:anywhere}',
        '.msg.bot .bubble{background:var(--bot);border:1px solid var(--bot-edge);border-bottom-left-radius:6px;color:var(--fg)}',
        '.msg.me .bubble{background:var(--me);color:var(--me-fg);border:1px solid rgba(255,255,255,.12);border-bottom-right-radius:6px}',
        '.text{white-space:pre-wrap}',
        '.text a{color:var(--link);text-decoration:underline;text-underline-offset:2px}',
        '.msg.me .text a{color:inherit}',
        '.msg.local .bubble{border-style:dashed}',
        '.dots{display:inline-flex;gap:5px;padding:4px 2px}',
        '.dots i{width:7px;height:7px;border-radius:50%;background:var(--fg3);animation:dot 1.2s infinite ease-in-out}',
        '.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}',
        '@keyframes dot{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}',
        '.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
        '.action{display:inline-flex;align-items:center;min-height:34px;padding:6px 13px;border-radius:999px;font-size:13.5px;font-weight:600;text-decoration:none;',
        '  color:var(--chip-fg);background:var(--chip);border:1px solid var(--chip-edge);transition:background .15s,transform .15s}',
        '.action:hover{background:var(--chip-hover);transform:translateY(-1px)}',
        '.action.primary{color:var(--on-accent);background:var(--accent-glow),var(--accent);border-color:transparent;box-shadow:0 0 0 1px rgba(255,255,255,.2) inset}',
        '.chips{display:flex;flex-wrap:wrap;gap:8px;padding:2px 0 6px}',
        '.chips[hidden]{display:none}',
        '.chip{padding:8px 13px;border-radius:999px;border:1px solid var(--chip-edge);background:var(--chip);color:var(--chip-fg);font-size:13.5px;font-weight:550;line-height:1.2;',
        '  transition:background .15s,transform .15s,border-color .15s}',
        '.chip:hover{background:var(--chip-hover);transform:translateY(-1px)}',
        '.composer{display:flex;align-items:flex-end;gap:8px;margin:6px 12px 0;padding:6px 6px 6px 14px;border-radius:16px;background:var(--field);border:1px solid var(--field-edge);transition:border-color .15s,box-shadow .15s}',
        '.composer:focus-within{border-color:var(--focus);box-shadow:0 0 0 3px color-mix(in srgb,var(--focus) 18%,transparent)}',
        'textarea{flex:1;resize:none;border:0;outline:0;background:transparent;color:var(--fg);font:inherit;font-size:15px;line-height:1.45;padding:7px 0;max-height:140px;min-height:22px}',
        'textarea::placeholder{color:var(--fg3)}',
        '.send{width:38px;height:38px;border-radius:12px;border:0;display:grid;place-items:center;color:var(--on-accent);background:var(--accent-glow),var(--accent);flex:none;',
        '  box-shadow:0 0 0 1px rgba(255,255,255,.2) inset;transition:transform .15s,opacity .15s}',
        '.send:hover{transform:translateY(-1px)}',
        '.send:disabled{opacity:.45;cursor:default;transform:none}',
        '.send .i{width:19px;height:19px}',
        '.note{margin:8px 16px 12px;font-size:11.5px;line-height:1.35;color:var(--fg3);text-align:center}',
        /* телефон: выше нижних панелей сайта, чат — полноэкранный лист */
        '@media (max-width:760px){',
        '  .km{--gap:16px;--bottom:96px}',
        '  .launcher{width:54px;height:54px}',
        '  .pill{right:calc(var(--gap) + 62px);bottom:calc(var(--bottom) + 10px)}',
        '  .panel{inset:0;width:auto;height:auto;border-radius:0;border:0;transform:translateY(24px);transform-origin:50% 100%;',
        '    padding-bottom:env(safe-area-inset-bottom);padding-top:env(safe-area-inset-top)}',
        '  .km[data-theme=light] .panel{background:linear-gradient(180deg,#ffffff 0%,#fbfaff 40%,#f6f3ff 100%)}',
        '  .km[data-theme=dark] .panel{background:linear-gradient(180deg,#121218 0%,#0c0c11 45%,#060608 100%)}',
        '  .km.open .launcher{opacity:0;pointer-events:none}',
        '  .bubble{max-width:90%}',
        '  textarea{font-size:16px}',
        '}',
        '@media (prefers-reduced-motion:reduce){.km *{transition:none!important;animation:none!important}.log{scroll-behavior:auto}}'
      ].join('\n');
    }
  }
})();
