// js/products.js
import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const productsContainer = document.getElementById("products");

async function loadProducts() {
  const q = await getDocs(collection(db, "products"));
  productsContainer.innerHTML = "";
  q.forEach((d) => {
    const p = d.data();
    const el = document.createElement("div");
    el.className = "product-card";
    el.innerHTML = `
      <img src="${p.imageUrl || 'https://via.placeholder.com/400x300'}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>الفئة: ${p.category || '-'}</p>
      <p>${p.price} ج.م</p>
      <button class="buyBtn" data-id="${d.id}">اطلب الآن</button>
    `;
    productsContainer.appendChild(el);
  });

  document.querySelectorAll(".buyBtn").forEach(btn => {
    btn.addEventListener("click", () => buyNow(btn.dataset.id));
  });
}

async function getTransferNumber() {
  try {
    const ref = doc(db, "settings", "payments");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().transferNumber || "01025380065";
    }
  } catch (e) {}
  return "01025380065";
}

async function buyNow(productId) {
  const pd = await getDoc(doc(db, "products", productId));
  if (!pd.exists()) return alert("المنتج غير موجود");
  const p = pd.data();
  let name = "";
  let phone = "";
  let address = "";

  const user = auth.currentUser;
  if (user) {
    try {
      const ud = await getDoc(doc(db, "users", user.uid));
      if (ud.exists()) {
        const u = ud.data();
        name = u.name || "";
        phone = u.phone || "";
      }
    } catch (e) {}
  }

  if (!name) name = prompt("الاسم كامل");
  if (!phone) phone = prompt("رقم الهاتف للتواصل");
  address = prompt("العنوان الكامل");

  if (!name || !phone || !address) return alert("اكمل بياناتك");

  const methodChoice = prompt("اختر طريقة الدفع اكتب 1 لفودافون كاش 2 لانستا باي");
  if (methodChoice !== "1" && methodChoice !== "2") return alert("طريقة دفع غير صحيحة");

  const method = methodChoice === "1" ? "فودافون كاش" : "انستا باي";
  const payNumber = prompt("ادخل رقم محفظتك او رقم الدفع الخاص بك");

  const shopNumber = await getTransferNumber();

  const order = {
    userId: user ? user.uid : "guest",
    name,
    phone,
    address,
    productId,
    productTitle: p.title,
    price: p.price,
    currency: "EGP",
    paymentMethod: method,
    customerPaymentNumber: payNumber,
    transferToNumber: shopNumber,
    status: "pending",
    createdAt: new Date()
  };

  try {
    await addDoc(collection(db, "orders"), order);
    alert("تم ارسال الطلب. رقم التحويل للتسليم: " + shopNumber);
  } catch (err) {
    alert(err.message);
  }
}

loadProducts();
