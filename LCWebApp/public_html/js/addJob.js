(function () {

    const submitBtn = document.getElementById("submit-btn");
    const formElements = document.getElementById("my-form").elements;
    
    const dbRefList = dbRefObject.child('jobs');
    const driverList = dbRefObject.child('users');
    const driverDropdown = document.getElementById('drivers');

    // Get previous jobId
    var lastId;
    dbRefObject.child('lastJobId').once("value").then(function (snapshot) {
        lastId = snapshot.val()+1; // 
    });
    
    //Push to db

    submitBtn.addEventListener('click', e => {
        var typeList = "";
        if(formElements[7].checked){
            if(typeList=="")
                typeList=formElements[7].value;
            else
                typeList = typeList +", "+formElements[7].value;
        }
        if(formElements[8].checked){
            if(typeList=="")
                typeList=formElements[8].value;
            else
                typeList = typeList +", "+ formElements[8].value;           
        }
        if(formElements[9].checked){
            if(typeList=="")
                typeList=formElements[9].value;
            else
                typeList = typeList +", "+ formElements[9].value;
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
            status: 'New',
            jobId: lastId

        };
        dbRefObject.update({lastJobId: lastId});
        dbRefList.push(job);
    });
    
    
    driverList.on('child_added', snap => {
        if(snap.val().priviledge=='driver'){
            driverDropdown.innerHTML = driverDropdown.innerHTML+"<option value='" + snap.val().name + "' class='icon-clock'>" + snap.val().name + "</option>"
        }

    });

}());