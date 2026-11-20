import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const cfg = window.FIREBASE_CONFIG || {};
const ready = Boolean(cfg.apiKey && cfg.projectId);

let db = null;
let auth = null;
let user = null;
const listeners = new Set();

if (ready) {
  const app = initializeApp(cfg);
  db = getFirestore(app);
  auth = getAuth(app);
  onAuthStateChanged(auth, (next) => {
    user = next;
    listeners.forEach((fn) => fn(next));
  });
}

window.TitanFirebase = {
  ready,
  currentUser() {
    return user;
  },
  onAuth(fn) {
    listeners.add(fn);
    if (ready) fn(user);
    return () => listeners.delete(fn);
  },
  async signIn(email, password) {
    if (!auth) {
      const error = new Error("ยังไม่ได้ใส่ค่า Firebase");
      error.code = "config-missing";
      throw error;
    }
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    user = cred.user;
    return user;
  },
  async signOut() {
    if (!auth) return;
    await signOut(auth);
    user = null;
  },
  async saveInquiry(data) {
    if (!db) {
      const error = new Error("ยังไม่ได้ใส่ค่า Firebase ใน js/firebase-config.js");
      error.code = "config-missing";
      throw error;
    }
    const ref = await addDoc(collection(db, "inquiries"), {
      name: data.name,
      phone: data.phone,
      line: data.line || "",
      modelId: data.modelId || "",
      modelName: data.modelName || "",
      battery: data.battery || "",
      addons: data.addons || [],
      total: Number.isFinite(data.total) ? data.total : null,
      note: data.note || "",
      source: data.source || "contact",
      createdAt: serverTimestamp()
    });
    return ref.id;
  },
  async listInquiries() {
    if (!db) {
      const error = new Error("ยังไม่ได้ใส่ค่า Firebase");
      error.code = "config-missing";
      throw error;
    }
    const snap = await getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(200)));
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
};

window.dispatchEvent(new Event("titan-firebase-ready"));
