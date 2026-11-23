/* =====================================================================
   Walkies Guernsey — main.js (vanilla, no dependencies)
   1. Load choreography   2. Header + menu   3. The lead (signature)
   4. Walk explorer       5. Lightbox        6. Reveals   7. Form
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Load choreography: start once fonts are in (max 900ms wait) ---------- */
  var started = false;
  function go() { if (started) return; started = true; requestAnimationFrame(function () { root.classList.add('is-loaded'); }); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); }
  setTimeout(go, 900);

  var year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  /* ---------- 2. Header, mobile menu, sticky bar, active nav ---------- */
  var header = $('#header');
  var burger = $('#burger');
  var menu = $('#menu');
  var bar = $('#mobileBar');

  function onScrollUI() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    if (bar) bar.classList.toggle('is-shown', y > window.innerHeight * 0.45 && !menu.classList.contains('is-open'));
  }
  window.addEventListener('scroll', onScrollUI, { passive: true });
  onScrollUI();

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    header.classList.toggle('is-scrolled', open || window.scrollY > 12);
    onScrollUI();
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); } });

  var navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['walk', 'photos', 'contact'].forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  /* ---------- 3. The lead: one line from the gate post to the hook by the door ---------- */
  var route = $('#route');
  var leadLine = $('#leadLine');
  var leadUnder = $('#leadUnder');
  var dog = $('#leadDog');
  var homeScene = $('#homeScene');
  var lead = { total: 0, samples: [], top: 0 };
  var NS = 'http://www.w3.org/2000/svg';

  function gutters() {
    var rr = route.getBoundingClientRect();
    var wrap = $('#walk .wrap');
    var wr = wrap.getBoundingClientRect();
    var cs = getComputedStyle(wrap);
    var cl = wr.left + parseFloat(cs.paddingLeft) - rr.left;
    var cr = wr.right - parseFloat(cs.paddingRight) - rr.left;
    var off = cl > 70 ? 40 : cl / 2;
    return { left: Math.max(10, cl - off), right: Math.min(rr.width - 10, cr + off) };
  }

  function buildLead() {
    if (!route || !leadLine) return;
    var rr = route.getBoundingClientRect();
    lead.top = rr.top + window.scrollY;
    var g = gutters();
    var pts = [];
    var s = $('[data-lead-start]').getBoundingClientRect();
    pts.push({ x: s.left - rr.left, y: s.top - rr.top });

    var secs = $$('[data-lead-side]', route).slice(1); // hero is the start
    secs.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      var cs = getComputedStyle(sec);
      var x = g[sec.getAttribute('data-lead-side')];
      var top = r.top - rr.top + parseFloat(cs.paddingTop) * 0.42;
      if (sec.tagName === 'FOOTER') {
        var e = $('[data-lead-end]').getBoundingClientRect();
        var ex = e.left - rr.left, ey = e.top - rr.top;
        pts.push({ x: x, y: top });
        if (ey - 90 > top + 20) pts.push({ x: x, y: ey - 90 });
        pts.push({ x: ex, y: ey });
      } else {
        pts.push({ x: x, y: top });
        pts.push({ x: x, y: r.bottom - rr.top - parseFloat(cs.paddingBottom) * 0.42 });
      }
    });

    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var p = pts[i - 1], q = pts[i], dy = (q.y - p.y) * 0.5;
      d += ' C' + p.x.toFixed(1) + ' ' + (p.y + dy).toFixed(1) + ' ' + q.x.toFixed(1) + ' ' + (q.y - dy).toFixed(1) + ' ' + q.x.toFixed(1) + ' ' + q.y.toFixed(1);
    }
    leadLine.setAttribute('d', d);
    leadUnder.setAttribute('d', d);
    lead.total = leadLine.getTotalLength();
    lead.samples = [];
    var step = 6;
    for (var l = 0; l <= lead.total; l += step) {
      var pt = leadLine.getPointAtLength(l);
      lead.samples.push({ l: l, x: pt.x, y: pt.y });
    }
    var endPt = leadLine.getPointAtLength(lead.total);
    lead.samples.push({ l: lead.total, x: endPt.x, y: endPt.y });
    [leadLine, leadUnder].forEach(function (el) { el.style.strokeDasharray = lead.total + ' ' + lead.total; });
    drawLead();
  }

  var lastLen = -1;
  function drawLead() {
    if (!lead.total) return;
    var len;
    if (reduceMotion) { len = lead.total; }
    else {
      var target = window.scrollY + window.innerHeight * 0.62 - lead.top;
      var sm = lead.samples, lo = 0, hi = sm.length - 1;
      while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (sm[mid].y <= target) lo = mid; else hi = mid - 1; }
      len = Math.max(0, sm[lo].l);
      // At the very bottom of the page, finish the walk.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) len = lead.total;
    }
    var off = lead.total - len;
    leadLine.style.strokeDashoffset = off;
    leadUnder.style.strokeDashoffset = off;

    if (dog && !reduceMotion) {
      var pt = leadLine.getPointAtLength(len);
      dog.style.transform = 'translate(' + (pt.x - 29).toFixed(1) + 'px,' + (pt.y - 37.6).toFixed(1) + 'px)';
      dog.classList.add('is-ready');
      var home = len >= lead.total - 1;
      dog.classList.toggle('is-home', home);
      if (homeScene) homeScene.classList.toggle('is-arrived', home);
      if (lastLen >= 0 && Math.abs(len - lastLen) > 0.5) trot();
      lastLen = len;
    }
  }

  var trotTimer;
  function trot() {
    dog.classList.add('is-trotting');
    clearTimeout(trotTimer);
    trotTimer = setTimeout(function () { dog.classList.remove('is-trotting'); }, 200);
  }

  if (route && leadLine) {
    if (reduceMotion && homeScene) homeScene.classList.add('is-arrived');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { drawLead(); ticking = false; });
    }, { passive: true });
    var rebuildT;
    var rebuild = function () { clearTimeout(rebuildT); rebuildT = setTimeout(buildLead, 120); };
    window.addEventListener('resize', rebuild);
    window.addEventListener('load', buildLead);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildLead);
    if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(route);
    buildLead();
  }

  /* ---------- 4. Walk explorer ---------- */
  var STEPS = [
    {
      title: 'Out with friends',
      text: 'Your dog heads out with the friends they know, with room to run and play as well as walk.',
      list: ['Walked alongside other dogs', 'Time to run and play'],
      img: 'headland-play', w: 800, h: 488,
      alt: 'Three apricot dogs on a grassy headland above the sea, one rolling on its back'
    },
    {
      title: 'Fields and coast paths',
      text: 'Walks cross open grass and follow the paths above the sea, with room to stretch their legs.',
      list: ['Open grass on the headlands', 'Gorse paths and cliff tops', 'Around the Vale'],
      img: 'gorse-path', w: 600, h: 800,
      alt: 'Three dogs heading away along a narrow path between gorse and bracken'
    },
    {
      title: 'Looked after as our own',
      text: 'We love the dogs we walk as if they were ours, from the young ones charging about to the older ones taking it steady.',
      list: ['Lots of fuss along the way'],
      img: 'cliff-top-doodle', w: 800, h: 600,
      alt: 'A curly apricot dog in a harness standing on a grassy cliff top above the sea'
    },
    {
      title: 'Back home',
      text: 'Once the walk is done, we bring your dog back home, worn out and content.',
      list: ['Dropped back home after the walk'],
      img: 'spaniel-sitting', w: 586, h: 800,
      alt: 'An older golden cocker spaniel sitting on the grass with the sea behind'
    }
  ];
  var tabs = $$('#stepTabs [role="tab"]');
  var panel = $('#stepPanel');
  var stepImg = $('#stepImg'), stepBody = $('#stepBody');
  var current = 0, swapT;

  // Warm the cache for the other step photos once the section is near.
  var preloaded = false;
  function preloadSteps() {
    if (preloaded) return; preloaded = true;
    STEPS.forEach(function (s) { var i = new Image(); i.src = 'images/work/' + s.img + '-sm.webp'; });
  }

  function showStep(i, focus) {
    if (i === current) return;
    current = i;
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tabs[i].focus();
    tabs[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    var s = STEPS[i];
    stepImg.classList.add('is-leaving');
    stepBody.classList.add('is-swapping');
    clearTimeout(swapT);
    swapT = setTimeout(function () {
      stepImg.src = 'images/work/' + s.img + '-sm.webp';
      stepImg.srcset = 'images/work/' + s.img + '-sm.webp 800w, images/work/' + s.img + '.webp 1600w';
      stepImg.width = s.w; stepImg.height = s.h; stepImg.alt = s.alt;
      $('#stepCount').textContent = 'Step ' + (i + 1) + ' of ' + STEPS.length;
      $('#stepTitle').textContent = s.title;
      $('#stepText').textContent = s.text;
      var ul = $('#stepList');
      ul.innerHTML = s.list.map(function (li) {
        return '<li class="flex items-start gap-3"><svg class="icon mt-0.5 text-action" aria-hidden="true"><use href="#i-paw"/></svg><span>' + li + '</span></li>';
      }).join('');
      var done = function () { stepImg.classList.remove('is-leaving'); stepBody.classList.remove('is-swapping'); };
      if (stepImg.complete) requestAnimationFrame(done); else { stepImg.onload = done; setTimeout(done, 600); }
    }, reduceMotion ? 0 : 220);
  }
  tabs.forEach(function (t, n) {
    t.addEventListener('click', function () { showStep(n); });
    t.addEventListener('mouseenter', preloadSteps);
    t.addEventListener('focus', preloadSteps);
    t.addEventListener('keydown', function (e) {
      var k = e.key, to = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') to = (n + 1) % tabs.length;
      if (k === 'ArrowLeft' || k === 'ArrowUp') to = (n - 1 + tabs.length) % tabs.length;
      if (k === 'Home') to = 0;
      if (k === 'End') to = tabs.length - 1;
      if (to !== null) { e.preventDefault(); showStep(to, true); }
    });
  });

  /* ---------- 5. Lightbox ---------- */
  var shots = $$('#gallery .shot').filter(function (b) { return getComputedStyle(b).display !== 'none'; });
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  var lbIndex = 0, lastFocus = null;

  function visibleShots() { return $$('#gallery .shot').filter(function (b) { return getComputedStyle(b).display !== 'none'; }); }
  function lbShow(i) {
    shots = visibleShots();
    lbIndex = (i + shots.length) % shots.length;
    var b = shots[lbIndex], img = $('img', b);
    lbImg.classList.add('is-changing');
    setTimeout(function () {
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = img.alt;
      lbImg.width = img.width; lbImg.height = img.height;
      lbCap.textContent = b.getAttribute('data-cap');
      lbCount.textContent = (lbIndex + 1) + ' / ' + shots.length;
      var done = function () { lbImg.classList.remove('is-changing'); };
      if (lbImg.complete) requestAnimationFrame(done); else { lbImg.onload = done; setTimeout(done, 700); }
    }, reduceMotion ? 0 : 140);
  }
  function lbOpen(i) {
    lastFocus = document.activeElement;
    lbShow(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lb-shown');
    setTimeout(function () { $('#lbClose').focus(); }, 50);
  }
  function lbCloseFn() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.classList.remove('lb-shown');
    if (lastFocus) lastFocus.focus();
  }
  $$('#gallery .shot').forEach(function (b) {
    b.addEventListener('click', function () { lbOpen(visibleShots().indexOf(b)); });
  });
  $('#lbClose').addEventListener('click', lbCloseFn);
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.id === 'lbStage') lbCloseFn(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbCloseFn();
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if (e.key === 'Tab') { // keep focus inside
      var f = $$('button', lb).filter(function (x) { return x.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Swipe
  var sx = null, sy = null;
  var stage = $('#lbStage');
  stage.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; });
  stage.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    sx = sy = null;
  });
  stage.addEventListener('pointercancel', function () { sx = sy = null; });

  /* ---------- 6. Reveals (a few elements only) ---------- */
  var reveals = $$('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { rio.observe(el); });
    var walk = $('#walk');
    if (walk) new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { preloadSteps(); o.disconnect(); } }, { rootMargin: '300px' }).observe(walk);
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 7. Form: inline validation + sending state ---------- */
  var form = $('#quoteForm');
  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var check = function (el) {
      var f = el.closest('.field'); if (!f) return true;
      var v = el.value.trim(), ok = true;
      if (el.required && !v) ok = false;
      if (ok && el.type === 'email' && v && !emailRe.test(v)) ok = false;
      if (ok && el.type === 'tel' && v && v.replace(/[^0-9]/g, '').length < 6) ok = false;
      f.classList.toggle('has-error', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    var fields = $$('input:not([type=hidden]):not([name=_honey]), select, textarea', form);
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value.trim() || el.closest('.field').classList.contains('has-error')) check(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('has-error')) check(el); });
      el.addEventListener('change', function () { check(el); });
    });
    form.addEventListener('submit', function (e) {
      var ok = true, firstBad = null;
      fields.forEach(function (el) { if (!check(el)) { ok = false; if (!firstBad) firstBad = el; } });
      if (!ok) { e.preventDefault(); firstBad.focus(); $('#formStatus').textContent = 'Please check the highlighted fields.'; return; }
      var btn = $('.btn-submit', form);
      btn.classList.add('is-sending');
      btn.disabled = true;
      $('.btn-label', btn).textContent = 'Sending';
      $('#formStatus').textContent = '';
    });
  }
})();
