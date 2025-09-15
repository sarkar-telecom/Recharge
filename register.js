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

const registerBtn = document.getElementById('registerBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const msg = document.getElementById('msg');

registerBtn.addEventListener('click',()=>{
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if(password!==confirm){msg.textContent="Passwords do not match"; return;}
  auth.createUserWithEmailAndPassword(email,password)
    .then(()=>{window.location.href='login.html';})
    .catch(e=>{msg.textContent=e.message;});
});