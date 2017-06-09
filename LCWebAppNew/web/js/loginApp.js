(function(){
	// Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyCixCWgtPu4hZuWSfITWsmd_kZI2k-q3DU",
	    authDomain: "laundry-85fd1.firebaseapp.com",
	    databaseURL: "https://laundry-85fd1.firebaseio.com",
	    projectId: "laundry-85fd1",
	    storageBucket: "laundry-85fd1.appspot.com",
	    messagingSenderId: "624037065494"
	  };
	  firebase.initializeApp(config);
          
          
          //Login
	  const txtEmail = document.getElementById("login-name");
  	  const txtPassword = document.getElementById("login-pass");
  	  const btnLogin = document.getElementById("login-btn");

          btnLogin.addEventListener('click', e => {
             // Get email and pass
             const email = txtEmail.value;
             const pass = txtPassword.value;
             const auth = firebase.auth();
             // Sign in
             const promise = auth.signInWithEmailAndPassword(email, pass);
             promise.catch (e => console.log(e.message));        

          });
          

          // Add a realtime listener
          firebase.auth().onAuthStateChanged(firebaseUser => {
             if(firebaseUser){
                 console.log(firebaseUser);
                 window.location = "dashboard.html";
             } 
          });

}());