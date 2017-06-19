import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View,
  ToolbarAndroid,
  ActivityIndicator
} from 'react-native';

// import {Scene, Router} from 'react-native-router-flux';

import DriverViewNew from './src/pages/DriverViewNew';
//import AddJob from './src/pages/AddJob';
//import ViewAccepted from './src/pages/ViewAccepted';
//import ViewCompleted from './src/pages/ViewCompleted';

//import Signup from './src/pages/Signup';
import Login from './src/pages/Login';
import AdminMain from './src/pages/AdminMain';
//import AdminViewCompleted from './src/pages/AdminViewCompleted';
//import AdminViewCurrent from './src/pages/AdminViewCurrent';

import styles from './src/styles/styles.js';

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCixCWgtPu4hZuWSfITWsmd_kZI2k-q3DU",
  authDomain: "laundry-85fd1.firebaseapp.com",
  databaseURL: "https://laundry-85fd1.firebaseio.com",
  storageBucket: "laundry-85fd1.appspot.com",
};
// Initialize the firebase app here and pass it to other components as needed. Only initialize on startup.
const firebaseApp = firebase.initializeApp(firebaseConfig);

'use strict';


class LCApp extends Component {
  // render() {
  //   return (
  //     <Router>
  //       <Scene key="root">
  //         <Scene key="signup" component={Signup} title="Login" hideNavBar={true} initial/>
  //         <Scene key="main" component={Main} title="Jobs Available"/>
  //         <Scene key="addJob" component={AddJob} title="Add Job" />
  //         <Scene key="viewAccepted" component={ViewAccepted} title="View Accepted" />
  //         <Scene key="viewCompleted" component={ViewCompleted} title="View Completed" />

  //       </Scene>
  //     </Router>
  //   );
  // }

  constructor(props){
    super(props);
    this.state = {
      // the page is the screen we want to show the user, we will determine that
      // based on what user the firebase api returns to us.
      page: null,
      firstName: null,
    };
    this.users = firebaseApp.database().ref("users");

  }

  componentWillMount(){
    // We must asynchronously get the auth state, if we use currentUser here, it'll be null
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
      // If the user is logged in take them to the accounts screen
      if (user != null) {
        this.users.on('value', (snap) => {
          snap.forEach((child) => {

            if(child.val().email==user.email){
            // if(true){
             // Check for priviledges in db
              if(child.val().priviledge=='admin'){                
                this.setState({page: AdminMain, firstName: child.val().firstName});
              }
              else if(child.val().priviledge=='driver'){
                this.setState({page: DriverViewNew, firstName: child.val().firstName});
              }
            }
            
          });
        });        

    
        return;
      }
      // otherwise have them login
      this.setState({page: Login});
      // unsubscribe this observer
      unsubscribe();
    });
  }
  render() {
    if (this.state.page) {
      return (
        // Take the user to whatever page we set the state to.
        // We will use a transition where the new page will slide in from the right.
        <Navigator
          initialRoute={{component: this.state.page}}
          configureScene={() => {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          renderScene={(route, navigator) => {
            if(route.component){
              // Pass the navigator the the page so it can navigate as well.
              // Pass firebaseApp so it can make calls to firebase.
              return React.createElement(route.component, { navigator, firebaseApp});
            }
        }} />
      );
    } else {
      return (
        // Our default loading view while waiting to hear back from firebase
        <View style={styles.container}>
          <ToolbarAndroid title="RN Firebase Auth" />
          <View style={styles.body}>
            <ActivityIndicator size="large" />
          </View>
        </View>
      );
    }
  }

    

  
}


AppRegistry.registerComponent('LCApp', () => LCApp);