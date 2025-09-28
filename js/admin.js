import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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

// تحقق من تسجيل الأدمن
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// إضافة فئة
const addCategoryForm = document.getElementById("addCategoryForm");
addCategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("categoryName").value;
  await addDoc(collection(db, "categories"), { name });
  location.reload();
});

// عرض الفئات
async function loadCategories() {
  const querySnapshot = await getDocs(collection(db, "categories"));
  const container = document.getElementById("categories");
  container.innerHTML = "";
  querySnapshot.forEach((docSnap) => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-2 border rounded";
    div.innerHTML = `
      <span>${docSnap.data().name}</span>
      <button class="bg-red-600 text-white px-2 py-1 rounded"
        onclick="deleteCategory('${docSnap.id}')">حذف</button>
    `;
    container.appendChild(div);
  });
}
window.deleteCategory = async (id) => {
  await deleteDoc(doc(db, "categories", id));
  location.reload();
};
loadCategories();

// إضافة منتج
const addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const imageUrl = document.getElementById("imageUrl").value;

  await addDoc(collection(db, "products"), { title, category, price, imageUrl });
  location.reload();
});

// عرض المنتجات
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const container = document.getElementById("products");
  container.innerHTML = "";
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "border rounded p-3";
    div.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.title}" class="w-full h-40 object-cover mb-2 rounded">
      <h3 class="font-semibold">${data.title}</h3>
      <p>الفئة: ${data.category}</p>
      <p>السعر: ${data.price} جنيه</p>
      <button class="bg-red-600 text-white px-2 py-1 rounded mt-2"
        onclick="deleteProduct('${docSnap.id}')">حذف</button>
    `;
    container.appendChild(div);
  });
}
window.deleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
  location.reload();
};
loadProducts();
