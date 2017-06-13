

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

import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';

import ListItem from '../components/ListItem';
import styles from '../styles/styles.js';

// import prompt from 'react-native-prompt-android';
import Prompt from 'react-native-prompt';

import Login from './Login';
import DriverViewNew from './DriverViewNew';
import DriverViewAccepted from './DriverViewAccepted';
import DriverViewCollected from './DriverViewCollected';


export default class DriverViewCompleted extends Component {

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
            title="Enter reason for rejection"
            placeholder=""
            defaultValue=""
            visible={this.state.promptVisible}
            onCancel={() => this.setState({ promptVisible: false, })}
            onSubmit={(value) => this._uncomplete(this.state.selectedJob, value) }/>

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableHighlight style={{padding: 15}}>
            <Text style={styles.primaryButtonText}>            </Text>
          </TouchableHighlight>
          <Text style={styles.navbarTitle}>Completed Jobs</Text>          

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
          <ActionButton2 title="Collected" onPress={this.goToDriverViewCollected.bind(this)}/>
          <ActionButton title="Completed"/>          
        </View>
      </View>

    );
  }

   listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        if(child.val().status=='Completed' && child.val().driver==this.state.user.email.substring(0,this.state.user.email.indexOf("@"))){
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
            completeDate: child.val().completeDate,
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
            // + "\nPreferred Pickup Date: " + item.preferredPickupDate
            // + "\nPreferred Pickup Time: " + item.preferredPickupTime
            + "\nRemarks: " + item.remarks

            // + "\nEmail: " + item.email
            // + "\nDriver: " + item.driver
            + "\nInvoice Number: " + item.invoiceNo
            + "\nAmount: " + item.amount
            // + "\nPreferredReturnDate: " + item.preferredReturnDate
            // + "\nPreferredReturnTime: " + item.preferredReturnTime
            + "\nCompleted Date: " + item.completeDate
            ,
          [
            {text: 'Cancel', onPress: (text) => console.log('Cancel')},
            {text: 'Uncomplete', onPress: () => this._cfmUncomplete(item)}

          ],
          'default'
        );
      };

      if(item.status=='Completed' && item.driver==this.state.user.email.substring(0,this.state.user.email.indexOf("@"))){
        return (
          <ListItem item={item} onPress={onPress}/>
        );
      }
      else{
        return(null);
      }  
    }



    // GO TO
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

    goToDriverViewCollected(){
      this.props.navigator.push({
        component: DriverViewCollected
      });
    }




     // Prompt confirmation of deletion
_cfmUncomplete(item){
  // prompt(
  //     // 'What is the problem?',
  //     'What\'s the reason for un-completing Job ID ' + item.jobId +'?',
  //     'Note there will be demerit points awarded if the reason is invalid.',
  //     [
  //      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //      {text: 'OK', onPress: reason => this._uncomplete(item, reason)},
  //     ],
  //     {
  //         type: 'default',
  //         cancelable: false,
  //         defaultValue: '',
  //         placeholder: 'Reason?'
  //     }
  //   );
  this.setState({ promptVisible: true, selectedJob: item});
}

// Change the job status back to unassigned
  _uncomplete(item, reason){
    this.itemsRef.child(item._key).update({status: 'Collected', reason: 'Uncompleted: '+reason})

    ToastAndroid.show('The Job has been un-completed!', ToastAndroid.LONG);

    this.setState({ promptVisible: false});

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