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

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.addEventListener('click',()=>{sidebar.style.left = (sidebar.style.left==='0px') ? '-250px' : '0px';});

// Avatar dropdown
const userAvatar = document.getElementById('userAvatar');
const avatarDropdown = document.getElementById('avatarDropdown');
userAvatar.addEventListener('click',()=>{avatarDropdown.style.display = avatarDropdown.style.display==='block' ? 'none' : 'block';});

// Logout
document.getElementById('logoutBtn').addEventListener('click',()=>{auth.signOut().then(()=>{window.location.href='login.html';});});

// Load user avatar
auth.onAuthStateChanged(user=>{
  if(user){
    db.collection('users').doc(user.uid).get().then(doc=>{
      if(doc.exists && doc.data().avatarUrl){userAvatar.src = doc.data().avatarUrl;}
    });
  }else{window.location.href='login.html';}
});