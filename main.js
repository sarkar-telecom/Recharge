// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ----- Firebase Config (আপনার Config বসানো হয়েছে) -----
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.firebasestorage.app",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== SIDEBAR & HEADER ====================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const avatarBtn = document.getElementById("avatarBtn");
const profileLink = document.getElementById("profileLink");
const authLink = document.getElementById("authLink");

menuToggle?.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.style.display = "block";
});
overlay?.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.style.display = "none";
});
avatarBtn?.addEventListener("click", () => avatarBtn.parentElement?.classList.toggle("show"));

// swipe open/close
let touchStartX = 0, touchEndX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX < 50 && touchEndX - touchStartX > 50) {
    sidebar.classList.add("open");
    overlay.style.display = "block";
  }
  if (touchStartX - touchEndX > 50) {
    sidebar.classList.remove("open");
    overlay.style.display = "none";
  }
});

// ==================== AUTH STATE ====================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    avatarBtn && (avatarBtn.src = user.photoURL || 'https://via.placeholder.com/40');
    if (profileLink) profileLink.href = 'profile.html';
    if (authLink) {
      authLink.textContent = 'Logout';
      authLink.onclick = function () {
        signOut(auth)
          .then(() => window.location.href = 'login.html')
          .catch(err => console.error("Logout failed:", err));
      };
    }

    // Dashboard: load user info
    if (document.getElementById("userName")) {
      document.getElementById("userName").textContent = user.displayName || "No Name";
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userPhoto").src = user.photoURL || "https://via.placeholder.com/80";

      // Firestore থেকে extra data
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.name) document.getElementById("userName").textContent = data.name;
        if (data.avatar) {
          document.getElementById("userPhoto").src = data.avatar;
          if (avatarBtn) avatarBtn.src = data.avatar;
        }
      }
    }

    // Profile page: load form data
    if (document.getElementById("profileForm")) {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        for (let key in data) {
          if (document.getElementById(key)) {
            document.getElementById(key).value = data[key];
          }
        }
      }

      // Update form submit
      document.getElementById("profileForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const updates = {};
        ["approved","avatar","balance","email","name","phone","role","tier","weekBoundary","weeklyDiamonds","weeklyTotal"].forEach(field => {
          const el = document.getElementById(field);
          if (el) {
            if (el.type === "checkbox") updates[field] = el.checked;
            else if (el.type === "number") updates[field] = Number(el.value);
            else updates[field] = el.value;
          }
        });

        try {
          await updateDoc(doc(db, "users", user.uid), updates);
          alert("Profile updated successfully!");
        } catch (err) {
          console.error("Update failed:", err);
          alert("Update failed: " + err.message);
        }
      });
    }

  } else {
    // not logged in
    if (!window.location.pathname.endsWith("login.html")) {
      window.location.href = "login.html";
    }
  }
});

// ==================== LOGIN / REGISTER ====================

// Login form
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => window.location.href = "dashboard.html")
      .catch(err => alert("Login failed: " + err.message));
  });
}

// Register form
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const name = document.getElementById("registerName").value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        avatar: "https://via.placeholder.com/80",
        balance: 0,
        role: "user",
        approved: false,
        phone: "",
        refundedOrders: [],
        tier: 1,
        weekBoundary: 0,
        weeklyDiamonds: 0,
        weeklyTotal: 0
      });
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Register failed: " + err.message);
    }
  });
}

// Reset password
if (document.getElementById("resetForm")) {
  document.getElementById("resetForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;
    sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset email sent!"))
      .catch(err => alert("Error: " + err.message));
  });
}