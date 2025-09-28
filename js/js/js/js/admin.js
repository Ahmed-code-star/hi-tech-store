// js/admin.js
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminPanel = document.getElementById("adminPanel");
const loginBox = document.getElementById("loginBox");
const transferNumberInput = document.getElementById("transferNumber");
const saveTransferBtn = document.getElementById("saveTransfer");
const updateAdminBtn = document.getElementById("updateAdmin");
const ordersContainer = document.getElementById("orders");
const logoutBtn = document.getElementById("logoutBtn");

async function ensurePaymentsDoc() {
  const ref = doc(db, "settings", "payments");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { transferNumber: "01025380065" });
    return "01025380065";
  }
  return snap.data().transferNumber || "01025380065";
}

async function loadOrders() {
  ordersContainer.innerHTML = "";
  const q = await getDocs(collection(db, "orders"));
  q.forEach(d => {
    const o = d.data();
    const el = document.createElement("div");
    el.className = "order-card";
    el.innerHTML = `
      <p><b>الاسم</b> ${o.name}</p>
      <p><b>هاتف</b> ${o.phone}</p>
      <p><b>عنوان</b> ${o.address}</p>
      <p><b>المنتج</b> ${o.productTitle}</p>
      <p><b>السعر</b> ${o.price} ج.م</p>
      <p><b>دفع</b> ${o.paymentMethod} - محفظة العميل ${o.customerPaymentNumber}</p>
      <p><b>حول إلى</b> ${o.transferToNumber}</p>
      <p><b>حالة</b> ${o.status}</p>
    `;
    ordersContainer.appendChild(el);
  });
}

adminLoginBtn.addEventListener("click", async () => {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    // if not found create account then sign in
    if (err.code === "auth/user-not-found") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (e) {
        return alert(e.message);
      }
    } else {
      return alert(err.message);
    }
  }

  // show panel
  loginBox.style.display = "none";
  adminPanel.style.display = "block";

  // ensure settings doc
  const num = await ensurePaymentsDoc();
  transferNumberInput.value = num;

  // load orders
  await loadOrders();
});

saveTransferBtn.addEventListener("click", async () => {
  const val = transferNumberInput.value.trim() || "01025380065";
  const ref = doc(db, "settings", "payments");
  try {
    await setDoc(ref, { transferNumber: val }, { merge: true });
    alert("تم حفظ رقم التحويل");
  } catch (e) {
    alert(e.message);
  }
});

updateAdminBtn.addEventListener("click", async () => {
  const newEmail = document.getElementById("newEmail").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  try {
    if (newEmail) await updateEmail(auth.currentUser, newEmail);
    if (newPassword) await updatePassword(auth.currentUser, newPassword);
    alert("تم تحديث بيانات الأدمن");
  } catch (e) {
    alert(e.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  adminPanel.style.display = "none";
  loginBox.style.display = "block";
  document.getElementById("adminPassword").value = "";
});
