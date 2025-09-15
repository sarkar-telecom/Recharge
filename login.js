import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.appspot.com",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");
const registerBtn = document.getElementById("registerBtn");
const forgotBtn = document.getElementById("forgotBtn");
const rememberEl = document.getElementById("rememberMe");
const showPass = document.getElementById("showPass");
const msgEl = document.getElementById("msg");

// Show/hide password
showPass.addEventListener('change',()=>{passEl.type = showPass.checked ? 'text' : 'password';});

// Login
loginBtn.addEventListener('click', async()=>{
  const email = emailEl.value.trim();
  const pass = passEl.value.trim();
  if(!email || !pass){msgEl.textContent="⚠️ Enter email & password"; return;}
  msgEl.textContent="⏳ Logging in...";

  const persistence = rememberEl.checked ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);

  signInWithEmailAndPassword(auth,email,pass)
    .then(()=>{window.location.href="index.html";})
    .catch(e=>{msgEl.textContent="❌ "+e.message;});
});

// Google Login
googleBtn.addEventListener('click',()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth,provider)
    .then(res=>{
      const user = res.user;
      setDoc(doc(db,'users',user.uid),{email:user.email,avatarUrl:user.photoURL||'https://via.placeholder.com/40'},{merge:true});
      window.location.href="index.html";
    })
    .catch(e=>{msgEl.textContent="❌ "+e.message;});
});

// Register
registerBtn.addEventListener('click',()=>{window.location.href='register.html';});

// Forgot Password
forgotBtn.addEventListener('click',()=>{
  const email = emailEl.value.trim();
  if(!email){msgEl.textContent="⚠️ Enter your email first"; return;}
  sendPasswordResetEmail(auth,email).then(()=>{msgEl.textContent="📩 Reset email sent!";}).catch(e=>{msgEl.textContent="❌ "+e.message;});
});