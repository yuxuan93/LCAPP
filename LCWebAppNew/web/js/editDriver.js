(function () {
    const deleteBtn = document.getElementById("delete-btn");
    const editBtn = document.getElementById("edit-btn");
    const formElements = document.getElementById("my-form").elements;

//    const dbRefList = dbRefObject.child('jobs');
    const driverList = dbRefObject.child('users');
//    const driverDropdown = document.getElementById('drivers');    

    // populate field
    var key = window.location.search.substring(window.location.search.indexOf("=") + 1);

    var emailField = document.getElementById("email");
//    var passwordField = document.getElementById("password");
    var firstNameField = document.getElementById("firstName");
    var lastNameField = document.getElementById("lastName");
    var contactNoField = document.getElementById("contactNo");
    var companyNameField = document.getElementById("companyName");
    var remarksField = document.getElementById("remarks");

    var driverId;
    
    driverList.child(key).on('value', (snap) => {
        driverId = snap.val().driverId;
        document.getElementById("myHeader").innerHTML = "Edit Driver ID: " + driverId;
        emailField.value = snap.val().email;
        firstNameField.value = snap.val().firstName;
        lastNameField.value = snap.val().lastName;
        contactNoField.value = snap.val().contactNo;
        companyNameField.value = snap.val().companyName;
        remarksField.value = snap.val().remarks;

    }

    );

    // Edit button pressed
    editBtn.addEventListener('click', e => {
        
        // Prompt for form validity check
        if (document.getElementById("my-form").checkValidity()) {

            // Form Job Object to be updated
            var driver = {
                email: formElements[0].value,
                firstName: formElements[2].value, //Show //*
                lastName: formElements[3].value, //Show //*
                contactNo: formElements[4].value, //*
                companyName: formElements[5].value,
                remarks: formElements[6].value, //*                
            };

                if (confirm("Are you sure you want to edit this job?\n\n\
Driver Id: " + driverId + "\n\
Email: " + driver.email + "\n\
First Name: " + driver.firstName + " \n\
Last Name: " + driver.lastName + " \n\
Contact No: " + driver.contactNo + "\n\
Company Name: " + driver.companyName + "\n\
Remarks: " + driver.remarks + "\n\
                \n") == true) {
                    window.location = "viewDrivers.html?edited&id=" + driverId;
                    driverList.child(key).update(driver);

                }
            
            
        }


    });

    deleteBtn.addEventListener('click', e => {
        
//        // Form Job Object to be updated
//            var driver = {
//                email: formElements[0].value,
//                firstName: formElements[2].value, //Show //*
//                lastName: formElements[3].value, //Show //*
//                contactNo: formElements[4].value, //*
//                companyName: formElements[5].value,
//                remarks: formElements[6].value, //*                
//            };
//        if (confirm("Are you sure you want to edit this job?\n\n\
//Driver Id: " + driverId + "\n\
//Email: " + driver.email + "\n\
//First Name: " + driver.firstName + " \n\
//Last Name: " + driver.lastName + " \n\
//Contact No: " + driver.contactNo + "\n\
//Company Name: " + driver.companyName + "\n\
//Remarks: " + driver.remarks + "\n\
//                \n") == true) {
//                    window.location = "viewDrivers.html?edited&id=" + driverId;
//                    driverList.child(key).remove();
//
//                }
    alert("Function not available yet. Please contact YX to manually delete.");


    });
}());