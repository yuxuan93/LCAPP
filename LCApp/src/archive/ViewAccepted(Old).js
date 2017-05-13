console.ignoredYellowBox = ['Warning: ReactNative.createElement'];


import Geocoder from '../Geocoder';
Geocoder.setApiKey('AIzaSyBge0_uc7Iqv0ZxisNFabbxflD6PBm2Sm8');
import prompt from 'react-native-prompt-android';

import React, {Component, PropTypes} from 'react';
// import {Actions} from 'react-native-router-flux';
import firebase from '../../modules/firebase.js';
import MapView , {Marker} from 'react-native-maps';
import StatusBar from '../components/StatusBar';
import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';

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

import Main from './Main';
import ViewCompleted from './ViewCompleted';

export default class ViewAccepted2 extends Component {
  constructor(props) {
    super(props);

    this.itemsRef = this.props.firebaseApp.database().ref("jobs");
    this.defaultMarker = {coordinate:{
                          latitude: 0.00, 
                          longitude: 0.00,
                        },
                         title: '', 
                        contactNo:'',
                        address: '', //Show
                        postalCode: '', //Show
                        turnaround: '', //Show
                        type: '', 
                        item: '',
                        remarks: '', //Show
                        email: '', 
                        preferredPickupDate: '', //Show
                        preferredPickupTime: '', //Show 
                        status: 'pending',
                        key:'temporaryplaceholder',
                        invoiceNo:''}

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selectedMarker: this.defaultMarker,

     markers: [],

     region: {
      latitude: 1.3521,
      longitude: 103.8198,
      // latitudeDelta: LATITUDE_DELTA,
      // longitudeDelta: LONGITUDE_DELTA
    },
    };
    


  }


  componentDidMount() {
    this.listenForItems(this.itemsRef);    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );


  }

  listenForItems(itemsRef) {
  //Reset whenever rendering
    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      this.setState({
                markers: []
              });
      snap.forEach((child) => {

          Geocoder.getFromLocation(child.val().address).then(
            json => {
              var location = json.results[0].geometry.location;
              this.setState({
                markers: [
                  ...this.state.markers,
                  {
                    coordinate:{
                      latitude: location.lat, 
                      longitude: location.lng
                    },
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
                    key:child.key,
                  }
                ]
              })
              
            },
            error => {
            }
          );
        
      });

    });
  }

  render() {
    var detailsSection;
    if(this.state.selectedMarker.title!=''){
      detailsSection =  <View style={{flex:2}}>
                          <ScrollView style={{margin:8}}>                            
                            <Text style={styles.mainText}>Address: {this.state.selectedMarker.title}</Text>
                            <Text>Name: {this.state.selectedMarker.name}</Text>
                            <Text>ContactNo: {this.state.selectedMarker.contactNo}</Text>
                            <Text>Preferred Pickup Date & Time: {this.state.selectedMarker.preferredPickupDate+" "+this.state.selectedMarker.preferredPickupTime}</Text>
                            <Text>Type of Wash: {this.state.selectedMarker.type} </Text>
                            <Text>Items: {this.state.selectedMarker.item}</Text>
                            <Text>Turnaround: {this.state.selectedMarker.turnaround}</Text>
                            <Text>Remarks: {this.state.selectedMarker.remarks}</Text>

                          </ScrollView>
                          <View style={{flex:1, margin:8, flexDirection:'row', alignItems: 'center'}}>
                            <Button style={{}} title='Remove' onPress={()=> this._cfmUnassign()}></Button>
                            <View style={{flex:1}}></View>
                            <Button title='Complete' onPress={()=> this._cfmCompletion()}></Button>

                          </View>
                        </View>;
    }
    else{
      detailsSection=null;
    }

    return (
      <View style={styles.container}>

        
        <View style={{
          flex: 10,
          flexDirection: 'column',
          justifyContent: 'space-between'}}>
            <StatusBar title="Accepted Jobs"/>

            <MapView
               showsMyLocationButton={true}
               showsUserLocation={true}
               moveOnMarkerPress={true}
               //loadingEnabled={true}
               style={styles.map}

               initialRegion={{
                 latitude: this.state.region.latitude, 
                 longitude: this.state.region.longitude,
                 latitudeDelta: 0.2,
                 longitudeDelta: 0.2,
                }}>
                  {this.state.markers.map((marker) => {
                    //return blue marker
                    if(marker.status=='accepted' && marker==this.state.selectedMarker){
                      return <Marker //{...marker} />
                        coordinate={marker.coordinate}
                        name={marker.name}
                        contactNo={marker.contactNo}
                        title={marker.title}
                        turnaround={marker.turnaround}    
                        type={marker.type}  
                        item={marker.item}
                        remarks={marker.remarks}
                        email={marker.email}
                        preferredPickupDate={marker.preferredPickupDate}
                        preferredPickupTime={marker.preferredPickupTime}
                        status={marker.status}                  
                        pinColor={'orange'}
                        key={marker.key}                        

                        onPress={()=> {
                          this.setState({
                            selectedMarker: marker
                          })}
                        }
                      />
                    }
                    //Return normal marker
                    else if(marker.status=='accepted'){
                      return <Marker //{...marker} />
                        coordinate={marker.coordinate}
                        name={marker.name}
                        contactNo={marker.contactNo}
                        title={marker.title}
                        turnaround={marker.turnaround}    
                        type={marker.type}  
                        item={marker.item}
                        remarks={marker.remarks}
                        email={marker.email}
                        preferredPickupDate={marker.preferredPickupDate}
                        preferredPickupTime={marker.preferredPickupTime}
                        status={marker.status}                                          
                        key={marker.key}             
                        onPress={()=> {
                          this.setState({
                            selectedMarker: marker
                          })}
                        }
                      />

                    }
                  })}
            </MapView>

            {detailsSection}
            
            

        </View>

        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
          <ActionButton2 title="Main" onPress={this.goToMain.bind(this)}/>
          <ActionButton title="ViewAccepted" />
          <ActionButton2 title="ViewCompleted" onPress={this.goToViewCompleted.bind(this)}/>
        </View>
        
      </View>
    );
    

  }

 
 // Prompt confirmation of deletion
