import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator
} from 'react-native';
import React, {Component} from 'react';
import DriverViewNew from './DriverViewNew';
import AdminMain from './AdminMain';

import styles from '../styles/styles.js';

export default class Login extends Component {

  constructor(props){
    super(props);

    this.users = this.props.firebaseApp.database().ref("users");

    // We have the same props as in our signup.js file and they serve the same purposes.
    this.state = {
      loading: false,
      email: '',
      password: '',
      priviledge: '',
    }
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder={"Email Address"} />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          placeholder={"Password"} />
        <TouchableHighlight onPress={this.getPriviledges.bind(this)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableHighlight>
        
      </View>;

    // A simple UI with a toolbar, and content below it.
        return (
                <View style={styles.container}>
                        <ToolbarAndroid
          style={styles.toolbar}
          title="Login" />
        <View style={styles.body}>
          {content}
        </View>
      </View>
                );
  }

  login(){
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    this.props.firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password
    ).then((userData) =>
      {
        this.setState({
          loading: false
        });
        if(this.state.priviledge=='admin'){
          this.props.navigator.push({
            component: AdminMain
          });
        }
        else if(this.state.priviledge=='driver'){
          this.props.navigator.push({
            component: DriverViewNew
          });
        }
      }
    ).catch((error) =>
        {
            this.setState({
              loading: false
            });
        alert('Login Failed. Please try again');
    });
  }


  // Loop through database for user priviledges, if have, then set state loading false, and go to screen(admin or driver)
  getPriviledges(){
    this.users.on('value', (snap) => {
      snap.forEach((child) => {

        if(child.val().email==this.state.email){
        // if(true){
         // Check for priviledges in db
          if(child.val().priviledge=='admin'){
            this.state.priviledge = 'admin';
          }
          else if(child.val().priviledge=='driver'){
            this.state.priviledge = 'driver';
          }
          this.login();
        }
        
      });
    });

  }

  // Go to the signup page
  goToSignup(){
    this.props.navigator.push({
      component: Signup
    });
  }
}

AppRegistry.registerComponent('Login', () => Login);