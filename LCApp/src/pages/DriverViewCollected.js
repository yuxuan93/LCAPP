// This page will display 'Collected' jobs assigned to the driver


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
  Linking,

 } from 'react-native';
// import {Actions} from 'react-native-router-flux';

import styles from '../styles/styles.js';
import ListItem from '../components/ListItem';

//import AddJob from './AddJob';
import DriverViewNew from './DriverViewNew';
import DriverViewAccepted from './DriverViewAccepted';
import DriverViewCompleted from './DriverViewCompleted';

// import prompt from 'react-native-prompt-android';
import Prompt from 'react-native-prompt';

import Login from './Login';
import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';


export default class DriverViewCollected extends Component {

  constructor(props) {
    super(props);

    this.itemsRef = this.props.firebaseApp.database().ref("jobs");
    
    this.state = {
      user: this.props.firebaseApp.auth().currentUser,
      loading: true,      
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      promptVisible: false,
      selectedJob: null,
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
        <Prompt
            title="What is the reason for un-collecting?"
            placeholder=""
            defaultValue=""
            visible={this.state.prompt5Visible}
            onCancel={() => this.setState({ promptVisible: false,})}
            onSubmit={(value) => this._uncollectJob(this.state.selectedJob, value) }/>

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableHighlight style={{padding: 15}}>
            <Text style={styles.primaryButtonText}>            </Text>
          </TouchableHighlight>
          <Text style={styles.navbarTitle}>Collected Jobs</Text>          

          <TouchableHighlight onPress={this.logout.bind(this)} style={{margin: 0, padding: 15, backgroundColor: '#808080'}}>
            <Text style={styles.primaryButtonText}>Logout</Text>
          </TouchableHighlight>
        </View>

        <ListView dataSource={this.state.dataSource} 
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listview} enableEmptySections={true}/>
        
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
          <ActionButton2 title="New" onPress={this.goToDriverViewNew.bind(this)}/>
          <ActionButton2 title="Accepted" onPress={this.goToDriverViewAccepted.bind(this)}/>
          <ActionButton title="Collected"/>
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
        if(child.val().status=='Collected' && child.val().driver==this.state.user.email.substring(0,this.state.user.email.indexOf("@"))){
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
            preferredReturnDate: child.val().preferredReturnDate, //Show
            preferredReturnTime: child.val().preferredReturnTime, //Show 
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
            + "\nInvoice Number: " + item.invoiceNo
            + "\nAmount: " + item.amount
            + "\nPreferred Return Date: " + item.preferredReturnDate
            + "\nPreferred Return Time: " + item.preferredReturnTime

            //Do we need to display the completed date of the job?
            ,
          [
            {text: 'Uncollect', onPress: () => this._popupUncollectReasonInput(item)},

            // {text: 'Cancel', onPress: (text) => console.log('Cancel')},
            {text: 'MAP', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
            {text: 'Complete', onPress: () => this._completePrompt(item)}
          ],
          'default'
        );
      };

      if(item.status=='Collected' && item.driver==this.state.user.email.substring(0,this.state.user.email.indexOf("@"))){
        return (
          <ListItem item={item} onPress={onPress}/>
        );
      }
      else{
        return(null);
      }  
    }


    // NAVIGATION

    goToDriverViewNew(){
      this.props.navigator.push({
        component: DriverViewNew
      });
    }

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


  // ACTIONS
  _uncollectJob(item, reason){

    this.itemsRef.child(item._key).update({status: 'Accepted', reason: 'Uncollected: '+reason})

    ToastAndroid.show('A job has been un-collected!', ToastAndroid.LONG);
    
    this.setState({selectedMarker: this.defaultMarker})
    this.setState({ prompt5Visible: false,});
  }

  _popupUncollectReasonInput(item){
    //  prompt(
    //   // 'What is the problem?',
    //   'What\'s the reason for un-collecting ' + item.name +'?',
    //   'Note there will be demerit points awarded if the reason is invalid.',
    //   [
    //    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //    {text: 'OK', onPress: reason => this._uncollectJob(item, reason)},
    //   ],
    //   {
    //       type: 'default',
    //       cancelable: false,
    //       defaultValue: '',
    //       placeholder: 'Reason?'
    //   }
    // );
    this.setState({ prompt5Visible: true, selectedJob: item});
  }
   _completePrompt(item){
      Alert.alert(
        'Are you sure you want to complete '+ item.name +'?',
        null,
        [
          {text: 'Cancel', onPress: (text) => console.log('Cancel')},
          {text: 'Complete', onPress: (text) => this._completeJob(item)}
        ],
        'default'
      ); 

  }


  _completeJob(item){
    this.itemsRef.child(item._key).update({status: 'Completed', completeDate: new Date().toString()})

    ToastAndroid.show('The job has been completed!', ToastAndroid.LONG);

    
    this.setState({selectedMarker: this.defaultMarker})

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