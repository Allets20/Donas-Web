// script.js  (usa <script type="module" src="script.js"></script> en tu HTML)

/* ---------- Imports (modular Firebase v10) ---------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

/* ---------- Config de Firebase ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyA1ArveNh2DsaTifj22oLzOhZZqgjMnMUc",
  authDomain: "donasreviews.firebaseapp.com",
  projectId: "donasreviews",
  storageBucket: "donasreviews.firebasestorage.app",
  messagingSenderId: "860575331491",
  appId: "1:860575331491:web:31a6c0e332af98570cfb16",
  measurementId: "G-J99XFQDYBX"
};

/* ---------- Inicializar Firebase ---------- */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ---------- DOM ---------- */
document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- Carrito -------------------- */
  let carrito = [];
  let total = 0;
  const listaCarrito = document.getElementById("listaCarrito");
  const totalEl = document.getElementById("total");

  function agregarCarrito(producto, precio) {
    carrito.push({ producto, precio });
    total += precio;
    actualizarCarrito();
  }
  window.agregarCarrito = agregarCarrito;

  function actualizarCarrito() {
    if (!listaCarrito) return;
    listaCarrito.innerHTML = "";
    carrito.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.producto} - S/ ${item.precio.toFixed(2)}`;
      listaCarrito.appendChild(li);
    });
    if (totalEl) totalEl.textContent = total.toFixed(2);
  }

  function finalizarCompra() {
    if (carrito.length === 0) { alert("Tu carrito está vacío"); return; }
    let mensaje = "Hola, quiero comprar:%0A";
    carrito.forEach(item => {
      mensaje += `- ${item.producto} S/ ${item.precio.toFixed(2)}%0A`;
    });
    mensaje += `Total: S/ ${total.toFixed(2)}`;
    window.open(`https://wa.me/51900000000?text=${encodeURIComponent(mensaje)}`, "_blank");
  }
  window.finalizarCompra = finalizarCompra;

  actualizarCarrito();

  /* -------------------- Reseñas -------------------- */
  const formReseña = document.getElementById("formReseña");
  const comentarioForm = document.getElementById("comentarioForm");
  const listaReseñas = document.getElementById("listaReseñas") || document.getElementById("comentarios");

  // Guardar reseña en Firestore (colección 'reseñas')
  async function sendComentario({ nombre, comentario, estrellas = null }) {
    try {
      await addDoc(collection(db, "reseñas"), {
        nombre: nombre,
        comentario: comentario,
        estrellas: estrellas ? Number(estrellas) : null,
        fecha: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error("Error guardando reseña:", err);
      return false;
    }
  }

  if (formReseña) {
    formReseña.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = (document.getElementById("nombre")?.value || "").trim();
      const comentario = (document.getElementById("comentario")?.value || "").trim();
      const estrellas = document.getElementById("estrellas") ? document.getElementById("estrellas").value : null;
      if (!nombre || !comentario) { alert("Completa nombre y comentario"); return; }

      const ok = await sendComentario({ nombre, comentario, estrellas });
      if (ok) { alert("Reseña enviada con éxito!"); formReseña.reset(); }
      else alert("Error al enviar reseña. Revisa la consola.");
    });
  }

  if (comentarioForm) {
    comentarioForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = (document.getElementById("nombre")?.value || "").trim();
      const comentario = (document.getElementById("comentario")?.value || "").trim();
      if (!nombre || !comentario) { alert("Completa nombre y comentario"); return; }

      const ok = await sendComentario({ nombre, comentario });
      if (ok) { alert("Comentario enviado ✅"); comentarioForm.reset(); }
      else alert("Error al enviar comentario. Revisa la consola.");
    });
  }

  // Escuchar reseñas en tiempo real
  try {
    const q = query(collection(db, "reseñas"), orderBy("fecha", "desc"));
    onSnapshot(q, (snapshot) => {
      if (!listaReseñas) return;
      listaReseñas.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "reseña";
        const estrellas = data.estrellas ? ' ' + '⭐'.repeat(data.estrellas) : '';
        const fechaText = data.fecha && data.fecha.toDate ? data.fecha.toDate().toLocaleString() : "";
        div.innerHTML = `<strong>${escapeHtml(data.nombre)}</strong> <span class="muted">· ${escapeHtml(fechaText)}</span><div class="muted">${estrellas}</div><p>${escapeHtml(data.comentario)}</p>`;
        listaReseñas.appendChild(div);
      });
    }, err => console.error("onSnapshot error:", err));
  } catch (err) {
    console.error("Error inicializando listener de reseñas:", err);
  }

  // Sanitizar texto antes de mostrar
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
