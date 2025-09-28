import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAY4KAjhd4ULV85XorgUXDKtW748Jo_Ju8",
  authDomain: "hi-tech-caeab.firebaseapp.com",
  projectId: "hi-tech-caeab",
  storageBucket: "hi-tech-caeab.appspot.com",
  messagingSenderId: "493997466961",
  appId: "1:493997466961:web:4aa242a63f03ff71441f70",
  measurementId: "G-M68F8YSY52"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// تسجيل الدخول
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch((error) => {
      document.getElementById("error").textContent = "خطأ في تسجيل الدخول";
      document.getElementById("error").classList.remove("hidden");
      console.error(error);
    });
});
