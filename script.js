// ==========================================
// Coleen's 21st Birthday Website
// Interactive Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- DOM References ----
  const mainContent    = document.getElementById('main-content');
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxClose  = document.getElementById('lightbox-close');

  // ==========================================
  // THEME SELECTOR
  // ==========================================

  const themeScreen   = document.getElementById('theme-screen');
  const confirmBtn    = document.getElementById('theme-confirm-btn');
  const themeCards    = document.querySelectorAll('.theme-card');
  const themeBg       = document.querySelector('.theme-screen-bg');

  let selectedTheme = 'skyblue';

  // Apply initial default theme
  document.documentElement.setAttribute('data-theme', 'skyblue');
  // Prevent scrolling while on theme screen
  document.body.style.overflow = 'hidden';

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from all
      themeCards.forEach(c => c.classList.remove('active'));
      // Set active on clicked
      card.classList.add('active');
      selectedTheme = card.dataset.theme;

      // Apply theme — this updates all CSS variables on <html>,
      // so the theme screen background, title, subtitle, and button
      // all repaint immediately via their var() references.
      document.documentElement.setAttribute('data-theme', selectedTheme);

      // Force repaint on the background element so gradient updates in all browsers
      themeBg.style.animation = 'none';
      themeBg.offsetHeight; // trigger reflow
      themeBg.style.animation = '';
    });
  });

  confirmBtn.addEventListener('click', () => {
    // Ensure theme is applied
    document.documentElement.setAttribute('data-theme', selectedTheme);

    // Hide theme screen
    themeScreen.classList.add('hidden');

    // Show Meme Videos Screen
    initMemeVideos();
  });

  function showMainContent() {
    mainContent.classList.add('visible');
    document.body.style.overflow = 'auto';

    // Initialize page components
    initScrollReveal();
    initParticles();
    initRobloxCarousel();
    initNameSpinner();
  }


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

    const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '135, 206, 235';

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
        ctx.fillStyle = `rgba(${particleColor}, ${d.o})`;
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

  // ==========================================
  // MEME VIDEOS
  // ==========================================
  const memeScreen = document.getElementById('meme-videos-screen');
  const memeVideo = document.getElementById('meme-video-player');
  const prevVideoBtn = document.getElementById('prev-video-btn');
  const nextVideoBtn = document.getElementById('next-video-btn');
  const memeVideoCounter = document.getElementById('meme-video-counter');
  const memeDoneBtn = document.getElementById('meme-done-btn');

  const memeVideos = [
    'assets/videoMemes/1.mp4',
    'assets/videoMemes/2.mp4',
    'assets/videoMemes/3.mp4',
    'assets/videoMemes/4.mp4',
    'assets/videoMemes/5.mp4'
  ];
  let currentVideoIndex = 0;

  function initMemeVideos() {
    memeScreen.classList.remove('hidden');
    currentVideoIndex = 0;
    loadVideo(0);
  }

  function loadVideo(index) {
    if (index < 0 || index >= memeVideos.length) return;
    memeVideo.src = memeVideos[index];
    memeVideo.play();
    memeVideoCounter.textContent = `${index + 1} / ${memeVideos.length}`;
    
    prevVideoBtn.disabled = index === 0;
    
    if (index === memeVideos.length - 1) {
      nextVideoBtn.style.display = 'none';
      memeDoneBtn.classList.remove('hidden');
    } else {
      nextVideoBtn.style.display = 'inline-block';
      memeDoneBtn.classList.add('hidden');
    }
  }

  memeVideo.addEventListener('ended', () => {
    if (currentVideoIndex < memeVideos.length - 1) {
      currentVideoIndex++;
      loadVideo(currentVideoIndex);
    }
  });

  prevVideoBtn.addEventListener('click', () => {
    if (currentVideoIndex > 0) {
      currentVideoIndex--;
      loadVideo(currentVideoIndex);
    }
  });

  nextVideoBtn.addEventListener('click', () => {
    if (currentVideoIndex < memeVideos.length - 1) {
      currentVideoIndex++;
      loadVideo(currentVideoIndex);
    }
  });

  memeDoneBtn.addEventListener('click', () => {
    memeVideo.pause();
    memeScreen.classList.add('hidden');
    initFeedbackScreen();
  });

  // ==========================================
  // FEEDBACK SCREEN
  // ==========================================
  const feedbackScreen = document.getElementById('feedback-screen');
  const feedbackYesBtn = document.getElementById('feedback-yes-btn');
  const feedbackKindaBtn = document.getElementById('feedback-kinda-btn');
  const feedbackNoBtn = document.getElementById('feedback-no-btn');
  const feedbackResponseText = document.getElementById('feedback-response-text');
  const feedbackDoneBtn = document.getElementById('feedback-done-btn');

  function initFeedbackScreen() {
    feedbackScreen.classList.remove('hidden');
    feedbackResponseText.classList.add('hidden');
    feedbackDoneBtn.classList.add('hidden');
    feedbackYesBtn.style.display = 'inline-block';
    feedbackKindaBtn.style.display = 'inline-block';
    feedbackNoBtn.style.display = 'inline-block';
  }

  function handleFeedback(response) {
    feedbackYesBtn.style.display = 'none';
    feedbackKindaBtn.style.display = 'none';
    feedbackNoBtn.style.display = 'none';
    feedbackResponseText.classList.remove('hidden');
    feedbackDoneBtn.classList.remove('hidden');
    
    if (response === 'yes') {
      feedbackResponseText.textContent = "Buti naman hehe";
      feedbackResponseText.style.color = "#48c78e"; // green-ish
    } else if (response === 'kinda') {
      feedbackResponseText.textContent = "Hala Bakit? Ghe proceed ka na sa next page";
      feedbackResponseText.style.color = "var(--color-primary)";
    } else {
      feedbackResponseText.textContent = "Ngek aray mo. Ghe next page ka na:(";
      feedbackResponseText.style.color = "rgba(255,107,138,0.8)"; // red-ish
    }
  }

  feedbackYesBtn.addEventListener('click', () => handleFeedback('yes'));
  feedbackKindaBtn.addEventListener('click', () => handleFeedback('kinda'));
  feedbackNoBtn.addEventListener('click', () => handleFeedback('no'));

  feedbackDoneBtn.addEventListener('click', () => {
    feedbackScreen.classList.add('hidden');
    initRacerTest();
  });

  // ==========================================
  // RACER TEST
  // ==========================================
  const racerScreen = document.getElementById('racer-test-screen');
  const racerImg = document.getElementById('racer-image');
  const racerInput = document.getElementById('racer-answer-input');
  const racerSubmit = document.getElementById('racer-submit-btn');
  const racerNextImageBtn = document.getElementById('racer-next-image-btn');
  const racerFeedback = document.getElementById('racer-feedback');
  const racerCounter = document.getElementById('racer-counter');
  const racerResultsArea = document.getElementById('racer-results-area');
  const racerQuizArea = document.getElementById('racer-quiz-area');
  const racerScoreText = document.getElementById('racer-score-text');
  const racerStatusText = document.getElementById('racer-racer-status');
  const racerDoneBtn = document.getElementById('racer-done-btn');

  const racerImages = [
    { src: 'assets/quizMemes/BIGGER.jpg', answer: 'BIGGER' },
    { src: 'assets/quizMemes/BURGER.jpg', answer: 'BURGER' },
    { src: 'assets/quizMemes/DAGGER.jpg', answer: 'DAGGER' },
    { src: 'assets/quizMemes/DIGGER.jpg', answer: 'DIGGER' },
    { src: 'assets/quizMemes/NUMBERS.jpg', answer: 'NUMBERS' },
    { src: 'assets/quizMemes/RIGGERS.jpg', answer: 'RIGGERS' },
    { src: 'assets/quizMemes/SINGER.jpg', answer: 'SINGER' }
  ];
  let currentRacerIndex = 0;
  let racerScore = 0;

  function initRacerTest() {
    racerScreen.classList.remove('hidden');
    currentRacerIndex = 0;
    racerScore = 0;
    racerQuizArea.classList.remove('hidden');
    racerResultsArea.classList.add('hidden');
    loadRacerImage(0);
  }

  function loadRacerImage(index) {
    if (index >= racerImages.length) {
      showRacerResults();
      return;
    }
    racerImg.src = racerImages[index].src;
    racerInput.value = '';
    racerInput.disabled = false;
    racerSubmit.classList.remove('hidden');
    racerNextImageBtn.classList.add('hidden');
    racerFeedback.innerHTML = '';
    racerFeedback.className = 'feedback-msg';
    racerCounter.textContent = `${index + 1} / ${racerImages.length}`;
    racerInput.focus();
  }

  function checkRacerAnswer() {
    if(racerInput.value.trim() === '') return;
    const rawGuess = racerInput.value;
    const guess = rawGuess.replace(/\s+/g, '').toUpperCase();
    const correct = racerImages[currentRacerIndex].answer;
    
    racerInput.disabled = true;
    racerSubmit.classList.add('hidden');
    racerNextImageBtn.classList.remove('hidden');

    if (guess === correct) {
      racerScore++;
      racerFeedback.innerHTML = `Correct! <b>${correct}</b> is the word.`;
      racerFeedback.className = 'feedback-msg feedback-correct';
    } else {
      racerFeedback.innerHTML = `Wrong! Your answer: <b>${rawGuess}</b><br>Correct answer: <b>${correct}</b>`;
      racerFeedback.className = 'feedback-msg feedback-wrong';
    }
  }

  racerSubmit.addEventListener('click', checkRacerAnswer);
  racerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !racerInput.disabled) checkRacerAnswer();
  });

  racerNextImageBtn.addEventListener('click', () => {
    currentRacerIndex++;
    loadRacerImage(currentRacerIndex);
  });

  function showRacerResults() {
    racerQuizArea.classList.add('hidden');
    racerResultsArea.classList.remove('hidden');
    racerScoreText.textContent = `You got ${racerScore} out of ${racerImages.length}`;
    
    if (racerScore <= 3) {
      racerStatusText.textContent = "lala bagsak ka yah. Certified racer ka siguro";
    } else if (racerScore <= 5) {
      racerStatusText.textContent = "pwede na. Medyo racer ka boss";
    } else {
      racerStatusText.textContent = "congrats di ka racer yay!";
    }
  }

  racerDoneBtn.addEventListener('click', () => {
    racerScreen.classList.add('hidden');
    initJokeScreen();
  });

  // ==========================================
  // JOKE SCREEN
  // ==========================================
  const jokeScreen = document.getElementById('joke-screen');
  const jokeText = document.getElementById('joke-text');
  const jokeInput = document.getElementById('joke-guess-input');
  const jokeGuessBtn = document.getElementById('joke-guess-btn');
  const jokeSiretBtn = document.getElementById('joke-siret-btn');
  const jokeFeedback = document.getElementById('joke-feedback');
  const jokeAnswerArea = document.getElementById('joke-answer-area');
  const jokeAnswerText = document.getElementById('joke-answer-text');
  const jokeNextBtn = document.getElementById('joke-next-btn');
  const jokeCounter = document.getElementById('joke-counter');
  const jokeResultsArea = document.getElementById('joke-results-area');
  const jokeInputGroup = document.getElementById('joke-input-group');
  const jokeDoneBtn = document.getElementById('joke-done-btn');

  const jokes = [
    { q: "Bakit laging natatanggap ang mga Bisaya sa call center?", a: "kasi nga BEST SA CALL (bisakol)", keywords: ["best", "bisakol", "call"] },
    { q: "Bakit galit na galit yung twin towers?", a: "kasi nag order sila ng pepperoni pizza pero ang nakuha lang nila ay plain (plane)", keywords: ["plain", "plane"] },
    { q: "Alam mo ba kung bakit madalas hiwalayan mga ofw sa Saudi?", a: "kasi nanlalamig na sila", keywords: ["nanlalamig", "lamig"] },
    { q: "Ano ang sabi ng elepante sa hubad na lalake?", a: "pano ka humihinga dyan?", keywords: ["hinga", "humihinga"] },
    { q: "What do you call a bird that doesn't fly?", a: "Dead Bird", keywords: ["dead", "patay"] }
  ];
  
  let currentJokeIndex = 0;

  function initJokeScreen() {
    jokeScreen.classList.remove('hidden');
    currentJokeIndex = 0;
    jokeResultsArea.classList.add('hidden');
    document.querySelector('.joke-area').classList.remove('hidden');
    loadJoke(0);
  }

  function loadJoke(index) {
    if (index >= jokes.length) {
      document.querySelector('.joke-area').classList.add('hidden');
      jokeResultsArea.classList.remove('hidden');
      return;
    }
    jokeText.textContent = `${index + 1}. ${jokes[index].q}`;
    jokeInput.value = '';
    jokeFeedback.textContent = '';
    jokeFeedback.className = 'feedback-msg';
    jokeAnswerText.textContent = ''; // Fix: clear the previous answer
    jokeAnswerArea.classList.add('hidden');
    jokeInputGroup.classList.remove('hidden');
    jokeCounter.textContent = `${index + 1} / ${jokes.length}`;
    jokeInput.focus();
  }

  function checkJokeGuess() {
    const guess = jokeInput.value.toLowerCase().trim();
    if (!guess) return;
    
    const keywords = jokes[currentJokeIndex].keywords;
    const isCorrect = keywords.some(kw => guess.includes(kw));

    if (isCorrect) {
      jokeFeedback.textContent = "Correct! HAHAHA";
      jokeFeedback.className = 'feedback-msg feedback-correct';
      revealJokeAnswer();
    } else {
      jokeFeedback.textContent = "Wrong! Try again or click Siret na.";
      jokeFeedback.className = 'feedback-msg feedback-wrong';
    }
  }

  jokeGuessBtn.addEventListener('click', checkJokeGuess);
  jokeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkJokeGuess();
  });

  jokeSiretBtn.addEventListener('click', revealJokeAnswer);

  function revealJokeAnswer() {
    jokeInputGroup.classList.add('hidden');
    jokeAnswerArea.classList.remove('hidden');
    jokeAnswerText.textContent = `Answer: ${jokes[currentJokeIndex].a}`;
    if (!jokeFeedback.textContent.includes('Correct')) {
       jokeFeedback.textContent = '';
    }
  }

  jokeNextBtn.addEventListener('click', () => {
    currentJokeIndex++;
    loadJoke(currentJokeIndex);
  });

  jokeDoneBtn.addEventListener('click', () => {
    jokeScreen.classList.add('hidden');
    showMainContent();
  });

});
