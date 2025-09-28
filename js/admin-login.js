// js/admin-login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("adminLoginForm");
const errorEl = document.getElementById("adminLoginError");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "admin.html";
    } catch (err) {
      if (errorEl) { errorEl.textContent = err.message; errorEl.classList.remove("hidden"); }
    }
  });
}
