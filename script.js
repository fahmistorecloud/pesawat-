// ============================================================
// PESAWAT TEMPUR — script.js
// ============================================================

// ============ AUDIO ============
const Audio = {
  ctx:null, masterGain:null, musicGain:null, sfxGain:null, muted:false, musicTimer:null,
  init(){ if(this.ctx) return; try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); this.masterGain = this.ctx.createGain(); this.masterGain.gain.value = 0.6; this.masterGain.connect(this.ctx.destination); this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.8; this.sfxGain.connect(this.masterGain); this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.15; this.musicGain.connect(this.masterGain); }catch(e){} },
  resume(){ if(this.ctx && this.ctx.state === "suspended") this.ctx.resume(); },
  tone(f,d,t,v,dl){ t=t||"sine"; v=v||0.3; dl=dl||0; if(this.muted||!this.ctx) return; const t0 = this.ctx.currentTime + dl; const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = t; o.frequency.setValueAtTime(f,t0); g.gain.setValueAtTime(v,t0); g.gain.exponentialRampToValueAtTime(0.001,t0+d); o.connect(g); g.connect(this.sfxGain); o.start(t0); o.stop(t0+d); },
  noise(d,v,ff){ v=v||0.3; ff=ff||1000; if(this.muted||!this.ctx) return; const b = this.ctx.createBuffer(1,this.ctx.sampleRate*d,this.ctx.sampleRate); const dt = b.getChannelData(0); for(let i=0;i<dt.length;i++) dt[i] = (Math.random()*2-1)*(1-i/dt.length); const s = this.ctx.createBufferSource(); s.buffer = b; const fl = this.ctx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = ff; const g = this.ctx.createGain(); g.gain.value = v; s.connect(fl); fl.connect(g); g.connect(this.sfxGain); s.start(); },
  shoot(){ if(!this.ctx||this.muted) return; const t0 = this.ctx.currentTime; const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = "square"; o.frequency.setValueAtTime(880,t0); o.frequency.exponentialRampToValueAtTime(220,t0+0.08); g.gain.setValueAtTime(0.15,t0); g.gain.exponentialRampToValueAtTime(0.001,t0+0.1); o.connect(g); g.connect(this.sfxGain); o.start(t0); o.stop(t0+0.1); },
  explode(){ this.noise(0.4,0.5,800); this.tone(80,0.3,"sawtooth",0.3); this.tone(160,0.2,"square",0.2,0.05); },
  hit(){ this.tone(1200,0.05,"square",0.15); },
  click(){ this.tone(660,0.05,"sine",0.2); },
  coin(){ this.tone(1046,0.08,"sine",0.3); this.tone(1568,0.12,"sine",0.3,0.06); },
  buy(){ this.tone(523,0.1,"square",0.3); this.tone(659,0.1,"square",0.3,0.1); this.tone(784,0.15,"square",0.3,0.2); this.tone(1046,0.25,"square",0.3,0.3); },
  gameOver(){ this.tone(400,0.2,"sawtooth",0.3); this.tone(300,0.3,"sawtooth",0.3,0.2); this.tone(200,0.5,"sawtooth",0.3,0.45); this.noise(0.6,0.4,500); },
  startMusic(){ if(!this.ctx || this.musicTimer) return; const notes = [220,277,330,277,220,165,220,277]; let i = 0; const p = () => { if(!this.ctx||this.muted) return; const f = notes[i%notes.length]; const t0 = this.ctx.currentTime; const o1 = this.ctx.createOscillator(); const o2 = this.ctx.createOscillator(); const g = this.ctx.createGain(); o1.type = "triangle"; o2.type = "sine"; o1.frequency.value = f; o2.frequency.value = f*0.5; g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(0.15,t0+0.15); g.gain.exponentialRampToValueAtTime(0.001,t0+1.1); o1.connect(g); o2.connect(g); g.connect(this.musicGain); o1.start(t0); o1.stop(t0+1.2); o2.start(t0); o2.stop(t0+1.2); i++; }; p(); this.musicTimer = setInterval(p,700); },
  stopMusic(){ if(this.musicTimer){ clearInterval(this.musicTimer); this.musicTimer = null; } },
  toggleMute(){ this.muted = !this.muted; if(this.masterGain) this.masterGain.gain.value = this.muted?0:0.6; return this.muted; }
};

// ============ SKINS ============
const SKINS = {
  default:{ name:"Default Cyan", price:0, hull:"#b4c3dc", hullLight:"#dce6f5", hullDark:"#5a698c", hullOutline:"#283250", wing:"#37415f", wingEdge:"#64789f", wingLeft:"#8291b4", wingLeftLight:"#c8d7f0", wingRight:"#465570", wingRightLight:"#96a5c8", cockpit:"#3c4664", cockpitGlass:"#1e648c", cockpitHi:"#64dcff", engine1:"#ff8800", engine2:"#ffdd00", glow:"0,220,255" },
  fire:{ name:"Fire Red", price:150, hull:"#cc5533", hullLight:"#ff8855", hullDark:"#883322", hullOutline:"#331100", wing:"#3f1f15", wingEdge:"#8a4422", wingLeft:"#aa4422", wingLeftLight:"#ff7744", wingRight:"#662a1a", wingRightLight:"#cc6633", cockpit:"#553311", cockpitGlass:"#cc4400", cockpitHi:"#ffaa00", engine1:"#ff4400", engine2:"#ffcc00", glow:"255,100,50" },
  matrix:{ name:"Matrix Green", price:300, hull:"#33aa44", hullLight:"#66dd77", hullDark:"#116622", hullOutline:"#002200", wing:"#1a4422", wingEdge:"#33aa44", wingLeft:"#33bb44", wingLeftLight:"#66ff77", wingRight:"#116622", wingRightLight:"#44cc55", cockpit:"#114422", cockpitGlass:"#117733", cockpitHi:"#44ff88", engine1:"#00ff44", engine2:"#aaffaa", glow:"50,255,100" },
  galaxy:{ name:"Galaxy Purple", price:500, hull:"#8855cc", hullLight:"#bb88ff", hullDark:"#4422aa", hullOutline:"#220044", wing:"#2a1a4a", wingEdge:"#7744cc", wingLeft:"#7744cc", wingLeftLight:"#bb88ff", wingRight:"#4422aa", wingRightLight:"#8855dd", cockpit:"#332255", cockpitGlass:"#6633cc", cockpitHi:"#aa88ff", engine1:"#cc44ff", engine2:"#ffaaff", glow:"200,100,255" },
  gold:{ name:"Gold Royal", price:800, hull:"#ddbb44", hullLight:"#ffee88", hullDark:"#886611", hullOutline:"#442200", wing:"#443311", wingEdge:"#ccaa44", wingLeft:"#ccaa44", wingLeftLight:"#ffee88", wingRight:"#886611", wingRightLight:"#ddaa33", cockpit:"#664411", cockpitGlass:"#cc8800", cockpitHi:"#ffdd44", engine1:"#ffaa00", engine2:"#ffee88", glow:"255,204,0" },
  neon:{ name:"Neon Pink", price:1500, hull:"#cc3388", hullLight:"#ff88cc", hullDark:"#661144", hullOutline:"#330022", wing:"#4a1a33", wingEdge:"#cc3388", wingLeft:"#cc3388", wingLeftLight:"#ff88cc", wingRight:"#882255", wingRightLight:"#dd44aa", cockpit:"#552244", cockpitGlass:"#aa2277", cockpitHi:"#ff88dd", engine1:"#ff0088", engine2:"#ffccdd", glow:"255,100,200" },
  ice:{ name:"Ice Blue", price:2000, hull:"#88ccff", hullLight:"#ddeeff", hullDark:"#3366aa", hullOutline:"#002244", wing:"#1a3a5a", wingEdge:"#66aaee", wingLeft:"#66aaee", wingLeftLight:"#cceeff", wingRight:"#3366aa", wingRightLight:"#88bbee", cockpit:"#224466", cockpitGlass:"#3366cc", cockpitHi:"#aaddff", engine1:"#00ccff", engine2:"#ffffff", glow:"150,220,255" },
  shadow:{ name:"Shadow Black", price:2500, hull:"#333344", hullLight:"#666680", hullDark:"#111122", hullOutline:"#000000", wing:"#1a1a2a", wingEdge:"#444466", wingLeft:"#444466", wingLeftLight:"#8888aa", wingRight:"#222233", wingRightLight:"#555577", cockpit:"#222233", cockpitGlass:"#4422aa", cockpitHi:"#8855ff", engine1:"#8800ff", engine2:"#cc88ff", glow:"140,80,255" },
  lava:{ name:"Lava Orange", price:3000, hull:"#ff6622", hullLight:"#ffaa66", hullDark:"#aa3300", hullOutline:"#441100", wing:"#4a1a00", wingEdge:"#ff8833", wingLeft:"#ff7722", wingLeftLight:"#ffbb77", wingRight:"#aa4400", wingRightLight:"#dd8844", cockpit:"#552200", cockpitGlass:"#ff5500", cockpitHi:"#ffcc44", engine1:"#ff2200", engine2:"#ffdd00", glow:"255,120,30" },
  toxic:{ name:"Toxic Lime", price:4000, hull:"#aaff00", hullLight:"#ddff88", hullDark:"#558800", hullOutline:"#223300", wing:"#2a4400", wingEdge:"#88cc00", wingLeft:"#99dd00", wingLeftLight:"#eeffaa", wingRight:"#558800", wingRightLight:"#aaff33", cockpit:"#334400", cockpitGlass:"#66aa00", cockpitHi:"#ccff44", engine1:"#88ff00", engine2:"#eeff88", glow:"180,255,50" },
  rainbow:{ name:"Rainbow", price:10000, hull:"#ff33aa", hullLight:"#ffddee", hullDark:"#883366", hullOutline:"#330022", wing:"#4422aa", wingEdge:"#aa44ff", wingLeft:"#ff4488", wingLeftLight:"#ffddee", wingRight:"#4422aa", wingRightLight:"#aa44ff", cockpit:"#552288", cockpitGlass:"#ff00aa", cockpitHi:"#ffeeff", engine1:"#ffaa00", engine2:"#00ffaa", glow:"255,100,200" },
  diamond:{ name:"Diamond Legend", price:25000, hull:"#ddeeff", hullLight:"#ffffff", hullDark:"#8899cc", hullOutline:"#222244", wing:"#445577", wingEdge:"#aabbee", wingLeft:"#bbccff", wingLeftLight:"#ffffff", wingRight:"#8899cc", wingRightLight:"#ddeeff", cockpit:"#334466", cockpitGlass:"#5588ee", cockpitHi:"#ffffff", engine1:"#88aaff", engine2:"#ffffff", glow:"200,220,255" },
  legendary:{ name:"✨ LEGENDARY ✨", price:500000, hull:"#ff00aa", hullLight:"#ffffff", hullDark:"#550033", hullOutline:"#220011", wing:"#7700ff", wingEdge:"#ff00ff", wingLeft:"#ff0088", wingLeftLight:"#ffaaff", wingRight:"#00ddff", wingRightLight:"#aaffff", cockpit:"#ff00ff", cockpitGlass:"#ff00aa", cockpitHi:"#ffffff", engine1:"#ff00ff", engine2:"#00ffff", glow:"255,0,255", rainbow:true }
};

