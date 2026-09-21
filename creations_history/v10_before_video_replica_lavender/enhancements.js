/**
 * ENHANCEMENTS — arch reveal choreography + hummingbirds & butterflies
 * Mustafa & Tasneem wedding invitation.
 *
 * Works alongside app.js without modifying it:
 *   - waits for #invitation-screen to lose its "hidden" class (app.js does that when the
 *     envelope has finished opening), then plays the arch reveal, restarts the walking
 *     couple video from its first frame and releases the wildlife.
 *   - the seal-tap glow waves are pure CSS (enhancements.css) driven by app.js's
 *     existing .light-active / .glowing classes.
 *
 * To revert: remove the <script> tag for this file (and enhancements.css).
 */
(function () {
  'use strict';

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var uid = 0;

  /* ------------------------------------------------------------------
     1. Hero prep — a second, lower lantern on each side (like the reference)
     ------------------------------------------------------------------ */
  function addSecondLanterns() {
    var stage = document.getElementById('hero-archway-stage');
    if (!stage || stage.querySelector('.lantern-b')) return;
    ['lantern-left', 'lantern-right'].forEach(function (id) {
      var src = document.getElementById(id);
      if (!src) return;
      var clone = src.cloneNode(true);
      clone.removeAttribute('id');
      clone.classList.add('lantern-b');
      var body = clone.querySelector('.lantern-body');
      if (body) body.style.animationDelay = (Math.random() * -3).toFixed(2) + 's';
      src.parentNode.insertBefore(clone, src.nextSibling);
    });
  }

  /* ------------------------------------------------------------------
     2. Arch reveal — runs once the invitation screen becomes visible
     ------------------------------------------------------------------ */
  var revealed = false;

  function revealArch() {
    if (revealed) return;
    revealed = true;

    var stage = document.getElementById('hero-archway-stage');
    if (stage) {
      stage.classList.remove('arch-revealed');
      void stage.offsetWidth; // restart the CSS animations cleanly
      stage.classList.add('arch-revealed');
    }

    startCoupleVideo();
    startWildlife(2200);
  }

  // The walking-couple loop starts from its first frame as the arch appears. Browsers can pause a
  // muted autoplay video while its section was hidden, so keep nudging it whenever it is on screen.
  function startCoupleVideo() {
    var vid = document.getElementById('couple-walk-video');
    if (!vid) return;
    var wantPlay = true;
    function play() {
      var p;
      try { p = vid.play(); } catch (e) { /* autoplay blocked; the poster stays visible */ }
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }
    try { vid.currentTime = 0; } catch (e) {}
    play();
    setInterval(function () { if (wantPlay && vid.paused && !document.hidden) play(); }, 700);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        wantPlay = entries[0].isIntersecting;
        if (wantPlay) play(); else vid.pause();
      }, { threshold: 0.15 }).observe(vid);
    }
  }

  function watchForReveal() {
    var invite = document.getElementById('invitation-screen');
    if (!invite) return;
    if (!invite.classList.contains('hidden')) { revealArch(); return; }
    var mo = new MutationObserver(function () {
      if (!invite.classList.contains('hidden')) { mo.disconnect(); revealArch(); }
    });
    mo.observe(invite, { attributes: true, attributeFilter: ['class'] });
  }

  /* ------------------------------------------------------------------
     3. Wildlife — SVG sprites
     ------------------------------------------------------------------ */
  // [light wing tone, deep wing tone, accent dots]
  var PALETTES = [
    ['#f4b6dc', '#9a6fd0', '#e9c46a'], // orchid pink → violet (like the reference butterfly)
    ['#ffe08a', '#e0a13a', '#fff3c4'], // golden
    ['#f4eefc', '#b8a0e0', '#e9c46a'], // pearl lavender
    ['#f7a8b8', '#c2547a', '#ffe1a8']  // rose
  ];

  function butterflySVG(pal) {
    var id = 'bfg' + (++uid);
    var half =
      '<path d="M49 36C44 18 30 4 16 5C6 6 2 16 6 26C10 36 30 42 49 42Z" fill="url(#' + id + ')" stroke="rgba(74,45,120,.75)" stroke-width="1.1"/>' +
      '<path d="M49 42C36 44 22 52 20 62C19 70 28 74 35 68C43 62 48 52 49 46Z" fill="url(#' + id + 'b)" stroke="rgba(74,45,120,.75)" stroke-width="1.1"/>' +
      '<path d="M49 40C36 30 24 20 12 12M49 43C34 44 24 46 10 34" fill="none" stroke="rgba(255,255,255,.55)" stroke-width=".8"/>' +
      '<circle cx="17" cy="17" r="2.4" fill="' + pal[2] + '"/><circle cx="11" cy="24" r="1.7" fill="' + pal[2] + '"/><circle cx="27" cy="62" r="1.8" fill="' + pal[2] + '"/>';
    return '<svg viewBox="0 0 100 80" width="100%" height="100%" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="' + id + '" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + pal[0] + '"/><stop offset="1" stop-color="' + pal[1] + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + pal[1] + '"/><stop offset="1" stop-color="' + pal[0] + '"/></linearGradient>' +
      '</defs>' +
      '<g class="wl">' + half + '</g>' +
      '<g class="wr"><g transform="translate(100 0) scale(-1 1)">' + half + '</g></g>' +
      '<ellipse cx="50" cy="42" rx="2.6" ry="13" fill="#4a3560"/><circle cx="50" cy="27" r="3.2" fill="#4a3560"/>' +
      '<path d="M49 25C46 16 42 12 39 11M51 25C54 16 58 12 61 11" fill="none" stroke="#4a3560" stroke-width="1" stroke-linecap="round"/>' +
      '</svg>';
  }

  // Faces LEFT by default (like the reference hummingbird); flipped with scaleX(-1) to face right
  function hummingSVG() {
    var id = 'hbg' + (++uid);
    return '<svg viewBox="0 0 140 100" width="100%" height="100%" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f8a7a"/><stop offset=".55" stop-color="#a7aa9d"/><stop offset="1" stop-color="#f4eee4"/></linearGradient></defs>' +
      '<path class="hw2" d="M58 44C66 20 92 6 122 8C114 26 88 44 64 50Z" fill="rgba(196,184,228,.55)" stroke="rgba(120,100,158,.55)" stroke-width="1"/>' +
      '<path d="M92 62L124 86L116 90L106 82L100 94L88 72Z" fill="#7a5a66"/>' +
      '<path d="M34 30C50 24 74 34 94 60C86 70 62 68 46 54C36 46 32 38 34 30Z" fill="url(#' + id + ')"/>' +
      '<path d="M38 41C48 57 68 66 88 66C74 73 52 67 40 52Z" fill="#f7f2e9" opacity=".92"/>' +
      '<circle cx="34" cy="36" r="10" fill="#7f8579"/>' +
      '<path d="M25 41C29 49 38 49 43 44C40 42 33 43 25 41Z" fill="#f1e9df"/>' +
      '<path d="M25 36L3 33" stroke="#3a3034" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="31" cy="34" r="2.6" fill="#231d20"/><circle cx="30.2" cy="33.2" r=".8" fill="#fff"/>' +
      '<path class="hw1" d="M52 44C58 22 82 10 108 16C98 32 76 46 58 50Z" fill="rgba(228,220,246,.66)" stroke="rgba(120,100,158,.55)" stroke-width="1"/>' +
      '</svg>';
  }

  /* ------------------------------------------------------------------
     4. Wildlife — flight
     ------------------------------------------------------------------ */
  var layer = null;
  var critters = [];
  var rafId = 0;
  var lastT = 0;
  var running = false;

  function vw() { return window.innerWidth; }
  function vh() { return window.innerHeight; }
  function qb(a, c, b, t) { var u = 1 - t; return u * u * a + 2 * u * t * c + t * t * b; }

  function makeCritter(kind, w, h, svg) {
    var el = document.createElement('div');
    el.className = 'critter ' + kind;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    if (kind === 'bf') el.style.setProperty('--flap', rand(0.22, 0.34).toFixed(2) + 's');
    el.innerHTML = svg;
    layer.appendChild(el);
    var c = { el: el, kind: kind, w: w, h: h, x: -200, y: -200, vx: 0, vy: 0, rot: 0, face: 1, phase: rand(0, 6.28), mode: 'wander', mt: 0, dur: 0, sleep: 0 };
    critters.push(c);
    return c;
  }

  function place(c, pitchDeg) {
    c.el.style.transform =
      'translate3d(' + (c.x - c.w / 2).toFixed(1) + 'px,' + (c.y - c.h / 2).toFixed(1) + 'px,0)' +
      (c.kind === 'hb' ? ' scaleX(' + c.face + ') rotate(' + pitchDeg.toFixed(1) + 'deg)' : ' rotate(' + c.rot.toFixed(1) + 'deg)');
  }

  /* --- butterflies: drift on lazy, fluttering, looping paths --- */
  function pickButterflyTarget(c) {
    c.tx = rand(vw() * 0.06, vw() * 0.94);
    c.ty = rand(vh() * 0.08, vh() * 0.92);
    c.speed = rand(46, 92);
    c.hold = rand(2.4, 5.2);
  }

  function updateButterfly(c, dt, t) {
    if (c.sleep > 0) { c.sleep -= dt; return; }
    c.hold -= dt;
    var dx = c.tx - c.x, dy = c.ty - c.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (c.hold <= 0 || d < 28) pickButterflyTarget(c);
    var k = Math.min(1, dt * 1.5);
    c.vx += (dx / d * c.speed - c.vx) * k;
    c.vy += (dy / d * c.speed - c.vy) * k;
    var sp = Math.sqrt(c.vx * c.vx + c.vy * c.vy) || 1;
    var wob = Math.sin(t * 6.5 + c.phase) * 26 + Math.sin(t * 2.7 + c.phase * 1.7) * 16;
    c.x += (c.vx + (-c.vy / sp) * wob) * dt;
    c.y += (c.vy + (c.vx / sp) * wob + Math.sin(t * 9 + c.phase) * 16) * dt;
    var target = Math.atan2(c.vy, c.vx) * 180 / Math.PI + 90; // head is "up" in the sprite
    var diff = ((target - c.rot + 540) % 360) - 180;
    c.rot += diff * Math.min(1, dt * 3.2);
    place(c, 0);
  }

  function spawnButterfly(i, small) {
    var w = small ? rand(34, 46) : rand(40, 58);
    var c = makeCritter('bf', w, w * 0.8, butterflySVG(PALETTES[i % PALETTES.length]));
    var fromTop = Math.random() < 0.5;
    c.x = rand(vw() * 0.1, vw() * 0.9);
    c.y = fromTop ? -60 : vh() + 60;
    c.vy = fromTop ? 40 : -40;
    c.sleep = i * 0.8;
    pickButterflyTarget(c);
    setTimeout(function () { c.el.classList.add('on'); }, 200 + i * 800);
  }

  /* --- hummingbirds: swoop in, hover at a flower, dart away --- */
  function flowerSpot() {
    var spots = [];
    var imgs = document.querySelectorAll('.arch-corner-left .arch-corner-img, .arch-corner-right .arch-corner-img');
    for (var i = 0; i < imgs.length; i++) {
      var r = imgs[i].getBoundingClientRect();
      if (r.width > 0 && r.bottom > 40 && r.top < vh() - 40) spots.push({ x: r.left + r.width * 0.5, y: r.top + r.height * 0.6 });
    }
    if (spots.length) return spots[Math.floor(Math.random() * spots.length)];
    return { x: rand(vw() * 0.2, vw() * 0.8), y: rand(vh() * 0.2, vh() * 0.6) };
  }

  function startArrive(c) {
    var spot = flowerSpot();
    var fromRight = spot.x < vw() / 2;
    c.face = fromRight ? 1 : -1;               // face the flower
    c.hx = spot.x + (fromRight ? 1 : -1) * c.w * 0.5;
    c.hy = spot.y;
    c.x0 = fromRight ? vw() + 80 : -80;
    c.y0 = rand(vh() * 0.1, vh() * 0.7);
    c.cx = (c.x0 + c.hx) / 2;
    c.cy = Math.min(c.y0, c.hy) - rand(40, 120);
    c.mode = 'arrive'; c.mt = 0; c.dur = rand(2.6, 3.4);
    c.el.classList.add('on');
  }

  function updateHummingbird(c, dt, t) {
    c.mt += dt;
    var pitch = 0, p, e;
    if (c.mode === 'wait') {
      if (c.mt >= c.dur) startArrive(c);
      return;
    }
    if (c.mode === 'arrive') {
      p = Math.min(1, c.mt / c.dur);
      e = 1 - Math.pow(1 - p, 3);
      c.x = qb(c.x0, c.cx, c.hx, e);
      c.y = qb(c.y0, c.cy, c.hy, e);
      pitch = -8 * (1 - e);
      if (p >= 1) { c.mode = 'hover'; c.mt = 0; c.dur = rand(4, 6.5); }
    } else if (c.mode === 'hover') {
      c.x = c.hx + Math.sin(t * 2.3 + c.phase) * 5 + Math.sin(t * 5.1) * 1.5;
      c.y = c.hy + Math.sin(t * 3.1 + c.phase) * 6;
      pitch = 10 + Math.sin(t * 2) * 3;
      if (c.mt >= c.dur) {
        c.mode = 'leave'; c.mt = 0; c.dur = rand(1.8, 2.4);
        c.sx = c.x; c.sy = c.y;
        c.face = -c.face;                       // turn away from the flower
        c.ex = c.face === 1 ? -100 : vw() + 100;
        c.ey = rand(-40, vh() * 0.5);
        c.lcy = c.sy - rand(60, 140);
      }
    } else { // leave
      p = Math.min(1, c.mt / c.dur);
      e = Math.pow(p, 2.2);
      c.x = qb(c.sx, (c.sx + c.ex) / 2, c.ex, e);
      c.y = qb(c.sy, c.lcy, c.ey, e);
      pitch = 8 * p;
      if (p >= 1) { c.mode = 'wait'; c.mt = 0; c.dur = rand(9, 20); c.el.classList.remove('on'); }
    }
    place(c, pitch);
  }

  function spawnHummingbird(j) {
    var w = vw() < 600 ? 64 : 82;
    var c = makeCritter('hb', w, w * 0.72, hummingSVG());
    c.mode = 'wait';
    c.dur = 3 + j * 7;
  }

  /* --- main loop --- */
  function tick(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    var t = now / 1000;
    for (var i = 0; i < critters.length; i++) {
      var c = critters[i];
      if (c.kind === 'bf') updateButterfly(c, dt, t); else updateHummingbird(c, dt, t);
    }
    rafId = requestAnimationFrame(tick);
  }

  function startWildlife(delayMs) {
    if (reduceMotion || running) return;
    setTimeout(function () {
      if (running) return;
      running = true;
      layer = document.createElement('div');
      layer.id = 'wildlife-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
      var small = vw() < 600;
      var nButterflies = small ? 4 : 6;
      for (var i = 0; i < nButterflies; i++) spawnButterfly(i, small);
      for (var j = 0; j < 2; j++) spawnHummingbird(j);
      lastT = performance.now();
      rafId = requestAnimationFrame(tick);
    }, delayMs || 0);
  }

  document.addEventListener('visibilitychange', function () {
    if (!running) return;
    if (document.hidden) { cancelAnimationFrame(rafId); }
    else { lastT = performance.now(); rafId = requestAnimationFrame(tick); }
  });

  /* ------------------------------------------------------------------ */
  function init() {
    addSecondLanterns();
    watchForReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
