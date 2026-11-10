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
    if (history.length > 1 && document.referrer) history.back();
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
    var f = o.querySelector('.hs');
    if (f) f.focus({ preventScroll: true });
  }

  function act(t) {
    var go = t.getAttribute('data-go');
    if (go) { location.href = go; return; }
    var url = t.getAttribute('data-url');
    if (url) { window.open(url, '_blank', 'noopener'); return; }
    var a = t.getAttribute('data-act');
    if (a === 'back') goBack();
    else if (a === 'close') {
      var o = t.closest('.ovl');
      if (o) o.hidden = true; else goBack();
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
      var links = document.querySelectorAll('.pb-tools a.pb-btn:not(.txt), .pb-tools span.pb-btn');
      var l = links[e.key === 'ArrowLeft' ? 0 : 1];
      if (l && l.href) location.href = l.href;
    }
  });

  if (hsBtn) hsBtn.addEventListener('click', function () { setHotspots(!body.classList.contains('show-hs')); });
  if (fitBtn) fitBtn.addEventListener('click', function () { fit = !fit; store('ct-fit', fit ? '1' : '0'); layout(); });

  // ---------- Avance automático ----------
  var tm = parseInt(body.getAttribute('data-timeout'), 10);
  var tgo = body.getAttribute('data-timeout-go');
  if (tm && tgo) setTimeout(function () { location.href = tgo; }, tm);
})();
