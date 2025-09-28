import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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
const db = getFirestore(app);

// إضافة فئة
document.getElementById("addCategoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("categoryName").value;

  await addDoc(collection(db, "categories"), { name });
  alert("تمت إضافة الفئة");
  location.reload();
});

// إضافة منتج
document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const image = document.getElementById("productImage").value;
  const category = document.getElementById("productCategory").value;

  await addDoc(collection(db, "products"), { name, price, image, category });
  alert("تمت إضافة المنتج");
  location.reload();
});

// عرض الفئات والمنتجات
async function loadData() {
  const categoriesSnap = await getDocs(collection(db, "categories"));
  const productsSnap = await getDocs(collection(db, "products"));

  let categoriesHTML = "";
  categoriesSnap.forEach((docSnap) => {
    categoriesHTML += `<li>${docSnap.data().name} 
      <button onclick="deleteCategory('${docSnap.id}')">حذف</button>
    </li>`;
  });
  document.getElementById("categoriesList").innerHTML = categoriesHTML;

  let productsHTML = "";
  productsSnap.forEach((docSnap) => {
    const d = docSnap.data();
    productsHTML += `<li>${d.name} - ${d.price}ج 
      <button onclick="deleteProduct('${docSnap.id}')">حذف</button>
    </li>`;
  });
  document.getElementById("productsList").innerHTML = productsHTML;
}

loadData();

// حذف فئة
window.deleteCategory = async function(id) {
  await deleteDoc(doc(db, "categories", id));
  alert("تم حذف الفئة");
  location.reload();
}

// حذف منتج
window.deleteProduct = async function(id) {
  await deleteDoc(doc(db, "products", id));
  alert("تم حذف المنتج");
  location.reload();
}
