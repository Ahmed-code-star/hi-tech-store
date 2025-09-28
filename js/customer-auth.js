import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY4KAjhd4ULV85XorgUXDKtW748Jo_Ju8",
  authDomain: "hi-tech-caeab.firebaseapp.com",
  projectId: "hi-tech-caeab",
  storageBucket: "hi-tech-caeab.appspot.com",
  messagingSenderId: "493997466961",
  appId: "1:493997466961:web:4aa242a63f03ff71441f70",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// تسجيل عميل جديد
const registerForm = document.getElementById("customerRegisterForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("customerEmail").value;
    const password = document.getElementById("customerPassword").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("تم التسجيل بنجاح");
        window.location.href = "index.html";
      })
      .catch((error) => alert(error.message));
  });
}

// تسجيل دخول عميل
const loginForm = document.getElementById("customerLoginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("تم تسجيل الدخول");
        window.location.href = "index.html";
      })
      .catch((error) => alert(error.message));
  });
}
