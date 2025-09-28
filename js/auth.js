// js/auth.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const clientRegisterForm = document.getElementById("clientRegisterForm");
if (clientRegisterForm) {
  clientRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const address = document.getElementById("clientAddress").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const password = document.getElementById("clientPassword").value;

    try {
      const uc = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "customers", uc.user.uid), { name, phone, address, email, createdAt: new Date() });
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

const clientLoginForm = document.getElementById("clientLoginForm");
if (clientLoginForm) {
  clientLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("clientLoginEmail").value.trim();
    const password = document.getElementById("clientLoginPassword").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}
