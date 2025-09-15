import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

// ----- Login Page -----
function pageLogin(){
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const msgEl = document.getElementById("msg");
  const rememberMeEl = document.getElementById("rememberMe");
  const showPass = document.getElementById("showPass");
  const loginBtn = document.getElementById("loginBtn");
  const googleBtn = document.getElementById("googleBtn");

  if(!emailEl) return;

  showPass?.addEventListener("change",e=>{passEl.type=e.target.checked?"text":"password";});

  loginBtn?.addEventListener("click",()=>{
    const email=emailEl.value.trim();
    const pass=passEl.value.trim();
    if(!email || !pass){msgEl.textContent="⚠️ Enter email & password"; return;}
    msgEl.textContent="⏳ Logging in...";
    signInWithEmailAndPassword(auth,email,pass).then(()=>{
      msgEl.textContent="✅ Login success!";
      if(rememberMeEl?.checked){
        localStorage.setItem("savedEmail",email);
        localStorage.setItem("savedPass",pass);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPass");
      }
      window.location.href="index.html";
    }).catch(e=>{msgEl.textContent="❌ "+e.message;});
  });

  googleBtn?.addEventListener("click",()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth,provider).then(res=>{
      const user = res.user;
      setDoc(doc(db,'users',user.uid),{email:user.email,avatarUrl:user.photoURL||'https://via.placeholder.com/40'},{merge:true});
      window.location.href="index.html";
    }).catch(e=>{msgEl.textContent="❌ "+e.message;});
  });

  window.addEventListener("load",()=>{
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPass = localStorage.getItem("savedPass");
    if(savedEmail && savedPass){emailEl.value=savedEmail; passEl.value=savedPass; rememberMeEl.checked=true;}
  });

  document.getElementById("forgotBtn")?.addEventListener("click",()=>{
    const email=emailEl.value.trim();
    if(!email){msgEl.textContent="⚠️ Enter your email first"; return;}
    sendPasswordResetEmail(auth,email).then(()=>{msgEl.textContent="📩 Reset email sent!";})
    .catch(e=>{msgEl.textContent="❌ "+e.message;});
  });
}

// ----- Register Page -----
function pageRegister(){
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");
  const confirmEl = document.getElementById("confirmPassword");
  const registerBtn = document.getElementById("registerBtn");
  const googleBtn = document.getElementById("googleBtn");
  const msgEl = document.getElementById("msg");
  const showPass = document.getElementById("showPass");
  const loginBtn = document.getElementById("loginBtn");

  if(!emailEl) return;

  showPass?.addEventListener("change",()=>{passEl.type=showPass.checked?'text':'password'; confirmEl.type=passEl.type;});

  registerBtn?.addEventListener("click",()=>{
    const email=emailEl.value.trim();
    const pass=passEl.value.trim();
    const confirm=confirmEl.value.trim();
    if(!email||!pass||!confirm){msgEl.textContent="⚠️ Fill all fields"; return;}
    if(pass!==confirm){msgEl.textContent="❌ Passwords do not match"; return;}
    if(pass.length<6){msgEl.textContent="❌ Password must be at least 6 chars"; return;}
    createUserWithEmailAndPassword(auth,email,pass).then(res=>{
      const user=res.user;
      setDoc(doc(db,'users',user.uid),{email:user.email,avatarUrl:'https://via.placeholder.com/40'},{merge:true});
      msgEl.textContent="✅ Registration successful!";
      setTimeout(()=>window.location.href='login.html',1000);
    }).catch(e=>{msgEl.textContent="❌ "+e.message;});
  });

  googleBtn?.addEventListener("click",()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth,provider).then(res=>{
      const user=res.user;
      setDoc(doc(db,'users',user.uid),{email:user.email,avatarUrl:user.photoURL||'https://via.placeholder.com/40'},{merge:true});
      window.location.href='index.html';
    }).catch(e=>{msgEl.textContent="❌ "+e.message;});
  });

  loginBtn?.addEventListener("click",()=>window.location.href='login.html');
}

// ----- Dashboard Page -----
function pageDashboard(){
  const avatarEl = document.getElementById("userAvatar");
  const dropdown = document.getElementById("dropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const sidebar = document.getElementById("sidebar");

  onAuthStateChanged(auth,user=>{
    if(user){
      getDoc(doc(db,'users',user.uid)).then(docSnap=>{
        if(docSnap.exists()){
          avatarEl.src=docSnap.data().avatarUrl || 'https://via.placeholder.com/40';
        } else {avatarEl.src='https://via.placeholder.com/40';}
      });
    } else {window.location.href='login.html';}
  });

  avatarEl?.addEventListener("click",()=>{dropdown.style.display=dropdown.style.display==='block'?'none':'block';});
  logoutBtn?.addEventListener("click",()=>{signOut(auth).then(()=>window.location.href='login.html');});

  document.getElementById("menuBtn")?.addEventListener("click",()=>{sidebar.style.left=sidebar.style.left==='0px'?' -250px':'0px';});
}

// ----- Profile Page -----
function pageProfile(){
  const avatarEl=document.getElementById("profileAvatar");
  const emailEl=document.getElementById("userEmail");
  const logoutBtn=document.getElementById("logoutBtn");

  onAuthStateChanged(auth,user=>{
    if(user){
      getDoc(doc(db,'users',user.uid)).then(docSnap=>{
        if(docSnap.exists()){
          avatarEl.src=docSnap.data().avatarUrl || 'https://via.placeholder.com/80';
          emailEl.textContent=user.email;
        }
      });
    } else {window.location.href='login.html';}
  });

  logoutBtn?.addEventListener("click",()=>{signOut(auth).then(()=>window.location.href='login.html');});
}

// Run page-specific
pageLogin();
pageRegister();
pageDashboard();
pageProfile();