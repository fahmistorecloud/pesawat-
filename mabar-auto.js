// ============================================================
// MABAR AUTO-INJECT — Bikin tombol & screen otomatis
// ============================================================
window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("[MABAR-AUTO] Loading...");

    // === TOMBOL MABAR ===
    const menuButtons = document.querySelector("#menu-screen .menu-buttons");
    if(menuButtons && !document.getElementById("btn-multiplayer")){
      const btn = document.createElement("button");
      btn.className = "btn btn-primary";
      btn.id = "btn-multiplayer";
      btn.style.background = "linear-gradient(135deg,#ff00aa,#7700ff)";
      btn.textContent = "🎮 MABAR";
      const shopBtn = document.getElementById("btn-shop");
      if(shopBtn && shopBtn.parentNode === menuButtons){
        shopBtn.insertAdjacentElement("afterend", btn);
      } else {
        menuButtons.appendChild(btn);
      }
      console.log("[MABAR-AUTO] Tombol ditambah");
    }

    // === SCREEN MABAR ===
    if(!document.getElementById("mabar-screen")){
      const gameScreen = document.getElementById("game-screen");
      if(gameScreen){
        const ms = document.createElement("div");
        ms.id = "mabar-screen";
        ms.className = "screen";
        ms.innerHTML = '<h2 style="color:#ff66cc;margin-top:20px">🎮 MABAR</h2>' +
          '<div class="form-card" style="margin-top:16px">' +
            '<div class="input-group"><label>Nama</label><input type="text" id="mp-name" placeholder="Pilot" maxlength="16"></div>' +
            '<button class="btn btn-primary" id="btn-create-room">🏠 BUAT ROOM</button>' +
            '<button class="btn btn-success" id="btn-show-join">🔗 JOIN ROOM</button>' +
            '<div id="join-form" style="display:none;margin-top:12px">' +
              '<div class="input-group"><label>Kode Room</label><input type="text" id="mp-room" placeholder="ABCD" maxlength="6" style="text-transform:uppercase"></div>' +
              '<button class="btn btn-success" id="btn-join-room">MASUK</button>' +
            '</div>' +
            '<div id="mp-status" style="margin-top:14px;text-align:center;font-size:13px;color:#8a8aa0"></div>' +
            '<div id="mp-room-display" style="display:none;margin-top:14px;text-align:center">' +
              '<div style="font-size:11px;color:#8a8aa0">KODE ROOM</div>' +
              '<div id="mp-room-code" style="font-size:38px;font-weight:900;color:#ff66cc;letter-spacing:6px;font-family:monospace">----</div>' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-secondary" style="max-width:340px;margin-top:16px" id="btn-mabar-back">← KEMBALI</button>';
        gameScreen.parentNode.insertBefore(ms, gameScreen);
        console.log("[MABAR-AUTO] Screen ditambah");
      }
    }

    // === DAFTARIN SCREEN ===
    if(typeof screens === "object" && !screens.mabar){
      screens.mabar = document.getElementById("mabar-screen");
    }

    // === HANDLER TOMBOL MABAR ===
    const btn = document.getElementById("btn-multiplayer");
    if(btn){
      btn.onclick = function(){
        try { Audio.init(); Audio.resume(); Audio.click(); } catch(e){}
        const st = document.getElementById("mp-status"); if(st) st.textContent = "";
        const jf = document.getElementById("join-form"); if(jf) jf.style.display = "none";
        const rd = document.getElementById("mp-room-display"); if(rd) rd.style.display = "none";
        const nm = document.getElementById("mp-name"); if(nm) nm.value = (typeof App !== "undefined" && App.username) || "";
        if(typeof showScreen === "function") showScreen("mabar");
      };
      console.log("[MABAR-AUTO] Handler tombol dipasang");
    }

    // === HANDLER KEMBALI ===
    const btnBack = document.getElementById("btn-mabar-back");
    if(btnBack){
      btnBack.onclick = function(){
        try { Audio.click(); } catch(e){}
        if(window.mpLeaveRoom) window.mpLeaveRoom();
        if(typeof showScreen === "function") showScreen("menu");
      };
    }

    // === HANDLER SHOW JOIN ===
    const btnShowJoin = document.getElementById("btn-show-join");
    if(btnShowJoin){
      btnShowJoin.onclick = function(){
        try { Audio.click(); } catch(e){}
        const jf = document.getElementById("join-form");
        if(jf) jf.style.display = (jf.style.display === "none") ? "block" : "none";
      };
    }

    // === HANDLER BUAT ROOM ===
    const btnCreate = document.getElementById("btn-create-room");
    if(btnCreate){
      btnCreate.onclick = async function(){
        try { Audio.click(); } catch(e){}
        const name = (document.getElementById("mp-name").value || "").trim() || "Player";
        if(!window.mpCreateRoom){ alert("Tunggu Firebase loading..."); return; }
        document.getElementById("mp-status").textContent = "Membuat room...";
        try {
          const room = await window.mpCreateRoom(name);
          document.getElementById("mp-room-code").textContent = room;
          document.getElementById("mp-room-display").style.display = "block";
          document.getElementById("mp-status").textContent = "✓ Room dibuat! Share kode ke temen.";
          setTimeout(function(){ if(typeof startGame === "function") startGame(); }, 800);
        } catch(e){ document.getElementById("mp-status").textContent = "✗ " + e.message; }
      };
    }

    // === HANDLER JOIN ROOM ===
    const btnJoin = document.getElementById("btn-join-room");
    if(btnJoin){
      btnJoin.onclick = async function(){
        try { Audio.click(); } catch(e){}
        const name = (document.getElementById("mp-name").value || "").trim() || "Player";
        const room = (document.getElementById("mp-room").value || "").trim().toUpperCase();
        if(room.length < 4){ document.getElementById("mp-status").textContent = "Kode min 4 huruf"; return; }
        if(!window.mpJoinRoom){ alert("Tunggu Firebase loading..."); return; }
        document.getElementById("mp-status").textContent = "Join room " + room + "...";
        const r = await window.mpJoinRoom(room, name);
        if(!r.ok){ document.getElementById("mp-status").textContent = "✗ " + r.msg; return; }
        document.getElementById("mp-status").textContent = "✓ Berhasil join!";
        setTimeout(function(){ if(typeof startGame === "function") startGame(); }, 800);
      };
    }

    console.log("[MABAR-AUTO] Selesai ✓");
  }, 1000);
});