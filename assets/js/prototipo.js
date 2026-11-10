/* Prototipo navegable Red Ñielol — Cerberus Tech
   Navegación entre pantallas, ventanas superpuestas, desplegables y escalado. */
(function () {
  'use strict';
  var body = document.body;
  if (!body.classList.contains('proto')) return;

  var W = parseFloat(body.getAttribute('data-w'));
  var H = parseFloat(body.getAttribute('data-h'));
  var stage = document.querySelector('.stage');
  var screen = document.querySelector('.screen');

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } return null; }

  // ---------- Actor y recorrido ----------
  var DATOS = window.CT_DATOS || { pantallas: {}, actores: [] };
  var FILE = body.getAttribute('data-file');
  var params = new URLSearchParams(location.search);
  var actor = null, rIdx = -1, sIdx = -1;

  function findActor(id) {
    for (var i = 0; i < DATOS.actores.length; i++) if (DATOS.actores[i].id === id) return DATOS.actores[i];
    return null;
  }
  function locate(a, prefer) {
    if (!a) return false;
    var order = [];
    if (prefer >= 0 && prefer < a.recorridos.length) order.push(prefer);
    for (var i = 0; i < a.recorridos.length; i++) if (i !== prefer) order.push(i);
    for (var k = 0; k < order.length; k++) {
      var j = a.recorridos[order[k]].pantallas.indexOf(FILE);
      if (j >= 0) { rIdx = order[k]; sIdx = j; return true; }
    }
    return false;
  }
  actor = findActor(params.get('a'));
  var pr = parseInt(params.get('r'), 10);
  if (!locate(actor, isNaN(pr) ? -1 : pr)) {
    if (actor) { rIdx = isNaN(pr) ? -1 : pr; sIdx = -1; }
    else {
      for (var ai = 0; ai < DATOS.actores.length && !actor; ai++) {
        if (locate(DATOS.actores[ai], -1)) actor = DATOS.actores[ai];
      }
    }
  }
  function q(r) {
    if (!actor) return '';
    return '?a=' + encodeURIComponent(actor.id) + (r >= 0 ? '&r=' + r : '');
  }
  function withCtx(href) {
    if (!href || /^[a-z]+:/i.test(href) || href.indexOf('?') >= 0 || !actor) return href;
    var r = rIdx;
    var cur = rIdx >= 0 ? actor.recorridos[rIdx] : null;
    if (!cur || cur.pantallas.indexOf(href) < 0) {
      r = -1;
      for (var i = 0; i < actor.recorridos.length; i++) {
        if (actor.recorridos[i].pantallas.indexOf(href) >= 0) { r = i; break; }
      }
      // La pantalla pertenece a otro actor: el visor lo detecta al cargarla.
      if (r < 0) return href;
    }
    return href + q(r);
  }

  (function setupBar() {
    var aEl = document.querySelector('[data-ui="actor"]');
    var fEl = document.querySelector('[data-ui="flow"]');
    var stEl = document.querySelector('[data-ui="step"]');
    var prev = document.querySelector('[data-ui="prev"]');
    var next = document.querySelector('[data-ui="next"]');
    if (actor && aEl) {
      aEl.textContent = actor.nombre;
      aEl.href = '../actores/' + actor.id + '.html';
      aEl.title = 'Ver el flujo completo de ' + actor.nombre;
    }
    var rec = actor && rIdx >= 0 ? actor.recorridos[rIdx] : null;
    if (fEl) fEl.textContent = rec ? rec.nombre + (sIdx < 0 ? ' · pantalla fuera del recorrido' : '') : '';
    function setLink(el, file, label) {
      if (!el) return;
      if (file) {
        el.href = file + q(rIdx);
        var p = DATOS.pantallas[file];
        el.title = label + ': ' + (p ? p.c + ' · ' + p.t : file) + ' (tecla ' + (label === 'Paso anterior' ? '←' : '→') + ')';
        el.classList.remove('off');
      } else {
        el.removeAttribute('href');
        el.classList.add('off');
        el.setAttribute('aria-disabled', 'true');
      }
    }
    if (rec && sIdx >= 0) {
      if (stEl) stEl.textContent = 'Paso ' + (sIdx + 1) + ' de ' + rec.pantallas.length;
      setLink(prev, rec.pantallas[sIdx - 1], 'Paso anterior');
      setLink(next, rec.pantallas[sIdx + 1], 'Paso siguiente');
    } else {
      if (stEl) stEl.textContent = '';
      setLink(prev, rec ? rec.pantallas[0] : null, 'Paso anterior');
      setLink(next, null, 'Paso siguiente');
    }
  })();

  // ---------- Escalado ----------
  var sizer = document.createElement('div');
  sizer.className = 'sizer';
  screen.parentNode.insertBefore(sizer, screen);
  sizer.appendChild(screen);

  var fit = store('ct-fit') !== '0';
  var fitBtn = document.querySelector('[data-ui="fit"]');

  function layout() {
    var cs = getComputedStyle(stage);
    var aw = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var ah = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var s = 1;
    if (fit) s = Math.min(aw / W, ah / H, 1.5);
    if (!(s > 0)) s = 1;
    sizer.style.width = (W * s) + 'px';
    sizer.style.height = (H * s) + 'px';
    screen.style.transform = 'scale(' + s + ')';
    if (fitBtn) {
      fitBtn.setAttribute('aria-pressed', fit ? 'true' : 'false');
      fitBtn.textContent = fit ? 'Ajustar' : 'Tamaño real';
    }
  }
  window.addEventListener('resize', layout);
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

  // ---------- Zonas clicables ----------
  var hsBtn = document.querySelector('[data-ui="hotspots"]');
  function setHotspots(on) {
    body.classList.toggle('show-hs', on);
    if (hsBtn) hsBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    store('ct-hs', on ? '1' : '0');
  }
  setHotspots(store('ct-hs') === '1');
  var flashTimer = null;
  function flash() {
    body.classList.add('flash-hs');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { body.classList.remove('flash-hs'); }, 650);
  }

  // ---------- Acciones ----------
  function goBack() {
    var sameSite = false;
    try { sameSite = !!document.referrer && new URL(document.referrer).pathname.indexOf('/pantallas/') >= 0; } catch (e) { sameSite = false; }
    if (sameSite && history.length > 1) { history.back(); return; }
    var rec = actor && rIdx >= 0 ? actor.recorridos[rIdx] : null;
    if (rec && sIdx > 0) location.href = rec.pantallas[sIdx - 1] + q(rIdx);
    else if (actor) location.href = '../actores/' + actor.id + '.html';
    else location.href = '../index.html';
  }

  function closeToggles(except) {
    var open = screen.querySelectorAll('.tgl.open');
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== except) setToggle(open[i], false);
    }
  }

  function setToggle(el, on) {
    el.classList.toggle('open', on);
    for (var i = 0; i < el.children.length; i++) {
      var c = el.children[i];
      if (c.classList.contains('st0')) c.hidden = on;
      if (c.classList.contains('st1')) c.hidden = !on;
    }
  }

  function openOverlay(id) {
    var o = document.getElementById(id);
    if (!o) return;
    o.hidden = false;
    o.setAttribute('data-opened', '1');
    var f = o.querySelector('.hs');
    if (f) f.focus({ preventScroll: true });
  }

  function act(t) {
    var go = t.getAttribute('data-go');
    if (go) { location.href = withCtx(go); return; }
    var url = t.getAttribute('data-url');
    if (url) { window.open(url, '_blank', 'noopener'); return; }
    var a = t.getAttribute('data-act');
    if (a === 'back') goBack();
    else if (a === 'close') {
      var o = t.closest('.ovl');
      var origin = body.getAttribute('data-origin');
      if (o && origin && !o.hasAttribute('data-opened')) location.href = withCtx(origin);
      else if (o) o.hidden = true;
      else goBack();
    } else if (a === 'overlay') openOverlay(t.getAttribute('data-target'));
    else if (a === 'toggle') { closeToggles(t); setToggle(t, !t.classList.contains('open')); }
  }

  var HS = '[data-go],[data-act],[data-url]';
  screen.addEventListener('click', function (e) {
    var t = e.target.closest(HS);
    var openT = e.target.closest('.tgl.open');
    if (!openT) closeToggles(null);
    if (!t || !screen.contains(t)) { flash(); return; }
    e.preventDefault();
    act(t);
  });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches(HS)) {
      e.preventDefault(); act(e.target); return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey || tag === 'input' || tag === 'textarea') return;
    if (e.key === 'Escape') {
      closeToggles(null);
      var ovs = screen.querySelectorAll('.ovl:not([hidden])');
      if (ovs.length) ovs[ovs.length - 1].hidden = true;
    } else if (e.key === 'h' || e.key === 'H') {
      setHotspots(!body.classList.contains('show-hs'));
    } else if (e.key === 'f' || e.key === 'F') {
      fit = !fit; store('ct-fit', fit ? '1' : '0'); layout();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      var l = document.querySelector(e.key === 'ArrowLeft' ? '[data-ui="prev"]' : '[data-ui="next"]');
      if (l && l.getAttribute('href')) location.href = l.href;
    } else if (e.key === 'Backspace') {
      e.preventDefault(); goBack();
    }
  });

  if (hsBtn) hsBtn.addEventListener('click', function () { setHotspots(!body.classList.contains('show-hs')); });
  var backBtn = document.querySelector('[data-ui="back"]');
  if (backBtn) backBtn.addEventListener('click', goBack);
  if (fitBtn) fitBtn.addEventListener('click', function () { fit = !fit; store('ct-fit', fit ? '1' : '0'); layout(); });

  // ---------- Avance automático ----------
  var tm = parseInt(body.getAttribute('data-timeout'), 10);
  var tgo = body.getAttribute('data-timeout-go');
  if (tm && tgo) setTimeout(function () { location.href = withCtx(tgo); }, tm);
})();
