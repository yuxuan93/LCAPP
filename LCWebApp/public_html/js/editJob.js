(function () {
    const deleteBtn = document.getElementById("delete-btn");
    const editBtn = document.getElementById("edit-btn");
    const formElements = document.getElementById("my-form").elements;

    const dbRefList = dbRefObject.child('jobs');
    const driverList = dbRefObject.child('users');
    const driverDropdown = document.getElementById('drivers');

    // populate all possible drivers
    driverList.on('child_added', snap => {
        if (snap.val().priviledge == 'driver') {
            driverDropdown.innerHTML = driverDropdown.innerHTML + "<option value='" + snap.val().firstName + "' class='icon-clock'>" + snap.val().firstName + "</option>"
        }

    });

    // populate field
    var key = window.location.search.substring(window.location.search.indexOf("=") + 1);

    var nameField = document.getElementById("name");
    var addressField = document.getElementById("address");
    var postalField = document.getElementById("postalCode");
    var contactField = document.getElementById("contactNo");
    var emailField = document.getElementById("email");
    var driverField = document.getElementById("drivers");
    var itemField = document.getElementById("item");
    var turnaroundField = document.getElementById("turnaround");
//Type                
    var normal = document.getElementById("normal");
    var dry = document.getElementById("dry");
    var load = document.getElementById("load");

    var preferredPickupDateField = document.getElementById("preferredPickupDate");
    var preferredPickupTimeField = document.getElementById("preferredPickupTime");
    var remarksField = document.getElementById("remarks");
    var statusField = document.getElementById("status");

    var invoiceField = document.getElementById("invoiceNo");
    var amountField = document.getElementById("amount");
    var preferredReturnDateField = document.getElementById("preferredReturnDate");
    var preferredReturnTimeField = document.getElementById("preferredReturnTime");
    var reasonField = document.getElementById("reason");
    var completeDateField = document.getElementById("completeDate");
    var jobId;
    dbRefList.child(key).on('value', (snap) => {
        jobId = snap.val().jobId;
        document.getElementById("myHeader").innerHTML = "Edit Job ID: " + jobId;
        nameField.value = snap.val().name;
        addressField.value = snap.val().address;
        postalField.value = snap.val().postalCode;
        contactField.value = snap.val().contactNo;
        emailField.value = snap.val().email;

        var opts = driverField.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value == snap.val().driver) {
                driverField.selectedIndex = j;
                break;
            }

        }

        itemField.value = snap.val().item;

        var opts2 = turnaroundField.options;
        for (var opt, j = 0; opt = opts2[j]; j++) {
            if (opt.value == snap.val().turnaround) {
                turnaroundField.selectedIndex = j;
                break;
            }

        }
        var typeArr = snap.val().type.toString().split(",");
        for (var type, j = 0; type = typeArr[j]; j++) {
            if (type.trim() == "Normal Clean") {
                normal.checked = true;
            } else if (type.trim() == "Dry Clean") {
                dry.checked = true;
            } else if (type.trim() == "Load Wash") {
                load.checked = true;
            }
        }


        preferredPickupDateField.value = snap.val().preferredPickupDate;
        preferredPickupTimeField.value = snap.val().preferredPickupTime;

        remarksField.value = snap.val().remarks;

        var opts3 = statusField.options;
        for (var opt, j = 0; opt = opts3[j]; j++) {
            if (opt.value == snap.val().status) {
                statusField.selectedIndex = j;
                break;

            }

        }
        invoiceField.value = snap.val().invoiceNo;
        amountField.value = snap.val().amount;
        preferredReturnDateField.value = snap.val().preferredReturnDate;
        preferredReturnTimeField.value = snap.val().preferredReturnTime;
        completeDateField.value = snap.val().completeDate;
        reasonField.value = snap.val().reason;

        // Check once if status is collected, completed(wont show alr) or rejected
        if (statusField.options[statusField.selectedIndex].value == "Collected" || statusField.options[statusField.selectedIndex].value == "Completed") {
            document.getElementById("hiddenField1").classList.remove("hide");
            document.getElementById("hiddenField2").classList.add("hide");

            invoiceField.required = true;
            amountField.required = true;


            if (statusField.options[statusField.selectedIndex].value == "Completed") {
                document.getElementById("hiddenField3").classList.remove("hide");
                completeDateField.required = true;
            }
        } else if (statusField.options[statusField.selectedIndex].value == "Rejected") {
            document.getElementById("hiddenField2").classList.remove("hide");
            document.getElementById("hiddenField1").classList.add("hide");
            document.getElementById("hiddenField3").classList.add("hide");
            invoiceField.required = false;
            amountField.required = false;
            completeDateField.required = false;

        } else {
            document.getElementById("hiddenField1").classList.add("hide");
            document.getElementById("hiddenField2").classList.add("hide");
            document.getElementById("hiddenField3").classList.add("hide");
            invoiceField.required = false;
            amountField.required = false;
            completeDateField.required = false;

        }



    }

    );



    //Change detected in status
    $("#status").change(function () {
        // Activate hidden fields if collected or rejected
        if (statusField.options[statusField.selectedIndex].value == "Collected" || statusField.options[statusField.selectedIndex].value == "Completed") {
            document.getElementById("hiddenField1").classList.remove("hide");
            document.getElementById("hiddenField2").classList.add("hide");

            invoiceField.required = true;
            amountField.required = true;

            if (statusField.options[statusField.selectedIndex].value == "Completed") {
                document.getElementById("hiddenField3").classList.remove("hide");
                completeDateField.required = true;
            }
        } else if (statusField.options[statusField.selectedIndex].value == "Rejected") {
            document.getElementById("hiddenField2").classList.remove("hide");
            document.getElementById("hiddenField1").classList.add("hide");
            document.getElementById("hiddenField3").classList.add("hide");
            invoiceField.required = false;
            amountField.required = false;
            completeDateField.required = false;

        } else {
            document.getElementById("hiddenField1").classList.add("hide");
            document.getElementById("hiddenField2").classList.add("hide");
            document.getElementById("hiddenField3").classList.add("hide");
            invoiceField.required = false;
            amountField.required = false;
            completeDateField.required = false;

        }
    });


    // Edit button pressed
    editBtn.addEventListener('click', e => {
        
        // Prompt for form validity check
        if (document.getElementById("my-form").checkValidity()) {

            // Form is valid
            var typeList = "";
            if (formElements[7].checked) {
                if (typeList == "")
                    typeList = formElements[7].value;
                else
                    typeList = typeList + ", " + formElements[7].value;
            }
            if (formElements[8].checked) {
                if (typeList == "")
                    typeList = formElements[8].value;
                else
                    typeList = typeList + ", " + formElements[8].value;
            }
            if (formElements[9].checked) {
                if (typeList == "")
                    typeList = formElements[9].value;
                else
                    typeList = typeList + ", " + formElements[9].value;
            }

            // Form Job Object to be updated
            var job = {
                name: formElements[0].value, //*
                address: formElements[1].value, //Show //*
                postalCode: formElements[2].value, //Show //*
                contactNo: formElements[3].value, //*
                email: formElements[4].value,
                item: formElements[5].value, //*
                turnaround: formElements[6].value, //Show //*            
                type: typeList, //*

                preferredPickupDate: formElements[10].value, //Show 
                preferredPickupTime: formElements[11].value, //Show  
                driver: formElements[12].value,
                remarks: formElements[13].value, //Show
                status: formElements[14].value,

                // IF status collected
                invoiceNo: formElements[15].value,
                amount: formElements[16].value,
                preferredReturnDate: formElements[17].value,
                preferredReturnTime: formElements[18].value,

                reason: formElements[19].value,
                completeDate: formElements[20].value
                        // IF status rejected

            };

            // Show edit confirmation dialog
            if (job.status == "Collected") {
                if (confirm("Are you sure you want to edit this job?\n\n\
                    JobId: " + jobId + "\n\
                    Name: " + job.name + " \n\
                    Address: " + job.address + " \n\
                    Postal Code: " + job.postalCode + "\n\
                    Contact No: " + job.contactNo + "\n\
                    Email: " + job.email + "\n\
                    Item: " + job.item + "\n\
                    Turnaround: " + job.turnaround + "\n\
                    Type: " + job.type + "\n\
                    Preferred Pickup Date: " + job.preferredPickupDate + "\n\
                    Preferred Pickup Time: " + job.preferredPickupTime + "\n\
                    Driver: " + job.driver + "\n\
                    Remarks: " + job.remarks + "\n\
                    Status: " + job.status + "\n\
                    Invoice No: " + job.invoiceNo + "\n\
                    Amount: " + job.amount + "\n\
                    Preferred Return Date: " + job.preferredReturnDate + "\n\
                    Preferred Return Time: " + job.preferredReturnTime + "\n\
                \n") == true) {
                    window.location = "/LCWebApp/dashboard.html?edited&id=" + jobId;
                    dbRefList.child(key).update(job);

                }

            } else if (job.status == "Completed") {
                if (confirm("Are you sure you want to edit this job?\n\n\
                    JobId: " + jobId + "\n\
                    Name: " + job.name + " \n\
                    Address: " + job.address + " \n\
                    Postal Code: " + job.postalCode + "\n\
                    Contact No: " + job.contactNo + "\n\
                    Email: " + job.email + "\n\
                    Item: " + job.item + "\n\
                    Turnaround: " + job.turnaround + "\n\
                    Type: " + job.type + "\n\
                    Preferred Pickup Date: " + job.preferredPickupDate + "\n\
                    Preferred Pickup Time: " + job.preferredPickupTime + "\n\
                    Driver: " + job.driver + "\n\
                    Remarks: " + job.remarks + "\n\
                    Status: " + job.status + "\n\
                    Invoice No: " + job.invoiceNo + "\n\
                    Amount: " + job.amount + "\n\
                    Preferred Return Date: " + job.preferredReturnDate + "\n\
                    Preferred Return Time: " + job.preferredReturnTime + "\n\
                    Complete Date: " + job.completeDate + "\n\
                \n") == true) {
                    window.location = "/LCWebApp/dashboard.html?edited&id=" + jobId;
                    dbRefList.child(key).update(job);

                }

            } else if (job.status == "Rejected") {
                if (confirm("Are you sure you want to edit this job?\n\n\
                    JobId: " + jobId + "\n\
                    Name: " + job.name + " \n\
                    Address: " + job.address + " \n\
                    Postal Code: " + job.postalCode + "\n\
                    Contact No: " + job.contactNo + "\n\
                    Email: " + job.email + "\n\
                    Item: " + job.item + "\n\
                    Turnaround: " + job.turnaround + "\n\
                    Type: " + job.type + "\n\
                    Preferred Pickup Date: " + job.preferredPickupDate + "\n\
                    Preferred Pickup Time: " + job.preferredPickupTime + "\n\
                    Driver: " + job.driver + "\n\
                    Remarks: " + job.remarks + "\n\
                    Status: " + job.status + "\n\
                    Reason: " + job.reason + "\n\
                \n") == true) {
                    window.location = "/LCWebApp/dashboard.html?edited&id=" + jobId;
                    dbRefList.child(key).update(job);

                }

            } else {
                if (confirm("Are you sure you want to edit this job?\n\n\
                    JobId: " + jobId + "\n\
                    Name: " + job.name + " \n\
                    Address: " + job.address + " \n\
                    Postal Code: " + job.postalCode + "\n\
                    Contact No: " + job.contactNo + "\n\
                    Email: " + job.email + "\n\
                    Item: " + job.item + "\n\
                    Turnaround: " + job.turnaround + "\n\
                    Type: " + job.type + "\n\
                    Preferred Pickup Date: " + job.preferredPickupDate + "\n\
                    Preferred Pickup Time: " + job.preferredPickupTime + "\n\
                    Driver: " + job.driver + "\n\
                    Remarks: " + job.remarks + "\n\
                    Status: " + job.status + "\n\
                    Reason: " + job.reason + "\n\
                ") == true) {
                    window.location = "/LCWebApp/dashboard.html?edited&id=" + jobId;

                    dbRefList.child(key).update(job);

                }
            }
        }


    });

    deleteBtn.addEventListener('click', e => {
        // Form is valid
        var typeList = "";
        if (formElements[7].checked) {
            if (typeList == "")
                typeList = formElements[7].value;
            else
                typeList = typeList + ", " + formElements[7].value;
        }
        if (formElements[8].checked) {
            if (typeList == "")
                typeList = formElements[8].value;
            else
                typeList = typeList + ", " + formElements[8].value;
        }
        if (formElements[9].checked) {
            if (typeList == "")
                typeList = formElements[9].value;
            else
                typeList = typeList + ", " + formElements[9].value;
        }

        // Form Job Object to be updated
        var job = {
            name: formElements[0].value, //*
            address: formElements[1].value, //Show //*
            postalCode: formElements[2].value, //Show //*
            contactNo: formElements[3].value, //*
            email: formElements[4].value,
            item: formElements[5].value, //*
            turnaround: formElements[6].value, //Show //*            
            type: typeList, //*

            preferredPickupDate: formElements[10].value, //Show 
            preferredPickupTime: formElements[11].value, //Show  
            driver: formElements[12].value,
            remarks: formElements[13].value, //Show
            status: formElements[14].value,
        };

        // Show edit confirmation dialog
        if (confirm("Are you sure you want to delete this job?\n\n\
            Name: " + job.name + " \n\
            Address: " + job.address + " \n\
            Postal Code: " + job.postalCode + "\n\
            Contact No: " + job.contactNo + "\n\
            Email: " + job.email + "\n\
            Item: " + job.item + "\n\
            Turnaround: " + job.turnaround + "\n\
            Type: " + job.type + "\n\
            Preferred Pickup Date: " + job.preferredPickupDate + "\n\
            Preferred Pickup Time: " + job.preferredPickupTime + "\n\
            Driver: " + job.driver + "\n\
            Remarks: " + job.remarks + "\n\
            Status: " + job.status + "\n\
            JobId: " + jobId + "\n\
        \n\
        ")) {
            dbRefList.child(key).remove();
            window.location = "/LCWebApp/dashboard.html?deleted&id=" + jobId;
        }

    });



}());