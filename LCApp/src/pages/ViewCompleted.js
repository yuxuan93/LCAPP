

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

import Main from './Main';
import ViewAccepted from './ViewAccepted';

export default class ViewCompleted extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.props.firebaseApp.database().ref("jobs");

  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Completed Jobs"/>

        <ListView dataSource={this.state.dataSource} 
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listview} enableEmptySections={true}/>
        
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
          <ActionButton2 title="Main" onPress={this.goToMain.bind(this)}/>
          <ActionButton2 title="ViewAccepted" onPress={this.goToViewAccepted.bind(this)}/>
          <ActionButton title="ViewCompleted"/>          
        </View>
      </View>

    );
  }

   listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        if(child.val().status=='completed'){
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
            {text: 'Uncomplete', onPress: () => this._cfmUncomplete(item)},

            {text: 'Cancel', onPress: (text) => console.log('Cancel')}
          ],
          'default'
        );
      };

      if(item.status=='completed'){
        return (
          <ListItem item={item} onPress={onPress}/>
        );
      }
      else{
        return(null);
      }  
    }

    goToMain(){
      this.props.navigator.push({
        component: Main
      });
    }

  

    goToViewAccepted(){
      this.props.navigator.push({
        component: ViewAccepted
      });
    }

     // Prompt confirmation of deletion
_cfmUncomplete(item){
  Alert.alert(
    'Are you sure you want to uncomplete '+ item.title +'?',
    'Address: '+ item.title +'\ncontactNo: '+item.contactNo + '\nThere will be consequences.',
    [

      //{text: 'Navigate', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
      {text: 'Uncomplete', onPress: (text) => this._uncomplete(item)},
      {text: 'Cancel', onPress: (text) => console.log('Cancel')}
    ],
    'default'
  );
}

// Change the job status back to unassigned
  _uncomplete(item){
    this.itemsRef.child(item._key).update({status: 'accepted', invoiceNo:''})

    ToastAndroid.show('The Job has been un-completed!', ToastAndroid.LONG);

    this.setState({selectedMarker: this.defaultMarker})

  }

}