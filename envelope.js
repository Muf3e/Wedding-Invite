/**
 * ENVELOPE OPENING + MUSIC BUTTON
 * Mustafa & Tasneem wedding invitation.
 *
 * Envelope: tapping the seal starts a CSS timeline (see the "opening timeline" block in
 * lavender.css): seal ignites + glow waves → seal and flaps lift with golden light at the
 * seam → the light blooms → the arch appears through the glow. This file only starts that
 * timeline and reveals the invitation at the right moment.
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
  var T_REVEAL = 4900; // the bloom is fully opaque, so the arch can be placed underneath
  var T_DONE = 7100;   // the stage has finished fading out

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
