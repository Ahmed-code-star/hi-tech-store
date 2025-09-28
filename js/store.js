// js/store.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const productsSection = document.getElementById("productsSection");
const searchBar = document.getElementById("searchBar");

async function fetchProducts() {
  const q = await getDocs(collection(db, "products"));
  const items = [];
  q.forEach(s => items.push({ id: s.id, ...s.data() }));
  return items;
}

function renderProducts(items) {
  if (!productsSection) return;
  productsSection.innerHTML = "";
  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4 flex flex-col";
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/400x300'}" class="rounded mb-3 object-cover h-40" alt="">
      <h3 class="font-bold mb-1">${p.name}</h3>
      <p class="text-indigo-600 font-semibold mb-3">${p.price} ج.م</p>
      <div class="mt-auto flex gap-2">
        <button class="addBtn bg-green-600 text-white px-3 py-2 rounded">اطلب الآن</button>
        <button class="detailsBtn border px-3 py-2 rounded">تفاصيل</button>
      </div>
    `;
    const addBtn = card.querySelector(".addBtn");
    addBtn.addEventListener("click", () => orderProduct(p));
    productsSection.appendChild(card);
  });
}

async function initProducts() {
  const items = await fetchProducts();
  renderProducts(items);
}

async function orderProduct(p) {
  const name = prompt("الاسم الكامل");
  const phone = prompt("رقم الهاتف");
  const address = prompt("العنوان");
  if (!name || !phone || !address) return alert("اكمل البيانات");
  // بسيط: نقل إلى checkout مع البيانات محفوظة محلياً
  localStorage.setItem("pendingOrder", JSON.stringify({ product: p, name, phone, address }));
  window.location.href = "checkout.html";
}

if (searchBar) {
  searchBar.addEventListener("input", async (e) => {
    const term = e.target.value.trim().toLowerCase();
    const items = await fetchProducts();
    const filtered = items.filter(i => i.name.toLowerCase().includes(term) || (i.category || "").toLowerCase().includes(term));
    renderProducts(filtered);
  });
}

initProducts();
