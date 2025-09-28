import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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
const db = getFirestore(app);

// تسجيل حساب جديد
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const phone = document.getElementById("signupPhone").value;
  const address = document.getElementById("signupAddress").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // تخزين بيانات العميل في Firestore
    await setDoc(doc(db, "customers", user.uid), {
      name,
      phone,
      address,
      email
    });

    alert("تم إنشاء الحساب بنجاح");
    window.location.href = "index.html"; // يرجع للمتجر
  } catch (error) {
    document.getElementById("error").textContent = "خطأ: " + error.message;
    document.getElementById("error").classList.remove("hidden");
  }
});

// تسجيل الدخول
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html"; // يرجع للمتجر
  } catch (error) {
    document.getElementById("error").textContent = "خطأ: " + error.message;
    document.getElementById("error").classList.remove("hidden");
  }
});
