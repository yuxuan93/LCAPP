// This page will display 'accepted' jobs pertaining to the driver

console.ignoredYellowBox = ['Warning: ReactNative.createElement'];


import Geocoder from '../Geocoder';
Geocoder.setApiKey('AIzaSyBge0_uc7Iqv0ZxisNFabbxflD6PBm2Sm8');

import React, {Component, PropTypes} from 'react';
// import {Actions} from 'react-native-router-flux';
import firebase from '../../modules/firebase.js';
import MapView , {Marker} from 'react-native-maps';
import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';
import prompt from 'react-native-prompt-android';

import ListItem from '../components/ListItem';
import styles from '../styles/styles.js';

import {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
  TextInput, 
  Navigator,
  Button,
  Linking,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,

} from 'react-native';

import DriverViewPending from './DriverViewPending';
import DriverViewCollected from './DriverViewCollected';
import DriverViewCompleted from './DriverViewCompleted';

export default class DriverViewAccepted extends Component {
  constructor(props) {
    super(props);

    this.itemsRef = this.props.firebaseApp.database().ref("jobs");
    
    this.state = {
      user: this.props.firebaseApp.auth().currentUser,
      loading: true,      
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }

  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
    // const userData = this.props.firebaseApp.auth().currentUser;
    this.setState({
      // user: userData,
      loading: false
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Accepted Jobs"/>

        <ListView dataSource={this.state.dataSource} 
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listview} enableEmptySections={true}/>
        

        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
         <ActionButton2 title="Pending" onPress={this.goToDriverViewPending.bind(this)}/>
          <ActionButton title="Accepted" />
          <ActionButton2 title="Collected" onPress={this.goToDriverViewCollected.bind(this)}/>
          <ActionButton2 title="Completed" onPress={this.goToDriverViewCompleted.bind(this)}/> 
        </View>
      </View>

    );
  }

   listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        if(child.val().status=='Accepted' && child.val().driver==this.state.user.email){
          items.push({
            jobId: child.val().jobId,            
            name: child.val().name, 
            contactNo:child.val().contactNo,
            address: child.val().address + " " + child.val().postalCode,
            turnaround: child.val().turnaround, //Show
            type: child.val().type, 
            item: child.val().item,
            remarks: child.val().remarks, //Show
            email: child.val().email, 
            preferredPickupDate: child.val().preferredPickupDate, //Show
            preferredPickupTime: child.val().preferredPickupTime, //Show 
            status: child.val().status,
            invoiceNo: child.val().invoiceNo,
            driver: child.val().driver,
            amount: child.val().amount,
            _key: child.key
          });
        }
      });
      
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
      
    });
  }


  // Each item on press, will trigger alert
   _renderItem(item) {

      const onPress = () => {
        Alert.alert(
         'Details for Job ID: '+ item.jobId,
          'Customer Name: '+ item.name 
            + '\nAddress: ' + item.address             
            + "\nContact Number: " + item.contactNo
            // + "\nTitle: " + item.title
            + "\nTurnaround: " + item.turnaround
            + "\nType: " + item.type
            + "\nItem: " + item.item
            + "\nPreferred Pickup Date: " + item.preferredPickupDate
            + "\nPreferred Pickup Time: " + item.preferredPickupTime
            + "\nRemarks: " + item.remarks

            // + "\nEmail: " + item.email
            // + "\nDriver: " + item.driver
            // + "\nInvoiceNo: " + item.invoiceNo
            // + "\nAmount: " + item.amount
            // + "\nPreferredReturnDate: " + item.preferredReturnDate
            // + "\nPreferredReturnTime: " + item.preferredReturnTime
            ,
          [
            // {text: 'Cancel', onPress: (text) => console.log('Cancel')},          
            {text: 'Delete', onPress: () => this._popupRejectionReasonInput(item)},
            {text: 'Navigate', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
            {text: 'Collected', onPress: () => this._showInvoicePrompt(item)}

          ],
          'default'
        );
      };

      if(item.status=='Accepted' && item.driver==this.state.user.email){
        return (
          <ListItem item={item} onPress={onPress}/>
        );
      }
      else{
        return(null);
      }  
    }



    // GO TO
   
  goToDriverViewPending(){
    this.props.navigator.push({
      component: DriverViewPending
    });
  }
  
  goToDriverViewCompleted(){
    this.props.navigator.push({
      component: DriverViewCompleted
    });
  }

  goToDriverViewCollected(){
    this.props.navigator.push({
      component: DriverViewCollected
    });
  }


//ACTIONS

_rejectJob(item, reason){

    this.itemsRef.child(item._key).update({status: 'Rejected', reason: reason})

    ToastAndroid.show('A job has been deleted!', ToastAndroid.LONG);
    
    this.setState({selectedMarker: this.defaultMarker})

  }

  _popupRejectionReasonInput(item){
     prompt(
      // 'What is the problem?',
      'What\'s the reason for deleting ' + item.name +'?',
      'Note there will be demerit points awarded if the reason is invalid.',
      [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
       {text: 'OK', onPress: reason => this._rejectJob(item, reason)},
      ],
      {
          type: 'default',
          cancelable: false,
          defaultValue: '',
          placeholder: 'Reason?'
      }
    );
  }


// Prompt for invoice
_showInvoicePrompt(item){
  prompt(
    'Enter invoice number',
    null,
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: invoiceNo => this._showAmtPrompt(item,invoiceNo)},
    ],
    {
        type: 'default',
        cancelable: false,
        defaultValue: '',
        placeholder: '000000'
    }
  );
}
// Prompt for invoice
_showAmtPrompt(item, invoiceNo){
  prompt(
    'Enter amount collected. (SGD)',
    null,
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: amt => this._showDatePrompt(item, invoiceNo, amt)},
    ],
    {
        type: 'default',
        cancelable: false,
        defaultValue: '',
        placeholder: ''
    }
  );
}
_showDatePrompt(item,invoiceNo,amt){
   prompt(
    'Is there a preferred return date?',
    null,
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: date => this._showTimePrompt(item, invoiceNo, amt, date)},
    ],
    {
        type: 'default',
        cancelable: false,
        defaultValue: '',
        placeholder: 'DD/MM/YY'
    }
  );
  
}
_showTimePrompt(item,invoiceNo,amt,date){
  prompt(
    'Is there a preferred return time?',
    null,
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: time => this._collectJob(item, invoiceNo, amt,date,time)},
    ],
    {
        type: 'default',
        cancelable: false,
        defaultValue: '',
        placeholder: ''
    }
  );
}

// Update the job as complete in database
  _collectJob(item, invoiceNo, amt, date, time){
    this.itemsRef.child(item._key).update({
      status: 'Collected', 
      invoiceNo: invoiceNo, 
      amount: '$'+amt,
      preferredReturnDate: date,
      preferredReturnTime: time
      }),

    ToastAndroid.show('The job has been collected !', ToastAndroid.LONG);

    this.setState({selectedMarker: this.defaultMarker})

  }
//      // Prompt confirmation of deletion
// _cfmUncomplete(item){
//   Alert.alert(
//     'Are you sure you want to uncomplete '+ item.title +'?',
//     'Address: '+ item.title +'\ncontactNo: '+item.contactNo + '\nThere will be consequences.',
//     [
//       //{text: 'Navigate', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
//       {text: 'Uncomplete', onPress: (text) => this._uncomplete(item)},
//       {text: 'Cancel', onPress: (text) => console.log('Cancel')}
//     ],
//     'default'
//   );
// }

// // Change the job status back to unassigned
//   _uncomplete(item){
//     this.itemsRef.child(item._key).update({status: 'accepted', invoiceNo:''})

//     ToastAndroid.show('The Job has been un-completed!', ToastAndroid.LONG);

//     this.setState({selectedMarker: this.defaultMarker})

//   }


}

