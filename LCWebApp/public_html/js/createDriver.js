(function(){
	
          //Login
	  const txtEmail = document.getElementById("email");
  	  const txtPassword = document.getElementById("password");
  	  const submitBtn = document.getElementById("submit-btn");

          submitBtn.addEventListener('click', e => {
             // Get email and pass
             const email = txtEmail.value;
             const pass = txtPassword.value;
             const auth = firebase.auth();
             // Sign in
             const promise = auth.createUserWithEmailAndPassword(email, pass);
             promise.then((authData)=>{
                 alert("Driver "+authData.email+" is successfully created!");
                 window.location = "/LCWebApp/drivers.html";
             })
                     .catch (e => alert(e.message));        

          });
          

//          // Add a realtime listener
//          firebase.auth().onAuthStateChanged(firebaseUser => {
//             if(firebaseUser){
//                 console.log(firebaseUser);
//                 window.location = "/LCWebApp/dashboard.html";
//             } 
//          });

}());