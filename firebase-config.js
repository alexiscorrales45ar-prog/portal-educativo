// ===========================
// CONFIGURACIÓN DE FIREBASE
// ===========================
// Instrucciones:
// 1. Ve a https://firebase.google.com y crea una cuenta (gratuita)
// 2. Crea un nuevo proyecto
// 3. En la consola, ve a "Configuración del proyecto"
// 4. Copia el objeto de configuración y pégalo abajo
// 5. Descomenta las líneas de Firebase en admin.html e index.html

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

console.log("⚠️ Firebase no está configurado. Ver instrucciones en firebase-config.js");
