/* KADR Studio site — language menu keyboard/outside-click behaviour and the first-visit «read in your language?» hint.
   No third-party code, nothing is sent anywhere. Without JS the <details> menu still opens as a plain list. */
(function () {
  "use strict";
  var menu = document.querySelector("details.lang");
  if (menu) {
    var sum = menu.querySelector("summary"), items = [].slice.call(menu.querySelectorAll("a"));
    menu.addEventListener("toggle", function () { sum.setAttribute("aria-expanded", menu.open ? "true" : "false"); });
    document.addEventListener("click", function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    menu.addEventListener("keydown", function (e) {
      var i = items.indexOf(document.activeElement);
      if (e.key === "Escape") { menu.open = false; sum.focus(); }
      else if (e.key === "ArrowDown" || (e.key === "ArrowUp" && !menu.open)) { e.preventDefault(); menu.open = true; items[i < 0 ? 0 : (i + 1) % items.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[i <= 0 ? items.length - 1 : i - 1].focus(); }
      else if (e.key === "Home" && menu.open) { e.preventDefault(); items[0].focus(); }
      else if (e.key === "End" && menu.open) { e.preventDefault(); items[items.length - 1].focus(); }
    });
    menu.addEventListener("focusout", function (e) { if (menu.open && e.relatedTarget && !menu.contains(e.relatedTarget)) menu.open = false; });
  }

  /* first visit from a browser in another of our five languages: offer, never redirect */
  var T = {
    uk: ["Читати цю сторінку українською?", "Українською", "Закрити"],
    ru: ["Читать эту страницу по-русски?", "По-русски", "Закрыть"],
    en: ["Read this page in English?", "In English", "Close"],
    es: ["¿Leer esta página en español?", "En español", "Cerrar"],
    de: ["Diese Seite auf Deutsch lesen?", "Auf Deutsch", "Schließen"]
  };
  var KEY = "kadr-lang-hint", page = document.documentElement.lang;
  var want = ((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase().split("-")[0];
  var alt = want && want !== page && T[want] && document.querySelector('link[rel="alternate"][hreflang="' + want + '"]');
  if (!alt) return;
  var seen = null;
  try { seen = localStorage.getItem(KEY); } catch (e) {}
  if (seen) return;
  function remember() { try { localStorage.setItem(KEY, want); } catch (e) {} }
  var bar = document.createElement("div");
  bar.className = "lang-hint"; bar.lang = want; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", T[want][0]);
  var txt = document.createElement("span"); txt.textContent = T[want][0];
  var go = document.createElement("a"); go.href = alt.href; go.hreflang = want; go.textContent = T[want][1]; go.addEventListener("click", remember);
  var x = document.createElement("button"); x.type = "button"; x.textContent = "×"; x.setAttribute("aria-label", T[want][2]);
  x.addEventListener("click", function () { remember(); bar.remove(); });
  bar.appendChild(txt); bar.appendChild(go); bar.appendChild(x);
  document.body.insertBefore(bar, document.body.firstChild);
})();
