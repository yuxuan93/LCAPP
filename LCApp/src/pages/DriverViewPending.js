// This page will display 'Pending' jobs assigned to the driver


console.disableYellowBox = true;

import React, { Component, PropTypes } from 'react';
import { 
  View, 
  Text, 
  TouchableHighlight, 
  TextInput, 
  Alert, 
  ListView, 
  ToastAndroid,
 } from 'react-native';
// import {Actions} from 'react-native-router-flux';

import Login from './Login';
import styles from '../styles/styles.js';
import ListItem from '../components/ListItem';
import prompt from 'react-native-prompt-android';

//import AddJob from './AddJob';
import DriverViewAccepted from './DriverViewAccepted';
import DriverViewCollected from './DriverViewCollected';
import DriverViewCompleted from './DriverViewCompleted';

import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';


export default class DriverViewPending extends Component {

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

        <StatusBar title="Pending Jobs"/>

        <ListView dataSource={this.state.dataSource} 
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listview} enableEmptySections={true}/>
        
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
         <ActionButton title="Pending"/>
          <ActionButton2 title="Accepted" onPress={this.goToDriverViewAccepted.bind(this)}/>
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
        if(child.val().status=='Pending' && child.val().driver==this.state.user.email){
          items.push({
            name: child.val().name, 
            contactNo:child.val().contactNo,
            title: child.val().address + " " + child.val().postalCode,
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

   _renderItem(item) {

      const onPress = () => {
        Alert.alert(
          'Details for '+ item.name,
          'Address: '+ item.address 
            + '\nName: ' + item.name 
            + "\nContactNo: " + item.contactNo
            + "\nTitle: " + item.title
            + "\nTurnaround: " + item.turnaround
            + "\nType: " + item.type
            + "\nItem: " + item.item
            + "\nRemarks: " + item.remarks
            + "\nEmail: " + item.email
            + "\nInvoiceNo: " + item.invoiceNo
            + "\nDriver: " + item.driver
            + "\nAmount: " + item.amount

            //Do we need to display the completed date of the job?
            ,
          [
            {text: 'Cancel', onPress: (text) => console.log(text)},
            {text: 'Reject', onPress: () => this._popupRejectionReasonInput(item)},
            {text: 'Accept', onPress: () => this._acceptJob(item)}

          ],
          'default'
        );
      };

      if(item.status=='Pending' && item.driver==this.state.user.email){
        return (
          <ListItem item={item} onPress={onPress}/>
        );
      }
      else{
        return(null);
      }  
    }

// GO TO
    goToDriverViewAccepted(){
    this.props.navigator.push({
      component: DriverViewAccepted
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



  // ACTIONS
  _acceptJob(item){
    this.itemsRef.child(item._key).update({                          
                          status: 'Accepted'})

    ToastAndroid.show('A job has been accepted !', ToastAndroid.LONG);
    
    this.setState({selectedMarker: this.defaultMarker})

  }

  _rejectJob(item, reason){

    this.itemsRef.child(item._key).update({                          
                          status: 'Rejected', reason: reason})

    ToastAndroid.show('A job has been rejected !', ToastAndroid.LONG);
    
    this.setState({selectedMarker: this.defaultMarker})

  }

  _popupRejectionReasonInput(item){
     prompt(
      'You have decided to reject ' + item.name +'. What is the reason?',
      null,
      [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
       {text: 'OK', onPress: reason => this._rejectJob(item, reason)},
      ],
      {
          type: 'default',
          cancelable: false,
          defaultValue: '',
          placeholder: ''
      }
    );
  }

}