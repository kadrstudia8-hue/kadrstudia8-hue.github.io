/* KADR Studio site: lazy video loops, «одна фраза → ролик» demo, OS-aware call, sticky phone call, notify placeholder.
   No third-party code, no trackers, nothing is sent anywhere. */
(function () {
  "use strict";
  var LANG = document.documentElement.lang, EN = LANG !== "ru" && LANG !== "uk";
  var T = {
    mac: { ru: "Скачать для Mac", uk: "Завантажити для Mac", en: "Download for Mac", es: "Descargar para Mac", de: "Für Mac herunterladen" },
    win: { ru: "Скачать для Windows", uk: "Завантажити для Windows", en: "Download for Windows", es: "Descargar para Windows", de: "Für Windows herunterladen" },
    copied: { ru: "ссылка скопирована", uk: "посилання скопійовано", en: "link copied", es: "enlace copiado", de: "Link kopiert" }
  };
  function t(k) { return T[k][LANG] || T[k].en; }
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator.connection && navigator.connection.saveData);
  var ua = navigator.userAgent || "";
  var mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (matchMedia("(pointer:coarse)").matches && innerWidth < 900) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua) && !matchMedia("(pointer:fine)").matches);
  if (mobile) document.documentElement.classList.add("is-mobile");

  /* videos: data-src is loaded only when the clip is on screen; loops pause off screen */
  function load(v) {
    if (v.dataset.loaded) return;
    var s = v.querySelector("source[data-src]");
    if (s) { s.src = s.dataset.src; v.load(); }
    v.dataset.loaded = "1";
  }
  function play(v) { load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var loops = [].slice.call(document.querySelectorAll("video[data-loop]"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { if (!calm) play(v); } else if (!v.paused) v.pause();
      });
    }, { rootMargin: "120px 0px", threshold: 0.25 });
    loops.forEach(function (v) { io.observe(v); });
  } else if (!calm) loops.forEach(play);
  if (calm) loops.forEach(function (v) { v.setAttribute("controls", ""); v.addEventListener("play", function () { load(v); }, { once: true }); });

  /* showreel: real source only on first play */
  [].forEach.call(document.querySelectorAll("video[data-reel]"), function (v) {
    v.addEventListener("play", function () { if (!v.dataset.loaded) { load(v); v.play(); } }, { once: true });
  });

  /* primary call follows the visitor's computer */
  var plat = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "").toLowerCase();
  [].forEach.call(document.querySelectorAll("[data-os-cta]"), function (a) {
    if (mobile) return;
    if (plat.indexOf("mac") > -1) a.textContent = t("mac");
    else if (plat.indexOf("win") > -1) a.textContent = t("win");
  });

  /* phones: KADR is a computer app — send the link to yourself */
  [].forEach.call(document.querySelectorAll("[data-share]"), function (b) {
    b.addEventListener("click", function () {
      var url = location.href.split("#")[0];
      if (navigator.share) { navigator.share({ title: "KADR Studio", url: url }).catch(function () {}); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () {
        b.textContent = t("copied");
      });
    });
  });

  /* «одна фраза → ролик» */
  var demo = document.querySelector("[data-demo]");
  if (demo) {
    var tabs = [].slice.call(demo.querySelectorAll("[role=tab]"));
    var box = demo.querySelector(".demo-prompt"), text = box.querySelector("p");
    var meta = demo.querySelector(".demo-meta"), stage = demo.querySelector(".demo-stage");
    var timer = null, auto = null, seen = false, touched = false;
    function show(i) {
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
      var t = tabs[i], full = t.dataset.prompt;
      meta.innerHTML = t.dataset.meta.split("|").map(function (m) { return "<li>" + m + "</li>"; }).join("");
      var vert = t.dataset.shape === "v";
      stage.innerHTML = '<figure class="frame ' + (vert ? "v" : "h") + '"><video muted loop playsinline preload="none" poster="' +
        t.dataset.poster + '" aria-label="' + t.dataset.alt + '"><source data-src="' + t.dataset.video + '" type="video/mp4"></video></figure>';
      var v = stage.querySelector("video");
      clearInterval(timer); box.classList.remove("done");
      if (calm) { text.textContent = full; box.classList.add("done"); v.setAttribute("controls", ""); v.addEventListener("play", function () { load(v); }, { once: true }); return; }
      var n = 0; text.textContent = "";
      timer = setInterval(function () {
        n += 2; text.textContent = full.slice(0, n);
        if (n >= full.length) { clearInterval(timer); box.classList.add("done"); play(v); }
      }, 22);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { touched = true; clearInterval(auto); show(i); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return; e.preventDefault(); var k = (i + d + tabs.length) % tabs.length; tabs[k].focus(); tabs[k].click();
      });
    });
    var start = function () {
      if (seen) return; seen = true; show(0);
      if (!calm) auto = setInterval(function () {
        if (touched) return clearInterval(auto);
        var k = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
        show((k + 1) % tabs.length);
      }, 11000);
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: 0.3 }).observe(demo);
    } else start();
  }

  /* sticky call on phones: after the hero, hidden over the download block */
  var bar = document.querySelector(".mcta"), hero = document.querySelector(".hero"), dl = document.getElementById("download");
  if (bar && hero && "IntersectionObserver" in window) {
    var past = false, atDl = false;
    var upd = function () { bar.classList.toggle("on", past && !atDl); };
    new IntersectionObserver(function (es) { past = !es[0].isIntersecting; upd(); }).observe(hero);
    if (dl) new IntersectionObserver(function (es) { atDl = es[0].isIntersecting; upd(); }).observe(dl);
  }

  /* notify form — [PLACEHOLDER: no endpoint yet; the owner connects his own receiver. Nothing is stored or sent.] */
  [].forEach.call(document.querySelectorAll("[data-notify]"), function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = f.querySelector("input"), msg = f.querySelector("[data-notify-msg]");
      if (!input.value.trim()) { input.focus(); return; }
      f.classList.add("sent");
      msg.innerHTML = EN
        ? 'Sign-ups are not connected yet, so your contact was <b>not sent</b> anywhere. To hear about the launch for sure, write to us via <a href="support-en.html">Support</a>.'
        : 'Приём заявок ещё не подключён — ваш контакт <b>никуда не отправлен</b>. Чтобы точно узнать о запуске, напишите нам через страницу <a href="support.html">«Поддержка»</a>.';
    });
  });
})();
