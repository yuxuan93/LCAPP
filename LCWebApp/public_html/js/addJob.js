(function () {


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



    const btnSubmit = document.getElementById("submit-btn");

    

    // Logout
    btnSubmit.addEventListener('click', e => {
        firebase.auth().signOut();
        console.log('logging out');
    });

    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (!firebaseUser) {
            console.log('not logged in');
            window.location = "/LCWebApp/index.html";
        }

    });
    
    
    

}());