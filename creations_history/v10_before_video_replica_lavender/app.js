/**
 * ROYAL LAVENDER & GOLD WEDDING INVITATION
 * Mustafa & Tasneem — Interactive Web Application
 * Google Sheets Live RSVP Target: https://docs.google.com/spreadsheets/d/1tygrKTnyoGsdj4KtKI4ogeCblV7MA8zkt8AwEICrxrM/edit?usp=sharing
 */

// Google Sheets Webhook URL (configured from Google Apps Script deployment)
const GOOGLE_SHEET_WEBHOOK_URL = window.GOOGLE_SHEET_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbz_wedding_rsvp_mustafa_tasneem/exec';

document.addEventListener('DOMContentLoaded', () => {
  initFloatingParticles();
  initEnvelopeExperience();
  initAudioPlayer();
  initCardCustomizer();
  initScratchCard();
  initCountdownTimer();
  initCalendarAction();
  initRsvpAndGuestbook();
  initBackToTop();
  initStoryScrollSpy();
  initParallaxDepth();
});

/* ==========================================================================
   1. LIVING MOTION GRAPHIC PARTICLES & DYNAMIC PARALLAX CANVAS
   ========================================================================== */
function initFloatingParticles() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;
  let scrollY = window.scrollY;
  let lastScrollY = scrollY;
  let scrollVelocity = 0;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    scrollVelocity = (scrollY - lastScrollY) * 0.3;
    lastScrollY = scrollY;
  }, { passive: true });

  // Interactive Cursor & Touch Trail
  const interactiveSparks = [];
  const addSparks = (x, y, count = 2) => {
    mouseX = x;
    mouseY = y;
    for (let i = 0; i < count; i++) {
      if (interactiveSparks.length > 60) interactiveSparks.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      interactiveSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.3 ? '212, 175, 55' : '255, 235, 170'
      });
    }
  };

  window.addEventListener('mousemove', (e) => addSparks(e.clientX, e.clientY, 1), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) addSparks(e.touches[0].clientX, e.touches[0].clientY, 2);
  }, { passive: true });

  // 1. Bokeh Orbs (deep ambient glow)
  const bokehCount = 14;
  const bokehs = [];
  for (let i = 0; i < bokehCount; i++) {
    bokehs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 45 + 25,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      baseOpacity: Math.random() * 0.12 + 0.06,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      isGold: Math.random() > 0.45
    });
  }

  // 2. Botanical Tumbling Petals & Blossoms
  const petalCount = 28;
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    petals.push(createPetal(true));
  }

  function createPetal(randomY = false) {
    const isGoldLeaf = Math.random() > 0.72;
    const isJasmine = !isGoldLeaf && Math.random() > 0.5;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -30,
      size: Math.random() * 9 + 7,
      speedX: (Math.random() - 0.5) * 0.9,
      speedY: Math.random() * 1.3 + 0.6,
      rotZ: Math.random() * Math.PI * 2,
      rotSpeedZ: (Math.random() - 0.5) * 0.035,
      tiltY: Math.random() * Math.PI * 2,
      tiltSpeedY: Math.random() * 0.04 + 0.015,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.025 + 0.01,
      opacity: Math.random() * 0.45 + 0.4,
      type: isGoldLeaf ? 'gold' : isJasmine ? 'jasmine' : 'lavender'
    };
  }

  // 3. Shimmering Stardust
  const stardustCount = 38;
  const stardust = [];
  for (let i = 0; i < stardustCount; i++) {
    stardust.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.3 + 0.1),
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.05 + 0.02,
      baseAlpha: Math.random() * 0.5 + 0.3
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Damping scroll velocity
    scrollVelocity *= 0.92;

    // 1. Render Bokeh
    for (let i = 0; i < bokehs.length; i++) {
      const b = bokehs[i];
      b.y += b.speedY - scrollVelocity * 0.1;
      b.x += b.speedX;
      b.phase += b.pulseSpeed;

      const alpha = b.baseOpacity * (0.8 + 0.2 * Math.sin(b.phase));
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      if (b.isGold) {
        grad.addColorStop(0, `rgba(235, 195, 90, ${alpha * 1.2})`);
        grad.addColorStop(0.6, `rgba(212, 175, 55, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      } else {
        grad.addColorStop(0, `rgba(186, 160, 235, ${alpha * 1.3})`);
        grad.addColorStop(0.6, `rgba(142, 95, 205, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(142, 95, 205, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      if (b.y < -b.radius) b.y = height + b.radius;
      if (b.y > height + b.radius) b.y = -b.radius;
      if (b.x < -b.radius) b.x = width + b.radius;
      if (b.x > width + b.radius) b.x = -b.radius;
    }

    // 2. Render Stardust
    for (let i = 0; i < stardust.length; i++) {
      const s = stardust[i];
      s.y += s.speedY - scrollVelocity * 0.15;
      s.twinklePhase += s.twinkleSpeed;
      const alpha = Math.max(0.1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35);

      ctx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle cross glimmer
      if (alpha > 0.65) {
        ctx.strokeStyle = `rgba(255, 255, 220, ${(alpha - 0.65) * 1.5})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x - s.size * 2, s.y);
        ctx.lineTo(s.x + s.size * 2, s.y);
        ctx.moveTo(s.x, s.y - s.size * 2);
        ctx.lineTo(s.x, s.y + s.size * 2);
        ctx.stroke();
      }

      if (s.y < -10) s.y = height + 10;
      if (s.y > height + 10) s.y = -10;
    }

    // 3. Render Tumbling Petals
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.swayPhase += p.swaySpeed;
      p.rotZ += p.rotSpeedZ;
      p.tiltY += p.tiltSpeedY;

      const swayX = Math.sin(p.swayPhase) * 1.5;
      p.x += p.speedX + swayX;
      p.y += p.speedY + scrollVelocity * 0.25;

      const scaleY = Math.cos(p.tiltY); // 3D tumble flip
      const petalW = p.size;
      const petalH = p.size * 1.45;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotZ);
      ctx.scale(1, Math.abs(scaleY) * 0.85 + 0.15);

      ctx.beginPath();
      ctx.moveTo(0, -petalH * 0.6);
      ctx.bezierCurveTo(petalW * 0.8, -petalH * 0.3, petalW * 0.7, petalH * 0.4, 0, petalH * 0.6);
      ctx.bezierCurveTo(-petalW * 0.7, petalH * 0.4, -petalW * 0.8, -petalH * 0.3, 0, -petalH * 0.6);
      ctx.closePath();

      if (p.type === 'gold') {
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * 0.85})`;
        ctx.strokeStyle = `rgba(255, 235, 140, ${p.opacity * 0.6})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      } else if (p.type === 'jasmine') {
        ctx.fillStyle = `rgba(255, 250, 240, ${p.opacity * 0.9})`;
        ctx.strokeStyle = `rgba(240, 225, 200, ${p.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(188, 168, 232, ${p.opacity * 0.75})`;
        ctx.strokeStyle = `rgba(225, 212, 248, ${p.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.fill();

      ctx.restore();

      if (p.y > height + 40) {
        petals[i] = createPetal(false);
      }
    }

    // 4. Render Interactive Cursor Trail Sparks
    for (let i = interactiveSparks.length - 1; i >= 0; i--) {
      const sp = interactiveSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= sp.decay;
      if (sp.life <= 0) {
        interactiveSparks.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(${sp.color}, ${sp.life * 0.85})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. 3D ENVELOPE OPENING MECHANICS & SOFT LIGHT REVEAL
   ========================================================================== */
/* Soft Special Sound Effect on Wax Seal Tap (Web Audio API synthesis) */
function playWaxSealSound() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const audioCtx = new AudioCtxClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const t = audioCtx.currentTime;

    // 1. Soft Wax Break / Parchment Rustle (Gentle filtered noise burst)
    const bufferSize = audioCtx.sampleRate * 0.09;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.016));
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1150, t);
    filter.Q.setValueAtTime(2.8, t);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.25, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    whiteNoise.start(t);

    // 2. Soft Celestial Golden Chime (Warm royal harmonics: C6, E6, G6, B6, D7)
    const chimeFreqs = [1046.50, 1318.51, 1567.98, 1975.53, 2349.32];
    chimeFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.032);

      const noteStart = t + idx * 0.032;
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.075 / (idx * 0.4 + 1), noteStart + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + 1.4);
    });
  } catch (err) {
    console.log('Wax seal audio effect:', err);
  }
}

function initEnvelopeExperience() {
  const waxSeal = document.getElementById('wax-seal');
  const envelopeBox = document.getElementById('envelope-box');
  const envelopeScreen = document.getElementById('envelope-screen');
  const inviteScreen = document.getElementById('invitation-screen');
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const lightPortal = document.getElementById('light-portal');
  const storyNav = document.getElementById('story-nav');

  if (!waxSeal || !envelopeBox) return;

  // Support direct preview of opened invitation for testing & inspection
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open') === 'true' || urlParams.get('preview') === 'open') {
    envelopeScreen.classList.add('hidden');
    inviteScreen.classList.remove('hidden');
    if (storyNav) storyNav.classList.add('visible');
  }

  let hasTriggered = false;

  const handleOpen = () => {
    if (hasTriggered) return;
    hasTriggered = true;

    // 1. Play Soft Special Wax Seal Unseal Audio Sound Effect
    playWaxSealSound();

    // 2. Play ambient background music smoothly
    if (bgAudio) {
      bgAudio.play().then(() => {
        if (musicToggle) musicToggle.classList.add('playing');
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }

    // 3. Activate radiant golden rays, glowing rim, and shimmer sweep across embossed flowers
    waxSeal.classList.add('glowing');
    envelopeBox.classList.add('light-active');
    const sealBurst = document.getElementById('seal-light-burst');
    if (sealBurst) sealBurst.classList.add('active');
    createSealBurst(waxSeal);

    // 4. Seal lifts forward in 3D perspective revealing inner gold glow (matching video 6.0s)
    setTimeout(() => {
      waxSeal.classList.add('lifting');
    }, 1800);

    // 5. Open flaps smoothly and slowly in authentic 3D perspective (matching video 7.4s)
    setTimeout(() => {
      envelopeBox.classList.add('open');
    }, 2800);

    // 6. Expand soft ethereal champagne light bloom portal
    setTimeout(() => {
      if (lightPortal) lightPortal.classList.add('active');
    }, 3800);

    // 7. Transition smoothly to the main invitation story (matching video 9.1s)
    setTimeout(() => {
      envelopeScreen.classList.add('hidden');
      inviteScreen.classList.remove('hidden');
      if (storyNav) storyNav.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Fade out soft light portal to unveil Chapter I
      setTimeout(() => {
        if (lightPortal) {
          lightPortal.style.transition = 'opacity 1.0s ease';
          lightPortal.classList.remove('active');
          setTimeout(() => {
            lightPortal.style.display = 'none';
          }, 1000);
        }
        triggerGoldConfetti();
      }, 400);
    }, 4500);
  };

  waxSeal.addEventListener('click', handleOpen);
  waxSeal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  });

  const sealIndicator = document.getElementById('seal-indicator');
  if (sealIndicator) {
    sealIndicator.addEventListener('click', handleOpen);
  }
}

function createSealBurst(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    const spark = document.createElement('div');
    spark.style.position = 'fixed';
    spark.style.left = `${centerX}px`;
    spark.style.top = `${centerY}px`;
    spark.style.width = '6px';
    spark.style.height = '6px';
    spark.style.borderRadius = '50%';
    spark.style.background = 'linear-gradient(135deg, #FFF0C2, #D4AF37)';
    spark.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.8)';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '9999';

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 30;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    document.body.appendChild(spark);

    spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => spark.remove();
  }
}

