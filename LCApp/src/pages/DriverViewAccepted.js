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

// import prompt from 'react-native-prompt-android';
import Prompt from 'react-native-prompt';

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

import Login from './Login';
import DriverViewNew from './DriverViewNew';
import DriverViewCollected from './DriverViewCollected';
import DriverViewCompleted from './DriverViewCompleted';

export default class DriverViewAccepted extends Component {
  constructor(props) {
    super(props);

    this.itemsRef = this.props.firebaseApp.database().ref("jobs");
    this.usersRef = this.props.firebaseApp.database().ref("users");

    this.state = {
      firstName: '',
      user: this.props.firebaseApp.auth().currentUser,
      loading: true,      
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selectedJob: null,
      invoice: '',
      amt:'',
      date:'',
      time:'',
      promptVisible: false,
      prompt2Visible: false,
      prompt3Visible: false,
      prompt4Visible: false,
      prompt5Visible: false,
      todayDate:'',
    }

  }
  componentWillMount(){
      this.usersRef.on('value', (snap) => {
        snap.forEach((child) => {
          if(child.val().email==this.state.user.email){
              this.setState({firstName:child.val().firstName});
          }
        });
      });
  }
  componentDidMount() {
    this.listenForItems(this.itemsRef);
    // const userData = this.props.firebaseApp.auth().currentUser;
    this.setState({
      // user: userData,
      loading: false
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    this.setState({todayDate:yyyy + '-'+mm + '-' + dd,});
  }

  render() {
    return (
      

      <View style={styles.container}>
               
        <Prompt
            title="Enter invoice number"
            placeholder="XXXX"
            defaultValue=""
            visible={this.state.promptVisible}
            onCancel={() => this.setState({ promptVisible: false, })}
            onSubmit={(value) => this.changeAndSetInvoice(value)}/>

        <Prompt
            title="Enter amount (SGD)"
            placeholder=""
            defaultValue=""
            visible={this.state.prompt2Visible}
            onCancel={() => this.setState({ prompt2Visible: false,})}
            onSubmit={(value) => this.changeAndSetAmt(value)}/>

        <Prompt
            title="Enter Preferred Return Date (yyyy-mm-dd)"
            placeholder="YYYY-MM-DD"
            defaultValue={this.state.todayDate}
            visible={this.state.prompt3Visible}
            onCancel={() => this.setState({ prompt3Visible: false, })}
            onSubmit={(value) => this.changeAndSetDate(value)}/>

        <Prompt
            title="Enter Preferred Return Time"
            placeholder=""
            defaultValue=""
            visible={this.state.prompt4Visible}
            onCancel={() => this.setState({ prompt4Visible: false,})}
            onSubmit={(value) => this._collectJob(this.state.selectedJob, this.state.invoice,  this.state.amt, this.state.date, value) }/>
        <Prompt
            title="Enter reason for rejection (There will be consequences)"
            placeholder=""
            defaultValue=""
            visible={this.state.prompt5Visible}
            onCancel={() => this.setState({ prompt5Visible: false, })}
            onSubmit={(value) => this._rejectJob(this.state.selectedJob, value) }/>

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableHighlight style={{padding: 15}}>
            <Text style={styles.primaryButtonText}>            </Text>
          </TouchableHighlight>
          <Text style={styles.navbarTitle}>Accepted Jobs</Text>          

          <TouchableHighlight onPress={this.logout.bind(this)} style={{margin: 0, padding: 15, backgroundColor: '#808080'}}>
            <Text style={styles.primaryButtonText}>Logout</Text>
          </TouchableHighlight>
        </View>

        <ListView dataSource={this.state.dataSource} 
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listview} enableEmptySections={true}/>
        

        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
         <ActionButton2 title="New" onPress={this.goToDriverViewNew.bind(this)}/>
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

        if(child.val().status=='Accepted' && child.val().driver==this.state.firstName){//this.state.user.email.substring(0,this.state.user.email.indexOf("@"))){
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
            {text: 'Reject', onPress: () => this._popupRejectionReasonInput(item)},
            {text: 'Call/Navigate', onPress: () => this._openCallMap(item)},
            {text: 'Collected', onPress: () => this._showInvoicePrompt(item)}

          ],
          'default'
        );
      };

      if(item.status=='Accepted' && item.driver==this.state.firstName){//.user.email.substring(0,this.state.user.email.indexOf("@"))){
        return (
          <ListItem item={item} onPress={onPress}/>
        );
      }
      else{
        return(null);
      }  
    }


    _openCallMap(item){
      Alert.alert(
        'Please choose your action for job ID '+ item.jobId+',',
        'Customer Name: '+ item.name 
        + '\nAddress: ' + item.address  
        + "\nContact Number: " + item.contactNo
        ,
        [
          null,
          {text: 'Call', onPress: () => Linking.openURL('tel:'+ encodeURIComponent(item.contactNo))},          
          {text: 'Navigate', onPress: () => Linking.openURL('https://maps.google.com?q='+item.address)},
        ],
        'default'
        );
    }
    // GO TO
   
  goToDriverViewNew(){
    this.props.navigator.push({
      component: DriverViewNew
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

_rejectJob(selectedJob, reason){

    this.itemsRef.child(selectedJob._key).update({status: 'Rejected', reason: reason})

    ToastAndroid.show('A job has been deleted!', ToastAndroid.LONG);
    
    // this.setState({selectedMarker: this.defaultMarker})
    this.setState({ prompt5Visible: false,});
  }
_popupRejectionReasonInput(item){
    this.setState({ prompt5Visible: true, selectedJob: item});
}
  


// Prompt for invoice
_showInvoicePrompt(item){
 
  this.setState({ promptVisible: true, selectedJob: item});
}
changeAndSetInvoice(value){
  this.setState({ promptVisible: false, invoice: value });
  setTimeout(
    function(){
      this.setState({prompt2Visible:true,});
    }.bind(this),1000
  );
}
changeAndSetAmt(value){
  this.setState({ prompt2Visible: false, amt: value });
  setTimeout(function(){this.setState({prompt3Visible:true,});}.bind(this),1000);
}
changeAndSetDate(value){
  this.setState({ prompt3Visible: false, date: value });
  setTimeout(function(){this.setState({prompt4Visible:true,});}.bind(this),1000);
}




// Update the job as complete in database
  _collectJob(selectedJob, invoiceNo, amt, date, time){


    this.itemsRef.child(selectedJob._key).update({
      status: 'Collected', 
      invoiceNo: invoiceNo, 
      amount: '$'+amt,
      preferredReturnDate: date,
      preferredReturnTime: time
      });

    ToastAndroid.show('The job has been collected !', ToastAndroid.LONG);

    // this.setState({selectedMarker: this.defaultMarker})；

    //close prompt after collecting
    this.setState({ prompt4Visible: false,});

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

