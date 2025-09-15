import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ----- Header / Sidebar -----
const menuToggle=document.getElementById("menuToggle");
const sidebar=document.getElementById("sidebar");
const overlay=document.getElementById("overlay");
const avatarBtn=document.getElementById("avatarBtn");
const profileLink=document.getElementById("profileLink");
const authLink=document.getElementById("authLink");

menuToggle.addEventListener("click",()=>{sidebar.classList.add("open");overlay.style.display="block";});
overlay.addEventListener("click",()=>{sidebar.classList.remove("open");overlay.style.display="none";});
avatarBtn?.addEventListener("click",()=>avatarBtn.parentElement.classList.toggle("show"));

let touchStartX=0,touchEndX=0;
document.addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].screenX);
document.addEventListener('touchend',e=>{
  touchEndX=e.changedTouches[0].screenX;
  if(touchStartX<50&&touchEndX-touchStartX>50){sidebar.classList.add("open");overlay.style.display="block";}
  if(touchStartX-touchEndX>50){sidebar.classList.remove("open");overlay.style.display="none";}
});

// ----- Firebase Auth UI -----
onAuthStateChanged(auth,user=>{
  if(user){
    avatarBtn.src=user.photoURL||'https://via.placeholder.com/40';
    profileLink.href='profile.html';
    authLink.textContent='Logout';
    authLink.onclick=function(){signOut(auth).then(()=>window.location.href='login.html');};
  } else {
    avatarBtn.src='https://via.placeholder.com/40';
    profileLink.href='login.html';
    authLink.textContent='Login';
    authLink.onclick=null;
  }
});

// ----- Page Specific Functions -----
// Login/Register/Dashboard code here (reuse previous main.js logic)