_cfmUnassign(){
  Alert.alert(
    'Are you sure you want to remove '+ this.state.selectedMarker.title +' from your accepted list?',
    'Address: '+ this.state.selectedMarker.title +'\ncontactNo: '+this.state.selectedMarker.contactNo + '\nThere will be consequences.',
    [

      //{text: 'Navigate', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
      {text: 'Un-assign', onPress: (text) => this._unassignJob()},
      {text: 'Cancel', onPress: (text) => console.log('Cancel')}
    ],
    'default'
  );
}

// Change the job status back to unassigned
  _unassignJob(){
    this.itemsRef.child(this.state.selectedMarker.key).update({status: 'pending', driver:''});

    ToastAndroid.show('The Job has been removed!', ToastAndroid.LONG);

    this.setState({selectedMarker: this.defaultMarker})

  }

 // Prompt confirmation of completion
_cfmCompletion(){
  Alert.alert(
    'Are you sure you want to complete '+ this.state.selectedMarker.title +'?',
    'Address: '+ this.state.selectedMarker.title +'\ncontactNo: '+this.state.selectedMarker.contactNo,
    [

      //{text: 'Navigate', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
      {text: 'Complete', onPress: (text) => this._showInvoicePrompt()},
      {text: 'Cancel', onPress: (text) => console.log('Cancel')}
    ],
    'default'
  );
}


// Prompt for invoice
_showInvoicePrompt(){
  prompt(
    'Enter invoice number',
    null,
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: invoiceNo => this._showAmtPrompt(invoiceNo)},
    ],
    {
        type: 'default',
        cancelable: false,
        defaultValue: '',
        placeholder: 'XXXX XXXX XXXX'
    }
  );
}
// Prompt for invoice
_showAmtPrompt(invoiceNo){
  prompt(
    'Enter amount collected.',
    null,
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: amt => this._completeJob(invoiceNo, amt)},
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
  _completeJob(invoiceNo, amt){
    this.itemsRef.child(this.state.selectedMarker.key).update({status: 'completed', invoiceNo: invoiceNo, amount: amt})

    ToastAndroid.show('A job has been completed !', ToastAndroid.LONG);

    this.setState({selectedMarker: this.defaultMarker})

  }

  // Go to the main page
  goToMain(){
    this.props.navigator.push({
      component: Main
    });
  }

  
  // Go to view completed page
  goToViewCompleted(){
    this.props.navigator.push({
      component: ViewCompleted
    });
  }


}

