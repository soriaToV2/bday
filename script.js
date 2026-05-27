// ==========================================
// Coleen's 21st Birthday Website
// Interactive Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- DOM References ----
  const candleScreen   = document.getElementById('candle-screen');
  const greetingScreen = document.getElementById('greeting-screen');
  const mainContent    = document.getElementById('main-content');
  const blowBtn        = document.getElementById('blow-btn');
  const enterBtn       = document.getElementById('enter-btn');
  const flameContainer = document.querySelector('.flame-container');
  const smokeContainer = document.querySelector('.smoke-container');
  const greetingContent = document.querySelector('.greeting-content');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxClose  = document.getElementById('lightbox-close');

  let hasBlown = false;

  // Prevent scrolling during intro
  document.body.style.overflow = 'hidden';

  // ==========================================
  // MICROPHONE BLOW DETECTION
  // ==========================================

  function initMicDetection() {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia not supported — using button fallback');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioCtx();
        const source   = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;

        const dataArray  = new Uint8Array(analyser.frequencyBinCount);
        let blowCount    = 0;
        const threshold  = 50;   // volume sensitivity
        const required   = 20;   // frames (~0.33 s at 60 fps)

        function checkVolume() {
          if (hasBlown) return;

          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;

          if (avg > threshold) {
            blowCount++;
            // Real-time visual feedback — flame reacts to blowing
            const progress = Math.min(blowCount / required, 1);
            flameContainer.style.opacity   = 1 - progress * 0.7;
            flameContainer.style.transform = `scale(${1 - progress * 0.6})`;

            if (blowCount >= required) {
              triggerBlowOut();
              stream.getTracks().forEach(t => t.stop());
              return;
            }
          } else {
            blowCount = Math.max(0, blowCount - 2);
            flameContainer.style.opacity   = 1;
            flameContainer.style.transform = 'scale(1)';
          }

          requestAnimationFrame(checkVolume);
        }

        checkVolume();
      })
      .catch(() => {
        console.log('Microphone access denied — using button fallback');
      });
  }

  initMicDetection();

  // ==========================================
  // BLOW-OUT TRIGGER
  // ==========================================

  function triggerBlowOut() {
    if (hasBlown) return;
    hasBlown = true;

    // 1. Extinguish flame
    flameContainer.classList.add('blown-out');

    // 2. Show smoke wisps
    setTimeout(() => {
      smokeContainer.classList.add('active');
    }, 200);

    // 3. Transition to greeting screen
    setTimeout(() => {
      candleScreen.classList.add('hidden');
      greetingScreen.classList.add('visible');
      startConfetti();

      // Reveal greeting text after confetti starts
      setTimeout(() => {
        greetingContent.classList.add('visible');
      }, 800);
    }, 1500);
  }

  // Fallback button
  blowBtn.addEventListener('click', triggerBlowOut);

  // ==========================================
  // CONFETTI SYSTEM  (subtle – 60 particles)
  // ==========================================

  function startConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = [
      '#87CEEB', '#B0E0F6', '#5BADE0', '#4A90D9',
      '#FFD700', '#FFFFFF', '#ff6b8a', '#2C6FB5'
    ];

    const particles = [];
    const count     = 60;      // keep it subtle
    const maxFrames = 180;     // ~3 seconds at 60 fps

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 3,
        speedY: Math.random() * 2 + 1.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    let frame = 0;

    function animate() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      frame++;

      const fadeStart = maxFrames * 0.7;

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.03;          // gravity
        p.rotation += p.rotSpeed;

        if (frame > fadeStart) {
          p.opacity = Math.max(0, 1 - (frame - fadeStart) / (maxFrames - fadeStart));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    animate();
  }

  // ==========================================
  // ENTER LANDING PAGE
  // ==========================================

  enterBtn.addEventListener('click', () => {
    greetingScreen.classList.add('hidden');
    greetingScreen.classList.remove('visible');
    mainContent.classList.add('visible');
    document.body.style.overflow = 'auto';

    initScrollReveal();
    initParticles();
    initRobloxCarousel();
    initNameSpinner();
  });

  // ==========================================
  // DYNAMIC NAME SPINNER
  // ==========================================

  function initNameSpinner() {
    const nameEl = document.getElementById('dynamic-name');
    if (!nameEl) return;

    const names = ['Coleen', 'Ariane', 'Panat', 'Colengleng', 'ColingColing'];
    let currentIndex = 0;

    setInterval(() => {
      nameEl.classList.add('fade-out');
      
      // Wait for the fade-out transition to complete (400ms match with CSS)
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % names.length;
        nameEl.textContent = names[currentIndex];
        nameEl.classList.remove('fade-out');
      }, 400);
    }, 3000); // Cycles every 3 seconds
  }

  // ==========================================
  // ROBLOX MOMENTS CAROUSEL
  // ==========================================

  function initRobloxCarousel() {
    const track      = document.getElementById('roblox-track');
    const dotsWrap   = document.getElementById('roblox-dots');
    const counter    = document.getElementById('roblox-counter');
    const prevBtn    = document.getElementById('roblox-prev');
    const nextBtn    = document.getElementById('roblox-next');
    const slides     = Array.from(document.querySelectorAll('.roblox-slide'));
    const total      = slides.length;

    if (!track || total === 0) return;

    let current     = 0;
    let autoTimer   = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'roblox-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.roblox-dot'));

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = `${current + 1} / ${total}`;
    }

    prevBtn.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
    nextBtn.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { resetAuto(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1); }
    });

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { resetAuto(); goTo(current + (diff > 0 ? 1 : -1)); }
    });

    // Click slide → open lightbox
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const img = slide.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('visible');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Auto-advance every 4 s
    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    startAuto();
    goTo(0);
  }

  // ==========================================
  // FLOATING PARTICLES  (hero background)
  // ==========================================

  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    canvas.width  = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const dots  = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(135, 206, 235, ${d.o})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    });
  }

  // ==========================================
  // SCROLL REVEAL
  // ==========================================

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ==========================================
  // GALLERY LIGHTBOX
  // ==========================================

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
      // Placeholder items have no <img>, so lightbox won't open for them
    });
  });

  lightboxClose.addEventListener('click', e => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
      closeLightbox();
    }
  });

  // Touch swipe down to close
  let lightboxTouchStartY = 0;
  lightbox.addEventListener('touchstart', e => {
    lightboxTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diffY = e.changedTouches[0].clientY - lightboxTouchStartY;
    // If swiped down more than 60px
    if (diffY > 60 && lightbox.classList.contains('visible')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('visible');
    document.body.style.overflow = 'auto';
  }

});
