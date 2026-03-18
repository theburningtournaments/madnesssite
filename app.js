import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;
let isAdmin = false;

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) return alert("Preenche email e password");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;
    isAdmin = true;
    updateUI();
  } catch (e) {
    alert("Erro login: " + e.code);
  }
}

async function logout() {
  await signOut(auth);
  currentUser = null;
  isAdmin = false;
  updateUI();
}

function updateUI() {
  document.querySelectorAll(".admin").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.style.display = isAdmin ? "none" : "flex";
}

onAuthStateChanged(auth, (user) => {
  if (user) { currentUser = user; isAdmin = true; }
  else { currentUser = null; isAdmin = false; }
  updateUI();
});

/* ===== INFO ===== */
async function addUpdate() {
  if (!isAdmin) return alert("Sem permissão");
  const text = document.getElementById("updateText").value;
  if (!text) return alert("Escreve algo");
  await addDoc(collection(db, "updates"), { text, date: new Date() });
  document.getElementById("updateText").value = "";
  loadUpdates();
}

async function loadUpdates() {
  const list = document.getElementById("updatesList");
  if (!list) return;
  const snapshot = await getDocs(collection(db, "updates"));
  list.innerHTML = "";
  snapshot.forEach(doc => list.innerHTML += `<div class="card">${doc.data().text}</div>`);
}

/* ===== PROGRESS ===== */
async function addProgress() {
  if (!isAdmin) return alert("Sem permissão");
  const raid = document.getElementById("raidSelect").value;
  const boss = document.getElementById("bossName").value;
  const pulls = parseInt(document.getElementById("pulls").value) || 0;
  const killed = document.getElementById("killed").checked;
  if (!raid || !boss) return alert("Preenche raid e boss");
  await addDoc(collection(db, "progress"), { raid, boss, pulls, killed });
  loadProgress();
}

async function loadProgress() {
  const raid = document.getElementById("raidSelect")?.value;
  if (!raid) return;
  const list = document.getElementById("progressList");
  const summary = document.getElementById("progressSummary");
  if (!list || !summary) return;
  list.innerHTML = ""; summary.innerHTML = "";
  const snapshot = await getDocs(collection(db, "progress"));
  let bosses = [], totalPulls = 0, downCount = 0;
  snapshot.forEach(doc => {
    const d = doc.data();
    if (d.raid === raid) {
      bosses.push(d);
      totalPulls += d.pulls;
      if (d.killed) downCount++;
      list.innerHTML += `<div class="card">${d.boss} - ${d.pulls} pulls - ${d.killed ? "Dead" : "Alive"}</div>`;
    }
  });
  summary.innerHTML = `Bosses Down: ${downCount}/${bosses.length} | Total Pulls: ${totalPulls}`;
}

/* ===== LOOT ===== */
async function addLoot() {
  if (!isAdmin) return alert("Sem permissão");
  const raidDate = document.getElementById("lootDate").value;
  const player = document.getElementById("player").value;
  const loot = document.getElementById("lootItem").value;
  if (!raidDate || !player || !loot) return alert("Preenche tudo");
  await addDoc(collection(db, "loot"), { raidDate, player, loot });
  loadLoot();
}

async function loadLoot() {
  const list = document.getElementById("lootList");
  if (!list) return;
  const snapshot = await getDocs(query(collection(db, "loot"), orderBy("raidDate","desc")));
  list.innerHTML = "";
  snapshot.forEach(doc => list.innerHTML += `<div class="card">${doc.data().raidDate} - ${doc.data().player} recebeu ${doc.data().loot}</div>`);
}

/* ===== SUPPORT ===== */
async function sendTicket() {
  if (!isAdmin) return alert("Sem permissão");
  const text = document.getElementById("ticketText").value;
  if (!text) return alert("Escreve algo");
  await addDoc(collection(db, "tickets"), { text, date: new Date() });
  document.getElementById("ticketText").value = "";
  loadTickets();
}

async function loadTickets() {
  const list = document.getElementById("ticketsList");
  if (!list) return;
  const snapshot = await getDocs(collection(db, "tickets"));
  list.innerHTML = "";
  snapshot.forEach(doc => list.innerHTML += `<div class="card">${doc.data().text}</div>`);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn")?.addEventListener("click", login);
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("addUpdateBtn")?.addEventListener("click", addUpdate);
  document.getElementById("addProgressBtn")?.addEventListener("click", addProgress);
  document.getElementById("addLootBtn")?.addEventListener("click", addLoot);
  document.getElementById("sendTicketBtn")?.addEventListener("click", sendTicket);

  updateUI();
  loadUpdates();
  loadProgress();
  loadLoot();
  loadTickets();
});