/* ==========================================================================
   3. BACKGROUND AUDIO EQUALIZER CONTROLLER
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('bg-audio');
  const toggleBtn = document.getElementById('music-toggle');
  if (!audio || !toggleBtn) return;

  const musicIcon = document.getElementById('music-icon-state');

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        toggleBtn.classList.add('playing');
        if (musicIcon) musicIcon.innerText = '⏸';
      }).catch(err => console.error(err));
    } else {
      audio.pause();
      toggleBtn.classList.remove('playing');
      if (musicIcon) musicIcon.innerText = '▶';
    }
  });
}

/* ==========================================================================
   4. CARD CUSTOMIZER & LIVE EDITING SYSTEM (Item 5)
   ========================================================================== */
function initCardCustomizer() {
  const toggleBtn = document.getElementById('toggle-editor-btn');
  const editorPanel = document.getElementById('card-editor-panel');
  const closeBtnX = document.getElementById('close-editor-x');
  const closeBtnDone = document.getElementById('close-editor-btn');
  const saveBtn = document.getElementById('save-card-btn');
  const resetBtn = document.getElementById('reset-card-btn');

  const widthSlider = document.getElementById('card-width-slider');
  const widthVal = document.getElementById('card-width-val');
  const textBoxWidthSlider = document.getElementById('text-box-width-slider');
  const textBoxWidthVal = document.getElementById('text-box-width-val');
  const paddingSlider = document.getElementById('card-padding-slider');
  const paddingVal = document.getElementById('card-padding-val');

  const fontIncBtn = document.getElementById('font-inc-btn');
  const fontDecBtn = document.getElementById('font-dec-btn');
  const fontSizeIndicator = document.getElementById('font-size-indicator');

  const cardStage = document.getElementById('invitation-card-stage');
  const parchmentBody = document.getElementById('card-parchment-body');

  if (!toggleBtn || !cardStage || !parchmentBody) return;

  // Restore initial HTML backup for reset
  const defaultCardHtml = parchmentBody.innerHTML;

  // Restore saved customization from localStorage
  const savedCustomization = JSON.parse(localStorage.getItem('wedding_card_customization') || 'null');
  if (savedCustomization) {
    if (savedCustomization.html) {
      parchmentBody.innerHTML = savedCustomization.html;
      // Sanitize: ensure no editing classes or contenteditable leaked into saved HTML
      parchmentBody.querySelectorAll('.active-editing-target').forEach(el => el.classList.remove('active-editing-target'));
      parchmentBody.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    }
    if (savedCustomization.maxWidth) {
      cardStage.style.maxWidth = savedCustomization.maxWidth;
      if (widthSlider) widthSlider.value = parseInt(savedCustomization.maxWidth, 10);
      if (widthVal) widthVal.innerText = savedCustomization.maxWidth;
    }
    if (savedCustomization.padding) {
      parchmentBody.style.padding = savedCustomization.padding;
      if (paddingSlider) paddingSlider.value = parseInt(savedCustomization.padding, 10);
      if (paddingVal) paddingVal.innerText = savedCustomization.padding;
    }
  }

  let isEditing = false;
  let activeElement = null;

  // Single delegated listener for focus tracking on editable elements
  parchmentBody.addEventListener('focusin', (e) => {
    if (!isEditing) return;
    const target = e.target.closest('[contenteditable="true"]');
    if (!target) return;
    if (activeElement && activeElement !== target) {
      activeElement.classList.remove('active-editing-target');
    }
    activeElement = target;
    activeElement.classList.add('active-editing-target');

    const currentSize = window.getComputedStyle(target).fontSize;
    if (fontSizeIndicator) fontSizeIndicator.innerText = Math.round(parseFloat(currentSize)) + 'px';

    const currentWidth = Math.round(target.getBoundingClientRect().width);
    if (textBoxWidthSlider) textBoxWidthSlider.value = Math.min(900, Math.max(200, currentWidth));
    if (textBoxWidthVal) textBoxWidthVal.innerText = currentWidth + 'px';
  });

  function setEditingMode(active) {
    isEditing = active;
    if (isEditing) {
      editorPanel.classList.remove('hidden');
      cardStage.classList.add('editing-card-active');
      toggleBtn.classList.add('active');
      toggleBtn.querySelector('.btn-text').innerText = 'Editing Mode Active (Click Any Text)';

      // Make all target text elements editable
      const textNodes = parchmentBody.querySelectorAll('p, span, h3, h4, .lisan-stanza-line, .parent-line-bold, .parent-line-sub, .thuluth-calligraphy-name, .knot-wedding-script, .knot-sub-script, .nikah-raza-callout, .invitation-request-line, .event-detail-eng, .event-detail-arabic, .sign-name, .final-salutations');
      textNodes.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      });
    } else {
      editorPanel.classList.add('hidden');
      cardStage.classList.remove('editing-card-active');
      toggleBtn.classList.remove('active');
      toggleBtn.querySelector('.btn-text').innerText = 'Customize Card Content';

      if (activeElement) {
        activeElement.classList.remove('active-editing-target');
        activeElement = null;
      }

      // Disable editable
      const textNodes = parchmentBody.querySelectorAll('[contenteditable="true"]');
      textNodes.forEach(el => el.removeAttribute('contenteditable'));
    }
  }

  toggleBtn.addEventListener('click', () => setEditingMode(!isEditing));
  if (closeBtnX) closeBtnX.addEventListener('click', () => setEditingMode(false));
  if (closeBtnDone) closeBtnDone.addEventListener('click', () => setEditingMode(false));

  // Card Frame Width Slider
  if (widthSlider) {
    widthSlider.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      cardStage.style.maxWidth = val;
      if (widthVal) widthVal.innerText = val;
    });
  }

  // Selected Text Box Width / Length Slider
  if (textBoxWidthSlider) {
    textBoxWidthSlider.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      if (textBoxWidthVal) textBoxWidthVal.innerText = val;
      if (activeElement) {
        activeElement.style.maxWidth = val;
        activeElement.style.width = '100%';
        activeElement.style.boxSizing = 'border-box';
        activeElement.style.display = 'block';
        activeElement.style.marginLeft = 'auto';
        activeElement.style.marginRight = 'auto';
      }
    });
  }

  // Padding Slider
  if (paddingSlider) {
    paddingSlider.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      parchmentBody.style.padding = val;
      if (paddingVal) paddingVal.innerText = val;
    });
  }

  // Font Size Adjustments
  function adjustFontSize(delta) {
    if (!activeElement) {
      activeElement = parchmentBody.querySelector('.lisan-stanza-line') || parchmentBody;
      activeElement.classList.add('active-editing-target');
    }
    const currentSize = parseFloat(window.getComputedStyle(activeElement).fontSize) || 16;
    const newSize = Math.max(10, Math.min(60, currentSize + delta));
    activeElement.style.fontSize = `${newSize}px`;
    if (fontSizeIndicator) fontSizeIndicator.innerText = `${Math.round(newSize)}px`;
  }

  if (fontIncBtn) fontIncBtn.addEventListener('click', () => adjustFontSize(2));
  if (fontDecBtn) fontDecBtn.addEventListener('click', () => adjustFontSize(-2));

  // Save changes
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Clean up editing active target outlines before serializing
      const activeTargets = parchmentBody.querySelectorAll('.active-editing-target');
      activeTargets.forEach(el => el.classList.remove('active-editing-target'));

      const textNodes = parchmentBody.querySelectorAll('[contenteditable="true"]');
      textNodes.forEach(el => el.removeAttribute('contenteditable'));

      const dataToSave = {
        html: parchmentBody.innerHTML,
        maxWidth: cardStage.style.maxWidth || '780px',
        padding: parchmentBody.style.padding || '35px'
      };
      localStorage.setItem('wedding_card_customization', JSON.stringify(dataToSave));

      if (isEditing) {
        textNodes.forEach(el => el.setAttribute('contenteditable', 'true'));
        if (activeElement) {
          activeElement.classList.add('active-editing-target');
        }
      }

      saveBtn.innerHTML = '<span>✅ Saved!</span>';
      setTimeout(() => {
        saveBtn.innerHTML = '<span>💾 Save Customization</span>';
      }, 2000);
    });
  }

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all card edits and restore original default styling?')) {
        localStorage.removeItem('wedding_card_customization');
        parchmentBody.innerHTML = defaultCardHtml;
        cardStage.style.maxWidth = '780px';
        parchmentBody.style.padding = '35px';
        if (widthSlider) widthSlider.value = 780;
        if (widthVal) widthVal.innerText = '780px';
        if (textBoxWidthSlider) textBoxWidthSlider.value = 720;
        if (textBoxWidthVal) textBoxWidthVal.innerText = 'Full';
        if (paddingSlider) paddingSlider.value = 35;
        if (paddingVal) paddingVal.innerText = '35px';
        if (fontSizeIndicator) fontSizeIndicator.innerText = 'Standard';
        activeElement = null;
        setEditingMode(false);
      }
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE HTML5 3-BLOCK SCRATCH-TO-REVEAL GRID (Item 1)
   ========================================================================== */
