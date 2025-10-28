let canvas, ctx;
let player, stars, asteroids, powerUps, particles;
let score, lives, keys;
let gameRunning = false;
let starInterval, asteroidInterval, powerUpInterval, scoreInterval, levelInterval;
let level = 1;
let starSpeed = 2;
let asteroidSpeed = 2;

// Load images
const playerImg = new Image();
const starImg = new Image();
const asteroidImg = new Image();
const backgroundImg = new Image();

playerImg.src = "assets/player.png";
starImg.src = "assets/star.png";
asteroidImg.src = "assets/asteroid.png";
backgroundImg.src = "assets/background.jpg";

// Load sounds
const music = new Audio("assets/music.mp3");
music.loop = true;

const sfxCatch = new Audio("assets/catch.mp3");
const sfxHit = new Audio("assets/hit.mp3");
const sfxPower = new Audio("assets/powerup.mp3");

// Wait for all images to load before enabling Start
let imagesLoaded = 0;
const totalImages = 4;

function checkAllImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    document.getElementById("startBtn").disabled = false;
  }
}

playerImg.onload = checkAllImagesLoaded;
starImg.onload = checkAllImagesLoaded;
asteroidImg.onload = checkAllImagesLoaded;
backgroundImg.onload = checkAllImagesLoaded;

document.getElementById("startBtn").disabled = true;

function setupGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  player = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 - 20,
    width: 40,
    height: 40,
    angle: 0,
    invincible: false
  };

  stars = [];
  asteroids = [];
  powerUps = [];
  particles = [];
  score = 0;
  lives = 5;
  level = 1;
  starSpeed = 2;
  asteroidSpeed = 2;
  keys = {};

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("lives").innerText = "Lives: 5";
  document.getElementById("level").innerText = "Level: 1";
  document.getElementById("gameOver").style.display = "none";
}

function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.angle);
  ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();
}

function drawStar(star) {
  ctx.drawImage(starImg, star.x - 10, star.y - 10, 20, 20);
}

function drawAsteroid(ast) {
  ctx.drawImage(asteroidImg, ast.x - 15, ast.y - 15, 30, 30);
}

