const game = document.getElementById("game");
const player = document.getElementById("player");
const heart = document.getElementById("heart");
const message = document.getElementById("message");

let x = 10, y = 10;
let lastCatchTime = Date.now();
let gameActive = true;
const step = 10;
let obstacles = [];

function randomPos(max) {
  return Math.floor(Math.random() * max);
}

/* AKADÁLYOK */
function generateObstacles() {
  obstacles.forEach(o => o.remove());
  obstacles = [];

  for (let i = 0; i < 4; i++) {
    const o = document.createElement("div");
    o.className = "obstacle";
    o.style.width = "50px";
    o.style.height = "12px";
    o.style.left = randomPos(300) + "px";
    o.style.top = randomPos(300) + "px";
    game.appendChild(o);
    obstacles.push(o);
  }
}

function moveHeart() {
  heart.style.left = randomPos(330) + "px";
  heart.style.top = randomPos(330) + "px";
}

function rect(el) {
  return el.getBoundingClientRect();
}

function hit(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function fail() {
  message.textContent = "Dont worry, try again, I'm worth it!";
  resetPosition();
}

function resetPosition() {
  x = 10; y = 10;
  player.style.left = x + "px";
  player.style.top = y + "px";
  lastCatchTime = Date.now();
}

document.addEventListener("keydown", e => {
  if (!gameActive) return;

  if (e.key === "ArrowUp") y -= step;
  if (e.key === "ArrowDown") y += step;
  if (e.key === "ArrowLeft") x -= step;
  if (e.key === "ArrowRight") x += step;

  /* fal */
  if (x < 0 || y < 0 || x > 330 || y > 300) {
    fail(); return;
  }

  player.style.left = x + "px";
  player.style.top = y + "px";

  const p = rect(player);

  for (let o of obstacles) {
    if (hit(p, rect(o))) {
      fail(); return;
    }
  }

  if (hit(p, rect(heart))) {
    endGame();
  }
});

setInterval(() => {
  if (Date.now() - lastCatchTime > 5000 && gameActive) {
    fail();
  }
}, 1000);

function endGame() {
  gameActive = false;
  message.textContent = "You caught my heart ❤️";

  setTimeout(() => {
    if (!confirm("Would you like to play again?")) {
      message.textContent = "Thanks for playing ❤️";
    } else {
      if (confirm("Do you really want to play with my heart?")) {
        message.textContent = "Okay… I'm hurt, but I love you. Here is my heart ❤️";
      } else {
        message.textContent = "Just kidding 😄";
      }
      restart();
    }
  }, 600);
}

function restart() {
  gameActive = true;
  generateObstacles();
  moveHeart();
  resetPosition();
}

/* START */
generateObstacles();
moveHeart();
resetPosition();
message.textContent = "Catch me ❤️";
