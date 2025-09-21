// --- Carrito ---
let carrito = [];
let total = 0;

function agregarCarrito(producto, precio) {
  carrito.push({ producto, precio });
  total += precio;
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  carrito.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.producto} - S/ ${item.precio.toFixed(2)}`;
    lista.appendChild(li);
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  let mensaje = "Hola, quiero comprar:\\n";
  carrito.forEach(item => {
    mensaje += `- ${item.producto} S/ ${item.precio.toFixed(2)}\\n`;
  });
  mensaje += `Total: S/ ${total.toFixed(2)}`;
  window.open(`https://wa.me/51900000000?text=${encodeURIComponent(mensaje)}`);
}

// Importar Firebase (esto debe ir en tu HTML con <script type="module">)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de tu proyecto (rellena con tus claves de Firebase)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "XXXXXXXXXXX",
  appId: "X:XXXXXXXXXXX:web:XXXXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formReseña = document.getElementById("formReseña");
const listaReseñas = document.getElementById("listaReseñas");

// Guardar en Firebase
formReseña.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const comentario = document.getElementById("comentario").value;
  const estrellas = document.getElementById("estrellas").value;

  try {
    await addDoc(collection(db, "reseñas"), {
      nombre,
      comentario,
      estrellas: parseInt(estrellas),
      fecha: new Date()
    });

    alert("¡Reseña enviada con éxito!");
    formReseña.reset();
    mostrarReseñas(); // recargar reseñas
  } catch (error) {
    console.error("Error al guardar la reseña:", error);
  }
});

// Mostrar reseñas guardadas
async function mostrarReseñas() {
  listaReseñas.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "reseñas"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.classList.add("reseña");
    div.innerHTML = `<strong>${data.nombre}</strong> (${ "⭐".repeat(data.estrellas) })<p>${data.comentario}</p>`;
    listaReseñas.appendChild(div);
  });
}

// Cargar reseñas al entrar
mostrarReseñas();

