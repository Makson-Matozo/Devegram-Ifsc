import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVA0cxpmbSAzL3uL-bA4t3MT3xqSXqmpc",
    authDomain: "devigram-db.firebaseapp.com",
    projectId: "devigram-db",
    storageBucket: "devigram-db.firebasestorage.app",
    messagingSenderId: "698522707526",
    appId: "1:698522707526:web:a12ca1598444cf3e9a8c47"
};

// Verifica se já existe uma instância do app Firebase inicializada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa os serviços a partir da instância do app
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
