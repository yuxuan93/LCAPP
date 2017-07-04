'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const styles = require('../styles/styles.js')
const { View, TouchableHighlight, Text } = ReactNative;

class ListItem extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>
          <Text style={styles.boldliText}>Job ID: {this.props.item.jobId}</Text>
          <Text style={styles.liText}>Pref Return Date: {this.props.item.preferredReturnDate}</Text>
          <Text style={styles.liText}>Address: {this.props.item.address}</Text>
          <Text style={styles.liText}>Cust Name: {this.props.item.name}</Text>

        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = ListItem;