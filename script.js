const game = document.getElementById("game");
const player = document.getElementById("player");
const heart = document.getElementById("heart");
const message = document.getElementById("message");
const controls = document.getElementById("controls");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

let x = 10, y = 10;
let lastCatchTime = Date.now();
let gameActive = true;
let obstacles = [];
const step = 10;
let dialogState = 0;

function randomPos(max) { return Math.floor(Math.random()*max); }

function generateObstacles() {
  obstacles.forEach(o => o.remove());
  obstacles = [];
  for(let i=0;i<4;i++){
    const o = document.createElement("div");
    o.className = "obstacle";
    o.style.width = (30+Math.random()*40)+"px";
    o.style.height = "12px";
    o.style.left = randomPos(300)+"px";
    o.style.top = randomPos(300)+"px";
    game.appendChild(o);
    obstacles.push(o);
  }
}

function moveHeart() {
  heart.style.left = randomPos(330)+"px";
  heart.style.top = randomPos(330)+"px";
}

function rect(el) { return el.getBoundingClientRect(); }
function hit(a,b){ return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom); }

function fail(){
  message.textContent="Dont worry, try again, I'm worth it!";
  resetPosition();
}

function resetPosition(){
  x=10;y=10;
  player.style.left=x+"px";
  player.style.top=y+"px";
  lastCatchTime=Date.now();
}

function endGame(){
  gameActive=false;
  message.textContent="You caught my heart ❤️";
  controls.classList.remove("hidden");
  dialogState=0;
  message.textContent="Would you like to play again?";
}

yesBtn.addEventListener("click",()=> handleDialog(true));
noBtn.addEventListener("click",()=> handleDialog(false));

function handleDialog(answer){
  switch(dialogState){
    case 0:
      if(answer) message.textContent="Do you really want to play with my heart?";
      else { message.textContent="Thanks for playing ❤️"; controls.classList.add("hidden"); return;}
      dialogState++; break;
    case 1:
      if(answer) message.textContent="Hát jó, most megsértődtem, de túlságosan szeretlek, szóval itt a szívem, játszál vele ❤️";
      else message.textContent="Just kidding 😄";
      dialogState++;
      setTimeout(()=>restart(),1000);
      controls.classList.add("hidden");
      break;
  }
}

/* BILLENTYŰZET */
document.addEventListener("keydown", e=>{
  if(!gameActive) return;
  if(e.key==="ArrowUp") y-=step;
  if(e.key==="ArrowDown") y+=step;
  if(e.key==="ArrowLeft") x-=step;
  if(e.key==="ArrowRight") x+=step;
  checkMove();
});

/* MOBIL / CURSOR MOZGATÁS */
let dragging=false;
player.addEventListener("mousedown",()=>dragging=true);
document.addEventListener("mouseup",()=>dragging=false);
document.addEventListener("mousemove",e=>{if(dragging && gameActive){x=e.offsetX-16; y=e.offsetY-32; checkMove();}});

player.addEventListener("touchstart",()=>dragging=true);
document.addEventListener("touchend",()=>dragging=false);
document.addEventListener("touchmove",e=>{
  if(dragging && gameActive){
    const rect = game.getBoundingClientRect();
    const touch = e.touches[0];
    x = touch.clientX - rect.left -16;
    y = touch.clientY - rect.top -32;
    checkMove();
  }
}, {passive:false});

function checkMove(){
  // fal
  if(x<0||y<0||x>330||y>300){ fail(); return;}
  player.style.left=x+"px";
  player.style.top=y+"px";
  const p=rect(player);
  for(let o of obstacles) if(hit(p,rect(o))){ fail(); return;}
  if(hit(p,rect(heart))) endGame();
}

setInterval(()=>{
  if(Date.now()-lastCatchTime>5000 && gameActive) fail();
},1000);

function restart(){
  gameActive=true;
  generateObstacles();
  moveHeart();
  resetPosition();
  message.textContent="Catch me ❤️";
}

/* INDÍTÁS */
generateObstacles();
moveHeart();
resetPosition();
message.textContent="Catch me ❤️";
