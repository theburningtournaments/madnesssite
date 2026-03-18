// app.js
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;
let isAdmin = false;

/* ========================= */
/* 🔐 LOGIN */
window.login = async function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) { alert("Preenche email e password"); return; }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ LOGIN OK:", userCredential.user);

    currentUser = userCredential.user;
    isAdmin = true; // Qualquer login válido é admin
    updateUI();

  } catch (e) {
    console.error("❌ ERRO:", e);
    alert("Erro login: " + e.code);
  }
};

/* 🔓 LOGOUT */
window.logout = async function () {
  await signOut(auth);
  currentUser = null;
  isAdmin = false;
  updateUI();
  alert("Logout feito!");
};

/* ========================= */
/* 🎨 UPDATE UI */
function updateUI() {
  document.querySelectorAll(".admin").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
}

/* ========================= */
/* 🔄 AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    isAdmin = true;
    updateUI();
  } else {
    currentUser = null;
    isAdmin = false;
    updateUI();
  }
});

/* ========================= */
/* 📢 UPDATES */
window.addUpdate = async function () {
  if (!isAdmin) return alert("Sem permissão");

  const text = document.getElementById("updateText").value;
  if (!text) return alert("Escreve algo");

  await addDoc(collection(db, "updates"), { text, date: new Date() });
  document.getElementById("updateText").value = "";
  loadUpdates();
};

async function loadUpdates() {
  const list = document.getElementById("updatesList");
  if (!list) return;

  const data = await getDocs(collection(db, "updates"));
  list.innerHTML = "";
  data.forEach(doc => { list.innerHTML += `<div class="card">${doc.data().text}</div>`; });
}

loadUpdates();

/* ========================= */
/* ⚔️ PROGRESS */
window.addProgress = async function () {
  if (!isAdmin) return alert("Sem permissão");

  const boss = document.getElementById("bossName").value;
  const pulls = document.getElementById("pulls").value;
  const killed = document.getElementById("killed").checked;
  if (!boss) return alert("Boss obrigatório");

  await addDoc(collection(db, "progress"), { boss, pulls, killed });
  loadProgress();
};

async function loadProgress() {
  const list = document.getElementById("progressList");
  if (!list) return;

  const data = await getDocs(collection(db, "progress"));
  list.innerHTML = "";
  data.forEach(doc => {
    const d = doc.data();
    list.innerHTML += `<div class="card">${d.boss} - ${d.pulls} pulls - ${d.killed ? "Dead" : "Alive"}</div>`;
  });
}

loadProgress();

/* ========================= */
/* 💰 LOOT */
window.addLoot = async function () {
  if (!isAdmin) return alert("Sem permissão");

  const player = document.getElementById("player").value;
  const loot = document.getElementById("lootItem").value;
  if (!player || !loot) return alert("Preenche tudo");

  await addDoc(collection(db, "loot"), { player, loot, date: new Date() });
  loadLoot();
};

async function loadLoot() {
  const list = document.getElementById("lootList");
  if (!list) return;

  const data = await getDocs(collection(db, "loot"));
  list.innerHTML = "";
  data.forEach(doc => {
    const d = doc.data();
    list.innerHTML += `<div class="card">${d.player} recebeu ${d.loot}</div>`;
  });
}

loadLoot();

/* ========================= */
/* 🎫 SUPPORT */
window.sendTicket = async function () {
  const text = document.getElementById("ticketText").value;
  if (!text) return alert("Escreve algo");

  await addDoc(collection(db, "tickets"), { text, date: new Date() });
  document.getElementById("ticketText").value = "";
  alert("Ticket enviado!");
};
