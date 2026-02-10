const game = document.getElementById("game");
const player = document.getElementById("player");
const heart = document.getElementById("heart");
const message = document.getElementById("message");

let x = 10, y = 10;
let gameActive = true;
let obstacles = [];
const step = 10;
const cellSize = 40;
const rows = 8;
const cols = 8;
let startTime = Date.now();

// segédfüggvények
function rect(el){ return el.getBoundingClientRect(); }
function hit(a,b){ return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom); }
function random(min,max){ return Math.floor(Math.random()*(max-min)+min); }

// akadályok generálása (10 db, mindig teljesíthető)
function generateObstacles(){
  obstacles.forEach(o=>o.remove());
  obstacles = [];

  const safeZone = ["0-0","1-0","0-1","1-1"];
  const pathCells = []; // biztos út a szívig

  // egyszerű, garantáltan elérhető út (pl. bal felső saroktól jobb alsóig)
  for(let i=0;i<8;i++){
    pathCells.push(i+"-0"); // felső sor
  }
  for(let j=1;j<8;j++){
    pathCells.push("7-"+j); // utolsó oszlop
  }

  // 10 akadály elhelyezése, nem az útvonalon
  let count = 0;
  while(count<10){
    let ox = Math.floor(Math.random()*cols);
    let oy = Math.floor(Math.random()*rows);
    let key = ox+"-"+oy;
    if(!pathCells.includes(key) && !safeZone.includes(key)){
      const o = document.createElement("div");
      o.className = "obstacle";
      o.style.width = cellSize+"px";
      o.style.height = "12px";
      o.style.left = (ox*cellSize+10)+"px";
      o.style.top = (oy*cellSize+20)+"px";
      game.appendChild(o);
      obstacles.push(o);
      count++;
    }
  }
}

// szív a jobb alsó sarokban
function moveHeart(){
  heart.style.left = (cols-1)*cellSize + "px";
  heart.style.top = (rows-1)*cellSize + "px";
}

// karakter reset
function resetPosition(){ x=10;y=10; player.style.left=x+"px"; player.style.top=y+"px"; startTime=Date.now(); message.textContent="Kapj el engem 💕"; gameActive=true; }

// ha nekiütközik akadálynak
function hitObstacle(){
  message.textContent="Nekimentél az akadálynak, de nem baj, próbáld újra, hidd el megéri";
  resetPosition();
}

// időkorlát
function failTime(){
  message.textContent="Túl sokáig tart, életem… ennyire nem akarod a szívemet? 😞";
  resetPosition();
}

// mozgás logika
function move(){
  if(!gameActive) return;

  if(x<0||y<0||x>330||y>300){ failTime(); return; }

  player.style.left = x+"px";
  player.style.top = y+"px";

  const p = rect(player);
  for(const o of obstacles){
    if(hit(p,rect(o))){
      hitObstacle();
      return;
    }
  }

  if(hit(p,rect(heart))){
    message.textContent="Elkaptál 💖";
    gameActive = false;
    setTimeout(resetPosition,3000);
  }
}

// billentyű
document.addEventListener("keydown",e=>{
  if(!gameActive) return;
  if(e.key==="ArrowUp") y-=step;
  if(e.key==="ArrowDown") y+=step;
  if(e.key==="ArrowLeft") x-=step;
  if(e.key==="ArrowRight")
