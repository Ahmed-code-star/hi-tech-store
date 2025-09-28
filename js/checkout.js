// js/checkout.js
import { db } from "./firebase.js";
import { collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("checkoutForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("buyerName").value.trim();
    const phone = document.getElementById("buyerPhone").value.trim();
    const address = document.getElementById("buyerAddress").value.trim();
    const method = document.getElementById("paymentMethod").value;
    const customerPaymentNumber = document.getElementById("buyerPaymentNumber").value.trim();

    if (!name || !phone || !address || !method || !customerPaymentNumber) return alert("اكمل الحقول");

    // جلب رقم التحويل المحفوظ في settings/payments.transferNumber لو متاح
    let transferToNumber = "01025380065";
    try {
      const sRef = doc(db, "settings", "payments");
      const sSnap = await getDoc(sRef);
      if (sSnap.exists()) transferToNumber = sSnap.data().transferNumber || transferToNumber;
    } catch (e) {}

    await addDoc(collection(db, "orders"), {
      name, phone, address, method, customerPaymentNumber, transferToNumber,
      status: "pending", createdAt: new Date()
    });

    alert("تم ارسال الطلب. سيتم التواصل معك");
    window.location.href = "index.html";
  });
}