function initScratchCard() {
  const blocks = [
    { id: 'scratch-canvas-1', title: 'DATE' },
    { id: 'scratch-canvas-2', title: 'MONTH' },
    { id: 'scratch-canvas-3', title: 'YEAR' }
  ];

  const progressBar = document.getElementById('scratch-progress');
  const hintText = document.getElementById('scratch-hint');
  const revealedSummary = document.getElementById('scratch-revealed-summary');

  let revealedCount = 0;
  const totalBlocks = 3;

  blocks.forEach((b) => {
    const canvas = document.getElementById(b.id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isBlockRevealed = false;

    function renderTileFoil() {
      const w = canvas.width;
      const h = canvas.height;

      // Rich metallic gold gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#B88E28');
      grad.addColorStop(0.25, '#F7E7B4');
      grad.addColorStop(0.5, '#D4AF37');
      grad.addColorStop(0.75, '#FFF5D1');
      grad.addColorStop(1, '#8A6414');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Fine filigree border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, 6, w - 12, h - 12);

      // Glitter noise
      for (let i = 0; i < 180; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(99, 71, 7, 0.25)';
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }

      // Foil text
      ctx.fillStyle = '#2A163B';
      ctx.font = 'bold 12px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ SCRATCH ✨', w / 2, h / 2 - 9);

      ctx.fillStyle = '#634707';
      ctx.font = 'italic 11px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(`Rub to reveal ${b.title.toLowerCase()}`, w / 2, h / 2 + 11);
    }

    renderTileFoil();

    function scratch(e) {
      if (!isDrawing || isBlockRevealed) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2, false);
      ctx.fill();

      checkBlockPercentage();
    }

    let checkTimer = null;
    function checkBlockPercentage() {
      if (checkTimer) return;
      checkTimer = setTimeout(() => {
        checkTimer = null;
        if (isBlockRevealed) return;

        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;
        let clearPixels = 0;
        const step = 20;

        for (let i = 3; i < pixels.length; i += 4 * step) {
          if (pixels[i] === 0) clearPixels++;
        }

        const totalSampled = pixels.length / (4 * step);
        const percent = Math.round((clearPixels / totalSampled) * 100);

        if (percent >= 35) {
          revealBlock();
        }
      }, 100);
    }

    function revealBlock() {
      if (isBlockRevealed) return;
      isBlockRevealed = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';

      setTimeout(() => {
        canvas.style.pointerEvents = 'none';
        revealedCount++;
        const totalPercent = Math.round((revealedCount / totalBlocks) * 100);

        if (progressBar) progressBar.style.setProperty('--progress', `${totalPercent}%`);

        if (hintText) {
          if (revealedCount < totalBlocks) {
            hintText.innerText = `Scratch all 3 blocks to unveil! (${revealedCount} of ${totalBlocks} Revealed)`;
          } else {
            hintText.innerText = '✨ Mubarak! Auspicious Wedding Date Has Been Revealed: 26th January 2026! ✨';
            hintText.style.color = '#8C5E14';
            hintText.style.fontWeight = '700';
            if (revealedSummary) revealedSummary.classList.add('visible');
            triggerGoldConfetti();
          }
        }
      }, 500);
    }

    // Pointer events for this canvas
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { isDrawing = false; });

    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: true });
    canvas.addEventListener('touchmove', scratch, { passive: true });
    window.addEventListener('touchend', () => { isDrawing = false; });
  });
}

