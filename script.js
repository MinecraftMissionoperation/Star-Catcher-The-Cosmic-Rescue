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

function setupGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  player = { x: 180, y: 500, width: 40, height: 40 };
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

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawStar(star) {
  ctx.drawImage(starImg, star.x - 10, star.y - 10, 20, 20);
}

function drawAsteroid(ast) {
  ctx.drawImage(asteroidImg, ast.x - 15, ast.y - 15, 30, 30);
}

function spawnStar() {
  let x = Math.random() * (canvas.width - 20) + 10;
  let y = Math.random() * (canvas.height - 100);
  let dx = (Math.random() - 0.5) * starSpeed;
  let dy = (Math.random() - 0.5) * starSpeed;
  stars.push({ x, y, dx, dy });
}

function spawnAsteroid() {
  let x = Math.random() * canvas.width;
  asteroids.push({ x, y: 0 });
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
    asteroids[i].y += asteroidSpeed;

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
    } else if (asteroids[i].y > canvas.height) {
      asteroids.splice(i, 1);
    }
  }
}

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += 5;
  if (keys["ArrowUp"] && player.y > 0) player.y -= 5;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += 5;
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
