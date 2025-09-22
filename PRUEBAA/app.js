// Importar Firebase (versión modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1ArveNh2DsaTifj22oLzOhZZqgjMnMUc",
  authDomain: "donasreviews.firebaseapp.com",
  projectId: "donasreviews",
  storageBucket: "donasreviews.appspot.com",
  messagingSenderId: "860575331491",
  appId: "1:860575331491:web:31a6c0e332af98570cfb16",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 👉 Exportar para que script.js lo pueda usar
export { db };
