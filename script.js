let canvas, ctx;
let basket, stars, score, lives, keys;
let gameRunning = false;
let starInterval;
let catchSound, missSound;

function setupGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  basket = { x: 160, y: 550, width: 80, height: 20 };
  stars = [];
  score = 0;
  lives = 5;
  keys = {};

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("lives").innerText = "Lives: 5";

  catchSound = new Audio("assets/catch.mp3");
  missSound = new Audio("assets/miss.mp3");
}

function drawBasket() {
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawStar(star) {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#00FFFF";
  ctx.fill();
  ctx.closePath();
}

function spawnStar() {
  let x = Math.random() * (canvas.width - 20) + 10;
  stars.push({ x: x, y: 0, radius: 10 });
}

function updateStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].y += 3 + score * 0.1;
    if (
      stars[i].y + stars[i].radius > basket.y &&
      stars[i].x > basket.x &&
      stars[i].x < basket.x + basket.width
    ) {
      stars.splice(i, 1);
      score++;
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
  if (keys["ArrowLeft"] && basket.x > 0) basket.x -= 5;
  if (keys["ArrowRight"] && basket.x < canvas.width - basket.width) basket.x += 5;
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
  alert("Game Over! Final Score: " + score);
}

document.getElementById("startBtn").onclick = function () {
  setupGame();
  gameRunning = true;
  starInterval = setInterval(spawnStar, 1000);
  gameLoop();
};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
