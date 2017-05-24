(function () {


// Get elements
    const preObject = document.getElementById('object');
    const jobList = document.getElementById('jobList');
    const dbRefList = dbRefObject.child('jobs');
    // Sync object changes
//          dbRefObject.on('value', snap => {
//              preObject.innerText = JSON.stringify(snap.val(), null, 3)
//          });

    var items = [];
    var counter = 1;
    // Sync list changes
    dbRefList.on('child_added', snap => {
        if (snap.val().status == "Completed") {
            counter = counter + 1;
            const tr = document.createElement('TR');
            tr.setAttribute("id", counter);
            if (counter % 2 != 0)
                tr.classList.add('alt');
            jobList.appendChild(tr);
            const jobIdCol = document.createElement('TD');
            jobIdCol.appendChild(document.createTextNode(snap.val().jobId));
            tr.appendChild(jobIdCol);
            const nameCol = document.createElement('TD');
            nameCol.appendChild(document.createTextNode(snap.val().name));
            tr.appendChild(nameCol);
            const addressCol = document.createElement('TD');
            addressCol.appendChild(document.createTextNode(snap.val().address));
            tr.appendChild(addressCol);
            const driverCol = document.createElement('TD');
            driverCol.appendChild(document.createTextNode(snap.val().driver));
            tr.appendChild(driverCol);
            const pickupDateCol = document.createElement('TD');
            pickupDateCol.appendChild(document.createTextNode(snap.val().preferredPickupDate));
            tr.appendChild(pickupDateCol);
            const statusCol = document.createElement('TD');
            statusCol.appendChild(document.createTextNode(snap.val().status));
            tr.appendChild(statusCol);
            tr.onclick = function () {
                if (confirm("Edit this job?\n\n\
                        JobId: " + snap.val().jobId + "\n\
                        Name: " + snap.val().name + " \n\
                        Address: " + snap.val().address + " \n\
                        Postal Code: " + snap.val().postalCode + "\n\
                        Contact No: " + snap.val().contactNo + "\n\
                        Email: " + snap.val().email + "\n\
                        Item: " + snap.val().item + "\n\
                        Turnaround: " + snap.val().turnaround + "\n\
                        Type: " + snap.val().type + "\n\
                        Preferred Pickup Date: " + snap.val().preferredPickupDate + "\n\
                        Preferred Pickup Time: " + snap.val().preferredPickupTime + "\n\
                        Driver: " + snap.val().driver + "\n\
                        Remarks: " + snap.val().remarks + "\n\
                        Status: " + snap.val().status + "\n\n\
                        Invoice No: " + snap.val().invoiceNo + "\n\
                        Amount: " + snap.val().amount + "\n\
                        Preferred Return Date: " + snap.val().preferredReturnDate + "\n\
                        Preferred Return Time: " + snap.val().preferredReturnTime + "\n\
                    \n") == true) {

                    // FOR EASY DELETION
//                dbRefList.child(snap.key).remove();
//                window.location = "/LCWebApp/dashboard.html";

//                // Send the key over - snap.key
                    window.location = "/LCWebApp/editJob.html?key=" + snap.key;
                }
            };
        }





    });
}());