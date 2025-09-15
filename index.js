const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.firebasestorage.app",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const userAvatar = document.getElementById('userAvatar');
const avatarDropdown = document.getElementById('avatarDropdown');
const logoutBtn = document.getElementById('logoutBtn');

// Sidebar toggle
menuBtn.addEventListener('click',()=>{sidebar.style.left = sidebar.style.left==='0px' ? '-250px':'0px';});

// Avatar dropdown toggle
userAvatar.addEventListener('click',()=>{avatarDropdown.style.display = avatarDropdown.style.display==='block'?'none':'block';});

// Logout
logoutBtn.addEventListener('click',()=>{auth.signOut().then(()=>{window.location.href='login.html';});});

// Check auth state
auth.onAuthStateChanged(user=>{
  if(!user){window.location.href='login.html'; return;}
  db.collection('users').doc(user.uid).get().then(doc=>{
    if(doc.exists && doc.data().avatarUrl){userAvatar.src=doc.data().avatarUrl;}
  });
});