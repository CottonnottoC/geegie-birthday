const TARGET_DATE = new Date('2026-05-05T00:00:00+07:00');

// ตอนนี้ตั้งเป็น true เพื่อให้ลองดูข้างในได้เลย
// ตอนจะส่งให้แฟนจริง ค่อยเปลี่ยนเป็น false
const TEST_MODE = true;

const imageMap = {
  'photo-letter-1': './booth1.MP4',
  'photo-letter-2': './booth2.MP4',
  'photo-letter-3': './booth3.MP4',
  'photo-letter-4': './booth4.MP4',
  'photo-letter-5': './booth5.MP4',

  'gallery-photo-1': './gallery1.jpg',
  'gallery-photo-2': './gallery2.jpg',
  'gallery-photo-3': './gallery3.jpg',
  'gallery-photo-4': './gallery4.jpg',
  'gallery-photo-5': './gallery5.jpg',
  'gallery-photo-6': './gallery6.jpg',
  'gallery-photo-7': './gallery7.jpg',
  'gallery-photo-8': './gallery8.jpg',

  'geegie-card-1': './card1.jpg',
  'geegie-card-2': './card2.jpg',
  'geegie-card-3': './card3.jpg',
  'geegie-card-4': './card4.jpg',
  'geegie-card-5': './card5.jpg',
  'geegie-card-6': './card6.jpg',
  'geegie-card-7': './card7.jpg',
  'geegie-card-8': './card8.jpg'
};

const captions = [
  'ความทรงจำที่ 1',
  'ความทรงจำที่ 2',
  'ความทรงจำที่ 3',
  'ความทรงจำที่ 4',
  'ความทรงจำที่ 5',
  'ความทรงจำที่ 6',
  'ความทรงจำที่ 7',
  'ความทรงจำที่ 8'
];

const screens = document.querySelectorAll('.screen');

const enterBtn = document.getElementById('enterBtn');
const envelopeBtn = document.getElementById('envelopeBtn');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const galleryGrid = document.getElementById('galleryGrid');
const gameBoard = document.getElementById('gameBoard');
const scoreText = document.getElementById('scoreText');

const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const closeLightbox = document.getElementById('closeLightbox');

const winModal = document.getElementById('winModal');
const closeWin = document.getElementById('closeWin');

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.remove('active');
  });

  const targetScreen = document.getElementById(id);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function pad(num) {
  return String(num).padStart(2, '0');
}

