/**
 * ENHANCEMENTS — arch reveal, butterflies roaming the whole screen, and a small flock of
 * hummingbirds that hovers around the roses of the arch artwork.
 * Mustafa & Tasneem wedding invitation.
 *
 * Works alongside app.js without modifying it:
 *   - waits for #invitation-screen to lose its "hidden" class (envelope.js does that when the
 *     envelope has finished opening), then plays the arch reveal and releases the wildlife.
 *   - butterflies drift over the FULL width of the screen, including over the invitation column;
 *     their layer sits behind the card content (z-index), so they pass behind text and cards and
 *     only show through the gaps and margins — never drawn on top of anything readable.
 *   - three hummingbirds live INSIDE the arch: they hover beside its rose and lilac clusters,
 *     dart from bloom to bloom (slowly — a leisurely drift, not a dart) and scroll away with the arch.
 *
 * To revert to the pre-lavender build: see creations_history/v10_before_video_replica_lavender/.
 */
(function () {
  'use strict';

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var uid = 0;

  /* ------------------------------------------------------------------
     1. Arch reveal — runs once the invitation screen becomes visible
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
    startWildlife(2200);
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
     2. Sprites (SVG)
     ------------------------------------------------------------------ */
  // [light wing tone, deep wing tone, accent dots]
  var PALETTES = [
    ['#f4b6dc', '#9a6fd0', '#f3e6ff'], // orchid pink → violet (like the reference butterfly)
    ['#e8dcff', '#9d7fe0', '#ffffff'], // lilac
    ['#fff0c2', '#d9b25a', '#ffffff'], // soft gold
    ['#f7a8b8', '#c2547a', '#ffe6f4']  // rose
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
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6d62"/><stop offset=".55" stop-color="#8b968a"/><stop offset="1" stop-color="#f1e8da"/></linearGradient></defs>' +
      '<path class="hw2" d="M58 44C66 20 92 6 122 8C114 26 88 44 64 50Z" fill="rgba(196,184,228,.55)" stroke="rgba(120,100,158,.55)" stroke-width="1"/>' +
      '<path d="M92 62L124 86L116 90L106 82L100 94L88 72Z" fill="#7a5a66"/>' +
      '<path d="M34 30C50 24 74 34 94 60C86 70 62 68 46 54C36 46 32 38 34 30Z" fill="url(#' + id + ')"/>' +
      '<path d="M38 41C48 57 68 66 88 66C74 73 52 67 40 52Z" fill="#f7f2e9" opacity=".92"/>' +
      '<circle cx="34" cy="36" r="10" fill="#5f6a5f"/>' +
      '<path d="M25 41C29 49 38 49 43 44C40 42 33 43 25 41Z" fill="#f1e9df"/>' +
      '<path d="M25 36L3 33" stroke="#3a3034" stroke-width="2.2" stroke-linecap="round"/>' +
      '<circle cx="31" cy="34" r="2.6" fill="#231d20"/><circle cx="30.2" cy="33.2" r=".8" fill="#fff"/>' +
      '<path class="hw1" d="M52 44C58 22 82 10 108 16C98 32 76 46 58 50Z" fill="rgba(228,220,246,.66)" stroke="rgba(120,100,158,.55)" stroke-width="1"/>' +
      '</svg>';
  }

  /* ------------------------------------------------------------------
     3. Butterflies — page-wide, kept to the two side bands (px coordinates, fixed layer)
     ------------------------------------------------------------------ */
  var layer = null;           // #wildlife-layer (fixed, behind the text)
  var critters = [];          // butterflies
  var rafId = 0;
  var lastT = 0;
  var running = false;

  function vw() { return window.innerWidth; }
  function vh() { return window.innerHeight; }
  function qb(a, c, b, t) { var u = 1 - t; return u * u * a + 2 * u * t * c + t * t * b; }

  function makeButterfly(w, h, svg) {
    var el = document.createElement('div');
    el.className = 'critter bf';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.setProperty('--flap', rand(0.22, 0.34).toFixed(2) + 's');
    el.innerHTML = svg;
    layer.appendChild(el);
    var c = { el: el, w: w, h: h, x: -200, y: -200, vx: 0, vy: 0, rot: 0, phase: rand(0, 6.28), sleep: 0 };
    critters.push(c);
    return c;
  }

  function placeButterfly(c) {
    c.el.style.transform =
      'translate3d(' + (c.x - c.w / 2).toFixed(1) + 'px,' + (c.y - c.h / 2).toFixed(1) + 'px,0) rotate(' + c.rot.toFixed(1) + 'deg)';
  }

  // The butterflies roam the FULL width of the screen — including over the invitation column and,
  // on a wide/desktop viewport, well outside it into the side margins — but the layer they live in
  // sits behind the card content (z-index, see #wildlife-layer), so they pass behind text and cards
  // and only show through in the gaps between them. That "now you see it, now you don't" is the
  // effect, not a hard boundary.
  //
  // "hold" is derived from the actual distance to the new target, not a fixed random span: on a
  // narrow phone screen a flat 2.4-5.2s hold was plenty of time to cross the whole width, but on a
  // wide desktop viewport it was nowhere near enough — the butterfly got re-targeted long before it
  // ever reached a far-off point, so in practice it just drifted near wherever it started, never
  // visibly reaching the outer margins. Basing hold on distance/speed (+ a short linger) guarantees
  // it actually arrives wherever it's sent, however far that is.
  function pickButterflyTarget(c) {
    c.tx = rand(vw() * 0.04, vw() * 0.96);
    c.ty = rand(vh() * 0.06, vh() * 0.94);
    c.speed = rand(55, 100);
    var dist = Math.hypot(c.tx - c.x, c.ty - c.y);
    c.hold = dist / c.speed + rand(0.8, 2.0);
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
    var lo = vw() * 0.02, hi = vw() * 0.98;          // stay just inside the viewport edges
    if (c.x < lo) { c.x = lo; c.vx = Math.abs(c.vx); }
    else if (c.x > hi) { c.x = hi; c.vx = -Math.abs(c.vx); }
    var target = Math.atan2(c.vy, c.vx) * 180 / Math.PI + 90; // head is "up" in the sprite
    var diff = ((target - c.rot + 540) % 360) - 180;
    c.rot += diff * Math.min(1, dt * 3.2);
    placeButterfly(c);
  }

  function spawnButterfly(i, small) {
    var w = small ? rand(26, 36) : rand(30, 44);
    var c = makeButterfly(w, w * 0.8, butterflySVG(PALETTES[i % PALETTES.length]));
    var fromTop = Math.random() < 0.5;
    c.x = rand(vw() * 0.1, vw() * 0.9);
    c.y = fromTop ? -60 : vh() + 60;
    c.vy = fromTop ? 40 : -40;
    c.sleep = i * 0.6;
    pickButterflyTarget(c);
    setTimeout(function () { c.el.classList.add('on'); }, 200 + i * 550);
  }

  /* ------------------------------------------------------------------
     4. Hummingbirds — a small flock hovering around the blooms of the arch artwork.
        Coordinates are in "widths of the arch" (1 = the arch's width; the 768 x 1376 artwork is
        AR = 1.79 widths tall), so the flock scales with the screen and scrolls with the arch.
     ------------------------------------------------------------------ */
  var AR = 1376 / 768;
  var FW = 0.19;                     // a bird is 19% of the arch's width ...
  var FR = 0.72;                     // ... and this much taller than wide (its own ratio)

  // Where the blooms are in the artwork — [x, y] in widths — grouped by corner: 0 TL, 1 TR, 2 BL, 3 BR
  var BLOOMS = [
    [[0.14, 0.16], [0.24, 0.06], [0.05, 0.29], [0.14, 0.36]],
    [[0.86, 0.15], [0.96, 0.28], [0.85, 0.35]],
    [[0.16, 1.56], [0.06, 1.42], [0.26, 1.68]],
    [[0.85, 1.60], [0.96, 1.45], [0.81, 1.41]]
  ];
  var LOGO = { x: 0.5, y: 0.9, r: 0.37 };   // the medallion in the middle is kept clear ...
  var GAP = 0.15;                            // ... and so is each other bird's hover spot

  var arch = null, flock = null;
  var birds = [];
  var archVisible = true;
  var lastW = 0;

  function makeBird(ci) {
    var el = document.createElement('div');
    el.className = 'critter hb';
    el.innerHTML = hummingSVG();
    flock.appendChild(el);
    var c = { el: el, X: 0, Y: 0, face: 1, pitch: 0, phase: rand(0, 6.28), ci: ci, mode: 'hover', mt: 0, dur: 0, hx: 0, hy: 0 };
    birds.push(c);
    var pt = pickBloom(c, ci) || hoverPoint(BLOOMS[ci][0]);
    c.X = c.hx = c.tx = pt.x; c.Y = c.hy = c.ty = pt.y; c.face = pt.face;
    c.dur = rand(2.5, 5.5);
    return c;
  }

  // Settle beside a bloom on its inner side, beak toward it. The bird stays inside the artwork and
  // out of the middle 38% of it, where the "Scroll down" hint sits.
  function hoverPoint(b) {
    var left = b[0] < 0.5;
    var x = b[0] + (left ? 1 : -1) * (0.08 + FW * 0.4) + rand(-0.015, 0.015);
    return {
      x: left ? clamp(x, 0.09, 0.31) : clamp(x, 0.69, 0.91),
      y: clamp(b[1] + rand(-0.025, 0.025), 0.08, AR - 0.08),
      face: left ? 1 : -1                 // 1 = facing left (as drawn), -1 = facing right
    };
  }

  // A free hover spot beside a bloom of this corner, or null when the corner is too crowded.
  function pickBloom(c, ci) {
    var list = BLOOMS[ci].slice(), i, j, k, t, pt, ok, o;
    for (i = list.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = list[i]; list[i] = list[j]; list[j] = t; }
    for (i = 0; i < list.length; i++) {
      for (t = 0; t < 3; t++) {
        pt = hoverPoint(list[i]);
        ok = !(c.tx !== undefined && Math.hypot(c.tx - pt.x, c.ty - pt.y) < 0.08);   // not the bloom it is at now
        for (k = 0; ok && k < birds.length; k++) {                                     // and clear of the other birds
          o = birds[k];
          if (o !== c && o.tx !== undefined && Math.hypot(o.tx - pt.x, o.ty - pt.y) < GAP) ok = false;
        }
        if (ok) return pt;
      }
    }
    return null;
  }

  function startDash(c) {
    var ci, r = Math.random(), i, o;
    if (c.nextCi !== undefined) { ci = c.nextCi; c.nextCi = undefined; }
    else if (r < 0.55) ci = c.ci;                    // another bloom in the same cluster
    else if (r < 0.87) ci = c.ci ^ 2;                // up / down the same side
    else ci = c.ci < 2 ? c.ci ^ 1 : c.ci;            // across the top of the arch now and then
    var pt = pickBloom(c, ci);
    if (!pt) { ci = c.ci ^ 2; pt = pickBloom(c, ci); }              // crowded: try up / down the same side
    if (!pt) { c.dur = c.mt + rand(0.8, 1.6); return; }             // nowhere free: keep hovering a little longer
    c.ci = ci;
    c.sx = c.X; c.sy = c.Y; c.ex = pt.x; c.ey = pt.y;
    c.tx = pt.x; c.ty = pt.y; c.face = pt.face;
    var dx = c.ex - c.sx, dy = c.ey - c.sy, dist = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dy) > 0.6) { c.cx = c.sx < 0.5 ? 0.02 : 0.98; c.cy = (c.sy + c.ey) / 2; }          // hug the edge, not the logo
    else if (Math.abs(dx) > 0.3) { c.cx = (c.sx + c.ex) / 2; c.cy = Math.min(c.sy, c.ey) - 0.09; }   // arc over the top
    else { c.cx = (c.sx + c.ex) / 2 + (c.ex < 0.5 ? -1 : 1) * rand(0, 0.06); c.cy = (c.sy + c.ey) / 2 + rand(-0.05, 0.05); }   // bend outward, away from the middle
    c.mode = 'dash'; c.mt = 0; c.dur = clamp(dist * 1.8 + 1.0, 1.3, 3.2); // a leisurely drift, not a dart
    // the rest of the flock on this side sometimes follows the leader
    for (i = 0; i < birds.length; i++) {
      o = birds[i];
      if (o !== c && o.mode === 'hover' && o.nextCi === undefined && o.ci !== ci && (o.ci & 1) === (ci & 1) && Math.random() < 0.45) {
        o.nextCi = ci;
        o.dur = Math.min(o.dur, o.mt + rand(0.35, 0.9));
      }
    }
  }

  function keepClear(c) {
    c.X = clamp(c.X, 0.03, 0.97);
    c.Y = clamp(c.Y, 0.05, AR - 0.05);
    var dx = c.X - LOGO.x, dy = c.Y - LOGO.y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < LOGO.r && d > 1e-4) { c.X = LOGO.x + dx / d * LOGO.r; c.Y = LOGO.y + dy / d * LOGO.r; }
  }

  function updateBird(c, dt, t) {
    c.mt += dt;
    var want = 0, p, e;
    if (c.mode === 'hover') {
      c.X = c.hx + Math.sin(t * 2.3 + c.phase) * 0.006 + Math.sin(t * 5.1) * 0.002;
      c.Y = c.hy + Math.sin(t * 3.1 + c.phase) * 0.008;
      want = 8 + Math.sin(t * 2) * 3;
      if (c.mt >= c.dur) startDash(c);
    } else {
      p = Math.min(1, c.mt / c.dur);
      e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      c.X = qb(c.sx, c.cx, c.ex, e);
      c.Y = qb(c.sy, c.cy, c.ey, e);
      want = clamp(-(c.ey - c.sy) * 20, -14, 14);
      if (p >= 1) { c.mode = 'hover'; c.mt = 0; c.dur = rand(2.8, 5.5); c.hx = c.ex; c.hy = c.ey; }
    }
    keepClear(c);
    c.pitch += (want - c.pitch) * Math.min(1, dt * 8);
  }

  function placeBird(c, W) {
    var w = FW * W, h = w * FR;
    c.el.style.transform =
      'translate3d(' + (c.X * W - w / 2).toFixed(1) + 'px,' + (c.Y * W - h / 2).toFixed(1) + 'px,0) scaleX(' + c.face + ') rotate(' + c.pitch.toFixed(1) + 'deg)';
  }

  /* ------------------------------------------------------------------
     5. Main loop
     ------------------------------------------------------------------ */
  function tick(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    var t = now / 1000, i;
    for (i = 0; i < critters.length; i++) updateButterfly(critters[i], dt, t);
    if (birds.length && archVisible) {
      var W = arch.clientWidth;
      if (W > 0) {
        if (W !== lastW) {
          lastW = W;
          for (i = 0; i < birds.length; i++) {
            birds[i].el.style.width = (FW * W).toFixed(1) + 'px';
            birds[i].el.style.height = (FW * FR * W).toFixed(1) + 'px';
          }
        }
        for (i = 0; i < birds.length; i++) { updateBird(birds[i], dt, t); placeBird(birds[i], W); }
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function startWildlife(delayMs) {
    if (reduceMotion || running) return;
    setTimeout(function () {
      if (running) return;
      running = true;

      // butterflies: a fixed layer inside the invitation (it isolates its own stacking context) so they sit BEHIND the text
      layer = document.createElement('div');
      layer.id = 'wildlife-layer';
      layer.setAttribute('aria-hidden', 'true');
      (document.getElementById('invitation-screen') || document.body).appendChild(layer);
      var small = vw() < 600;
      var nButterflies = small ? 6 : 9;
      for (var i = 0; i < nButterflies; i++) spawnButterfly(i, small);

      // hummingbirds: a layer inside the arch itself, above the artwork and below the logo
      arch = document.getElementById('hero-archway-stage');
      if (arch) {
        flock = document.createElement('div');
        flock.id = 'flock-layer';
        flock.setAttribute('aria-hidden', 'true');
        arch.appendChild(flock);
        [0, 1, 3].forEach(function (ci, idx) {          // top-left, top-right, bottom-right to begin with
          var b = makeBird(ci);
          setTimeout(function () { b.el.classList.add('on'); }, 500 + idx * 700);
        });
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) { archVisible = entries[0].isIntersecting; }, { threshold: 0.02 }).observe(arch);
        }
      }

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
  function init() { watchForReveal(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