function triggerGoldConfetti() {
  const container = document.querySelector('.scratch-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = `${centerX}px`;
    confetti.style.top = `${centerY}px`;
    confetti.style.width = `${Math.random() * 8 + 4}px`;
    confetti.style.height = `${Math.random() * 12 + 6}px`;
    confetti.style.backgroundColor = Math.random() > 0.4 ? '#D4AF37' : '#B29FE0';
    confetti.style.borderRadius = '2px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 160 + 50;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;
    const rot = Math.random() * 720;

    document.body.appendChild(confetti);

    confetti.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) rotate(${rot}deg) scale(0.3)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 400,
      easing: 'cubic-bezier(0.2, 1, 0.3, 1)'
    }).onfinish = () => confetti.remove();
  }
}

/* ==========================================================================
   5. REAL-TIME COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  if (!daysEl) return;

  // Auspicious Wedding Date (Monday, Jan 26, 12:00:00)
  let targetDate = new Date('January 26, 2026 12:00:00').getTime();
  if (targetDate <= Date.now()) {
    targetDate = new Date('January 26, 2027 12:00:00').getTime();
  }

  function updateTimer() {
    const now = new Date().getTime();
    let distance = targetDate - now;

    if (distance < 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days < 10 ? '0' + days : days;
    hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   6. 1-CLICK CALENDAR INTEGRATION (.ICS & GOOGLE CALENDAR)
   ========================================================================== */
