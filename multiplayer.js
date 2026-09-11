// ============================================================
// MULTIPLAYER — Firebase Realtime Database
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, onDisconnect, remove, update, push, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcgrdbjNbDT7uX6Gt-mMCVMAa_Ex4yI30",
  authDomain: "pesawat-tempur-29d7d.firebaseapp.com",
  databaseURL: "https://pesawat-tempur-29d7d-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "pesawat-tempur-29d7d",
  storageBucket: "pesawat-tempur-29d7d.firebasestorage.app",
  messagingSenderId: "157321916918",
  appId: "1:157321916918:web:021b2be110b91b030b57d7"
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

window.MP = { active:false, roomCode:"", playerId:"", otherPlayers:{}, enemyBulletsMP:[], lastBroadcast:0 };

function mpId(){ return Math.random().toString(36).slice(2,8); }
function mpRoom(){ return Math.random().toString(36).slice(2,6).toUpperCase(); }

window.mpCreateRoom = async function(name){
  const room = mpRoom(), pid = mpId();
  MP.active=true; MP.roomCode=room; MP.playerId=pid; MP.otherPlayers={};
  const pRef = ref(rtdb, "rooms/"+room+"/players/"+pid);
  await set(pRef, {name:name||"Player", x:0, y:0, skin:"default"});
  onDisconnect(pRef).remove();
  onValue(ref(rtdb, "rooms/"+room+"/players"), (s)=>{
    const d = s.val()||{}; MP.otherPlayers={};
    for(const id in d){ if(id!==MP.playerId) MP.otherPlayers[id]=d[id]; }
  });
  mpListen();
  return room;
};

window.mpJoinRoom = async function(code, name){
  const room = code.toUpperCase().trim();
  if(room.length<4) return {ok:false, msg:"Kode invalid"};
  const pid = mpId();
  MP.active=true; MP.roomCode=room; MP.playerId=pid; MP.otherPlayers={};
  const pRef = ref(rtdb, "rooms/"+room+"/players/"+pid);
  await set(pRef, {name:name||"Player", x:0, y:0, skin:"default"});
  onDisconnect(pRef).remove();
  onValue(ref(rtdb, "rooms/"+room+"/players"), (s)=>{
    const d = s.val()||{}; MP.otherPlayers={};
    for(const id in d){ if(id!==MP.playerId) MP.otherPlayers[id]=d[id]; }
  });
  mpListen();
  return {ok:true, room};
};

window.mpBroadcast = function(x,y,skin){
  if(!MP.active) return;
  const now = Date.now();
  if(now-MP.lastBroadcast<50) return;
  MP.lastBroadcast = now;
  update(ref(rtdb, "rooms/"+MP.roomCode+"/players/"+MP.playerId), {x,y,skin}).catch(()=>{});
};

window.mpShoot = function(x,y,vx,vy,color){
  if(!MP.active) return;
  const r = push(ref(rtdb, "rooms/"+MP.roomCode+"/bullets"));
  set(r, {owner:MP.playerId,x,y,vx,vy,color:color||"#0ff"});
  setTimeout(()=>remove(r).catch(()=>{}), 2000);
};

function mpListen(){
  const bRef = ref(rtdb, "rooms/"+MP.roomCode+"/bullets");
  onChildAdded(bRef, (s)=>{
    const b = s.val();
    if(!b || b.owner===MP.playerId) return;
    MP.enemyBulletsMP.push({id:s.key,x:b.x,y:b.y,vx:b.vx,vy:b.vy,color:b.color});
  });
  onChildRemoved(bRef, (s)=>{ MP.enemyBulletsMP = MP.enemyBulletsMP.filter(b=>b.id!==s.key); });
}

window.mpLeaveRoom = function(){
  if(!MP.active) return;
  remove(ref(rtdb, "rooms/"+MP.roomCode+"/players/"+MP.playerId)).catch(()=>{});
  MP.active=false; MP.roomCode=""; MP.playerId=""; MP.otherPlayers={}; MP.enemyBulletsMP=[];
};

console.log("✓ Multiplayer ready");