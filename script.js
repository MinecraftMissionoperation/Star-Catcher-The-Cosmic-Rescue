let canvas, ctx;
let player, stars, asteroids, score, lives, keys;
let gameRunning = false;
let starInterval, asteroidInterval, scoreInterval, levelInterval;
let level = 1;
let starSpeed = 2;
let asteroidSpeed = 2;

// Load images
const playerImg = new Image();
playerImg.src = "assets/player.png";

const starImg = new Image();
starImg.src = "assets/star.png";

const asteroidImg = new Image();
asteroidImg.src = "assets/asteroid.png";

const backgroundImg = new Image();
backgroundImg.src = "assets/background.jpg";

function setupGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  player = { x: 180, y: 300, width: 40, height: 40, angle: 0 };
  stars = [];
  asteroids = [];
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
    case 0: // Top
      x = Math.random() * canvas.width;
      y = 0;
      dx = (canvas.width / 2 - x) / 100;
      dy = asteroidSpeed;
      break;
    case 1: // Bottom
      x = Math.random() * canvas.width;
      y = canvas.height;
      dx = (canvas.width / 2 - x) / 100;
      dy = -asteroidSpeed;
      break;
    case 2: // Left
      x = 0;
      y = Math.random() * canvas.height;
      dx = asteroidSpeed;
      dy = (canvas.height / 2 - y) / 100;
      break;
    case 3: // Right
      x = canvas.width;
      y = Math.random() * canvas.height;
      dx = -asteroidSpeed;
      dy = (canvas.height / 2 - y) / 100;
      break;
  }

  asteroids.push({ x, y, dx, dy });
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
      asteroids.splice(i, 1);
      lives--;
      document.getElementById("lives").innerText = "Lives: " + lives;
      if (lives <= 0) endGame();
    } else if (
      asteroids[i].x < -30 || asteroids[i].x > canvas.width + 30 ||
      asteroids[i].y < -30 || asteroids[i].y > canvas.height + 30
    ) {
      asteroids.splice(i, 1);
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

  // Clamp position
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Update angle
  if (dx !== 0 || dy !== 0) {
    player.angle = Math.atan2(dy, dx);
  }
}

function gameLoop() {
  if (!gameRunning) return;
  drawBackground();
  drawPlayer();
  stars.forEach(drawStar);
  asteroids.forEach(drawAsteroid);
  updateStars();
  updateAsteroids();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  clearInterval(starInterval);
  clearInterval(asteroidInterval);
  clearInterval(scoreInterval);
  clearInterval(levelInterval);
  document.getElementById("finalScore").innerText = "Final Score: " + score;
  document.getElementById("gameOver").style.display = "block";
}

function restartGame() {
  setupGame();
  startGame();
}

function startGame() {
  gameRunning = true;
  starInterval = setInterval(spawnStar, 2000);
  asteroidInterval = setInterval(spawnAsteroid, 1500);
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
  setupGame();
  startGame();
};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