function initCalendarAction() {
  const calBtn = document.getElementById('add-to-cal-btn');
  if (!calBtn) return;

  calBtn.addEventListener('click', () => {
    // Generate iCal format (.ics)
    const title = 'Wedding of Mustafa & Tasneem (Aqd al-Nikah)';
    const description = 'Auspicious wedding celebration of Mustafa & Tasneem under the Raza Mubarak of His Holiness Syedna Mufaddal Saifuddin (TUS).';
    const location = 'Pulgaon, Maharashtra';
    const startDate = '20260126T063000Z'; // UTC format (12:00 PM IST)
    const endDate = '20260126T140000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mustafa and Tasneem Wedding//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Trigger download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Mustafa_Tasneem_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Feedback
    calBtn.innerHTML = '<span>✅ Added to Calendar!</span>';
    setTimeout(() => {
      calBtn.innerHTML = '<span class="btn-icon">📅</span> Add to Calendar';
    }, 3000);
  });
}

/* ==========================================================================
   7. DIGITAL RSVP & MUBARAKI DUA GUESTBOOK
   ========================================================================== */
function initRsvpAndGuestbook() {
  const form = document.getElementById('rsvp-form');
  const feedback = document.getElementById('rsvp-feedback');
  const wishesList = document.getElementById('wishes-list');
  if (!form || !wishesList) return;

  // Real wishes only (Item 11: Remove default/temporary fake wishes)
  let storedWishes = JSON.parse(localStorage.getItem('mt_wedding_wishes') || '[]');
  if (Array.isArray(storedWishes)) {
    storedWishes = storedWishes.filter(w => 
      w.name !== 'Burhanuddin Bhai & Family' && 
      w.name !== 'Husain Bhai Kapasi' && 
      w.name !== 'Arwa Ben & Shabbir Bhai'
    );
    localStorage.setItem('mt_wedding_wishes', JSON.stringify(storedWishes));
  } else {
    storedWishes = [];
  }

  function renderWishes() {
    const wishesBoard = document.getElementById('wishes-board') || document.querySelector('.wishes-board');
    wishesList.innerHTML = '';
    if (!storedWishes || storedWishes.length === 0) {
      if (wishesBoard) {
        wishesBoard.classList.add('hidden');
        wishesBoard.style.display = 'none';
      }
      return;
    }

    if (wishesBoard) {
      wishesBoard.classList.remove('hidden');
      wishesBoard.style.display = 'block';
    }

    storedWishes.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-author">
          <span>${escapeHtml(item.name)}</span>
          <span class="wish-time">${escapeHtml(item.time || 'Recent')}</span>
        </div>
        <p class="wish-text">"${escapeHtml(item.text)}"</p>
      `;
      wishesList.appendChild(card);
    });
  }

  renderWishes();

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const phone = document.getElementById('guest-phone').value.trim();
    const count = document.getElementById('guest-count').value;
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value || 'Joyfully Attending';
    const message = document.getElementById('guest-message').value.trim();

    if (!name || !phone) return;

    // Save RSVP record to localStorage
    const rsvpRecords = JSON.parse(localStorage.getItem('mt_rsvp_records') || '[]');
    const rsvpItem = {
      name,
      phone,
      count,
      attendance,
      message,
      timestamp: new Date().toISOString()
    };
    rsvpRecords.push(rsvpItem);
    localStorage.setItem('mt_rsvp_records', JSON.stringify(rsvpRecords));

    // Async sync to Google Sheets (if webhook configured or fallback webhook)
    if (typeof GOOGLE_SHEET_WEBHOOK_URL !== 'undefined' && GOOGLE_SHEET_WEBHOOK_URL) {
      fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpItem)
      }).catch(err => console.log('Google Sheets sync notice:', err));
    }

    // If guest left a message, add it to the live wall
    if (message) {
      storedWishes.unshift({
        name: name,
        time: 'Just now',
        text: message
      });
      localStorage.setItem('mt_wedding_wishes', JSON.stringify(storedWishes));
      renderWishes();
    }

    // Show feedback and celebrate
    form.classList.add('hidden');
    feedback.classList.remove('hidden');
    triggerGoldConfetti();
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================================================
   8. BACK TO TOP SMOOTH SCROLL
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. STORYTELLER BOOK PARALLAX SCROLL SPY & CHAPTER NAVIGATION
   ========================================================================== */
function initStoryScrollSpy() {
  const navDots = document.querySelectorAll('.story-nav-dot');
  const chapters = document.querySelectorAll('.story-chapter');

  if (navDots.length === 0 || chapters.length === 0) return;

  // Handle dot clicks for smooth jumping
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // IntersectionObserver to highlight active chapter
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navDots.forEach(dot => {
          if (dot.getAttribute('href') === `#${id}`) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  chapters.forEach(chapter => observer.observe(chapter));
}

/* ==========================================================================
   10. SMOOTH PARALLAX DEPTH & TACTILE 3D INTERACTION ON CARDS
   ========================================================================== */
function initParallaxDepth() {
  const cards = document.querySelectorAll('.parchment-card-luxury, .luxury-card-box, .timeline-card, .calligraphy-monogram-block');
  const romanNumerals = document.querySelectorAll('.chapter-roman');

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          // Distance from viewport vertical center
          const distCenter = (rect.top + rect.height / 2) - (viewportHeight / 2);
          // Subtle, luxurious parallax translation (-14px to +14px)
          const translateY = Math.max(-16, Math.min(16, -distCenter * 0.035));
          card.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        });

        romanNumerals.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const distCenter = (rect.top + rect.height / 2) - (viewportHeight / 2);
          const translateY = Math.max(-20, Math.min(20, -distCenter * 0.05));
          el.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Interactive 3D Subtle Tilt on Luxury Cards for Mouse Hover
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 3;
      const rotY = (x / (rect.width / 2)) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.008)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // Mobile Gyroscope Subtle Tilt
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const rotY = Math.max(-5, Math.min(5, e.gamma / 6));
        const rotX = Math.max(-5, Math.min(5, (e.beta - 45) / 6));
        cards.forEach((card) => {
          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
        });
      }
    }, { passive: true });
  }
}


