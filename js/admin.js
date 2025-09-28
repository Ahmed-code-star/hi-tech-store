// js/admin.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// عناصر DOM
const addCategoryForm = document.getElementById("addCategoryForm");
const addProductForm = document.getElementById("addProductForm");
const categoriesList = document.getElementById("categoriesList");
const productsList = document.getElementById("productsList");
const productCategorySelect = document.getElementById("productCategory");
const adminsEmailsInput = document.getElementById("adminsEmails");
const saveAdminsBtn = document.getElementById("saveAdmins");
const logoutBtn = document.getElementById("adminLogout");

// حماية: تحقق أن المستخدم أحد الإيميلات المصرح بها (يخزن في doc settings/admins.emails)
async function isAuthorizedAdmin(email){
  try {
    const docRef = doc(db, "settings", "admins");
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    const data = snap.data();
    const list = Array.isArray(data.emails) ? data.emails : [];
    return list.includes(email);
  } catch {
    return false;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "admin-login.html";
  const ok = await isAuthorizedAdmin(user.email);
  if (!ok) {
    alert("ليس لديك صلاحيات الأدمن");
    await signOut(auth);
    return window.location.href = "admin-login.html";
  }
  loadAll();
});

// إضافة فئة
if (addCategoryForm) {
  addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("categoryName").value.trim();
    if (!name) return;
    await addDoc(collection(db, "categories"), { name });
    addCategoryForm.reset();
    loadCategories();
  });
}

// حفظ اعدادات الادمن (قائمة الايميلات)
if (saveAdminsBtn) {
  saveAdminsBtn.addEventListener("click", async () => {
    const raw = adminsEmailsInput.value.trim();
    const list = raw ? raw.split(",").map(s => s.trim()).filter(Boolean) : [];
    await setDoc(doc(db, "settings", "admins"), { emails: list });
    alert("تم الحفظ");
  });
}

// إضافة منتج
if (addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const img = document.getElementById("productImage").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    if (!name || !price) return alert("اكمل الحقول");
    await addDoc(collection(db, "products"), { name, price, image: img, category });
    addProductForm.reset();
    loadAll();
  });
}

// تحميل القوائم
async function loadCategories(){
  if (!categoriesList || !productCategorySelect) return;
  categoriesList.innerHTML = "";
  productCategorySelect.innerHTML = `<option value="">اختر فئة</option>`;
  const q = await getDocs(collection(db, "categories"));
  q.forEach(s => {
    const id = s.id;
    const name = s.data().name;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-2 border rounded";
    div.innerHTML = `<span>${name}</span><div class="flex gap-2"><button data-id="${id}" class="delCat text-red-600">حذف</button></div>`;
    categoriesList.appendChild(div);

    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    productCategorySelect.appendChild(opt);
  });

  document.querySelectorAll(".delCat").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "categories", id));
      loadAll();
    });
  });
}

async function loadProducts(){
  if (!productsList) return;
  productsList.innerHTML = "";
  const q = await getDocs(collection(db, "products"));
  q.forEach(s => {
    const d = s.data();
    const id = s.id;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-2 border rounded";
    div.innerHTML = `<div><div class="font-semibold">${d.name}</div><div class="text-sm text-gray-600">${d.category || '-'}</div></div>
      <div class="flex gap-2"><button data-id="${id}" class="delProd text-red-600">حذف</button></div>`;
    productsList.appendChild(div);
  });

  document.querySelectorAll(".delProd").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "products", id));
      loadAll();
    });
  });
}

async function loadAll(){
  await loadCategories();
  await loadProducts();
  // load admins emails to field
  const aDoc = await (await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")).getDoc((await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")).doc(db, "settings", "admins"));
  if (aDoc.exists && adminsEmailsInput) {
    const val = aDoc.data().emails || [];
    adminsEmailsInput.value = val.join(", ");
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "admin-login.html";
  });
}
