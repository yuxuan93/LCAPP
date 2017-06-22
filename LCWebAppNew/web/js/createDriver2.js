(function () {

    //Login
    const txtEmail = document.getElementById("email");
    const txtPassword = document.getElementById("password");
    const submitBtn = document.getElementById("submit-btn");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");

    const contactNo = document.getElementById("contactNo");
    const companyName = document.getElementById("companyName");

    const driverList = dbRefObject.child('users');
    var lastId;
    dbRefObject.child('lastDriverId').once("value").then(function (snapshot) {
        lastId = snapshot.val() + 1; // 
    });
    submitBtn.addEventListener('click', e => {
        // Get email and pass
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        const fn = firstName.value;
        const ln = lastName.value;
        const contactNum = contactNo.value;
        const coName = companyName.value;
        
        // Sign in
        const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise.then((authData) => {
            alert("Driver " + authData.email + " is successfully created!");
            var driver = {
                email: email,
                firstName: fn,
                lastName: ln,
                contactNo: contactNum,
                companyName: coName,
                priviledge: "driver",
                driverId: lastId
            }
            driverList.push(driver);
            dbRefObject.update({lastDriverId: lastId});
            window.location = "createDriver.html";

        })
                .catch(e => alert(e.message));

    });


//          // Add a realtime listener
//          firebase.auth().onAuthStateChanged(firebaseUser => {
//             if(firebaseUser){
//                 console.log(firebaseUser);
//                 window.location = "/LCWebApp/dashboard.html";
//             } 
//          });

}());