function drawPowerUp(p) {
  ctx.fillStyle = p.type === "shield" ? "#00ff00" : p.type === "slow" ? "#ff00ff" : "#ffff00";
  ctx.beginPath();
  ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawParticles() {
  for (let p of particles) {
    ctx.fillStyle = `rgba(0,255,255,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRadar() {
  const scale = 0.1;
  const radarX = canvas.width - 100;
  const radarY = 10;
  ctx.fillStyle = "#111";
  ctx.fillRect(radarX, radarY, 90, 90);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(radarX, radarY, 90, 90);

  ctx.fillStyle = "#FFD700";
  ctx.fillRect(radarX + player.x * scale, radarY + player.y * scale, 4, 4);

  ctx.fillStyle = "#00FFFF";
  for (let s of stars) {
    ctx.fillRect(radarX + s.x * scale, radarY + s.y * scale, 2, 2);
  }

  ctx.fillStyle = "#888";
  for (let a of asteroids) {
    ctx.fillRect(radarX + a.x * scale, radarY + a.y * scale, 2, 2);
  }
}

function spawnStar() {
  let x = Math.random() * (canvas.width - 20) + 10;
  let y = Math.random() * (canvas.height - 20) + 10;
  let dx = (Math.random() - 0.5) * starSpeed;
  let dy = (Math.random() - 0.5) * starSpeed;
  stars.push({ x, y, dx, dy });
}

function spawnAsteroid() {
  const side = Math.floor(Math.random() * 4);
  let x, y, dx, dy;

  switch (side) {
    case 0: x = Math.random() * canvas.width; y = 0; dx = 0; dy = asteroidSpeed; break;
    case 1: x = Math.random() * canvas.width; y = canvas.height; dx = 0; dy = -asteroidSpeed; break;
    case 2: x = 0; y = Math.random() * canvas.height; dx = asteroidSpeed; dy = 0; break;
    case 3: x = canvas.width; y = Math.random() * canvas.height; dx = -asteroidSpeed; dy = 0; break;
  }

  asteroids.push({ x, y, dx, dy });
}

function spawnPowerUp() {
  const types = ["shield", "slow", "life"];
  const type = types[Math.floor(Math.random() * types.length)];
  let x = Math.random() * (canvas.width - 30);
  let y = Math.random() * (canvas.height - 30);
  powerUps.push({ x, y, type });
}

function updateStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].x += stars[i].dx;
    stars[i].y += stars[i].dy;

    if (stars[i].x < 0 || stars[i].x > canvas.width) stars[i].dx *= -1;
    if (stars[i].y < 0 || stars[i].y > canvas.height) stars[i].dy *= -1;

    if (
      stars[i].x > player.x &&
      stars[i].x < player.x + player.width &&
      stars[i].y > player.y &&
      stars[i].y < player.y + player.height
    ) {
      stars.splice(i, 1);
      score += 10;
      sfxCatch.play();
      document.getElementById("score").innerText = "Score: " + score;
    }
  }
}

function updateAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].x += asteroids[i].dx;
    asteroids[i].y += asteroids[i].dy;

    if (
      asteroids[i].x > player.x &&
      asteroids[i].x < player.x + player.width &&
      asteroids[i].y > player.y &&
      asteroids[i].y < player.y + player.height
    ) {
      if (!player.invincible) {
        lives--;
        sfxHit.play();
        document.getElementById("lives").innerText = "Lives: " + lives;
        if (lives <= 0) endGame();
      }
      asteroids.splice(i, 1);
    }
  }
}

function updatePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let p = powerUps[i];
    if (
      p.x > player.x &&
      p.x < player.x + player.width &&
      p.y > player.y &&
      p.y < player.y + player.height
    ) {
      applyPowerUp(p.type);
      sfxPower.play();
      powerUps.splice(i, 1);
    }
  }
  }

function applyPowerUp(type) {
  if (type === "life") {
    lives++;
    document.getElementById("lives").innerText = "Lives: " + lives;
  } else if (type === "slow") {
    asteroidSpeed = Math.max(1, asteroidSpeed - 1);
    setTimeout(() => asteroidSpeed += 1, 5000);
  } else if (type === "shield") {
    player.invincible = true;
    setTimeout(() => player.invincible = false, 5000);
  }
}

function spawnParticle(x, y) {
  particles.push({ x, y, alpha: 1 });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].alpha -= 0.02;
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function movePlayer() {
  let dx = 0, dy = 0;
  if (keys["ArrowLeft"]) dx -= 5;
  if (keys["ArrowRight"]) dx += 5;
  if (keys["ArrowUp"]) dy -= 5;
  if (keys["ArrowDown"]) dy += 5;

  player.x += dx;
  player.y += dy;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  if (dx !== 0 || dy !== 0) {
    player.angle = Math.atan2(dy, dx);
    spawnParticle(player.x + player.width / 2, player.y + player.height / 2);
  }
}

function gameLoop() {
  if (!gameRunning) return;
  drawBackground();
  updateParticles();
  drawParticles();
  drawRadar();
  drawPlayer();
  stars.forEach(drawStar);
  asteroids.forEach(drawAsteroid);
  powerUps.forEach(drawPowerUp);
  updateStars();
  updateAsteroids();
  updatePowerUps();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  clearInterval(starInterval);
  clearInterval(asteroidInterval);
  clearInterval(powerUpInterval);
  clearInterval(scoreInterval);
  clearInterval(levelInterval);
  music.pause();
  document.getElementById("finalScore").innerText = "Final Score: " + score;
  document.getElementById("gameOver").style.display = "block";
}

function restartGame() {
  setupGame();
  startGame();
}

function startGame() {
  setupGame();
  gameRunning = true;
  try { music.play(); } catch (e) { console.warn("Music autoplay blocked:", e); }
  starInterval = setInterval(spawnStar, 2000);
  asteroidInterval = setInterval(spawnAsteroid, 1500);
  powerUpInterval = setInterval(spawnPowerUp, 20000);
  scoreInterval = setInterval(() => {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }, 1000);
  levelInterval = setInterval(() => {
    level++;
    starSpeed += 0.5;
    asteroidSpeed += 0.5;
    document.getElementById("level").innerText = "Level: " + level;
  }, 15000);
  gameLoop();
}

document.getElementById("startBtn").onclick = function () {
  startGame();
};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
