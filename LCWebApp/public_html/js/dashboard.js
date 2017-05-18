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

        const statusCol = document.createElement('TD');
        statusCol.appendChild(document.createTextNode(snap.val().status));
        tr.appendChild(statusCol);

    });

    console.log(items);
    
}());