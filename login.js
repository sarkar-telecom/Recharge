// Firebase Config
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

// Elements
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');
const registerBtn = document.getElementById('registerBtn');
const forgotBtn = document.getElementById('forgotBtn');
const msg = document.getElementById('msg');
const showPass = document.getElementById('showPass');
const rememberMe = document.getElementById('rememberMe');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Show/hide password
showPass.addEventListener('change',()=>{passwordInput.type = showPass.checked ? 'text':'password';});

// Login Email/Password
loginBtn.addEventListener('click',()=>{
  const email = emailInput.value;
  const password = passwordInput.value;
  const persistence = rememberMe.checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
  auth.setPersistence(persistence)
    .then(()=> auth.signInWithEmailAndPassword(email,password))
    .then(()=> window.location.href='index.html')
    .catch(e=> msg.textContent = e.message);
});

// Google Login
googleBtn.addEventListener('click',()=>{
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result=>{
      const user = result.user;
      db.collection('users').doc(user.uid).set({
        email: user.email,
        avatarUrl: user.photoURL || 'https://via.placeholder.com/40'
      }, {merge:true});
      window.location.href='index.html';
    })
    .catch(e=> msg.textContent = e.message);
});

// Register button
registerBtn.addEventListener('click',()=>{window.location.href='register.html';});

// Forgot password
forgotBtn.addEventListener('click',()=>{
  const email = emailInput.value;
  if(!email){msg.textContent="Enter your email first"; return;}
  auth.sendPasswordResetEmail(email)
    .then(()=>{msg.style.color="#0f0"; msg.textContent="Password reset email sent!";})
    .catch(e=>{msg.style.color="#f00"; msg.textContent=e.message;});
});