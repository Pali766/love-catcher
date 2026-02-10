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
let startTime = Date.now();
const cellSize = 40;
const cols = 8;
const rows = 8;

// előre definiált útvonalak
const predefinedPaths = [
  ["0-0","1-0","2-0","3-0","4-1","5-2","6-3","7-4","7-5","7-6","7-7"],
  ["0-0","0-1","0-2","1-2","2-2","3-2","4-3","5-4","6-5","7-6","7-7"],
  ["0-0","1-0","2-1","3-2","4-2","5-3","6-4","7-5","7-6","7-7"],
  ["0-0","0-1","1-2","2-3","3-4","4-5","5-6","6-6","7-7"],
  ["0-0","1-0","2-0","3-1","4-2","5-3","6-4","7-5","7-6","7-7"]
];

// segédfüggvények
function rect(el){ return el.getBoundingClientRect(); }
function hit(a,b){ return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom); }
function random(min,max){ return Math.floor(Math.random()*(max-min)+min); }

// akadályok generálása
function generateObstacles(){
  obstacles.forEach(o=>o.remove());
  obstacles = [];

  const path = predefinedPaths[Math.floor(Math.random()*predefinedPaths.length)];
  const safeZone = ["0-0","1-0","0-1","1-1"];

  for(let y0=0;y0<rows;y0++){
    for(let x0=0;x0<cols;x0++){
      const key = x0+"-"+y0;
      if(safeZone.includes(key) || path.includes(key)) continue;
      if(Math.random()<0.35){
        const o = document.createElement("div");
        o.className="obstacle";
        o.style.width = cellSize + "px";
        o.style.height = "12px";
        o.style.left = (x0*cellSize+10)+"px";
        o.style.top = (y0*cellSize+20)+"px";
        game.appendChild(o);
        obstacles.push(o);
      }
    }
  }
}

// szív elhelyezése
function moveHeart(){
  let valid=false, hx, hy;
  while(!valid){
    hx=random(50,320);
    hy=random(50,320);
    valid=true;
    for(const o of obstacles){
      if(hit({left:hx,top:hy,right:hx+24,bottom:hy+24}, rect(o))){
        valid=false; break;
      }
    }
  }
  heart.style.left=hx+"px";
  heart.style.top=hy+"px";
}

// karakter mozgatás
function resetPosition(){ x=10;y=10;player.style.left=x+"px";player.style.top=y+"px"; startTime=Date.now(); }

function failTime(){ message.textContent="Túl sokáig tart, életem… ennyire nem akarod a szívemet? 😞"; resetPosition(); }

function endGame(){ gameActive=false; controls.classList.remove("hidden"); dialogState=0; message.textContent="Akarsz még játszani?"; }

function handleDialog(answer){
  if(dialogState===0){
    if(answer){ message.textContent="Biztos, hogy a szívemmel akarsz játszani?"; dialogState++; }
    else{ message.textContent="Csak vicceltem, hercegnőm, játsz nyugodtan 😄"; controls.classList.add("hidden"); setTimeout(restart,3500); }
  } else if(dialogState===1){
    if(answer){ message.textContent="Hát jó… most megsértődtem, de túl sokat jelentesz, szóval itt a szívem 💗"; }
    else{ message.textContent="Csak vicceltem, hercegnőm, játsz nyugodtan 😄"; }
    controls.classList.add("hidden");
    setTimeout(restart,3500);
  }
}

yesBtn.onclick=()=>handleDialog(true);
noBtn.onclick=()=>handleDialog(false);

// billentyű
document.addEventListener("keydown",e=>{
  if(!gameActive) return;
  if(e.key==="ArrowUp") y-=step;
  if(e.key==="ArrowDown") y+=step;
  if(e.key==="ArrowLeft") x-=step;
  if(e.key==="ArrowRight") x+=step;
  move();
});

// egér / touch
let dragging=false, offsetX=0, offsetY=0;
player.addEventListener("mousedown", e=>{ dragging=true; const r=player.getBoundingClientRect(); offsetX=e.clientX-r.left; offsetY=e.clientY-r.top; });
document.addEventListener("mouseup", ()=>dragging=false);
document.addEventListener("mousemove", e=>{ if(!dragging||!gameActive) return; const r=game.getBoundingClientRect(); x=e.clientX-r.left-o
