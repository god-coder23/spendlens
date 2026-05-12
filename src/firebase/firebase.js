import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "spendlens-f3fe1.firebaseapp.com",
  projectId: "spendlens-f3fe1",
  storageBucket: "spendlens-f3fe1.firebasestorage.app",
  messagingSenderId: "1069913112059",
  appId: "1:1069913112059:web:7a712ee93efc2a3ee15f5e",
  measurementId: "G-ZTTL39V83Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, db, analytics };
export default app;