// ============ SCREENS ============
const screens = {
  login: document.getElementById("login-screen"),
  register: document.getElementById("register-screen"),
  tos: document.getElementById("tos-screen"),
  menu: document.getElementById("menu-screen"),
  shop: document.getElementById("shop-screen"),
  difficulty: document.getElementById("difficulty-screen"),
  howto: document.getElementById("howto-screen"),
  topup: document.getElementById("topup-screen"),
  game: document.getElementById("game-screen"),
  pause: document.getElementById("pause-screen"),
  gameover: document.getElementById("gameover-screen"),
  admin: document.getElementById("admin-screen")
};
function showScreen(n){ for(const k in screens) if(screens[k]) screens[k].classList.remove("active"); if(screens[n]) screens[n].classList.add("active"); }
function toast(m,t,d){ t=t||""; d=d||2200; const el = document.getElementById("toast"); el.textContent = m; el.className = "show " + t; clearTimeout(el._t); el._t = setTimeout(() => { el.className = ""; }, d); }

// ============ DB ============
const DB = {
  KEY:"sd_users_db", SESSION_KEY:"sd_session", TOPUP_KEY:"sd_topup_db",
  loadUsers(){ try{ const v = localStorage.getItem(this.KEY); return v ? JSON.parse(v) : {}; }catch(e){ return {}; } },
  saveUsers(u){ try{ localStorage.setItem(this.KEY,JSON.stringify(u)); }catch(e){} },
  getUser(u){ return this.loadUsers()[u] || null; },
  createUser(u,p,c){ c=c||0; const users = this.loadUsers(); if(users[u]) return false; users[u] = { password:p, coins:c, bestScores:{EASY:0,NORMAL:0,HARD:0}, gamesPlayed:0, createdAt:Date.now(), ownedSkins:["default"], equippedSkin:"default" }; this.saveUsers(users); return true; },
  updateUser(u,up){ const users = this.loadUsers(); if(!users[u]) return false; users[u] = Object.assign({}, users[u], up); this.saveUsers(users); return true; },
  deleteUser(u){ const users = this.loadUsers(); delete users[u]; this.saveUsers(users); },
  countUsers(){ return Object.keys(this.loadUsers()).length; },
  setSession(u){ try{ localStorage.setItem(this.SESSION_KEY,u); }catch(e){} },
  clearSession(){ try{ localStorage.removeItem(this.SESSION_KEY); }catch(e){} },
  loadTopups(){ try{ const v = localStorage.getItem(this.TOPUP_KEY); return v ? JSON.parse(v) : []; }catch(e){ return []; } },
  saveTopups(l){ try{ localStorage.setItem(this.TOPUP_KEY,JSON.stringify(l)); }catch(e){} },
  addTopup(r){ const l = this.loadTopups(); l.unshift(r); this.saveTopups(l); },
  updateTopup(id,up){ const l = this.loadTopups(); const i = l.findIndex(x => x.id === id); if(i >= 0){ l[i] = Object.assign({}, l[i], up); this.saveTopups(l); return true; } return false; },
  getUserTopups(u){ return this.loadTopups().filter(x => x.username === u); },
  getPendingTopups(){ return this.loadTopups().filter(x => x.status === "pending"); }
};

// ============ CONFIG ============
const ADMIN_CRED = { username:"admin", password:"admin123" };
const PACKAGES = [
  {coins:100,price:"Rp 5.000"}, {coins:250,price:"Rp 10.000"},
  {coins:600,price:"Rp 20.000"}, {coins:1500,price:"Rp 50.000"},
  {coins:3500,price:"Rp 100.000"}, {coins:10000,price:"Rp 250.000"}
];

const DIFF = {
  EASY:{ label:"EASY", color:"#22cc77", startSpeed:3, spawnBase:45, spawnMin:18, maxAsteroids:15, shootCooldown:6, asteroidHp:1, destroyBonus:3 },
  NORMAL:{ label:"NORMAL", color:"#00dcff", startSpeed:5, spawnBase:30, spawnMin:10, maxAsteroids:25, shootCooldown:5, asteroidHp:2, destroyBonus:3 },
  HARD:{ label:"HARD", color:"#ff4455", startSpeed:7, spawnBase:20, spawnMin:6, maxAsteroids:35, shootCooldown:4, asteroidHp:3, destroyBonus:5 }
};

const BOSS_CONFIG = {
  EASY:   { spawnScore:500,  hp:30,  w:90,  h:80,  speed:1.5, shootCD:100, bulletSpeed:3.0, reward:15, color:"#22cc77", pattern:"single" },
  NORMAL: { spawnScore:800,  hp:60,  w:120, h:100, speed:2.2, shootCD:70,  bulletSpeed:3.8, reward:35, color:"#00dcff", pattern:"double" },
  HARD:   { spawnScore:1000, hp:120, w:150, h:130, speed:3.0, shootCD:45,  bulletSpeed:4.5, reward:60, color:"#ff4455", pattern:"triple" }
};

const ENEMY_COLORS = [
  { c1:"#8a2a3a", c2:"#6a1a2a", c3:"#3a0a15" },
  { c1:"#2a3a8a", c2:"#1a2a6a", c3:"#0a0a3a" },
  { c1:"#3a8a2a", c2:"#2a6a1a", c3:"#0a3a0a" },
  { c1:"#8a6a2a", c2:"#6a4a1a", c3:"#3a1a0a" },
  { c1:"#8a2a8a", c2:"#6a1a6a", c3:"#3a0a3a" }
];

// ============ APP ============
const App = {
  username:"", difficulty:"NORMAL", muted:false, isAdmin:false,
  get userData(){ return DB.getUser(this.username) || null; },
  get coins(){ return this.userData ? this.userData.coins : 0; },
  get bestScores(){ return this.userData ? this.userData.bestScores : {EASY:0,NORMAL:0,HARD:0}; },
  get ownedSkins(){ return (this.userData && this.userData.ownedSkins) || ["default"]; },
  get equippedSkin(){ return (this.userData && this.userData.equippedSkin) || "default"; },
  get skinColors(){ return SKINS[this.equippedSkin] || SKINS.default; },
  login(u){ this.username = u; DB.setSession(u); try{ this.muted = JSON.parse(localStorage.getItem("sd_muted") || "false"); }catch(e){ this.muted = false; } },
  logout(){ this.username = ""; DB.clearSession(); },
  saveMuted(){ try{ localStorage.setItem("sd_muted", JSON.stringify(this.muted)); }catch(e){} }
};
try { App.muted = JSON.parse(localStorage.getItem("sd_muted") || "false"); }catch(e){}

// ============ TOGGLE PASS ============
document.querySelectorAll(".toggle-pass").forEach(b => {
  b.onclick = (e) => { e.preventDefault(); const i = document.getElementById(b.dataset.target); if(!i) return; if(i.type === "password"){ i.type = "text"; b.textContent = "🙈"; } else { i.type = "password"; b.textContent = "👁"; } };
});

function updateUserCounter(){ const el = document.getElementById("user-count-login"); if(el) el.textContent = DB.countUsers(); }
updateUserCounter();

