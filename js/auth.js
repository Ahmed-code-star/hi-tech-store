// auth.js
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

// تسجيل الأدمن
const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول كأدمن");
      window.location.href = "admin.html";
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  });
}

// تسجيل عميل جديد
const clientRegisterForm = document.getElementById("clientRegisterForm");
if (clientRegisterForm) {
  clientRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("clientEmail").value;
    const password = document.getElementById("clientPassword").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("تم إنشاء الحساب بنجاح");
      window.location.href = "index.html";
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  });
}

// تسجيل دخول العميل
const clientLoginForm = document.getElementById("clientLoginForm");
if (clientLoginForm) {
  clientLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("clientLoginEmail").value;
    const password = document.getElementById("clientLoginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول");
      window.location.href = "index.html";
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  });
}
