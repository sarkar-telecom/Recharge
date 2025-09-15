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

const registerBtn = document.getElementById('registerBtn');
const googleBtn = document.getElementById('googleBtn');
const msg = document.getElementById('msg');
const showRegPass = document.getElementById('showRegPass');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regName = document.getElementById('regName');

// Show/hide password
showRegPass.addEventListener('change',()=>{regPassword.type = showRegPass.checked?'text':'password';});

// Register Email/Password
registerBtn.addEventListener('click',()=>{
  const email = regEmail.value;
  const password = regPassword.value;
  const name = regName.value;
  if(!email||!password||!name){msg.textContent="All fields are required"; return;}

  auth.createUserWithEmailAndPassword(email,password)
    .then(userCredential=>{
      const user = userCredential.user;
      db.collection('users').doc(user.uid).set({
        name: name,
        email: email,
        avatarUrl: 'https://via.placeholder.com/40'
      });
      window.location.href='index.html';
    })
    .catch(e=>msg.textContent=e.message);
});

// Google Sign-Up
googleBtn.addEventListener('click',()=>{
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result=>{
      const user = result.user;
      db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        avatarUrl: user.photoURL || 'https://via.placeholder.com/40'
      }, {merge:true});
      window.location.href='index.html';
    })
    .catch(e=>msg.textContent=e.message);
});