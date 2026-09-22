/**
 * ENVELOPE OPENING + MUSIC BUTTON
 * Mustafa & Tasneem wedding invitation.
 *
 * Envelope: tapping the seal starts a CSS timeline (see the "opening timeline" block in
 * lavender.css). The mechanic is verified against the reference video — the seal reacts, gold
 * light ramps up from nothing to full brightness as it races along the fold lines and blooms
 * across the whole face, then HOLDS there fully lit and sparkling — still visually closed — for
 * a long, steady beat, then the envelope DISSOLVES as a slow opacity crossfade (no flap
 * hinge-rotation) into the arch, which is already rendering underneath. A fast, frame-accurate
 * ~2.1s version of this read as rushed in practice, so it's stretched back out to a slow,
 * unhurried ~7.1s tap-to-revealed (0.5s ignite + ~2.2s ramp + ~3.1s hold + ~1.3s dissolve),
 * close to the original pacing. This file only starts that timeline and reveals the invitation
 * at the right moment.
 *
 * Music: a single bars-only button. Its state is always read from the <audio> element
 * (play / pause / ended events), so the bars can never disagree with what you hear.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------------
     Music — bars move while playing, freeze while paused
     ------------------------------------------------------------------ */
  var audio = $('bg-audio');
  var musicBtn = $('vx-music');

  function syncMusic() {
    if (!musicBtn || !audio) return;
    var on = !audio.paused && !audio.ended;
    musicBtn.classList.toggle('is-playing', on);
    musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  }

  function playMusic() {
    if (!audio) return;
    try {
      var p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(syncMusic); // autoplay refused: bars simply stay still
    } catch (e) { syncMusic(); }
  }

  if (audio && musicBtn) {
    ['play', 'playing', 'pause', 'ended', 'emptied', 'error'].forEach(function (ev) {
      audio.addEventListener(ev, syncMusic);
    });
    musicBtn.addEventListener('click', function () {
      if (audio.paused) playMusic(); else audio.pause();
    });
    syncMusic();
  }

  function showMusicBtn() { if (musicBtn) musicBtn.classList.add('is-visible'); }

  /* ------------------------------------------------------------------
     Envelope
     ------------------------------------------------------------------ */
  var envScreen = $('envelope-screen');
  var stage = $('env2-stage');
  var seal = $('env2-seal');
  var invite = $('invitation-screen');
  var root = document.documentElement;

  if (!envScreen || !stage || !seal || !invite) { showMusicBtn(); return; }

  // milliseconds after the tap; keep in step with the timeline in lavender.css
  // (.env2-stage.is-opening's envStageOut runs delay 5.8s, duration 1.3s -> 5.8s-7.1s)
  var T_REVEAL = 5600; // just before the stage starts to dissolve, so the arch is already there to show through
  var T_DONE = 7150;   // just after the stage has finished fading out (5.8s + 1.3s = 7.1s)

  function reveal() {
    invite.classList.remove('hidden'); // enhancements.js sees this and plays the arch reveal
    window.scrollTo(0, 0);
    showMusicBtn();
  }

  function finish() {
    envScreen.classList.add('hidden');
    root.classList.remove('env-lock');
  }

  // ?open=true skips the envelope (handy for previewing the invitation directly)
  var params = new URLSearchParams(window.location.search);
  if (params.get('open') === 'true' || params.get('preview') === 'open') {
    reveal();
    finish();
    return;
  }

  root.classList.add('env-lock'); // the page must not scroll while the envelope is up

  var started = false;
  function open() {
    if (started) return;
    started = true;
    try { if (typeof playWaxSealSound === 'function') playWaxSealSound(); } catch (e) { /* sound is optional */ }
    playMusic();
    if (reduce) { reveal(); finish(); return; }
    stage.classList.add('is-opening');
    setTimeout(reveal, T_REVEAL);
    setTimeout(finish, T_DONE);
  }

  seal.addEventListener('click', open);
})();
