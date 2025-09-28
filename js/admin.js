import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- إضافة منتج ---
const addProductForm = document.getElementById("addProductForm");
const productsContainer = document.getElementById("products");

if (addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const imageUrl = document.getElementById("imageUrl").value;

    try {
      await addDoc(collection(db, "products"), {
        title,
        category,
        price,
        imageUrl
      });
      alert("تمت إضافة المنتج بنجاح");
      addProductForm.reset();
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  });
}

// --- تحميل وعرض المنتجات ---
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productsContainer.innerHTML = "";
  querySnapshot.forEach((d) => {
    const product = d.data();
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>الفئة: ${product.category}</p>
      <p>${product.price} ج.م</p>
      <button onclick="editProduct('${d.id}','${product.title}','${product.category}','${product.price}','${product.imageUrl}')">تعديل</button>
      <button onclick="deleteProduct('${d.id}')">حذف</button>
    `;
    productsContainer.appendChild(div);
  });
}

window.deleteProduct = async (id) => {
  if (confirm("هل تريد حذف هذا المنتج؟")) {
    await deleteDoc(doc(db, "products", id));
    alert("تم الحذف بنجاح");
    loadProducts();
  }
};

window.editProduct = async (id, oldTitle, oldCategory, oldPrice, oldImage) => {
  const title = prompt("اسم المنتج:", oldTitle);
  const category = prompt("الفئة:", oldCategory);
  const price = prompt("السعر:", oldPrice);
  const imageUrl = prompt("رابط الصورة:", oldImage);

  if (!title || !category || !price || !imageUrl) return;

  await updateDoc(doc(db, "products", id), {
    title,
    category,
    price,
    imageUrl
  });

  alert("تم تعديل المنتج");
  loadProducts();
};

// --- إضافة فئة ---
const addCategoryForm = document.getElementById("addCategoryForm");
const categoriesContainer = document.getElementById("categories");

if (addCategoryForm) {
  addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("categoryName").value;
    try {
      await addDoc(collection(db, "categories"), { name });
      alert("تمت إضافة الفئة");
      addCategoryForm.reset();
      loadCategories();
    } catch (error) {
      alert(error.message);
    }
  });
}

// --- تحميل وعرض الفئات ---
async function loadCategories() {
  const querySnapshot = await getDocs(collection(db, "categories"));
  categoriesContainer.innerHTML = "";
  querySnapshot.forEach((d) => {
    const category = d.data();
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <p>${category.name}</p>
      <button onclick="editCategory('${d.id}','${category.name}')">تعديل</button>
      <button onclick="deleteCategory('${d.id}')">حذف</button>
    `;
    categoriesContainer.appendChild(div);
  });
}

window.deleteCategory = async (id) => {
  if (confirm("هل تريد حذف هذه الفئة؟")) {
    await deleteDoc(doc(db, "categories", id));
    alert("تم الحذف");
    loadCategories();
  }
};

window.editCategory = async (id, oldName) => {
  const name = prompt("اسم الفئة:", oldName);
  if (!name) return;
  await updateDoc(doc(db, "categories", id), { name });
  alert("تم تعديل الفئة");
  loadCategories();
};

// --- تشغيل ---
if (productsContainer) loadProducts();
if (categoriesContainer) loadCategories();
