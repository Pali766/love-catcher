const game = document.getElementById("game");
const player = document.getElementById("player");
const heart = document.getElementById("heart");
const message = document.getElementById("message");
const controls = document.getElementById("controls");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

let x = 10, y = 10;
let gameActive = true;
let obstacles = [];
let dialogState = 0;
const step = 10;

let startTime = Date.now(); // 15 mp időkorlát

function rect(el){ return el.getBoundingClientRect(); }
function hit(a,b){
  return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom);
}
function random(min,max){ return Math.floor(Math.random()*(max-min)+min); }

/* RENDEZETT AKADÁLYOK */
function generateObstacles(){
  obstacles.forEach(o=>o.remove());
  obstacles=[];

  const positions = [
    {x:60,y:60},{x:220,y:60},
    {x:60,y:220},{x:220,y:220}
  ];

  positions.forEach(p=>{
    const o=document.createElement("div");
    o.className="obstacle";
    o.style.width="60px";
    o.style.height="12px";
    o.style.left=p.x+"px";
    o.style.top=p.y+"px";
    game.appendChild(o);
    obstacles.push(o);
  });
}

function moveHeart(){
  heart.style.left=random(260,310)+"px";
  heart.style.top=random(260,310)+"px";
}

function resetPosition(){
  x=10; y=10;
  player.style.left=x+"px";
  player.style.top=y+"px";
  startTime=Date.now();
}

function failTime(){
  message.textContent="Túl sokáig tart, életem… ennyire nem akarod a szívemet? 😞";
  resetPosition();
}

function endGame(){
  gameActive=false;
  controls.classList.remove("hidden");
  dialogState=0;
  message.textContent="Akarsz még játszani?";
}

function handleDialog(answer){
  switch(dialogState){
    case 0:
      if(answer){
        message.textContent="Biztos, hogy a szívemmel akarsz játszani?";
      } else {
        message.textContent="Csak vicceltem, hercegnőm, játsz nyugodtan 😄";
        controls.classList.add("hidden");
        setTimeout(restart,1200);
        return;
      }
      dialogState++;
      break;
    case 1:
      if(answer){
        message.textContent="Hát jó… most megsértődtem, de túl sokat jelentesz, szóval itt a szívem 💗";
      } else {
        message.textContent="Csak vicceltem, hercegnőm, játsz nyugodtan 😄";
      }
      controls.classList.add("hidden");
      setTimeout(restart,1200);
      break;
  }
}

yesBtn.onclick=()=>handleDialog(true);
noBtn.onclick=()=>handleDialog(false);

/* BILLENTYŰZET MOZGÁS */
document.addEventListener("keydown",e=>{
  if(!gameActive) return;
  if(e.key==="ArrowUp") y-=step;
  if(e.key==="ArrowDown") y+=step;
  if(e.key==="ArrowLeft") x-=step;
  if(e.key==="ArrowRight") x+=step;
  move();
});

/* MOBIL MOZGÁS */
let drag=false;
player.addEventListener("touchstart",()=>drag=true);
document.addEventListener("touchend",()=>drag=false);
document.addEventListener("touchmove",e=>{
  if(!drag||!gameActive) return;
  const r=game.getBoundingClientRect();
  x=e.touches[0].clientX-r.left-16;
  y=e.touches[0].clientY-r.top-32;
  move();
},{passive:false});

function move(){
  if(x<0||y<0||x>330||y>300){ failTime(); return; }
  player.style.left=x+"px";
  player.style.top=y+"px";

  const p=rect(player);
  for(const o of obstacles){
    if(hit(p,rect(o))){ failTime(); return; }
  }

  if(hit(p,rect(heart))) endGame();
}

/* 15 MP IDŐKORLÁT */
setInterval(()=>{
  if(!gameActive) return;
  if(Date.now()-startTime>15000) failTime();
},500);

function restart(){
  gameActive=true;
  generateObstacles();
  moveHeart();
  resetPosition();
  message.textContent="Kapj el engem 💕";
}

/* INDÍTÁS */
generateObstacles();
moveHeart();
resetPosition();
message.textContent="Kapj el engem 💕";
