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
        if (snap.val().status != "Completed") {
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
                alert("HELLO");

//                $.ajax({
//                    type: "POST",
//                    username: "ACb8b5d43c4036b57e6fa97c05ced16e51",
//                    password: "b6eed83aa8ae930883d08835da084c8d",
//                    url: "https://api.twilio.com/2010-04-01/Accounts/AC67bf2dccdfe1e96411f237adab4472f1/Messages.json",
//                    data: {
//                        "To": "+6590937283",
//                        "From": "+12569603664",
//                        "Body": "From jQuery AJAX"
//                    },
//                    success: function (data) {
//                        console.log(data);
//                    },
//                    error: function (data) {
//                        console.log(data);
//                    }
//                });


                var accountSid = "AC67bf2dccdfe1e96411f237adab4472f1";
                var authToken = "0c28064c5dc5b65bd47da21d9b656e1b";
                var fromNumber = "+12569603664";
                var toNumber = "+6590937283";
                var text = "It works!";

// pure JS solution
                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function (e) {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            console.log(xhttp.responseText)
                        } else {
                            console.log("Error", xhttp.statusText);
                        }
                    }
                };

                xhttp.open("POST", "https://" + accountSid + ":" + authToken + "@api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("From=" + encodeURIComponent(fromNumber) + "&To=" + encodeURIComponent(toNumber) + "&Body=" + encodeURIComponent(text));

// jQuery solution
//                $.ajax({
//                    url: "https://" + accountSid + ":" + authToken + "@api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages",
//                    type: "POST",
//                    data: "From=" + encodeURIComponent(fromNumber) + "&To=" + encodeURIComponent(toNumber) + "&Body=" + encodeURIComponent(text),
//                    success: function (data, textStatus, jqXHR) {
//                        console.log(data);
//                    },
//                    error: function (jqXHR, textStatus, errorThrown) {
//                        console.log(textStatus);
//                    }
//                });
                
 
// var twilio = require('twilio');
//
//// Find your account sid and auth token in your Twilio account Console.
//var client = twilio('AC67bf2dccdfe1e96411f237adab4472f1', '0c28064c5dc5b65bd47da21d9b656e1b');
// 
//// Send the text message.
//client.sendMessage({
//  to: '+6590937283',
//  from: '+12569603664',
//  body: 'Hello from Twilio!'
//});
                if (snap.val().status == "Collected") {
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
                } else if (snap.val().status == "Rejected") {
                    if (confirm("Edit this job?\n\n\
                        JobId: " + snap.val().jobId + "\n\
                        Name: " + snap.val().name + " \n\
                        Address: " + snap.val().address + " \n\
                        Postal Code: " + snap.val().postalCode + "\n\
                        Contact No: " + snap.val().contactNo + "\n\
                        Email: " + snap.val().email + "\n\
                        Item: " + snap.val().item + "\n\
                        Type: " + snap.val().type + "\n\
                        Preferred Pickup Date: " + snap.val().preferredPickupDate + "\n\
                        Preferred Pickup Time: " + snap.val().preferredPickupTime + "\n\
                        Driver: " + snap.val().driver + "\n\
                        Remarks: " + snap.val().remarks + "\n\
                        Status: " + snap.val().status + "\n\n\
                        Reason: " + snap.val().reason + "\n\
                    \n") == true) {

                        // FOR EASY DELETION
//                dbRefList.child(snap.key).remove();
//                window.location = "/LCWebApp/dashboard.html";

//                // Send the key over - snap.key
                        window.location = "/LCWebApp/editJob.html?key=" + snap.key;

                    }
                } else {
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
                    \n") == true) {

                        // FOR EASY DELETION
//                dbRefList.child(snap.key).remove();
//                window.location = "/LCWebApp/dashboard.html";

//                // Send the key over - snap.key
                        window.location = "/LCWebApp/editJob.html?key=" + snap.key;
                    }
                }

            }
        }
        ;
    });
}());