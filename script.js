let canvas, ctx;
let basket, stars, score, lives, keys;
let gameRunning = false;
let starInterval, scoreInterval, levelInterval;
let level = 1;
let starSpeed = 3;
let catchSound, missSound;

function setupGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  basket = { x: 160, y: 550, width: 80, height: 20 };
  stars = [];
  score = 0;
  lives = 5;
  level = 1;
  starSpeed = 3;
  keys = {};

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("lives").innerText = "Lives: 5";
  document.getElementById("level").innerText = "Level: 1";
  document.getElementById("gameOver").style.display = "none";

  catchSound = new Audio("assets/catch.mp3");
  missSound = new Audio("assets/miss.mp3");
}

function drawBasket() {
  ctx.fillStyle = "#FFD700";
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 20;
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
  ctx.shadowBlur = 0;
}

function drawStar(star) {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#00FFFF";
  ctx.shadowColor = "#00FFFF";
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function spawnStar() {
  let x = Math.random() * (canvas.width - 20) + 10;
  stars.push({ x: x, y: 0, radius: 10 });
}

function updateStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].y += starSpeed;
    if (
      stars[i].y + stars[i].radius > basket.y &&
      stars[i].x > basket.x &&
      stars[i].x < basket.x + basket.width
    ) {
      stars.splice(i, 1);
      score += 5;
      catchSound.play();
      document.getElementById("score").innerText = "Score: " + score;
    } else if (stars[i].y > canvas.height) {
      stars.splice(i, 1);
      lives--;
      missSound.play();
      document.getElementById("lives").innerText = "Lives: " + lives;
      if (lives <= 0) endGame();
    }
  }
}

function moveBasket() {
  if (keys["ArrowLeft"] && basket.x > 0) basket.x -= 6;
  if (keys["ArrowRight"] && basket.x < canvas.width - basket.width) basket.x += 6;
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  stars.forEach(drawStar);
  updateStars();
  moveBasket();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  clearInterval(starInterval);
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
  starInterval = setInterval(spawnStar, 1000);
  scoreInterval = setInterval(() => {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }, 1000);
  levelInterval = setInterval(() => {
    level++;
    starSpeed += 1;
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
