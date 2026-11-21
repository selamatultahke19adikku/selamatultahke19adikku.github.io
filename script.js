const yesBtn = document.getElementById('yesBtn');
const modal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const openVideo = document.getElementById('openVideo');
const videoModal = document.getElementById('videoModal');
const birthdayVideo = document.getElementById('birthdayVideo');
const closeVideo = document.getElementById('closeVideo');
const videoStatus = document.getElementById('videoStatus');
const speakBtn = document.getElementById('speakBtn');
const speechStatus = document.getElementById('speechStatus');
const birthdayMusic = document.getElementById('birthdayMusic');
const musicToggle = document.getElementById('musicToggle');
const musicStatus = document.getElementById('musicStatus');
const welcomeGate = document.getElementById('welcomeGate');
const enterWithMusic = document.getElementById('enterWithMusic');
const enterSilent = document.getElementById('enterSilent');
const gateStatus = document.getElementById('gateStatus');
const speechText = 'Selamat ulang tahun yang ke-19, Nikita! Semoga hari ini penuh kebahagiaan, tawa, dan kejutan manis. Terima kasih sudah menjadi adik yang hebat. Semoga kamu selalu sehat, semua impianmu tercapai, dan bahagia selalu. Kakak selalu menyayangimu.';

const glitchName = document.querySelector('.glitch-name');
if (glitchName && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => {
    glitchName.classList.add('is-glitching');
    glitchName.textContent = 'Nikitul';
    glitchName.dataset.text = 'Nikitul';

    window.setTimeout(() => {
      glitchName.textContent = 'Nikita!';
      glitchName.dataset.text = 'Nikita!';
      glitchName.classList.remove('is-glitching');
    }, 420);
  }, 3200);
}
const speechSynthesis = window.speechSynthesis;
const gsap = window.gsap;
let resumeMusicAfterVideo = false;

if (gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.portrait', { autoAlpha: 0, y: 28, scale: 0.96, duration: 1.05 });
  intro.from('.eyebrow, h1, .lead, .wish-line, .actions', {
    autoAlpha: 0,
    y: 20,
    duration: 0.72,
    stagger: 0.12,
  }, '-=0.62');

  gsap.to('.cake', {
    y: -9,
    rotation: 1,
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  const portrait = document.querySelector('.portrait');
  const tiltX = gsap.quickTo(portrait, 'rotationX', { duration: 0.45, ease: 'power2.out' });
  const tiltY = gsap.quickTo(portrait, 'rotationY', { duration: 0.45, ease: 'power2.out' });

  portrait.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = portrait.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;
    portrait.style.setProperty('--pointer-x', `${pointerX * 100}%`);
    portrait.style.setProperty('--pointer-y', `${pointerY * 100}%`);
    tiltX((pointerY - 0.5) * -7);
    tiltY((pointerX - 0.5) * 9);
  });

  portrait.addEventListener('pointerleave', () => {
    tiltX(0);
    tiltY(0);
  });
}

function resetSpeechButton() {
  speakBtn.innerHTML = '<span aria-hidden="true">▶</span> Dengerin ucapan';
  speakBtn.setAttribute('aria-label', 'Dengerin ucapan');
}

function updateMusicState(isPlaying) {
  musicToggle.classList.toggle('is-playing', isPlaying);
  const soundEnabled = isPlaying && !birthdayMusic.muted;
  musicToggle.setAttribute('aria-pressed', String(soundEnabled));
  musicToggle.setAttribute(
    'aria-label',
    isPlaying ? (soundEnabled ? 'Jeda musik' : 'Aktifkan suara musik') : 'Putar musik',
  );
  musicStatus.textContent = isPlaying
    ? (soundEnabled ? 'Sedang diputar' : 'Ketuk untuk menyalakan suara')
    : 'Klik untuk memutar';
}

musicToggle.addEventListener('click', async () => {
  if (!birthdayMusic.paused) {
    if (birthdayMusic.muted) {
      birthdayMusic.muted = false;
      updateMusicState(true);
    } else {
      birthdayMusic.pause();
    }
    return;
  }

  birthdayMusic.muted = false;
  try {
    await birthdayMusic.play();
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      musicStatus.textContent = 'Ketuk untuk mengizinkan musik';
      return;
    }

    musicStatus.textContent = 'Musik tidak dapat diputar';
    console.error('Gagal memutar backsound ulang tahun:', error);
  }
});

