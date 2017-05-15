'use strict';
import React, {Component} from 'react';

import {
  ReactNative,
  TouchableHighlight, 
  Text,
  View,
  Navigator
}from 'react-native';

import styles from '../styles/styles.js';

class StatusBar extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
        // Header
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableHighlight style={{padding: 15}}>
            <Text style={styles.primaryButtonText}>            </Text>
          </TouchableHighlight>
          <Text style={styles.navbarTitle}>{this.props.title}</Text>          

          <TouchableHighlight onPress={this.logout.bind(this)} style={{margin: 0, padding: 15, backgroundColor: '#808080'}}>
            <Text style={styles.primaryButtonText}>Logout</Text>
          </TouchableHighlight>
        </View>
    );
  }
  logout() {
    // logout, once that is complete, return the user to the login screen.
    this.props.firebaseApp.auth().signOut().then(() => {
      this.props.navigator.push({
        component: Login
      });
    });
  }
}

module.exports = StatusBar;