// ============ COPY DANA ============
const btnCopyDana = document.getElementById("btn-copy-dana");
if(btnCopyDana){
  btnCopyDana.onclick = () => {
    Audio.click();
    const nomor = document.getElementById("dana-number").textContent;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(nomor).then(() => toast("✓ Nomor DANA disalin: " + nomor, "success", 2500)).catch(() => fallbackCopyDana(nomor));
    } else fallbackCopyDana(nomor);
  };
}
function fallbackCopyDana(text){
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); toast("✓ Disalin: " + text, "success", 2500); }
  catch(e){ toast("Salin manual: " + text, "err", 3000); }
  document.body.removeChild(ta);
}

// ============ NAV ============
document.getElementById("goto-register-btn").onclick = () => { Audio.init(); Audio.resume(); Audio.click(); showScreen("register"); document.getElementById("reg-user").focus(); };
document.getElementById("goto-login").onclick = () => { Audio.click(); showScreen("login"); };

// ============ REGISTER ============
document.getElementById("btn-register").onclick = () => {
  Audio.init(); Audio.resume(); Audio.click();
  const u = document.getElementById("reg-user").value.trim();
  const p = document.getElementById("reg-pass").value;
  const p2 = document.getElementById("reg-pass2").value;
  const err = document.getElementById("reg-error");
  err.style.color = "#ff6677";
  if(u.length < 3){ err.textContent = "Username minimal 3 huruf!"; return; }
  if(!/^[a-zA-Z0-9_]+$/.test(u)){ err.textContent = "Hanya huruf, angka, _"; return; }
  if(u.toLowerCase() === "admin"){ err.textContent = "Username admin tidak bisa dipakai!"; return; }
  if(p.length < 3){ err.textContent = "Password minimal 3 karakter!"; return; }
  if(p !== p2){ err.textContent = "Konfirmasi tidak sama!"; return; }
  if(!DB.createUser(u,p,0)){ err.textContent = "Username sudah dipakai!"; return; }
  err.style.color = "#22cc77"; err.textContent = "Akun dibuat! Silakan login.";
  updateUserCounter();
  setTimeout(() => {
    document.getElementById("login-user").value = u;
    document.getElementById("login-pass").value = "";
    document.getElementById("reg-user").value = "";
    document.getElementById("reg-pass").value = "";
    document.getElementById("reg-pass2").value = "";
    err.textContent = ""; err.style.color = "#ff6677";
    showScreen("login"); document.getElementById("login-pass").focus();
  }, 1200);
};
document.getElementById("reg-pass2").addEventListener("keydown", e => { if(e.key === "Enter") document.getElementById("btn-register").click(); });

// ============ LOGIN ============
document.getElementById("btn-login").onclick = () => {
  Audio.init(); Audio.resume(); Audio.click();
  const u = document.getElementById("login-user").value.trim();
  const p = document.getElementById("login-pass").value;
  const err = document.getElementById("login-error");
  if(!u || !p){ err.textContent = "Isi username dan password!"; return; }
  if(u === ADMIN_CRED.username && p === ADMIN_CRED.password){
    err.textContent = ""; App.isAdmin = true; App.username = u;
    Audio.coin(); toast("Selamat datang, Admin!", "gold", 2000);
    setTimeout(() => { showScreen("admin"); refreshAdminPanel(); }, 400); return;
  }
  const user = DB.getUser(u);
  if(!user){ err.textContent = "Username tidak ditemukan!"; return; }
  if(user.password !== p){ err.textContent = "Password salah!"; return; }
  err.textContent = ""; App.isAdmin = false; App.login(u);
  showScreen("tos");
  document.getElementById("tos-check").checked = false;
  document.getElementById("btn-tos-agree").disabled = true;
};
document.getElementById("login-pass").addEventListener("keydown", e => { if(e.key === "Enter") document.getElementById("btn-login").click(); });

// ============ TOS ============
document.getElementById("tos-check").addEventListener("change", e => { document.getElementById("btn-tos-agree").disabled = !e.target.checked; Audio.click(); });
document.getElementById("btn-tos-back").onclick = () => { Audio.click(); App.logout(); showScreen("login"); };
document.getElementById("btn-tos-agree").onclick = () => {
  Audio.click();
  document.getElementById("welcome-text").textContent = "Selamat datang, " + App.username;
  updateMenuModeButton(); updateMuteButton(); updateCoinDisplay();
  showScreen("menu"); drawMenuShip(); Audio.startMusic();
};

// ============ MENU ============
function updateCoinDisplay(){
  document.getElementById("menu-coins").textContent = App.coins;
  const sc = document.getElementById("shop-coins"); if(sc) sc.textContent = App.coins;
}
function updateMenuModeButton(){
  const btn = document.getElementById("btn-mode");
  btn.textContent = "MODE: " + App.difficulty;
  const c = DIFF[App.difficulty].color;
  btn.style.background = "linear-gradient(135deg," + c + "," + c + "99)";
}
function updateMuteButton(){ document.getElementById("btn-mute-menu").textContent = App.muted ? "🔇" : "🔊"; }

document.getElementById("btn-mute-menu").onclick = (e) => { e.stopPropagation(); App.muted = Audio.toggleMute(); App.saveMuted(); updateMuteButton(); };
document.getElementById("btn-play").onclick = () => { Audio.click(); startGame(); };
document.getElementById("btn-mode").onclick = () => { Audio.click(); updateDifficultyScreen(); showScreen("difficulty"); };
document.getElementById("btn-howto").onclick = () => { Audio.click(); showScreen("howto"); };
document.getElementById("btn-topup").onclick = () => { Audio.click(); openTopup(); };
document.getElementById("btn-shop").onclick = () => { Audio.click(); openShop(); };
document.getElementById("btn-logout").onclick = () => { Audio.click(); Audio.stopMusic(); App.logout(); showScreen("login"); document.getElementById("login-user").value = ""; document.getElementById("login-pass").value = ""; updateUserCounter(); };
document.getElementById("btn-howto-back").onclick = () => { Audio.click(); showScreen("menu"); };

// ============ SHOP ============
let shopRainbowTimer = null;
function openShop(){
  renderShop();
  updateCoinDisplay();
  showScreen("shop");
  if(shopRainbowTimer) clearInterval(shopRainbowTimer);
  shopRainbowTimer = setInterval(() => {
    if(!screens.shop || !screens.shop.classList.contains("active")){ clearInterval(shopRainbowTimer); shopRainbowTimer = null; return; }
    const grid = document.getElementById("skin-grid");
    if(!grid) return;
    const cards = grid.querySelectorAll(".skin-card canvas");
    const ids = Object.keys(SKINS);
    cards.forEach((canvas, i) => {
      const id = ids[i];
      if(id && SKINS[id] && SKINS[id].rainbow){
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShipWithSkin(ctx, canvas.width/2, canvas.height/2, 140, 160, SKINS[id]);
      }
    });
  }, 100);
}
function renderShop(){
  const grid = document.getElementById("skin-grid");
  const owned = App.ownedSkins, equipped = App.equippedSkin;
  grid.innerHTML = "";
  for(const id in SKINS){
    const skin = SKINS[id];
    const isOwned = owned.indexOf(id) >= 0;
    const isEquipped = equipped === id;
    const card = document.createElement("div");
    card.className = "skin-card" + (isOwned ? " owned" : "") + (isEquipped ? " equipped" : "");
    const preview = document.createElement("div"); preview.className = "skin-preview";
    const canvas = document.createElement("canvas"); canvas.width = 160; canvas.height = 180;
    preview.appendChild(canvas); card.appendChild(preview);
    const nameEl = document.createElement("div"); nameEl.className = "skin-name"; nameEl.textContent = skin.name; card.appendChild(nameEl);
    const priceEl = document.createElement("div");
    if(isOwned){ priceEl.className = "skin-price"; priceEl.textContent = "Sudah dimiliki"; priceEl.style.color = "#22cc77"; }
    else if(skin.price === 0){ priceEl.className = "skin-price free"; priceEl.textContent = "GRATIS"; }
    else { priceEl.className = "skin-price"; priceEl.textContent = skin.price + " koin"; }
    card.appendChild(priceEl);
    const btn = document.createElement("button");
    if(isEquipped){ btn.className = "skin-btn equipped"; btn.textContent = "DIPAKAI"; }
    else if(isOwned){ btn.className = "skin-btn equip"; btn.textContent = "PAKAI"; btn.onclick = () => equipSkin(id); }
    else if(App.coins >= skin.price){ btn.className = "skin-btn buy"; btn.textContent = "BELI"; btn.onclick = () => buySkin(id); }
    else { btn.className = "skin-btn locked"; btn.textContent = "KOIN KURANG"; }
    card.appendChild(btn); grid.appendChild(card);
    setTimeout(() => { const ctx = canvas.getContext("2d"); drawShipWithSkin(ctx, canvas.width/2, canvas.height/2, 140, 160, skin); }, 0);
  }
}
function buySkin(id){
  const skin = SKINS[id]; if(!skin) return;
  if(App.ownedSkins.indexOf(id) >= 0){ toast("Skin sudah dimiliki!","err"); return; }
  if(App.coins < skin.price){ toast("Koin tidak cukup!","err"); return; }
  const u = DB.getUser(App.username);
  DB.updateUser(App.username, { coins: u.coins - skin.price, ownedSkins: (u.ownedSkins || ["default"]).concat([id]) });
  Audio.buy(); toast("✓ Skin " + skin.name + " dibeli!","success",2000);
  updateCoinDisplay(); renderShop();
}
function equipSkin(id){
  if(App.ownedSkins.indexOf(id) < 0){ toast("Skin belum dimiliki!","err"); return; }
  DB.updateUser(App.username, { equippedSkin:id });
  Audio.coin(); toast("✓ Skin dipakai!","success",1500);
  renderShop(); drawMenuShip();
}
document.getElementById("btn-shop-back").onclick = () => { Audio.click(); if(shopRainbowTimer){ clearInterval(shopRainbowTimer); shopRainbowTimer = null; } showScreen("menu"); drawMenuShip(); };

