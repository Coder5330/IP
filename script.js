// ─── DOM refs ────────────────────────────────────────────
const potato        = document.getElementById("potato");
const farmerBtn     = document.getElementById("farmer");
const tractorBtn    = document.getElementById("tractor");
const container     = document.getElementById("container");
const IMAGE_URL     = "assets/potato.png";

let score       = 0;
let farmers     = 0;
let tractors    = 0;
let farmerCost  = 10;
let tractorCost = 100;
let farmerUnlocked  = false;
let tractorUnlocked = false;
let particles = [];
const mouse = { x: 0, y: 0 };

const SUFFIXES = [
    [1e153, "Qiq"], [1e150, "qiq"], [1e147, "Tiq"], [1e144, "Diq"], [1e141, "Uiq"],
    [1e138, "Qag"], [1e135, "Ntn"], [1e132, "Otn"], [1e129, "Stn"], [1e126, "stn"],
    [1e123, "Qtn"], [1e120, "qtn"], [1e117, "Ttn"], [1e114, "Dtn"], [1e111, "Utn"],
    [1e108, "TTg"], [1e105, "NTg"], [1e102, "OTg"], [1e99,  "Tg"],
    [1e96,  "Ng"],  [1e93,  "Og"],  [1e90,  "Sg"],  [1e87,  "sg"],
    [1e84,  "Qg"],  [1e81,  "qg"],  [1e78,  "tg"],  [1e75,  "Dg"],
    [1e72,  "Ug"],  [1e69,  "Vg"],  [1e66,  "Nd"],  [1e63,  "Od"],
    [1e60,  "Sd"],  [1e57,  "sd"],  [1e54,  "Qd"],  [1e51,  "qd"],
    [1e48,  "Td"],  [1e45,  "Dd"],  [1e42,  "Ud"],  [1e39,  "Dc"],
    [1e36,  "No"],  [1e33,  "D"],   [1e30,  "N"],   [1e27,  "O"],
    [1e24,  "s"],   [1e21,  "S"],   [1e18,  "q"],   [1e15,  "Q"],
    [1e12,  "T"],   [1e9,   "B"],   [1e6,   "M"],   [1e3,   "K"],
];


function formatNum(n) {
  for (const [threshold, suffix] of SUFFIXES) {
    if (n >= threshold) return (n / threshold).toFixed(2) + suffix;
  }
  return String(n);
}

const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function spawnParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    const img = document.createElement("img");
    img.src = IMAGE_URL;
    Object.assign(img.style, {
      width:    "20px",
      position: "fixed",
      left:     randInt(x - 20, x + 20) + "px",
      top:      randInt(y - 20, y + 20) + "px",
    });
    img.xVel = randInt(-3, 3);
    img.yVel = 1;
    container.appendChild(img);
    particles.push(img);
    setTimeout(() => {
      img.remove();
      particles = particles.filter(p => p !== img);
    }, 350);
  }
}

function updateStats() {
  document.getElementById("score").innerText   = "Potatoes: "  + formatNum(score);
  document.getElementById("farmers").innerText  = "Farmers: "   + formatNum(farmers);
  document.getElementById("tractors").innerText = "Tractors: "  + formatNum(tractors);
}

function updateButtons() {
  if (score >= farmerCost)   farmerUnlocked  = true;
  if (farmers >= 20)         tractorUnlocked = true;

  const applyButton = (btn, unlocked, cost, label) => {
    if (!unlocked) {
      btn.innerText = "??????";
      btn.style.background = "gray";
      btn.style.border     = "2px solid black";
      return;
    }
    btn.style.display    = "block";
    btn.innerText        = `Buy ${label} (${formatNum(cost)} Potatoes)`;
    const canAfford      = score >= cost;
    btn.style.background = canAfford ? "blue" : "gray";
    btn.style.border     = canAfford ? "2px solid red" : "2px solid black";
  };

  applyButton(farmerBtn,  farmerUnlocked,  farmerCost,  "Farmer");
  applyButton(tractorBtn, tractorUnlocked, tractorCost, "Tractor");
}

potato.addEventListener("click", () => {
  score++;
  spawnParticles(mouse.x, mouse.y);
  updateStats();
});

farmerBtn.addEventListener("click", () => {
  if (score < farmerCost) return;
  score      -= farmerCost;
  farmers++;
  farmerCost  = Math.floor(farmerCost * 1.15);
  updateStats();
});

tractorBtn.addEventListener("click", () => {
  if (score < tractorCost) return;
  score       -= tractorCost;
  tractors++;
  tractorCost  = Math.floor(tractorCost * 1.15);
  updateStats();
});

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

setInterval(() => {
  score   += farmers;
  farmers += tractors;
  updateStats();
}, 1000);

setInterval(() => {
  updateButtons();

  particles.forEach(p => {
    p.style.opacity  = 0;
    p.style.transition = "opacity 1000ms";
    p.xVel  *= 0.95;
    p.yVel  += 0.5;
    p.style.left = parseFloat(p.style.left) + p.xVel + "px";
    p.style.top  = parseFloat(p.style.top)  + p.yVel + "px";
  });
}, 16);

function cheat() {
  score = Number(prompt("Potatoes:"));
  if (farmerUnlocked)  farmers  = Number(prompt("Farmers:"));
  if (tractorUnlocked) tractors = Number(prompt("Tractors:"));
  updateStats();
}
