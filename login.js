// Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.firebasestorage.app",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};
firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.firestore();

var loginBtn = document.getElementById('loginBtn');
var googleBtn = document.getElementById('googleBtn');
var registerBtn = document.getElementById('registerBtn');
var forgotBtn = document.getElementById('forgotBtn');
var msg = document.getElementById('msg');
var showPass = document.getElementById('showPass');
var rememberMe = document.getElementById('rememberMe');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');

// Show/Hide Password
showPass.addEventListener('change',function(){
  passwordInput.type = showPass.checked ? 'text':'password';
});

// Email/Password Login
loginBtn.addEventListener('click',function(){
  var email = emailInput.value;
  var password = passwordInput.value;
  var persistence = rememberMe.checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;

  auth.setPersistence(persistence)
    .then(function(){
      return auth.signInWithEmailAndPassword(email,password);
    })
    .then(function(){
      window.location.href='index.html';
    })
    .catch(function(e){
      msg.style.color = 'red';
      msg.textContent = e.message;
    });
});

// Google Login
googleBtn.addEventListener('click',function(){
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(function(result){
      var user = result.user;
      db.collection('users').doc(user.uid).set({
        email: user.email,
        avatarUrl: user.photoURL || 'https://via.placeholder.com/40'
      }, {merge:true});
      window.location.href='index.html';
    })
    .catch(function(e){
      msg.style.color = 'red';
      msg.textContent = e.message;
    });
});

// Register Redirect
registerBtn.addEventListener('click',function(){
  window.location.href='register.html';
});

// Forgot Password
forgotBtn.addEventListener('click',function(){
  var email = emailInput.value;
  if(!email){msg.style.color='red'; msg.textContent="Enter your email first"; return;}
  auth.sendPasswordResetEmail(email)
    .then(function(){
      msg.style.color = '#0f0';
      msg.textContent = "Password reset email sent!";
    })
    .catch(function(e){
      msg.style.color = 'red';
      msg.textContent = e.message;
    });
});