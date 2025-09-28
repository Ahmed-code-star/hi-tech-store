// js/checkout.js
import { db } from "./firebase.js";
import { addDoc, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const placeBtn = document.getElementById("placeOrderBtn");
if (placeBtn) {
  placeBtn.addEventListener("click", async () => {
    const name = document.getElementById("buyerName").value.trim();
    const phone = document.getElementById("buyerPhone").value.trim();
    const address = document.getElementById("buyerAddress").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;
    const customerPaymentNumber = document.getElementById("paymentNumber").value.trim();

    if (!name || !phone || !address || !customerPaymentNumber) {
      return alert("اكمل الحقول");
    }

    // fetch shop transfer number
    let transferToNumber = "01025380065";
    try {
      const sRef = doc(db, "settings", "payments");
      const snap = await getDoc(sRef);
      if (snap.exists()) transferToNumber = snap.data().transferNumber || transferToNumber;
    } catch (e) {}

    try {
      await addDoc(collection(db, "orders"), {
        userId: "guest",
        name,
        phone,
        address,
        paymentMethod,
        customerPaymentNumber,
        transferToNumber,
        items: [],
        total: 0,
        currency: "EGP",
        status: "pending",
        createdAt: new Date()
      });
      alert("تم ارسال الطلب. رقم التحويل للتسليم: " + transferToNumber);
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}
