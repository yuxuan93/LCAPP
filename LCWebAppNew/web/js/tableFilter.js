function myFunction() {
    // Declare variables
    var input1, input2, input3, filter1, filter2, filter3, jobList, tr, td1, td2, i;


    input1 = document.getElementById("driverFilter");
    filter1 = input1.value.toUpperCase();
    
    input2 = document.getElementById('statusFilter');
    filter2 = input2.value.toUpperCase();
    
    input3 = document.getElementById("filterDate");
    filter3 = input3.value.toUpperCase();

    jobList = document.getElementById("jobList");
    tr = jobList.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[4];
        td2 = tr[i].getElementsByTagName("td")[6];
        td3 = tr[i].getElementsByTagName("td")[5];
        if (td1.innerHTML.toUpperCase().indexOf(filter1) > -1 && td2.innerHTML.toUpperCase().indexOf(filter2) > -1) {
            if (filter3 != "" && td3.innerHTML.toUpperCase() == filter3) {
                // SHOW
                tr[i].style.display = "";
                tr[i].classList.remove("tableexport-ignore");
            }
            else if( filter3==""){
                // SHOW
                tr[i].style.display = "";
                tr[i].classList.remove("tableexport-ignore");
            }
            else {
                // HIDE
                tr[i].style.display = "none";
                tr[i].classList.add("tableexport-ignore");
            }
            
        } else {
            tr[i].style.display = "none";
            tr[i].classList.add("tableexport-ignore");
        }
    }


}
function myFunction2() {
    // Declare variables
    var input1, input2, input3, filter1, filter2, filter3, jobList, tr, td1, td2, i;


    input1 = document.getElementById("driverFilter");
    filter1 = input1.value.toUpperCase();
    input2 = document.getElementById("startFilterDate");
    filter2 = input2.value.toUpperCase();
    input3 = document.getElementById("endFilterDate");
    filter3 = input3.value.toUpperCase();



    jobList = document.getElementById("jobList");
    tr = jobList.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[3];
        td2 = tr[i].getElementsByTagName("td")[10];
        if (td1.innerHTML.toUpperCase().indexOf(filter1) > -1 && td2.innerHTML.toUpperCase() >= filter2 && td2.innerHTML.toUpperCase() <= filter3) {
            tr[i].style.display = "";
            tr[i].classList.remove("tableexport-ignore")
        } else {
            tr[i].style.display = "none";
            tr[i].classList.add("tableexport-ignore");
        }
    }


}
