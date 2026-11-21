import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getDownloadURL, getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const cfg = window.FIREBASE_CONFIG || {};
const ready = Boolean(cfg.apiKey && cfg.projectId);

let db = null;
let auth = null;
let storage = null;
let user = null;
let profile = null;
let secondaryAuth = null;
let pendingGoogle = null;
const listeners = new Set();
const passwordEmail = {
  url: "https://titanev-hatyai.web.app/#/admin",
  handleCodeInApp: false
};

if (ready) {
  const app = initializeApp(cfg);
  db = getFirestore(app);
  auth = getAuth(app);
  auth.languageCode = "th";
  storage = getStorage(app);
  onAuthStateChanged(auth, async (next) => {
    user = next;
    profile = null;
    if (next) {
      try { await ensureProfile(next); } catch (error) { profile = null; }
    }
    listeners.forEach((fn) => fn(next));
  });
}

function inviteAuth() {
  if (!secondaryAuth) {
    const app = initializeApp(cfg, "user-admin");
    secondaryAuth = getAuth(app);
    secondaryAuth.languageCode = "th";
  }
  return secondaryAuth;
}

async function ensureProfile(next) {
  const snap = await getDoc(doc(db, "users", next.uid));
  if (snap.exists()) {
    profile = { id: snap.id, ...snap.data() };
    return profile;
  }
  if (next.email !== window.OWNER_EMAIL) return null;
  const seeded = {
    name: "เจ้าของเว็บ",
    phone: "",
    email: next.email,
    role: "admin",
    status: "active",
    createdAt: serverTimestamp()
  };
  await setDoc(doc(db, "users", next.uid), seeded);
  profile = { id: next.uid, ...seeded };
  return profile;
}

function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return "Aa1!" + [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
}

function requireDb() {
  if (!db) {
    const error = new Error("ยังไม่ได้ใส่ค่า Firebase");
    error.code = "config-missing";
    throw error;
  }
}

const CATEGORY_IDS = ["cargo", "box", "passenger", "food"];

function clipText(value, max) {
  return String(value || "").trim().slice(0, max);
}

function applyImageMap(model, imageMap) {
  (model.images || []).forEach((image, index) => {
    const src = imageMap[model.id + "_" + index];
    if (src) image.src = src;
  });
}

function applyLegacyPrices(model, override) {
  const batteryPrices = override.batteries;
  const addonPrices = override.addons;
  if (batteryPrices && !Array.isArray(batteryPrices)) {
    (model.batteries || []).forEach((battery) => {
      const price = batteryPrices[battery.id];
      if (Number.isFinite(price)) battery.price = price;
    });
  }
  if (addonPrices && !Array.isArray(addonPrices)) {
    (model.addons || []).forEach((addon) => {
      const price = addonPrices[addon.id];
      if (Number.isFinite(price)) addon.price = price;
    });
  }
}

function normalizeImages(list) {
  return (Array.isArray(list) ? list : []).slice(0, 12).map((image) => ({
    src: clipText(image && image.src, 900),
    alt: clipText(image && image.alt, 120),
    caption: clipText(image && image.caption, 160),
    ...(image && image.clip ? { clip: true } : {})
  })).filter((image) => image.src);
}

function normalizeBatteries(list) {
  const seen = new Set();
  return (Array.isArray(list) ? list : []).slice(0, 12).map((battery, index) => {
    let id = clipText(battery && battery.id, 40).replace(/[^a-z0-9-]/gi, "") || ("b" + (index + 1));
    while (seen.has(id)) id += "x";
    seen.add(id);
    return {
      id,
      name: clipText(battery && battery.name, 80) || "แบตเตอรี่",
      price: Math.max(0, Math.round(Number(battery && battery.price) || 0)),
      warranty: clipText(battery && battery.warranty, 40)
    };
  });
}

function normalizeAddons(list) {
  const seen = new Set();
  return (Array.isArray(list) ? list : []).slice(0, 16).map((addon, index) => {
    let id = clipText(addon && addon.id, 40).replace(/[^a-z0-9-]/gi, "") || ("a" + (index + 1));
    while (seen.has(id)) id += "x";
    seen.add(id);
    const item = {
      id,
      name: clipText(addon && addon.name, 80) || "อุปกรณ์เสริม",
      price: Math.max(0, Math.round(Number(addon && addon.price) || 0))
    };
    const group = clipText(addon && addon.group, 20);
    if (group) item.group = group;
    return item;
  });
}

