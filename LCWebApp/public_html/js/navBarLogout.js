/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

    // Create references
    const dbRefObject = firebase.database().ref();

    const btnLogout = document.getElementById("logout-btn");
    
    
     // Logout
    btnLogout.addEventListener('click', e => {
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
    
    function showEditedNotif() {
        // Get the snackbar DIV
        var x = document.getElementById("editedNotif")

        // Add the "show" class to DIV
        x.className = "snackbarshow";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("snackbarshow", "hide"); }, 5000);
    }
    
    function showAddedNotif() {
        // Get the snackbar DIV
        var x = document.getElementById("addedNotif")

        // Add the "show" class to DIV
        x.className = "snackbarshow";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("snackbarshow", "hide"); }, 5000);
    }
    
    function showDeletedNotif() {
        // Get the snackbar DIV
        var x = document.getElementById("deletedNotif")

        // Add the "show" class to DIV
        x.className = "snackbarshow";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("snackbarshow", "hide"); }, 5000);
    }