// ============ DRAW SHIP ============
function drawShipWithSkin(ctx, cx, cy, w, h, skin){
  let skinUse = skin;
  if(skin.rainbow){
    const t = Date.now() / 150;
    const hue = (t * 60) % 360;
    const hue2 = (hue + 60) % 360;
    const hue3 = (hue + 120) % 360;
    skinUse = Object.assign({}, skin, {
      hull: "hsl(" + hue + ",100%,55%)", hullLight: "hsl(" + hue + ",100%,85%)",
      hullDark: "hsl(" + hue + ",100%,30%)", hullOutline: "hsl(" + hue + ",100%,15%)",
      wingLeft: "hsl(" + hue2 + ",100%,55%)", wingLeftLight: "hsl(" + hue2 + ",100%,85%)",
      wingRight: "hsl(" + hue3 + ",100%,55%)", wingRightLight: "hsl(" + hue3 + ",100%,85%)",
      cockpitGlass: "hsl(" + hue2 + ",100%,50%)", cockpitHi: "hsl(" + hue3 + ",100%,90%)",
      engine1: "hsl(" + hue + ",100%,60%)", engine2: "hsl(" + hue2 + ",100%,80%)",
      glow: ((hue * 255 / 360) | 0) + "," + ((hue2 * 255 / 360) | 0) + "," + ((hue3 * 255 / 360) | 0)
    });
  }
  skin = skinUse;
  ctx.save(); ctx.translate(cx, cy);
  ctx.shadowColor = "rgba(" + skin.glow + ",0.9)";
  ctx.shadowBlur = skin.rainbow ? 40 : 25;
  ctx.fillStyle = skin.hullDark;
  ctx.beginPath(); ctx.moveTo(-w/2 - 6, h/6); ctx.lineTo(-w/2 - 10, h/2 - 4); ctx.lineTo(-w/6, h/3); ctx.lineTo(-w/6, h/6); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(w/2 + 6, h/6); ctx.lineTo(w/2 + 10, h/2 - 4); ctx.lineTo(w/6, h/3); ctx.lineTo(w/6, h/6); ctx.closePath(); ctx.fill();
  const wingGradL = ctx.createLinearGradient(-w/2, 0, 0, h/3);
  wingGradL.addColorStop(0, skin.hullDark); wingGradL.addColorStop(1, skin.wingLeft);
  ctx.fillStyle = wingGradL;
  ctx.beginPath(); ctx.moveTo(-w/8, -h/6); ctx.lineTo(-w/2 - 8, h/4); ctx.lineTo(-w/2 + 2, h/2); ctx.lineTo(-w/5, h/3); ctx.lineTo(-w/12, h/6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = skin.hullOutline; ctx.lineWidth = 1.5; ctx.stroke();
  const wingGradR = ctx.createLinearGradient(w/2, 0, 0, h/3);
  wingGradR.addColorStop(0, skin.hullDark); wingGradR.addColorStop(1, skin.wingRight);
  ctx.fillStyle = wingGradR;
  ctx.beginPath(); ctx.moveTo(w/8, -h/6); ctx.lineTo(w/2 + 8, h/4); ctx.lineTo(w/2 - 2, h/2); ctx.lineTo(w/5, h/3); ctx.lineTo(w/12, h/6); ctx.closePath(); ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#666"; ctx.fillRect(-w/2 - 2, h/4, 6, h/8); ctx.fillRect(w/2 - 4, h/4, 6, h/8);
  ctx.fillStyle = "#ff3333";
  ctx.beginPath(); ctx.moveTo(-w/2 + 1, h/4); ctx.lineTo(-w/2 - 2, h/4 - 6); ctx.lineTo(-w/2 + 5, h/4 - 6); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(w/2 + 1, h/4); ctx.lineTo(w/2 - 2, h/4 - 6); ctx.lineTo(w/2 + 5, h/4 - 6); ctx.closePath(); ctx.fill();
  const bodyGrad = ctx.createLinearGradient(-w/4, 0, w/4, 0);
  bodyGrad.addColorStop(0, skin.hullDark); bodyGrad.addColorStop(0.3, skin.hull); bodyGrad.addColorStop(0.5, skin.hullLight); bodyGrad.addColorStop(0.7, skin.hull); bodyGrad.addColorStop(1, skin.hullDark);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(0, -h/2);
  ctx.bezierCurveTo(w/6, -h/3, w/7, -h/6, w/7, 0);
  ctx.lineTo(w/9, h/3); ctx.lineTo(w/12, h/2 - 2); ctx.lineTo(-w/12, h/2 - 2);
  ctx.lineTo(-w/9, h/3); ctx.lineTo(-w/7, 0);
  ctx.bezierCurveTo(-w/7, -h/6, -w/6, -h/3, 0, -h/2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = skin.hullOutline; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath(); ctx.moveTo(0, -h/2 + 6); ctx.lineTo(w/12, 0); ctx.lineTo(-w/12, 0); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = skin.cockpit;
  ctx.beginPath(); ctx.ellipse(0, -h/6, w/9, h/5, 0, 0, Math.PI*2); ctx.fill();
  const glassGrad = ctx.createLinearGradient(0, -h/4, 0, -h/12);
  glassGrad.addColorStop(0, skin.cockpitHi); glassGrad.addColorStop(0.5, skin.cockpitGlass); glassGrad.addColorStop(1, "#000000");
  ctx.fillStyle = glassGrad;
  ctx.beginPath(); ctx.ellipse(0, -h/6, w/10, h/6, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath(); ctx.ellipse(-w/30, -h/5, w/40, h/25, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, -h/2 + 8); ctx.lineTo(0, h/2 - 4); ctx.stroke();
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.ellipse(-w/10, h/2 - 2, w/16, h/20, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w/10, h/2 - 2, w/16, h/20, 0, 0, Math.PI*2); ctx.fill();
  const t2 = Date.now() / 80;
  const flicker = 0.7 + Math.sin(t2) * 0.3;
  ctx.shadowColor = skin.engine1; ctx.shadowBlur = skin.rainbow ? 35 : 25;
  ctx.fillStyle = skin.engine1;
  ctx.beginPath(); ctx.ellipse(-w/10, h/2 + 6*flicker, w/20, h/12*flicker, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = skin.engine2;
  ctx.beginPath(); ctx.ellipse(-w/10, h/2 + 4*flicker, w/30, h/16*flicker, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = skin.engine1;
  ctx.beginPath(); ctx.ellipse(w/10, h/2 + 6*flicker, w/20, h/12*flicker, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = skin.engine2;
  ctx.beginPath(); ctx.ellipse(w/10, h/2 + 4*flicker, w/30, h/16*flicker, 0, 0, Math.PI*2); ctx.fill();
  ctx.shadowColor = "rgba(" + skin.glow + ",1)"; ctx.shadowBlur = skin.rainbow ? 45 : 30;
  ctx.fillStyle = "rgba(" + skin.glow + ",0.4)";
  ctx.beginPath(); ctx.ellipse(0, h/2 + 8, w/6, h/10, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawMenuShip(){
  const c = document.getElementById("menuShip"); if(!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  drawShipWithSkin(ctx, c.width/2, c.height/2, 70, 90, App.skinColors);
}

// ============ DIFFICULTY ============
function updateDifficultyScreen(){
  document.querySelectorAll(".diff-btn").forEach(b => {
    if(b.dataset.diff === App.difficulty) b.classList.add("active"); else b.classList.remove("active");
  });
  const bs = App.bestScores;
  document.getElementById("diff-best").innerHTML = "🏆 Best — EASY: " + bs.EASY + " · NORMAL: " + bs.NORMAL + " · HARD: " + bs.HARD;
}
document.querySelectorAll(".diff-btn").forEach(b => {
  b.onclick = () => { Audio.click(); App.difficulty = b.dataset.diff; updateDifficultyScreen(); toast("Mode: " + b.dataset.diff, "", 1200); };
});
document.getElementById("btn-diff-back").onclick = () => { Audio.click(); updateMenuModeButton(); showScreen("menu"); };

// ============ TOPUP ============
let selectedPkgIndex = -1;
function openTopup(){
  selectedPkgIndex = -1;
  renderPackages(); renderTopupHistory();
  document.getElementById("topup-name").value = "";
  document.getElementById("topup-note").value = "";
  showScreen("topup");
}
function renderPackages(){
  const wrap = document.getElementById("topup-packages");
  wrap.innerHTML = "";
  PACKAGES.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = "topup-pkg" + (i === selectedPkgIndex ? " selected" : "");
    btn.innerHTML = '<div class="coins">🪙 ' + p.coins + '</div><div class="price">' + p.price + '</div>';
    btn.onclick = () => { selectedPkgIndex = i; renderPackages(); Audio.click(); };
    wrap.appendChild(btn);
  });
}
function renderTopupHistory(){
  const hist = document.getElementById("topup-history");
  const list = DB.getUserTopups(App.username);
  if(list.length === 0){ hist.innerHTML = '<div class="empty-state">Belum ada riwayat</div>'; return; }
  hist.innerHTML = "";
  list.slice(0, 5).forEach(t => {
    const div = document.createElement("div"); div.className = "item";
    div.innerHTML = "<span>🪙 " + t.coins + " (" + t.price + ")</span><span class='status-" + t.status + "'>" + t.status.toUpperCase() + "</span>";
    hist.appendChild(div);
  });
}
document.getElementById("btn-topup-submit").onclick = () => {
  Audio.click();
  if(selectedPkgIndex < 0){ toast("Pilih paket dulu!","err"); return; }
  const name = document.getElementById("topup-name").value.trim();
  if(name.length < 2){ toast("Isi nama pengirim!","err"); return; }
  const note = document.getElementById("topup-note").value.trim();
  const pkg = PACKAGES[selectedPkgIndex];
  DB.addTopup({
    id: "tu_" + Date.now() + "_" + Math.random().toString(36).slice(2,7),
    username: App.username, senderName: name, coins: pkg.coins, price: pkg.price,
    note: note, status: "pending", date: Date.now()
  });
  Audio.coin();
  toast("✓ Request dikirim! Tunggu admin approve.","success",3000);
  document.getElementById("topup-name").value = "";
  document.getElementById("topup-note").value = "";
  selectedPkgIndex = -1; renderPackages(); renderTopupHistory();
};
document.getElementById("btn-topup-back").onclick = () => { Audio.click(); showScreen("menu"); };

// ============================================================
// ==================== GAME =================================
// ============================================================
const canvas = document.getElementById("gameCanvas");
const gameCtx = canvas.getContext("2d");

let gameRunning = false, gamePaused = false;
let gameScore = 0, gameSpeed = 0, spawnTimer = 0, shootTimer = 0;
let frameCount = 0, screenShake = 0;
let player = { x:0, y:0, w:40, h:50, targetX:0, targetY:0, alive:true };
let asteroids = [], playerBullets = [], particles = [], bgStars = [];
let boss = null, bossBullets = [], nextBossScore = 0, bossDefeated = 0;
let enemyBullets = [];
let rafId = null, lastTime = 0;

function resizeCanvas(){
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width * (window.devicePixelRatio || 1);
  canvas.height = r.height * (window.devicePixelRatio || 1);
}
window.addEventListener("resize", () => { if(gameRunning) resizeCanvas(); });

function initBgStars(){
  bgStars = [];
  for(let i = 0; i < 80; i++){
    bgStars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 0.5, speed: Math.random() * 2 + 1, alpha: Math.random() * 0.7 + 0.3 });
  }
}

function startGame(){
  showScreen("game");
  setTimeout(() => {
    resizeCanvas();
    initBgStars();
    gameRunning = true; gamePaused = false;
    gameScore = 0; gameSpeed = DIFF[App.difficulty].startSpeed;
    spawnTimer = 0; shootTimer = 0; frameCount = 0; screenShake = 0;
    asteroids = []; playerBullets = []; particles = []; enemyBullets = [];
    boss = null; bossBullets = []; bossDefeated = 0;
    nextBossScore = BOSS_CONFIG[App.difficulty].spawnScore;
    player.x = canvas.width / 2; player.y = canvas.height - 200;
    player.targetX = player.x; player.targetY = player.y; player.alive = true;
    document.getElementById("boss-bar").classList.remove("show");
    document.getElementById("hud-diff").textContent = "[" + App.difficulty + "]";
    document.getElementById("hud-diff").style.color = DIFF[App.difficulty].color;
    updateHUD();
    if(rafId) cancelAnimationFrame(rafId);
    lastTime = performance.now();
    rafId = requestAnimationFrame(gameLoop);
  }, 50);
}

function updateHUD(){
  document.getElementById("hud-score").textContent = "Score: " + gameScore;
  document.getElementById("hud-best").textContent = "Best: " + (App.bestScores[App.difficulty] || 0);
}

function handleMove(clientX, clientY){
  const r = canvas.getBoundingClientRect();
  const scaleX = canvas.width / r.width;
  const scaleY = canvas.height / r.height;
  player.targetX = (clientX - r.left) * scaleX;
  player.targetY = (clientY - r.top) * scaleY;
}
canvas.addEventListener("touchstart", e => { e.preventDefault(); if(e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
canvas.addEventListener("touchmove", e => { e.preventDefault(); if(e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
canvas.addEventListener("mousemove", e => handleMove(e.clientX, e.clientY));

function gameLoop(now){
  if(!gameRunning) return;
  const dt = Math.min(50, now - lastTime);
  lastTime = now;
  if(!gamePaused) update(dt);
  render();
  rafId = requestAnimationFrame(gameLoop);
}

function update(dt){
  frameCount++;
  const cfg = DIFF[App.difficulty];
  gameSpeed = cfg.startSpeed + Math.floor(gameScore / 500) * 0.5;

  player.x += (player.targetX - player.x) * 0.2;
  player.y += (player.targetY - player.y) * 0.2;
  player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
  player.y = Math.max(40, Math.min(canvas.height - 20, player.y));

  shootTimer++;
  if(shootTimer >= cfg.shootCooldown){
    shootTimer = 0;
    const pbx = player.x, pby = player.y - 40;
    playerBullets.push({ x:pbx, y:pby, vy:-14, dead:false });
    const skin = App.skinColors;
    for(let i = 0; i < 6; i++){
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 4;
      particles.push({ x: pbx, y: pby + 10, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 2, life: 12, maxLife: 12, size: 2 + Math.random() * 3, color: "rgba(" + skin.glow + ",1)" });
    }
    Audio.shoot();
  }
  playerBullets.forEach(b => { b.y += b.vy; if(b.y < -20) b.dead = true; });
  playerBullets = playerBullets.filter(b => !b.dead);

  spawnTimer++;
  const spawnRate = Math.max(cfg.spawnMin, cfg.spawnBase - Math.floor(gameScore / 100));
  if(spawnTimer >= spawnRate && asteroids.length < cfg.maxAsteroids && !boss){
    spawnTimer = 0;
    const size = 20 + Math.random() * 30;
    const ec = ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)];
    asteroids.push({ color: ec.c1, color2: ec.c2, color3: ec.c3, x: Math.random() * (canvas.width - size * 2) + size, y: -size, r: size, vy: gameSpeed * (0.8 + Math.random() * 0.5), vx: (Math.random() - 0.5) * 1.5, rot: 0, rotSpeed: 0, hp: cfg.asteroidHp, maxHp: cfg.asteroidHp, hitFlash: 0, dead: false, shootTimer: Math.floor(Math.random() * 50) + 30 });
  }
  asteroids.forEach(a => {
    a.y += a.vy; a.x += a.vx;
    if(a.hitFlash > 0) a.hitFlash -= 0.05;
    if(a.x < a.r || a.x > canvas.width - a.r) a.vx *= -1;
    a.shootTimer--;
    if(a.shootTimer <= 0 && a.y > 0 && a.y < canvas.height - 100){
      a.shootTimer = Math.floor(Math.random() * 50) + 30;
      enemyBullets.push({ x: a.x, y: a.y + a.r * 0.5, vx: 0, vy: 7, r: 5, color: a.color || "#ff2244", dead: false });
      Audio.tone(440, 0.06, "square", 0.08);
    }
  });

  playerBullets.forEach(pb => {
    asteroids.forEach(a => {
      if(pb.dead || a.dead) return;
      if(Math.hypot(pb.x - a.x, pb.y - a.y) < a.r + 6){
        pb.dead = true; a.hp--; a.hitFlash = 1; Audio.hit();
        if(a.hp <= 0){
          a.dead = true; gameScore += cfg.destroyBonus;
          for(let i = 0; i < 12; i++){
            particles.push({ x:a.x, y:a.y, vx:(Math.random()-0.5)*8, vy:(Math.random()-0.5)*8, life:30, maxLife:30, size:3 + Math.random()*3, color: i % 2 === 0 ? "#ffaa44" : "#ff6644" });
          }
        }
      }
    });
  });
  asteroids = asteroids.filter(a => !a.dead && a.y < canvas.height + 60);

  playerBullets.forEach(pb => {
    if(pb.dead || !boss || boss.phase !== "fight") return;
    if(Math.abs(pb.x - boss.x) < boss.w/2 && Math.abs(pb.y - boss.y) < boss.h/2){ pb.dead = true; damageBoss(1); }
  });
  playerBullets = playerBullets.filter(b => !b.dead);

  asteroids.forEach(a => {
    if(!player.alive) return;
    if(Math.hypot(a.x - player.x, a.y - player.y) < a.r + 30){ gameOver(); }
  });

  updateBoss(); updateBossBullets(); checkBossSpawn();

  for(let i = enemyBullets.length - 1; i >= 0; i--){
    const b = enemyBullets[i];
    b.x += b.vx; b.y += b.vy;
    if(b.y > canvas.height + 30 || b.y < -30 || b.x < -30 || b.x > canvas.width + 30){ enemyBullets.splice(i, 1); continue; }
    if(player.alive){ if(Math.hypot(b.x - player.x, b.y - player.y) < b.r + 30){ enemyBullets.splice(i, 1); gameOver(); return; } }
  }

  particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life--; });
  particles = particles.filter(p => p.life > 0);
  if(screenShake > 0) screenShake *= 0.9;
  bgStars.forEach(s => { s.y += s.speed; if(s.y > canvas.height){ s.y = 0; s.x = Math.random() * canvas.width; } });
  updateHUD();
}

function render(){
  const ctx = gameCtx;
  ctx.fillStyle = "#05050f"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  let sx = 0, sy = 0;
  if(screenShake > 0.5){ sx = (Math.random()-0.5) * screenShake; sy = (Math.random()-0.5) * screenShake; }
  ctx.save(); ctx.translate(sx, sy);
  bgStars.forEach(s => { ctx.globalAlpha = s.alpha; ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill(); });
  ctx.globalAlpha = 1;
  asteroids.forEach(a => {
    ctx.save(); ctx.translate(a.x, a.y);
    const flash = a.hitFlash > 0.5;
    const c1 = a.color || "#8a2a3a", c2 = a.color2 || "#6a1a2a", c3 = a.color3 || "#3a0a15";
    ctx.shadowColor = "#ff2244"; ctx.shadowBlur = 12;
    ctx.fillStyle = flash ? "#ffffff" : c3;
    ctx.beginPath(); ctx.moveTo(-a.r * 0.5, 0); ctx.lineTo(-a.r * 1.0, -a.r * 0.6); ctx.lineTo(-a.r * 0.9, -a.r * 0.3); ctx.lineTo(-a.r * 0.4, a.r * 0.05); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(a.r * 0.5, 0); ctx.lineTo(a.r * 1.0, -a.r * 0.6); ctx.lineTo(a.r * 0.9, -a.r * 0.3); ctx.lineTo(a.r * 0.4, a.r * 0.05); ctx.closePath(); ctx.fill();
    const wg1 = ctx.createLinearGradient(-a.r, 0, 0, a.r); wg1.addColorStop(0, c3); wg1.addColorStop(1, c2);
    ctx.fillStyle = flash ? "#ffffff" : wg1;
    ctx.beginPath(); ctx.moveTo(-a.r * 0.15, -a.r * 0.2); ctx.lineTo(-a.r * 0.9, a.r * 0.1); ctx.lineTo(-a.r * 0.85, a.r * 0.35); ctx.lineTo(-a.r * 0.3, a.r * 0.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c3; ctx.lineWidth = 1.5; ctx.stroke();
    const wg2 = ctx.createLinearGradient(a.r, 0, 0, a.r); wg2.addColorStop(0, c3); wg2.addColorStop(1, c2);
    ctx.fillStyle = flash ? "#ffffff" : wg2;
    ctx.beginPath(); ctx.moveTo(a.r * 0.15, -a.r * 0.2); ctx.lineTo(a.r * 0.9, a.r * 0.1); ctx.lineTo(a.r * 0.85, a.r * 0.35); ctx.lineTo(a.r * 0.3, a.r * 0.2); ctx.closePath(); ctx.fill();
    ctx.stroke();
    const bodyGrad = ctx.createLinearGradient(-a.r * 0.3, 0, a.r * 0.3, 0); bodyGrad.addColorStop(0, c3); bodyGrad.addColorStop(0.5, c1); bodyGrad.addColorStop(1, c3);
    ctx.fillStyle = flash ? "#ffffff" : bodyGrad;
    ctx.beginPath(); ctx.moveTo(0, a.r * 0.9); ctx.bezierCurveTo(-a.r * 0.25, a.r * 0.5, -a.r * 0.3, -a.r * 0.2, -a.r * 0.25, -a.r * 0.7); ctx.lineTo(a.r * 0.25, -a.r * 0.7); ctx.bezierCurveTo(a.r * 0.3, -a.r * 0.2, a.r * 0.25, a.r * 0.5, 0, a.r * 0.9); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c3; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.shadowBlur = 0;
    const glass = ctx.createLinearGradient(0, -a.r * 0.5, 0, 0); glass.addColorStop(0, "#ff88aa"); glass.addColorStop(0.5, "#440011"); glass.addColorStop(1, "#000000");
    ctx.fillStyle = glass; ctx.beginPath(); ctx.ellipse(0, -a.r * 0.15, a.r * 0.18, a.r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ff2244"; ctx.lineWidth = 1; ctx.stroke();
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 12;
    ctx.fillStyle = flash ? "#ffffff" : "#ff2244";
    ctx.beginPath(); ctx.ellipse(-a.r * 0.08, -a.r * 0.15, a.r * 0.05, a.r * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(a.r * 0.08, -a.r * 0.15, a.r * 0.05, a.r * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#111";
    ctx.fillRect(-a.r * 0.08, a.r * 0.7, a.r * 0.05, a.r * 0.25); ctx.fillRect(a.r * 0.03, a.r * 0.7, a.r * 0.05, a.r * 0.25);
    if(a.hp < a.maxHp){ ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(-a.r * 0.8, -a.r * 1.15, a.r * 1.6, 4); ctx.fillStyle = "#ff4455"; ctx.fillRect(-a.r * 0.8, -a.r * 1.15, a.r * 1.6 * (a.hp / a.maxHp), 4); }
    ctx.restore();
  });
  playerBullets.forEach(b => {
    ctx.save();
    const g = App.skinColors.glow;
    ctx.shadowColor = "rgba(" + g + ",1)"; ctx.shadowBlur = 20;
    ctx.fillStyle = "rgba(" + g + ",1)";
    ctx.beginPath(); ctx.ellipse(b.x, b.y, 3, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.ellipse(b.x, b.y, 1.5, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
  enemyBullets.forEach(b => {
    ctx.save(); ctx.shadowColor = b.color; ctx.shadowBlur = 15; ctx.fillStyle = b.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
  if(player.alive) drawShipWithSkin(ctx, player.x, player.y, 100, 130, App.skinColors);
  drawBoss(); drawBossBullets();
  particles.forEach(p => { ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size); });
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ============ BOSS ============
function checkBossSpawn(){ if(!boss && gameScore >= nextBossScore) spawnBoss(); }
function spawnBoss(){
  const cfg = BOSS_CONFIG[App.difficulty];
  boss = { x: canvas.width / 2, y: -cfg.h, w: cfg.w, h: cfg.h, hp: cfg.hp, maxHp: cfg.hp, vx: cfg.speed, vy: 2.5, phase: "entering", shootTimer: 0, shootCD: cfg.shootCD, bulletSpeed: cfg.bulletSpeed, pattern: cfg.pattern, hitFlash: 0, color: cfg.color, reward: cfg.reward, wingAngle: 0 };
  Audio.tone(80, 0.6, "sawtooth", 0.35); Audio.tone(140, 0.5, "square", 0.25, 0.15);
  toast("⚠️ BOSS PESAWAT MUNCUL! ⚠️", "err", 2500);
  document.getElementById("boss-bar").classList.add("show"); updateBossBar();
}
function updateBoss(){
  if(!boss) return;
  if(boss.phase === "entering"){ boss.y += boss.vy; if(boss.y >= 110){ boss.y = 110; boss.phase = "fight"; } updateBossBar(); return; }
  if(boss.phase === "dying"){
    boss.y -= 1.5; boss.hitFlash = 1; boss.wingAngle += 0.4;
    if(Math.random() < 0.5){ for(let i = 0; i < 4; i++){ particles.push({ x: boss.x + (Math.random()-0.5)*boss.w, y: boss.y + (Math.random()-0.5)*boss.h, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, life: 35, maxLife: 35, size: 4 + Math.random()*4, color: Math.random() < 0.5 ? boss.color : "#ffaa00" }); } }
    if(Math.random() < 0.15) Audio.explode();
    updateBossBar();
    if(boss.y < -150) defeatBossComplete();
    return;
  }
  if(boss.phase === "fight"){
    boss.x += boss.vx;
    if(boss.x < boss.w/2){ boss.x = boss.w/2; boss.vx *= -1; }
    if(boss.x > canvas.width - boss.w/2){ boss.x = canvas.width - boss.w/2; boss.vx *= -1; }
    boss.y = 110 + Math.sin(Date.now()/500) * 20;
    boss.wingAngle += 0.08;
    boss.shootTimer++;
    if(boss.shootTimer >= boss.shootCD){ boss.shootTimer = 0; bossShoot(); }
    if(boss.hitFlash > 0) boss.hitFlash -= 0.06;
    updateBossBar();
  }
}
function bossShoot(){
  if(!boss) return;
  const p = boss.pattern, bs = boss.bulletSpeed, bx = boss.x, by = boss.y + boss.h/2;
  if(p === "single"){ bossBullets.push({ x:bx, y:by, vx:0, vy:bs, r:7, color:boss.color }); Audio.tone(320, 0.08, "square", 0.12); }
  else if(p === "double"){ bossBullets.push({ x:bx - 20, y:by, vx:-0.5, vy:bs, r:7, color:boss.color }); bossBullets.push({ x:bx + 20, y:by, vx: 0.5, vy:bs, r:7, color:boss.color }); Audio.tone(320, 0.08, "square", 0.12); }
  else if(p === "triple"){ bossBullets.push({ x:bx, y:by, vx:-1.8, vy:bs, r:8, color:boss.color }); bossBullets.push({ x:bx, y:by, vx: 0, vy:bs, r:8, color:boss.color }); bossBullets.push({ x:bx, y:by, vx: 1.8, vy:bs, r:8, color:boss.color }); Audio.tone(280, 0.1, "square", 0.15); if(Math.random() < 0.3) bossBullets.push({ x:bx, y:by, vx:0, vy:bs*0.5, r:18, color:"#ffffff", laser:true }); }
}
function updateBossBullets(){
  for(let i = bossBullets.length - 1; i >= 0; i--){
    const b = bossBullets[i];
    b.x += b.vx; b.y += b.vy;
    if(b.y > canvas.height + 50 || b.x < -50 || b.x > canvas.width + 50){ bossBullets.splice(i, 1); continue; }
    if(player.alive){ if(Math.hypot(b.x - player.x, b.y - player.y) < b.r + 30){ bossBullets.splice(i, 1); gameOver(); return; } }
  }
}
function damageBoss(dmg){
  if(!boss || boss.phase !== "fight") return;
  boss.hp -= dmg; boss.hitFlash = 1; Audio.hit();
  for(let i = 0; i < 2; i++){ particles.push({ x: boss.x + (Math.random()-0.5)*boss.w, y: boss.y + (Math.random()-0.5)*boss.h, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, life: 15, maxLife: 15, size: 3, color: "#ffffff" }); }
  if(boss.hp <= 0){ boss.phase = "dying"; gameScore += 150; screenShake = 25; Audio.explode(); }
}
function defeatBossComplete(){
  const reward = boss.reward;
  const cfg = BOSS_CONFIG[App.difficulty];
  bossDefeated++; boss = null; bossBullets = [];
  document.getElementById("boss-bar").classList.remove("show");
  const u = DB.getUser(App.username);
  if(u) DB.updateUser(App.username, { coins: u.coins + reward });
  Audio.coin(); toast("🎉 BOSS KALAH! +" + reward + " koin","gold",3000);
  nextBossScore = gameScore + cfg.spawnScore;
}
function updateBossBar(){
  if(!boss) return;
  const fill = document.getElementById("boss-hp-fill");
  const text = document.getElementById("boss-hp-text");
  const pct = Math.max(0, boss.hp / boss.maxHp) * 100;
  fill.style.width = pct + "%";
  text.textContent = Math.max(0, boss.hp) + " / " + boss.maxHp;
}
function drawBoss(){
  if(!boss) return;
  const ctx = gameCtx, x = boss.x, y = boss.y, w = boss.w, h = boss.h;
  const flash = boss.hitFlash > 0.5, s = w / 100;
  ctx.save();
  ctx.shadowColor = "#ff2244"; ctx.shadowBlur = 30;
  ctx.fillStyle = flash ? "#ffffff" : "#2a0810";
  ctx.beginPath(); ctx.moveTo(x - w * 0.4, y + h * 0.1); ctx.lineTo(x - w * 1.2, y + h * 0.35); ctx.lineTo(x - w * 1.0, y + h * 0.5); ctx.lineTo(x - w * 0.3, y + h * 0.3); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + w * 0.4, y + h * 0.1); ctx.lineTo(x + w * 1.2, y + h * 0.35); ctx.lineTo(x + w * 1.0, y + h * 0.5); ctx.lineTo(x + w * 0.3, y + h * 0.3); ctx.closePath(); ctx.fill();
  const wingGradL = ctx.createLinearGradient(x - w, 0, x, h); wingGradL.addColorStop(0, "#3a0a15"); wingGradL.addColorStop(1, "#8a2a3a");
  ctx.fillStyle = flash ? "#ffffff" : wingGradL;
  ctx.beginPath(); ctx.moveTo(x - w * 0.15, y - h * 0.2); ctx.lineTo(x - w * 0.9, y + h * 0.15); ctx.lineTo(x - w * 0.95, y + h * 0.35); ctx.lineTo(x - w * 0.4, y + h * 0.25); ctx.lineTo(x - w * 0.15, y + h * 0.05); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#ff2244"; ctx.lineWidth = 2; ctx.stroke();
  const wingGradR = ctx.createLinearGradient(x + w, 0, x, h); wingGradR.addColorStop(0, "#3a0a15"); wingGradR.addColorStop(1, "#8a2a3a");
  ctx.fillStyle = flash ? "#ffffff" : wingGradR;
  ctx.beginPath(); ctx.moveTo(x + w * 0.15, y - h * 0.2); ctx.lineTo(x + w * 0.9, y + h * 0.15); ctx.lineTo(x + w * 0.95, y + h * 0.35); ctx.lineTo(x + w * 0.4, y + h * 0.25); ctx.lineTo(x + w * 0.15, y + h * 0.05); ctx.closePath(); ctx.fill();
  ctx.stroke();
  const bodyGrad = ctx.createLinearGradient(x - w * 0.4, 0, x + w * 0.4, 0);
  bodyGrad.addColorStop(0, "#3a0a15"); bodyGrad.addColorStop(0.3, "#8a2a3a"); bodyGrad.addColorStop(0.5, flash ? "#ffffff" : "#cc4455"); bodyGrad.addColorStop(0.7, "#8a2a3a"); bodyGrad.addColorStop(1, "#3a0a15");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath(); ctx.moveTo(x, y + h * 0.55); ctx.bezierCurveTo(x + w * 0.35, y + h * 0.3, x + w * 0.4, y - h * 0.1, x + w * 0.35, y - h * 0.5); ctx.lineTo(x - w * 0.35, y - h * 0.5); ctx.bezierCurveTo(x - w * 0.4, y - h * 0.1, x - w * 0.35, y + h * 0.3, x, y + h * 0.55); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#4a0a1a"; ctx.lineWidth = 3; ctx.stroke();
  ctx.shadowBlur = 0;
  const glassGrad = ctx.createLinearGradient(x, y - h * 0.35, x, y + h * 0.1);
  glassGrad.addColorStop(0, "#ff88aa"); glassGrad.addColorStop(0.5, "#440011"); glassGrad.addColorStop(1, "#000000");
  ctx.fillStyle = glassGrad;
  ctx.beginPath(); ctx.ellipse(x, y - h * 0.1, w * 0.22, h * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ff2244"; ctx.lineWidth = 2; ctx.stroke();
  ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 25;
  ctx.fillStyle = flash ? "#ffffff" : "#ff0022";
  ctx.beginPath(); ctx.ellipse(x - w * 0.1, y - h * 0.1, w * 0.05, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + w * 0.1, y - h * 0.1, w * 0.05, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawBossBullets(){
  const ctx = gameCtx;
  bossBullets.forEach(b => {
    ctx.save(); ctx.shadowColor = b.color; ctx.shadowBlur = b.laser ? 25 : 15; ctx.fillStyle = b.color;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}
// ============ GAME OVER ============
function gameOver(){
  if(!player.alive) return;
  player.alive = false; gameRunning = false;
  Audio.gameOver(); screenShake = 30;
  if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
  const u = DB.getUser(App.username);
  if(u){
    const best = u.bestScores || {EASY:0,NORMAL:0,HARD:0};
    const isNew = gameScore > (best[App.difficulty] || 0);
    if(isNew) best[App.difficulty] = gameScore;
    DB.updateUser(App.username, { bestScores: best, gamesPlayed: (u.gamesPlayed || 0) + 1 });
  }
  setTimeout(() => {
    document.getElementById("go-mode").textContent = "[" + App.difficulty + "]";
    document.getElementById("go-mode").style.color = DIFF[App.difficulty].color;
    document.getElementById("go-score").textContent = gameScore;
    const u2 = DB.getUser(App.username);
    const best = u2 ? (u2.bestScores[App.difficulty] || 0) : 0;
    const isNewBest = gameScore >= best && gameScore > 0;
    document.getElementById("go-best-container").innerHTML = isNewBest ? '<div class="new-best">🏆 REKOR BARU!</div>' : '<div class="best-label">Best: ' + best + '</div>';
    showScreen("gameover"); updateCoinDisplay();
  }, 800);
}
document.getElementById("btn-pause").onclick = () => { if(!gameRunning) return; Audio.click(); gamePaused = true; showScreen("pause"); };
document.getElementById("btn-resume").onclick = () => { Audio.click(); gamePaused = false; showScreen("game"); lastTime = performance.now(); };
document.getElementById("btn-restart").onclick = () => { Audio.click(); showScreen("game"); setTimeout(startGame, 20); };
document.getElementById("btn-quit").onclick = () => { Audio.click(); gameRunning = false; gamePaused = false; if(rafId){ cancelAnimationFrame(rafId); rafId = null; } showScreen("menu"); updateCoinDisplay(); drawMenuShip(); };
document.getElementById("btn-again").onclick = () => { Audio.click(); startGame(); };
document.getElementById("btn-gomenu").onclick = () => { Audio.click(); showScreen("menu"); updateCoinDisplay(); drawMenuShip(); };

// ============================================================
// ==================== ADMIN PANEL ==========================
// ============================================================
function refreshAdminPanel(){
  const users = DB.loadUsers();
  const keys = Object.keys(users);
  const pending = DB.getPendingTopups();
  let totalCoins = 0, totalGames = 0;
  keys.forEach(k => { totalCoins += (users[k].coins || 0); totalGames += (users[k].gamesPlayed || 0); });
  document.getElementById("stat-total-users").textContent = keys.length;
  document.getElementById("stat-total-coins").textContent = totalCoins;
  document.getElementById("stat-pending").textContent = pending.length;
  document.getElementById("stat-total-games").textContent = totalGames;
  const reqWrap = document.getElementById("topup-requests");
  if(pending.length === 0){ reqWrap.innerHTML = '<div class="empty-state">Belum ada request</div>'; }
  else {
    reqWrap.innerHTML = "";
    pending.forEach(t => {
      const div = document.createElement("div");
      div.className = "topup-req";
      div.innerHTML = '<div class="head"><span class="user">' + t.username + '</span><span class="pkg">🪙 ' + t.coins + ' — ' + t.price + '</span></div><div style="font-size:11px;color:#8a8aa0">Nama: <b style="color:#fff">' + t.senderName + '</b>' + (t.note ? ' — "' + t.note + '"' : '') + '</div><div class="actions"><button style="background:#22aa66" data-act="approve" data-id="' + t.id + '">✓ APPROVE</button><button style="background:#cc3344" data-act="reject" data-id="' + t.id + '">✗ TOLAK</button></div>';
      reqWrap.appendChild(div);
    });
    reqWrap.querySelectorAll("button[data-act]").forEach(b => {
      b.onclick = () => {
        const id = b.dataset.id, act = b.dataset.act;
        if(act === "approve"){
          const t = DB.loadTopups().find(x => x.id === id);
          if(t){ const u = DB.getUser(t.username); if(u) DB.updateUser(t.username, { coins: (u.coins || 0) + t.coins }); DB.updateTopup(id, { status: "approved", approvedAt: Date.now() }); toast("✓ +" + t.coins + " koin ke " + t.username, "success", 3000); }
        } else { DB.updateTopup(id, { status: "rejected", rejectedAt: Date.now() }); toast("✗ Top up ditolak", "err", 2500); }
        refreshAdminPanel();
      };
    });
  }
  const tbody = document.getElementById("user-list");
  if(keys.length === 0){ tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Belum ada akun</td></tr>'; }
  else {
    tbody.innerHTML = "";
    keys.forEach(k => {
      const u = users[k];
      const bs = u.bestScores || {EASY:0,NORMAL:0,HARD:0};
      const bestMax = Math.max(bs.EASY || 0, bs.NORMAL || 0, bs.HARD || 0);
      const tr = document.createElement("tr");
      tr.innerHTML = '<td class="uname">' + k + '</td><td class="coins">' + (u.coins || 0) + '</td><td>' + bestMax + '</td><td>' + (u.gamesPlayed || 0) + '</td><td class="actions"><button class="mini-btn mini-btn-detail" data-u="' + k + '" data-act="detail">📋</button><button class="mini-btn mini-btn-edit" data-u="' + k + '" data-act="coin">🪙</button><button class="mini-btn mini-btn-add" data-u="' + k + '" data-act="addcoin">＋</button><button class="mini-btn mini-btn-del" data-u="' + k + '" data-act="del">🗑</button></td>';
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll("button[data-act]").forEach(b => {
      b.onclick = () => {
        const u = b.dataset.u, act = b.dataset.act;
        if(act === "detail") showUserDetail(u);
        else if(act === "coin") openCoinModal(u);
        else if(act === "addcoin") addCoins(u, 100);
        else if(act === "del"){ if(confirm("Hapus akun " + u + "?")){ DB.deleteUser(u); refreshAdminPanel(); toast("Akun dihapus", "err"); } }
      };
    });
  }
}
function showUserDetail(u)
{
  const user = DB.getUser(u); if(!user) return;
  const bs = user.bestScores || {EASY:0,NORMAL:0,HARD:0};
  const owned = (user.ownedSkins || ["default"]).join(", ");
  const created = new Date(user.createdAt || Date.now()).toLocaleString("id-ID");
  document.getElementById("detail-content").innerHTML = '<div>Username: <b>' + u + '</b></div><div>Password: <b>' + user.password + '</b></div><div>Koin: <span class="gold-val">' + (user.coins || 0) + '</span></div><div>Best EASY: <b>' + (bs.EASY || 0) + '</b></div><div>Best NORMAL: <b>' + (bs.NORMAL || 0) + '</b></div><div>Best HARD: <b>' + (bs.HARD || 0) + '</b></div><div>Total Main: <b>' + (user.gamesPlayed || 0) + '</b></div><div>Skin Dimiliki: <b>' + owned + '</b></div><div>Skin Dipakai: <b>' + (user.equippedSkin || "default") + '</b></div><div>Dibuat: <b>' + created + '</b></div>';
  document.getElementById("detail-modal").classList.add("show");
}
function openCoinModal(u){
  const user = DB.getUser(u); if(!user) return;
  document.getElementById("modal-username").value = u;
  document.getElementById("modal-coins").value = user.coins || 0;
  document.getElementById("coin-modal").classList.add("show");
}
function addCoins(u, amount){
  const user = DB.getUser(u); if(!user) return;
  DB.updateUser(u, { coins: (user.coins || 0) + amount });
  toast("✓ +" + amount + " koin ke " + u, "success");
  refreshAdminPanel();
}
document.getElementById("btn-modal-cancel").onclick = () => { document.getElementById("coin-modal").classList.remove("show"); };
document.getElementById("btn-modal-save").onclick = () => { const u = document.getElementById("modal-username").value; const c = parseInt(document.getElementById("modal-coins").value) || 0; DB.updateUser(u, { coins: c }); toast("✓ Koin " + u + " diupdate jadi " + c, "success"); document.getElementById("coin-modal").classList.remove("show"); refreshAdminPanel(); };
document.getElementById("btn-detail-close").onclick = () => { document.getElementById("detail-modal").classList.remove("show"); };
document.getElementById("btn-create-user").onclick = () => { const u = document.getElementById("new-user").value.trim(); const p = document.getElementById("new-pass").value; const c = parseInt(document.getElementById("new-coins").value) || 0; if(u.length < 3 || p.length < 3){ toast("Username/password min 3 karakter", "err"); return; } if(!DB.createUser(u, p, c)){ toast("Username sudah ada", "err"); return; } toast("✓ Akun " + u + " dibuat dengan " + c + " koin", "success"); document.getElementById("new-user").value = ""; document.getElementById("new-pass").value = ""; document.getElementById("new-coins").value = 0; refreshAdminPanel(); };
document.getElementById("btn-wipe-all").onclick = () => { if(confirm("⚠️ HAPUS SEMUA DATA? Nggak bisa dibalikin!")){ if(confirm("Yakin beneran? Ini terakhir!")){ localStorage.removeItem("sd_users_db"); localStorage.removeItem("sd_topup_db"); localStorage.removeItem("sd_session"); toast("Semua data dihapus!", "err", 3000); refreshAdminPanel(); } } };
document.getElementById("btn-admin-logout").onclick = () => { App.isAdmin = false; App.username = ""; showScreen("login"); document.getElementById("login-user").value = ""; document.getElementById("login-pass").value = ""; toast("Logout admin", "", 1500); };

// ============ INIT ============
drawMenuShip();

// ============================================================
// MABAR PATCH — Broadcast & Render
// ============================================================
setInterval(function(){
  if(!window.MP || !MP.active) return;
  try { if(typeof player !== "undefined") mpBroadcast(player.x, player.y, App.equippedSkin); } catch(e){}
}, 50);

let _lastB = 0;
setInterval(function(){
  if(!window.MP || !MP.active || !window.mpShoot) return;
  try {
    if(typeof playerBullets !== "undefined" && playerBullets.length > _lastB){
      for(let i = _lastB; i < playerBullets.length; i++){
        const b = playerBullets[i];
        if(b && !b._mp){ b._mp = true; mpShoot(b.x, b.y, 0, b.vy || -14, "rgba(" + App.skinColors.glow + ",1)"); }
      }
    }
    _lastB = (typeof playerBullets !== "undefined") ? playerBullets.length : 0;
  } catch(e){}
}, 30);

setInterval(function(){
  if(!window.MP || !MP.active) return;
  try {
    MP.enemyBulletsMP.forEach(function(b){ b.x += b.vx; b.y += b.vy; });
    MP.enemyBulletsMP = MP.enemyBulletsMP.filter(function(b){ return b.y > -50 && b.y < canvas.height + 50; });
    for(let i = MP.enemyBulletsMP.length - 1; i >= 0; i--){
      const b = MP.enemyBulletsMP[i];
      if(player.alive && Math.hypot(b.x - player.x, b.y - player.y) < 30){
        MP.enemyBulletsMP.splice(i, 1); gameOver(); return;
      }
    }
  } catch(e){}
}, 30);

// Override render biar gambar pemain lain
if(typeof render === "function"){
  const _old = render;
  render = function(){
    _old();
    if(!window.MP || !MP.active) return;
    const ctx = gameCtx;
    for(const id in MP.otherPlayers){
      const op = MP.otherPlayers[id];
      if(!op || !op.x) continue;
      ctx.save(); ctx.globalAlpha = 0.85;
      drawShipWithSkin(ctx, op.x, op.y, 100, 130, SKINS[op.skin]||SKINS.default);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ff66cc"; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
      ctx.fillText(op.name||"Player", op.x, op.y - 80);
      ctx.restore();
    }
    MP.enemyBulletsMP.forEach(function(b){
      ctx.save(); ctx.shadowColor = b.color; ctx.shadowBlur = 15; ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
  };
}

console.log("[MABAR] Patch loaded ✓");
