import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;
let isAdmin = false;

/* 🔐 LOGIN (FIX + DEBUG) */
window.login = async function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Preenche email e password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    console.log("✅ LOGIN OK:", userCredential.user);
    alert("Login feito com sucesso!");

  } catch (e) {
    console.error("❌ ERRO FIREBASE:", e);

    if (e.code === "auth/user-not-found") {
      alert("Utilizador não existe");
    } else if (e.code === "auth/wrong-password") {
      alert("Password errada");
    } else if (e.code === "auth/invalid-email") {
      alert("Email inválido");
    } else if (e.code === "auth/invalid-credential") {
      alert("Credenciais inválidas");
    } else {
      alert("Erro: " + e.code);
    }
  }
};

/* 🔓 LOGOUT */
window.logout = async function () {
  await signOut(auth);
  alert("Logout feito");
};

/* 👑 CHECK ADMIN */
async function checkAdmin(uid) {
  try {
    const q = query(collection(db, "admins"), where("uid", "==", uid));
    const res = await getDocs(q);

    isAdmin = !res.empty;

    console.log("👑 Is Admin:", isAdmin);

    updateUI();

  } catch (e) {
    console.error("Erro ao verificar admin:", e);
  }
}

/* 🎨 CONTROLAR UI ADMIN */
function updateUI() {
  document.querySelectorAll(".admin").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
}

/* 🔄 DETECTAR LOGIN */
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("👤 User logged:", user.email);

    currentUser = user;
    checkAdmin(user.uid);

  } else {
    console.log("🚪 User logged out");

    currentUser = null;
    isAdmin = false;
    updateUI();
  }
});

/* ========================= */
/* 📢 UPDATES */
/* ========================= */

window.addUpdate = async function () {
  if (!isAdmin) return alert("Sem permissão");

  const text = document.getElementById("updateText").value;

  if (!text) return alert("Escreve algo");

  await addDoc(collection(db, "updates"), {
    text,
    date: new Date()
  });

  document.getElementById("updateText").value = "";
  loadUpdates();
};

async function loadUpdates() {
  const list = document.getElementById("updatesList");
  if (!list) return;

  const data = await getDocs(collection(db, "updates"));

  list.innerHTML = "";

  data.forEach(doc => {
    list.innerHTML += `<div class="card">${doc.data().text}</div>`;
  });
}

loadUpdates();

/* ========================= */
/* ⚔️ PROGRESS */
/* ========================= */

window.addProgress = async function () {
  if (!isAdmin) return alert("Sem permissão");

  const boss = document.getElementById("bossName").value;
  const pulls = document.getElementById("pulls").value;
  const killed = document.getElementById("killed").checked;

  if (!boss) return alert("Boss obrigatório");

  await addDoc(collection(db, "progress"), {
    boss,
    pulls,
    killed
  });

  loadProgress();
};

async function loadProgress() {
  const list = document.getElementById("progressList");
  if (!list) return;

  const data = await getDocs(collection(db, "progress"));

  list.innerHTML = "";

  data.forEach(doc => {
    const d = doc.data();

    list.innerHTML += `
      <div class="card">
        ${d.boss} - ${d.pulls} pulls - ${d.killed ? "Dead" : "Alive"}
      </div>
    `;
  });
}

loadProgress();

/* ========================= */
/* 💰 LOOT */
/* ========================= */

window.addLoot = async function () {
  if (!isAdmin) return alert("Sem permissão");

  const player = document.getElementById("player").value;
  const loot = document.getElementById("lootItem").value;

  if (!player || !loot) return alert("Preenche tudo");

  await addDoc(collection(db, "loot"), {
    player,
    loot,
    date: new Date()
  });

  loadLoot();
};

async function loadLoot() {
  const list = document.getElementById("lootList");
  if (!list) return;

  const data = await getDocs(collection(db, "loot"));

  list.innerHTML = "";

  data.forEach(doc => {
    const d = doc.data();

    list.innerHTML += `
      <div class="card">
        ${d.player} recebeu ${d.loot}
      </div>
    `;
  });
}

loadLoot();

/* ========================= */
/* 🎫 SUPPORT */
/* ========================= */

window.sendTicket = async function () {
  const text = document.getElementById("ticketText").value;

  if (!text) return alert("Escreve algo");

  await addDoc(collection(db, "tickets"), {
    text,
    date: new Date()
  });

  document.getElementById("ticketText").value = "";

  alert("Ticket enviado!");
};