enterWithMusic.addEventListener('click', async () => {
  enterWithMusic.disabled = true;
  gateStatus.textContent = 'Menyiapkan musik…';

  try {
    await birthdayMusic.play();
    welcomeGate.classList.add('hidden');
    yesBtn.focus();
  } catch (error) {
    enterWithMusic.disabled = false;
    gateStatus.textContent = error.name === 'NotAllowedError'
      ? 'Browser belum mengizinkan audio. Coba tekan sekali lagi.'
      : 'Musik gagal diputar. Kamu tetap bisa membuka ucapan tanpa musik.';
    musicStatus.textContent = 'Musik tidak dapat diputar';
    console.error('Gagal memulai backsound dari layar pembuka:', error);
  }
});

enterSilent.addEventListener('click', () => {
  welcomeGate.classList.add('hidden');
  yesBtn.focus();
});

const giftModal = document.getElementById('giftModal');
const closeGift = document.getElementById('closeGift');
const giftAudio = document.getElementById('giftAudio');
const giftStatus = document.getElementById('giftStatus');
let resumeMusicAfterGift = false;

function closeGiftModal() {
  giftModal.classList.add('hidden');
  giftAudio.pause();
  giftAudio.currentTime = 0;

  if (resumeMusicAfterGift) {
    resumeMusicAfterGift = false;
    birthdayMusic.play().catch(() => {
      musicStatus.textContent = 'Klik untuk melanjutkan musik';
    });
  }

  document.querySelector('.gift-card').focus();
}

document.querySelectorAll('.gift-card').forEach((giftCard) => {
  giftCard.addEventListener('click', async () => {
    giftCard.setAttribute('aria-expanded', 'true');
    giftModal.classList.remove('hidden');
    closeGift.focus();
    giftStatus.textContent = '';

    resumeMusicAfterGift = !birthdayMusic.paused;
    if (resumeMusicAfterGift) birthdayMusic.pause();

    try {
      await giftAudio.play();
    } catch (error) {
      giftStatus.textContent = error.name === 'NotAllowedError'
        ? 'Tekan tombol putar untuk mendengarkan pesan hadiah.'
        : 'Audio hadiah tidak dapat diputar.';
    }

    if (gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo('.gift-modal-card',
        { autoAlpha: 0, y: 20, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.35)' });
    }
  });
});

closeGift.addEventListener('click', closeGiftModal);
giftModal.addEventListener('click', (event) => {
  if (event.target === giftModal) closeGiftModal();
});
giftAudio.addEventListener('error', () => {
  giftStatus.textContent = 'File audio hadiah tidak dapat dimuat.';
});

birthdayMusic.addEventListener('play', () => updateMusicState(true));
birthdayMusic.addEventListener('pause', () => updateMusicState(false));
birthdayMusic.addEventListener('volumechange', () => {
  if (!birthdayMusic.paused) updateMusicState(true);
});
birthdayMusic.addEventListener('error', () => {
  musicStatus.textContent = 'File musik tidak dapat dimuat';
  musicToggle.disabled = true;
  enterWithMusic.disabled = false;
  gateStatus.textContent = 'Musik gagal dimuat. Kamu tetap bisa lanjut tanpa musik.';
  console.error('File backsound ulang tahun gagal dimuat.');
});

if (!speechSynthesis || !window.SpeechSynthesisUtterance) {
  speakBtn.disabled = true;
  speechStatus.textContent = 'Browser ini belum mendukung fitur suara.';
} else {
  speakBtn.addEventListener('click', () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      resetSpeechButton();
      speechStatus.textContent = 'Audio dihentikan.';
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = speechSynthesis.getVoices();
    const indonesianVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('id'));
    if (indonesianVoice) utterance.voice = indonesianVoice;

    utterance.onend = () => {
      resetSpeechButton();
      speechStatus.textContent = 'Selesai dibacakan.';
    };
    utterance.onerror = () => {
      resetSpeechButton();
      speechStatus.textContent = 'Audio tidak bisa diputar di browser ini.';
    };

    speechStatus.textContent = 'Pesan sedang dibacakan...';
    speakBtn.innerHTML = '<span aria-hidden="true">■</span> Berhenti';
    speakBtn.setAttribute('aria-label', 'Berhenti membacakan pesan');
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });
}

yesBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  if (gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to('#cakeFlame', { scale: 0.2, autoAlpha: 0, duration: 0.35, transformOrigin: '50% 100%' });
    gsap.fromTo('.modal-card',
      { autoAlpha: 0, y: 22, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' });
    gsap.fromTo('.confetti span',
      { y: -30, rotation: 0, autoAlpha: 0 },
      {
        y: () => window.innerHeight + 50,
        rotation: 540,
        autoAlpha: 1,
        duration: 2.4,
        stagger: 0.09,
        ease: 'power1.in',
        onComplete: () => gsap.set('.confetti span', { autoAlpha: 0 }),
      });
  }
  closeModal.focus();
});

function hideModal() {
  modal.classList.add('hidden');
  if (gsap) gsap.set('#cakeFlame', { clearProps: 'all' });
  yesBtn.focus();
}

closeModal.addEventListener('click', hideModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) hideModal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) hideModal();
  if (event.key === 'Escape' && !videoModal.classList.contains('hidden')) {
    closeVideoModal();
  }
  if (event.key === 'Escape' && !giftModal.classList.contains('hidden')) {
    closeGiftModal();
  }
});

openVideo.addEventListener('click', async () => {
  videoModal.classList.remove('hidden');
  videoStatus.textContent = '';
  resumeMusicAfterVideo = !birthdayMusic.paused;
  if (resumeMusicAfterVideo) birthdayMusic.pause();
  closeVideo.focus();

  try {
    await birthdayVideo.play();
  } catch (error) {
    videoStatus.textContent = error.name === 'NotAllowedError'
      ? 'Tekan tombol putar pada video untuk mulai.'
      : 'Video tidak dapat diputar.';
    if (error.name !== 'NotAllowedError') {
      console.error('Gagal memutar video ucapan:', error);
    }
  }
});

async function closeVideoModal() {
  videoModal.classList.add('hidden');
  birthdayVideo.pause();
  if (birthdayVideo.readyState > 0) birthdayVideo.currentTime = 0;
  openVideo.focus();

  if (resumeMusicAfterVideo) {
    resumeMusicAfterVideo = false;
    try {
      await birthdayMusic.play();
    } catch (error) {
      musicStatus.textContent = 'Klik untuk melanjutkan musik';
      console.error('Gagal melanjutkan backsound setelah video:', error);
    }
  }
}

closeVideo.addEventListener('click', closeVideoModal);

videoModal.addEventListener('click', (event) => {
  if (event.target === videoModal) closeVideoModal();
});

birthdayVideo.addEventListener('error', () => {
  videoStatus.textContent = 'File video tidak dapat dimuat.';
  console.error('File video ucapan gagal dimuat.');
});

const canvas = document.getElementById('stars');
const context = canvas.getContext('2d');
let stars = [];

function resizeStars() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(110, Math.floor(window.innerWidth / 10)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.2 + 0.2,
    alpha: Math.random() * 0.7 + 0.15,
  }));
}

function drawStars() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star, index) => {
    const pulse = 0.65 + Math.sin(Date.now() * 0.0015 + index) * 0.35;
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 255, ${star.alpha * pulse})`;
    context.fill();
  });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(drawStars);
  }
}

window.addEventListener('resize', resizeStars);
resizeStars();
drawStars();

const backgroundSlides = document.querySelectorAll('.photo-slide');
let activeBackgroundIndex = 0;

window.setInterval(() => {
  backgroundSlides[activeBackgroundIndex].classList.remove('is-active');
  activeBackgroundIndex = (activeBackgroundIndex + 1) % backgroundSlides.length;
  backgroundSlides[activeBackgroundIndex].classList.add('is-active');
}, 6500);
