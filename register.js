import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
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
const confirmEl = document.getElementById("confirmPassword");
const registerBtn = document.getElementById("registerBtn");
const googleBtn = document.getElementById("googleBtn");
const loginBtn = document.getElementById("loginBtn");
const showPass = document.getElementById("showPass");
const msgEl = document.getElementById("msg");

// Show/hide password
showPass.addEventListener('change',()=> {
  const type = showPass.checked ? 'text' : 'password';
  passEl.type = type;
  confirmEl.type = type;
});

// Email/Password Registration
registerBtn.addEventListener('click',()=>{
  const email = emailEl.value.trim();
  const pass = passEl.value.trim();
  const confirm = confirmEl.value.trim();

  if(!email || !pass || !confirm){msgEl.textContent="⚠️ Fill all fields"; return;}
  if(pass !== confirm){msgEl.textContent="❌ Passwords do not match"; return;}
  if(pass.length<6){msgEl.textContent="❌ Password must be at least 6 characters"; return;}

  createUserWithEmailAndPassword(auth,email,pass)
    .then(res=>{
      const user = res.user;
      setDoc(doc(db,'users',user.uid),{email:user.email,avatarUrl:'https://via.placeholder.com/40'},{merge:true});
      msgEl.textContent="✅ Registration successful!";
      setTimeout(()=>{window.location.href="login.html";},1000);
    })
    .catch(e=>{msgEl.textContent="❌ "+e.message;});
});

// Google Sign-Up/Login
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

// Redirect to Login
loginBtn.addEventListener('click',()=>{window.location.href='login.html';});