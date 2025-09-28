import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// إضافة فئة
const categoryForm = document.getElementById("categoryForm");
if (categoryForm) {
  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("categoryName").value;
    await addDoc(collection(db, "categories"), { name });
    loadCategories();
  });
}

// إضافة منتج
const productForm = document.getElementById("productForm");
if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const image = document.getElementById("productImage").value;
    const category = document.getElementById("productCategory").value;

    await addDoc(collection(db, "products"), { name, price, image, category });
    loadProducts();
  });
}

// تحميل الفئات
async function loadCategories() {
  const categoriesList = document.getElementById("categoriesList");
  const select = document.getElementById("productCategory");
  if (!categoriesList || !select) return;

  categoriesList.innerHTML = "";
  select.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "categories"));
  querySnapshot.forEach((docSnap) => {
    const li = document.createElement("li");
    li.textContent = docSnap.data().name;
    li.className = "flex justify-between border-b p-2";
    const del = document.createElement("button");
    del.textContent = "حذف";
    del.className = "text-red-600";
    del.onclick = async () => {
      await deleteDoc(doc(db, "categories", docSnap.id));
      loadCategories();
    };
    li.appendChild(del);
    categoriesList.appendChild(li);

    const option = document.createElement("option");
    option.value = docSnap.data().name;
    option.textContent = docSnap.data().name;
    select.appendChild(option);
  });
}

// تحميل المنتجات
async function loadProducts() {
  const productsList = document.getElementById("productsList");
  if (!productsList) return;

  productsList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.className = "flex justify-between border-b p-2";
    li.innerHTML = `<span>${data.name} - ${data.price} ج.م</span>`;
    const del = document.createElement("button");
    del.textContent = "حذف";
    del.className = "text-red-600";
    del.onclick = async () => {
      await deleteDoc(doc(db, "products", docSnap.id));
      loadProducts();
    };
    li.appendChild(del);
    productsList.appendChild(li);
  });
}

loadCategories();
loadProducts();