function updateCountdown() {
  if (!enterBtn || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (TEST_MODE) {
    enterBtn.classList.remove('hidden');
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    enterBtn.classList.remove('hidden');
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

function createPhotoElement(name) {
  const src = imageMap[name];

  if (src) {
    const isVideo = /\.(mp4|MP4|webm|mov|MOV)$/i.test(src);

    if (isVideo) {
      const video = document.createElement('video');
      video.src = src;
      video.className = 'photo-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';

      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');

      return video;
    }

    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    img.className = 'photo-img';
    return img;
  }

  const div = document.createElement('div');
  div.className = 'photo-placeholder';
  div.textContent = name;
  return div;
}

function fillLetterPhotos() {
  document.querySelectorAll('.photo-slot, .video-slot').forEach((slot) => {
    const photoName = slot.dataset.photo;
    slot.innerHTML = '';
    slot.appendChild(createPhotoElement(photoName));
  });
}

function buildGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';

  for (let i = 1; i <= 8; i++) {
    const name = `gallery-photo-${i}`;

    const item = document.createElement('div');
    item.className = 'polaroid gallery-item';
    item.style.setProperty('--r', i % 2 === 0 ? '2deg' : '-2deg');

    const photo = createPhotoElement(name);

    const cap = document.createElement('p');
    cap.className = 'gallery-caption';
    cap.textContent = captions[i - 1];

    item.appendChild(photo);
    item.appendChild(cap);

    item.addEventListener('click', () => {
      openLightbox(name);
    });

    galleryGrid.appendChild(item);
  }
}

function openLightbox(name) {
  if (!lightbox || !lightboxContent) return;

  lightboxContent.innerHTML = '';
  lightboxContent.appendChild(createPhotoElement(name));
  lightbox.classList.remove('hidden');
}

let flipped = [];
let matchedCount = 0;
let lockBoard = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function buildGame() {
  if (!gameBoard || !scoreText || !winModal) return;

  gameBoard.innerHTML = '';
  flipped = [];
  matchedCount = 0;
  lockBoard = false;
  scoreText.textContent = 'คะแนน: 0 / 8';
  winModal.classList.add('hidden');

  const pairs = [];

  for (let i = 1; i <= 8; i++) {
    pairs.push({
      id: `geegie-card-${i}`,
      pair: i
    });

    pairs.push({
      id: `geegie-card-${i}`,
      pair: i
    });
  }

  const cards = shuffle(pairs);

  cards.forEach((cardData, index) => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.dataset.pair = cardData.pair;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">💗</div>
        <div class="card-back"></div>
      </div>
    `;

    const back = card.querySelector('.card-back');
    back.appendChild(createPhotoElement(cardData.id));

    card.addEventListener('click', () => {
      flipCard(card);
    });

    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  if (flipped.length >= 2) return;

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const first = flipped[0];
  const second = flipped[1];

  if (!first || !second) return;

  const isMatch = first.dataset.pair === second.dataset.pair;

  if (isMatch) {
    first.classList.add('matched');
    second.classList.add('matched');

    matchedCount++;
    scoreText.textContent = `คะแนน: ${matchedCount} / 8`;

    flipped = [];

    if (matchedCount === 8) {
      setTimeout(() => {
        if (winModal) {
          winModal.classList.remove('hidden');
        }

        confettiBurst();
      }, 500);
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');

      flipped = [];
      lockBoard = false;
    }, 800);
  }
}

function createFloatingHearts() {
  const bg = document.getElementById('bgHearts');
  if (!bg) return;

  bg.innerHTML = '';

  for (let i = 0; i < 28; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = ['💗', '💕', '💖', '✨'][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${14 + Math.random() * 24}px`;
    heart.style.animationDuration = `${7 + Math.random() * 9}s`;
    heart.style.animationDelay = `${Math.random() * 8}s`;

    bg.appendChild(heart);
  }
}

function confettiBurst() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    size: 5 + Math.random() * 7,
    speed: 2 + Math.random() * 4,
    angle: Math.random() * Math.PI * 2,
    spin: Math.random() * 0.2,
    emoji: Math.random() > 0.72 ? '💗' : null
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
      p.y += p.speed;
      p.x += Math.sin(frame * p.spin + p.angle) * 1.4;

      if (p.emoji) {
        ctx.font = `${p.size * 2}px serif`;
        ctx.fillText(p.emoji, p.x, p.y);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle + frame * p.spin);
        ctx.fillStyle = ['#ff5fa2', '#ffc1dd', '#fff7ec', '#ff8fbd'][
          Math.floor(Math.random() * 4)
        ];
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    frame++;

    if (frame < 150) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

if (enterBtn) {
  enterBtn.classList.remove('hidden');

  enterBtn.addEventListener('click', () => {
    showScreen('homeScreen');
    confettiBurst();
  });
}

if (envelopeBtn) {
  envelopeBtn.addEventListener('click', () => {
    envelopeBtn.classList.add('open');

    setTimeout(() => {
      showScreen('menuScreen');
    }, 650);
  });
}

document.querySelectorAll('.category-card').forEach((card) => {
  card.addEventListener('click', () => {
    showScreen(card.dataset.target);
  });
});

document.querySelectorAll('.back-menu').forEach((btn) => {
  btn.addEventListener('click', () => {
    showScreen('menuScreen');
  });
});

document.querySelectorAll('.back-home').forEach((btn) => {
  btn.addEventListener('click', () => {
    showScreen('homeScreen');
  });
});

if (closeLightbox) {
  closeLightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add('hidden');
    }
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', buildGame);
}

if (playAgainBtn) {
  playAgainBtn.addEventListener('click', buildGame);
}

if (closeWin) {
  closeWin.addEventListener('click', () => {
    winModal.classList.add('hidden');
  });
}

if (winModal) {
  winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
      winModal.classList.add('hidden');
    }
  });
}

setInterval(updateCountdown, 1000);
updateCountdown();

fillLetterPhotos();
buildGallery();
buildGame();
createFloatingHearts();

console.log('Geegie birthday script loaded');