function blankModel(id) {
  return {
    id,
    name: "รุ่นใหม่",
    category: "cargo",
    kicker: "รุ่นเพิ่มเอง",
    blurb: "",
    motor: "-",
    load: "-",
    range: "-",
    speed: "-",
    bed: "-",
    colors: [],
    images: [],
    batteries: [{ id: "b1", name: "แบตเตอรี่", price: 0, warranty: "ประกันแบต 1 ปี" }],
    addons: [],
    specs: [],
    features: []
  };
}

function applySheet(model, sheet) {
  const name = clipText(sheet.name, 80);
  if (name) model.name = name;
  if (CATEGORY_IDS.includes(sheet.category)) model.category = sheet.category;
  if (Array.isArray(sheet.images)) model.images = normalizeImages(sheet.images);
  const batteries = normalizeBatteries(sheet.batteries);
  if (batteries.length) model.batteries = batteries;
  if (Array.isArray(sheet.addons)) model.addons = normalizeAddons(sheet.addons);
  model.images.forEach((image) => { if (!image.alt) image.alt = model.name; });
}

async function readCatalog() {
  requireDb();
    const [snap, images] = await Promise.all([
      getDoc(doc(db, "settings", "catalog")),
      getDocs(collection(db, "images"))
    ]);
    const imageMap = {};
    images.forEach((item) => {
      imageMap[item.id] = item.data().src;
    });
    return {
      models: snap.exists() ? snap.data().models || {} : {},
      imageMap
    };
  }

async function writeCatalog(models) {
  requireDb();
  delete models["titan-11m"];
  await setDoc(doc(db, "settings", "catalog"), { models });
}

