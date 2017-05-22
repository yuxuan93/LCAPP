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
            driverDropdown.innerHTML = driverDropdown.innerHTML + "<option value='" + snap.val().name + "' class='icon-clock'>" + snap.val().name + "</option>"
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


    }

    );


    //Push to db

    editBtn.addEventListener('click', e => {

        if (confirm("Are you sure you want to edit this job?\n\n\
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
        ") == true) {
//            dbRefObject.update({lastJobId: lastId});
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
            dbRefList.child(key).update(job);
        } else {
        }

    });





}());