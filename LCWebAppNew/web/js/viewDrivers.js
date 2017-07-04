(function () {

//var admin = require("firebase-admin");

// Get elements
    const preObject = document.getElementById('object');
    const driverList = document.getElementById('driverList');
    const dbRefList = dbRefObject.child('users');
    // Sync object changes
//          dbRefObject.on('value', snap => {
//              preObject.innerText = JSON.stringify(snap.val(), null, 3)
//          });
    var items = [];
    var counter = 1;

    // Sync list changes
    dbRefList.on('child_added', snap => {
        if (snap.val().priviledge == "driver") {
            counter = counter + 1;
            const tr = document.createElement('TR');
            tr.setAttribute("id", counter);
            if (counter % 2 != 0)
                tr.classList.add('alt');
            driverList.appendChild(tr);

            const driverIdCol = document.createElement('TD');
            driverIdCol.appendChild(document.createTextNode(snap.val().driverId));
            tr.appendChild(driverIdCol);

            const firstNameCol = document.createElement('TD');
            firstNameCol.appendChild(document.createTextNode(snap.val().firstName));
            tr.appendChild(firstNameCol);

            const lastNameCol = document.createElement('TD');
            lastNameCol.appendChild(document.createTextNode(snap.val().lastName));
            tr.appendChild(lastNameCol);

            const emailCol = document.createElement('TD');
            emailCol.appendChild(document.createTextNode(snap.val().email));
            tr.appendChild(emailCol);

            const contactNoCol = document.createElement('TD');
            contactNoCol.appendChild(document.createTextNode(snap.val().contactNo));
            tr.appendChild(contactNoCol);

            const companyNameCol = document.createElement('TD');
            companyNameCol.appendChild(document.createTextNode(snap.val().companyName));
            tr.appendChild(companyNameCol);
            
            const remarksCol = document.createElement('TD');
            remarksCol.appendChild(document.createTextNode(snap.val().remarks));
            tr.appendChild(remarksCol);

            tr.onclick = function () {
//                DELETE FUNCTION
////            alert("hello");
//                if (confirm("Delete this driver?\n\n\
//Driver Id: " + snap.val().driverId + "\n\
//Display Name: " + snap.val().firstName + " \n") == true) {
//
//                dbRefList.child(snap.key).remove();
//                    admin.auth().getUserByEmail(snap.val().email).delete()
//                            .then(function (userRecord) {
//                                // See the UserRecord reference doc for the contents of userRecord.
//                                alert("Successfully fetched user data:", userRecord.toJSON());
//                            })
//                            .catch(function (error) {
//                                alert("Error fetching user data:", error);
//                            });
//
//                }
//                window.location = "viewDrivers.html";

//                EDIT FUNCTION
                
                window.location = "editDriver.html?id="+snap.key;
            }
        };
    });
}());