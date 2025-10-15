const startBtn = document.getElementById('startBtn');
const mainArea = document.querySelector('.main-area');
const goodjob = document.getElementById('goodjob');
const bucket = document.getElementById('bucket');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');



// droplet emojis
const GOOD_DROP = '💧';
const BAD_DROP = '🌢';

let gameRunning = false;
let dropInterval;
let timerInterval;
let score = 0;
let timeLeft = 60;
let bucketX = window.innerWidth / 2;

// start game
function startGame() {
  startBtn.style.opacity = '0';
  startBtn.style.transform = 'scale(0.8)';

  setTimeout(() => {
    startBtn.style.display = 'none';
    console.log('Game started!');
    gameRunning = true;
    score = 0;
    timeLeft = 60;
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft;
    gameOverScreen.classList.add('hidden');
    resetBtn.classList.remove('hidden');

    startDroplets();
    startTimer();
    moveBucket();
  }, 300);
}

// droplet spawner
function startDroplets() {
  clearInterval(dropInterval);
  dropInterval = setInterval(createDroplet, 800);
}

// create droplets
function createDroplet() {
  if (!gameRunning) return;
  const drop = document.createElement('div');
  drop.classList.add('droplet');

  const isGood = Math.random() > 0.45;
  drop.textContent = isGood ? GOOD_DROP : BAD_DROP;
  drop.classList.add(isGood ? 'good' : 'bad');

  const x = Math.random() * (mainArea.offsetWidth - 40);
  drop.style.left = `${x}px`;
  drop.style.top = `14vh`;
  mainArea.appendChild(drop);

  const fallDuration = 4000 + Math.random() * 2000;
  drop.style.transition = `top ${fallDuration}ms linear`;
  requestAnimationFrame(() => {
    drop.style.top = `${mainArea.offsetHeight + 30}px`;
  });

  const checkCollision = setInterval(() => {
    if (!gameRunning) {
      clearInterval(checkCollision);
      return;
    }
    const dropRect = drop.getBoundingClientRect();
    const bucketRect = bucket.getBoundingClientRect();

    if (
      dropRect.bottom >= bucketRect.top &&
      dropRect.top <= bucketRect.bottom &&
      dropRect.left <= bucketRect.right &&
      dropRect.right >= bucketRect.left
    ) {
      if (drop.classList.contains('good')) {
        score++;
        scoreEl.textContent = score;
        showGoodJob();
      } else if (drop.classList.contains('bad')) {
        if (score > 0) {
          score--;
          scoreEl.textContent = score;
        } else {
          endGame();
        }
      } else {
        endGame();
      }

      if (score === 30) {
        celebrateWin();
        endGame();
      }
      
      drop.remove();
      clearInterval(checkCollision);
    }

    // remove if hits ground
    if (dropRect.top > mainArea.offsetHeight + 100) {
      drop.remove();
      clearInterval(checkCollision);
    }
  }, 50);

  setTimeout(() => {
    drop.remove();
    clearInterval(checkCollision);
  }, fallDuration);
}

// bucket movement
function moveBucket() {
  bucket.style.left = `${bucketX - bucket.offsetWidth / 2}px`;
}

window.addEventListener('mousemove', (e) => {
  if (!gameRunning) return;
  bucketX = e.clientX;
  moveBucket();
});

// timer
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameRunning) return;
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// end game
function endGame() {
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(dropInterval);
  clearInterval(timerInterval);

  // remove all droplets
  document.querySelectorAll('.droplet').forEach((d) => d.remove());


  // show Game Over
  resetBtn.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  gameOverScreen.style.display = 'block';
}

// restart game
function restartGame() {
  clearInterval(dropInterval);
  clearInterval(timerInterval);

  // reset values
  score = 0;
  timeLeft = 60;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;

  // clear droplets
  document.querySelectorAll('.droplet').forEach((d) => d.remove());

  // hide game over screen
  resetBtn.classList.remove('hidden');
  gameOverScreen.classList.add('hidden');
  gameOverScreen.style.display = 'none';

  // restart logic
  gameRunning = true;
  startDroplets();
  startTimer();
}

function resetGame() {
  if (!gameRunning) return; // only works mid-game
  clearInterval(dropInterval);
  clearInterval(timerInterval);

  // reset values instantly
  score = 0;
  timeLeft = 60;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;

  // remove all droplets
  document.querySelectorAll('.droplet').forEach((d) => d.remove());

  // restart fresh round
  startDroplets();
  startTimer();
}


startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
resetBtn.addEventListener('click', resetGame);


// popup animation
function showGoodJob(duration = 800) {
  goodjob.classList.remove('hidden');
  void goodjob.offsetWidth;
  goodjob.classList.add('pop');

  setTimeout(() => {
    goodjob.classList.remove('pop');
    setTimeout(() => goodjob.classList.add('hidden'), 250);
  }, duration);
}

// Levelup
function celebrateWin() {
  // Launch confetti bursts for a short time
  const duration = 2000; // 2 seconds
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFC907', '#4FCB53', '#2E9DF7', '#FF902A', '#F5402C']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFC907', '#4FCB53', '#2E9DF7', '#FF902A', '#F5402C']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
