// admin.js
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { app } from "./firebase.js";

const db = getFirestore(app);

// إضافة فئة
const addCategoryForm = document.getElementById("addCategoryForm");
if (addCategoryForm) {
  addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoryName = document.getElementById("categoryName").value;

    try {
      await addDoc(collection(db, "categories"), { name: categoryName });
      alert("تمت إضافة الفئة");
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  });
}

// إضافة منتج
const addProductForm = document.getElementById("addProductForm");
if (addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productCategory = document.getElementById("productCategory").value;
    const productImage = document.getElementById("productImage").value;

    try {
      await addDoc(collection(db, "products"), {
        name: productName,
        price: productPrice,
        category: productCategory,
        image: productImage
      });
      alert("تمت إضافة المنتج");
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  });
}
