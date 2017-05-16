(function(){
    
    
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
          
          
          
         const btnLogout = document.getElementById("logout-btn");

          // Get elements
          const preObject = document.getElementById('object');
          const jobList = document.getElementById('jobList');
          
          // Create references
          const dbRefObject = firebase.database().ref();
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
                    tr.setAttribute("id",counter);
                    if(counter%2!=0)
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
          
          // Logout
          btnLogout.addEventListener('click', e => {
              firebase.auth().signOut();
              console.log('logging out');
          });
          
          // Add a realtime listener
          firebase.auth().onAuthStateChanged(firebaseUser => {
             if(!firebaseUser){
                 console.log('not logged in');
                 window.location = "http://localhost:8383/LCWebApp/index.html";
             } 
             
          });

}());