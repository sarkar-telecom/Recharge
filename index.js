import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

const avatarEl = document.getElementById("userAvatar");
const dropdown = document.getElementById("dropdown");
const logoutBtn = document.getElementById("logoutBtn");

// Toggle dropdown
avatarEl.addEventListener('click',()=>{dropdown.style.display = dropdown.style.display==='block'?'none':'block';});

// Logout
logoutBtn.addEventListener('click',()=>{signOut(auth).then(()=>{window.location.href='login.html';});});

// Check user login
onAuthStateChanged(auth,user=>{
  if(user){
    getDoc(doc(db,'users',user.uid)).then(docSnap=>{
      if(docSnap.exists()){avatarEl.src=docSnap.data().avatarUrl||'https://via.placeholder.com/40';}
    });
  } else {window.location.href='login.html';}
});