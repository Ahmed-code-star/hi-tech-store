import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY4KAjhd4ULV85XorgUXDKtW748Jo_Ju8",
  authDomain: "hi-tech-caeab.firebaseapp.com",
  projectId: "hi-tech-caeab",
  storageBucket: "hi-tech-caeab.appspot.com",
  messagingSenderId: "493997466961",
  appId: "1:493997466961:web:4aa242a63f03ff71441f70",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// حفظ الطلب
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("customerPhone").value;
    const method = document.getElementById("paymentMethod").value;

    await addDoc(collection(db, "orders"), { phone, method, date: new Date() });
    alert("تم إرسال الطلب بنجاح");
    window.location.href = "index.html";
  });
}
