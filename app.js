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

/* 🔐 LOGIN GLOBAL */
window.login = async function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) return alert("Preenche tudo");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login feito!");
  } catch (e) {
    console.error(e);
    alert("Erro login");
  }
};

window.logout = async function () {
  await signOut(auth);
};

/* 👑 CHECK ADMIN */
async function checkAdmin(uid) {
  const q = query(collection(db, "admins"), where("uid", "==", uid));
  const res = await getDocs(q);

  isAdmin = !res.empty;

  console.log("Admin:", isAdmin);

  updateUI();
}

/* 🎨 UPDATE UI */
function updateUI() {
  document.querySelectorAll(".admin").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
}

/* 🔄 AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    checkAdmin(user.uid);
  } else {
    currentUser = null;
    isAdmin = false;
    updateUI();
  }
});

/* 📢 UPDATES */
window.addUpdate = async function () {
  if (!isAdmin) return;

  const text = document.getElementById("updateText").value;

  await addDoc(collection(db, "updates"), {
    text,
    date: new Date()
  });

  loadUpdates();
};

async function loadUpdates() {
  const data = await getDocs(collection(db, "updates"));
  const list = document.getElementById("updatesList");
  if (!list) return;

  list.innerHTML = "";

  data.forEach(doc => {
    list.innerHTML += `<div class="card">${doc.data().text}</div>`;
  });
}

loadUpdates();

/* ⚔️ PROGRESS */
window.addProgress = async function () {
  if (!isAdmin) return;

  await addDoc(collection(db, "progress"), {
    boss: bossName.value,
    pulls: pulls.value,
    killed: killed.checked
  });

  loadProgress();
};

async function loadProgress() {
  const data = await getDocs(collection(db, "progress"));
  const list = document.getElementById("progressList");
  if (!list) return;

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

/* 💰 LOOT */
window.addLoot = async function () {
  if (!isAdmin) return;

  await addDoc(collection(db, "loot"), {
    player: player.value,
    loot: lootItem.value,
    date: new Date()
  });

  loadLoot();
};

async function loadLoot() {
  const data = await getDocs(collection(db, "loot"));
  const list = document.getElementById("lootList");
  if (!list) return;

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

/* 🎫 SUPPORT */
window.sendTicket = async function () {
  await addDoc(collection(db, "tickets"), {
    text: ticketText.value,
    date: new Date()
  });

  alert("Ticket enviado!");
};
