import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

async function loadProducts() {
  const productsContainer = document.getElementById("products");
  if (!productsContainer) return;

  productsContainer.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "bg-white shadow rounded p-4 text-center";

    card.innerHTML = `
      <img src="${data.image}" alt="${data.name}" class="w-full h-40 object-cover rounded mb-3">
      <h3 class="font-semibold mb-1">${data.name}</h3>
      <p class="text-blue-600 mb-2">${data.price} ج.م</p>
      <button class="bg-green-600 text-white px-3 py-1 rounded">أضف للسلة</button>
    `;

    productsContainer.appendChild(card);
  });
}

loadProducts();

// البحث
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", async (e) => {
    const term = e.target.value.toLowerCase();
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.name.toLowerCase().includes(term)) {
        const card = document.createElement("div");
        card.className = "bg-white shadow rounded p-4 text-center";
        card.innerHTML = `
          <img src="${data.image}" alt="${data.name}" class="w-full h-40 object-cover rounded mb-3">
          <h3 class="font-semibold mb-1">${data.name}</h3>
          <p class="text-blue-600 mb-2">${data.price} ج.م</p>
          <button class="bg-green-600 text-white px-3 py-1 rounded">أضف للسلة</button>
        `;
        productsContainer.appendChild(card);
      }
    });
  });
}
