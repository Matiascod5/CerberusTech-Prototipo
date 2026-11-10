/* Tótem de autoadmisión: letra grande, alto contraste, guía por voz, idioma y teclado del RUN. */
(function () {
  'use strict';
  var root = document.querySelector('.tt');
  if (!root) return;

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } return null; }

  // Zonas clicables y teclado para los enlaces del tótem
  var links = root.querySelectorAll('[data-go],[data-act]');
  for (var i = 0; i < links.length; i++) {
    links[i].classList.add('hs');
    links[i].setAttribute('tabindex', '0');
    links[i].setAttribute('role', 'button');
  }

  // ---------- Accesibilidad ----------
  var estado = { letra: store('tt-letra') === '1', contraste: store('tt-contraste') === '1', voz: store('tt-voz') === '1' };

  function hablar(texto) {
    if (!('speechSynthesis' in window) || !texto) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-CL';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) { /* sin voz disponible */ }
  }
  function leerPantalla() {
    var t = [];
    var el = root.querySelectorAll('[data-voz]');
    for (var i = 0; i < el.length; i++) t.push(el[i].textContent.trim());
    hablar(t.join('. '));
  }

  function aplicar() {
    root.classList.toggle('tt-big', estado.letra);
    root.classList.toggle('tt-hc', estado.contraste);
    var b = root.querySelectorAll('[data-tt]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', estado[b[i].getAttribute('data-tt')] ? 'true' : 'false');
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tt]');
    if (t) {
      var k = t.getAttribute('data-tt');
      estado[k] = !estado[k];
      store('tt-' + k, estado[k] ? '1' : '0');
      aplicar();
      if (k === 'voz') { if (estado.voz) leerPantalla(); else if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
      return;
    }
    var l = e.target.closest('[data-tt-lang]');
    if (l) {
      var g = l.parentNode.querySelectorAll('[data-tt-lang]');
      for (var j = 0; j < g.length; j++) { g[j].classList.toggle('on', g[j] === l); g[j].setAttribute('aria-pressed', g[j] === l ? 'true' : 'false'); }
      return;
    }
    var key = e.target.closest('[data-key]');
    if (key) teclear(key.getAttribute('data-key'));
  });
  aplicar();
  if (estado.voz) setTimeout(leerPantalla, 400);

  // ---------- Teclado del RUN ----------
  var run = root.querySelector('[data-run]');
  var crudo = run ? run.textContent.replace(/[^0-9K]/gi, '') : '';
  function formatear(c) {
    if (!c) return '';
    var dv = c.length > 1 ? c.slice(-1) : '';
    var cuerpo = c.length > 1 ? c.slice(0, -1) : c;
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return dv ? cuerpo + '-' + dv : cuerpo;
  }
  function teclear(k) {
    if (!run) return;
    if (k === 'del') crudo = crudo.slice(0, -1);
    else if (crudo.length < 9) crudo += k;
    run.textContent = formatear(crudo);
    if (estado.voz) hablar(k === 'del' ? 'Borrado' : k);
  }
  if (run) run.textContent = formatear(crudo);
})();