window.TitanFirebase = {
  ready,
  currentUser() {
    return user;
  },
  currentProfile() {
    return profile;
  },
  role() {
    if (!user) return "";
    if (user.email === window.OWNER_EMAIL) return "admin";
    if (profile && profile.status === "active") return profile.role || "";
    return "";
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
    if (pendingGoogle) {
      try { await linkWithCredential(user, pendingGoogle); } catch (error) { /* เข้าด้วยรหัสผ่านได้ แม้ยังผูก Gmail ไม่สำเร็จ */ }
      pendingGoogle = null;
    }
    await ensureProfile(user);
    return user;
  },
  async signInWithGoogle() {
    if (!auth) {
      const error = new Error("ยังไม่ได้ใส่ค่า Firebase");
      error.code = "config-missing";
      throw error;
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const cred = await signInWithPopup(auth, provider);
      user = cred.user;
      await ensureProfile(user);
      return user;
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        pendingGoogle = GoogleAuthProvider.credentialFromError(error);
      }
      throw error;
    }
  },
  async signOut() {
    if (!auth) return;
    await signOut(auth);
    user = null;
    profile = null;
  },
  async listUsers() {
    requireDb();
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "th"));
  },
  async registerUser(data) {
    requireDb();
    const invited = inviteAuth();
    const cred = await createUserWithEmailAndPassword(invited, data.email, randomPassword());
    const uid = cred.user.uid;
    await setDoc(doc(db, "users", uid), {
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      status: data.status,
      createdAt: serverTimestamp()
    });
    await sendPasswordResetEmail(invited, data.email, passwordEmail);
    await signOut(invited);
    return uid;
  },
  async deleteUser(id) {
    requireDb();
    await deleteDoc(doc(db, "users", id));
  },
  async updateUser(id, data) {
    requireDb();
    await updateDoc(doc(db, "users", id), {
      name: data.name,
      phone: data.phone,
      role: data.role,
      status: data.status
    });
  },
  async sendPasswordLink(email) {
    if (!auth) {
      const error = new Error("ยังไม่ได้ใส่ค่า Firebase");
      error.code = "config-missing";
      throw error;
    }
    await sendPasswordResetEmail(auth, email, passwordEmail);
  },
  async applyCatalog(models) {
    if (!db) return;
    const data = await readCatalog();
    const saved = data.models || {};
    models.forEach((model) => {
      const override = saved[model.id];
      const sheet = override && override.sheet;
      if (sheet && typeof sheet === "object") {
        applySheet(model, sheet);
        return;
      }
      applyImageMap(model, data.imageMap);
      if (override) applyLegacyPrices(model, override);
    });
    Object.keys(saved).forEach((id) => {
      const sheet = saved[id] && saved[id].sheet;
      if (!sheet || models.some((model) => model.id === id) || !/^[a-z0-9-]{3,40}$/.test(id)) return;
      const model = blankModel(id);
      applySheet(model, sheet);
      models.push(model);
    });
  },
  async saveModel(model) {
    const data = await readCatalog();
    data.models = data.models || {};
    const batteries = {};
    const addons = {};
    model.batteries.forEach((battery) => { batteries[battery.id] = battery.price; });
    model.addons.forEach((addon) => { addons[addon.id] = addon.price; });
    data.models[model.id] = {
      ...(data.models[model.id] || {}),
      batteries,
      addons,
      sheet: {
        name: model.name,
        category: model.category,
        images: model.images.map((image) => ({
          src: image.src || "",
          alt: image.alt || model.name,
          caption: image.caption || "",
          ...(image.clip ? { clip: true } : {})
        })),
        batteries: model.batteries.map((battery) => ({
          id: battery.id,
          name: battery.name,
          price: battery.price,
          warranty: battery.warranty || ""
        })),
        addons: model.addons.map((addon) => ({
          id: addon.id,
          name: addon.name,
          price: addon.price,
          ...(addon.group ? { group: addon.group } : {})
        }))
      }
    };
    await writeCatalog(data.models);
  },
  async saveModelImage(modelId, index, blob) {
    requireDb();
    if (!storage) {
      const error = new Error("ยังไม่มีที่เก็บรูป");
      error.code = "storage-missing";
      throw error;
    }
    const stored = ref(storage, `catalog/${modelId}/${index}-${Date.now()}.jpg`);
    await uploadBytes(stored, blob, { contentType: "image/jpeg" });
    const src = await getDownloadURL(stored);
    await setDoc(doc(db, "images", modelId + "_" + index), { src });
    return src;
  },
  async saveInquiry(data) {
    requireDb();
    const saved = await addDoc(collection(db, "inquiries"), {
      name: data.name,
      phone: data.phone,
      line: data.line || "",
      area: data.area || "",
      modelId: data.modelId || "",
      modelName: data.modelName || "",
      battery: data.battery || "",
      addons: data.addons || [],
      total: Number.isFinite(data.total) ? data.total : null,
      note: data.note || "",
      source: data.source || "contact",
      createdAt: serverTimestamp()
    });
    return saved.id;
  },
  async listInquiries() {
    requireDb();
    const snap = await getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(200)));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  },
  async listNotes(inquiryId) {
    requireDb();
    const snap = await getDocs(query(collection(db, "inquiries", inquiryId, "notes"), orderBy("createdAt", "asc"), limit(100)));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  },
  async deleteNote(inquiryId, noteId) {
    requireDb();
    await deleteDoc(doc(db, "inquiries", inquiryId, "notes", noteId));
  },
  async addNote(inquiryId, entry) {
    requireDb();
    const saved = await addDoc(collection(db, "inquiries", inquiryId, "notes"), {
      text: entry.text,
      date: entry.date,
      recordedBy: entry.recordedBy,
      recordedByEmail: entry.recordedByEmail,
      recordedByUid: entry.recordedByUid,
      createdAt: serverTimestamp()
    });
    return saved.id;
  },
  async listCash() {
    requireDb();
    const snap = await getDocs(query(collection(db, "cashbook"), orderBy("createdAt", "desc"), limit(300)));
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  },
  async addCash(entry) {
    requireDb();
    const saved = await addDoc(collection(db, "cashbook"), {
      direction: entry.direction,
      amount: entry.amount,
      note: entry.note || "",
      date: entry.date,
      recordedBy: entry.recordedBy,
      recordedByEmail: entry.recordedByEmail,
      recordedByUid: entry.recordedByUid,
      createdAt: serverTimestamp()
    });
    return saved.id;
  },
  async deleteCash(id) {
    requireDb();
    await deleteDoc(doc(db, "cashbook", id));
  }
};

window.dispatchEvent(new Event("titan-firebase-ready"));
