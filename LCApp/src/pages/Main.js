console.disableYellowBox = true;


import Geocoder from '../util/Geocoder';
Geocoder.setApiKey('AIzaSyBge0_uc7Iqv0ZxisNFabbxflD6PBm2Sm8');

import React, {Component, PropTypes} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ToolbarAndroid,
  ListView,
  Alert,
  Navigator,
  Button,
  ToastAndroid,

} from 'react-native';

//import * as firebase from 'firebase';
// import {Actions} from 'react-native-router-flux';
import MapView , {Marker} from 'react-native-maps';

import Login from './Login';
import styles from '../styles/styles.js';

//import AddJob from './AddJob';
import ViewAccepted from './ViewAccepted';
import ViewCompleted from './ViewCompleted';

import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';


const accountStyles = StyleSheet.create({
  email_container: {
    padding: 20
  },
  email_text: {
    fontSize: 18
  }
});



export default class Main extends Component {
  constructor(props) {
    super(props);

    this.itemsRef = this.props.firebaseApp.database().ref("jobs");
    this.defaultMarker = {coordinate:{
                          latitude: 0.00, 
                          longitude: 0.00,
                        },
                        details: '',
                        title: '',
                        address: '',
                        status: '',
                        key:'temporaryplaceholder',}

    this.state = {
      loading: true,

      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selectedMarker: this.defaultMarker,

      markers: [],

      region: {
        latitude: 1.3521,
        longitude: 103.8198,
      }
    };    
  }

  componentWillMount() {
    // get the current user from firebase
    const userData = this.props.firebaseApp.auth().currentUser;
    this.setState({
      user: userData,
      loading: false
    });
  }


  componentDidMount() {
    this.listenForItems(this.itemsRef);    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            // latitudeDelta: LATITUDE_DELTA,
            // longitudeDelta: LONGITUDE_DELTA
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
          // items.push({
          //   name: child.val().name,
          //   address: child.val().address,
          //   details: child.val().details,
          //   status: child.val().status,
          //   _key: child.key
          // });

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
                    turnaround: child.val().turnaround,
                    title: child.val().address + " " + child.val().postalCode,
                    remarks: child.val().remarks,
                    preferredPickupDate: child.val().preferredPickupDate,
                    preferredPickupTime: child.val().preferredPickupTime,
                    status: child.val().status,
                    key:child.key,

                  }
                ]
              })
              
            },
            error => {
              //alert(error);
            }
          );
        
      });



    });
  }

  render() {
    var detailsSection;
    if(this.state.selectedMarker.title!=''){
      detailsSection =  <View style={{flex:1}}>
                          <View style={{margin:8}}>
                            <Text style={styles.mainText}>Address: {this.state.selectedMarker.title}</Text>
                            <Text>Remarks: {this.state.selectedMarker.remarks}</Text>
                            <Text>Turnaround: {this.state.selectedMarker.turnaround}</Text>
                            <Text>Preferred Pickup Date & Time: {this.state.selectedMarker.preferredPickupDate+" "+this.state.selectedMarker.preferredPickupTime}</Text>
                          </View><View style={{margin:8, flexDirection:'row', alignItems: 'center'}}>
                            <ActionButton style={styles.action2} title='Accept' onPress={()=> this._cfmAcceptance()}/>
                            <View style={{flex:1}}></View>
                          </View>
                        </View>;
    }
    else{
      detailsSection=null;
    }

    return (
      <View style={styles.container}>

        <View style={styles.body}>
          <View style={accountStyles.email_container}>
            <Text style={accountStyles.email_text}>{this.state.user.email}</Text>
          </View>
          <Image
            style={styles.image}
            source={{uri: this.state.user.photoURL}} />
          <TouchableHighlight onPress={this.logout.bind(this)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Logout</Text>
          </TouchableHighlight>
        </View>
        
        <View style={{
          flex: 9,
          flexDirection: 'column',
          justifyContent: 'space-between',

          }}>
            <MapView
               style={styles.map}

               showsMyLocationButton={true}
               showsUserLocation={true}
               moveOnMarkerPress={true}
               // loadingEnabled={true}

               initialRegion={{
                 latitude: this.state.region.latitude, 
                 longitude: this.state.region.longitude,
                 latitudeDelta: 0.2,
                 longitudeDelta: 0.2,
                }}>
                  {this.state.markers.map((marker) => {
                    //return blue marker
                    if(marker.status=='pending' && marker==this.state.selectedMarker){
                      return <Marker //{...marker} />
                        coordinate={marker.coordinate}
                        title={marker.title}
                        turnaround={marker.turnaround}  
                        remarks={marker.remarks}
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
                    else if(marker.status=='pending'){
                      return <Marker //{...marker} />
                        coordinate={marker.coordinate}
                        title={marker.address}
                        turnaround={marker.turnaround}  
                        remarks={marker.remarks}
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
          <ActionButton title="Main"/>
          <ActionButton2 title="ViewAccepted" onPress={this.goToViewAccepted.bind(this)}/>
          <ActionButton2 title="ViewCompleted" onPress={this.goToViewCompleted.bind(this)}/>
        </View>
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

_cfmAcceptance(){
  Alert.alert(
    'Are you sure you want to accept '+ this.state.selectedMarker.title +'?',
    'Turnaround'+this.state.selectedMarker.turnaround,
    [

      //{text: 'Navigate', onPress: (text) => Linking.openURL('https://maps.google.com?q='+item.address)},
      {text: 'Accept', onPress: (text) => this._acceptJob()},
      {text: 'Cancel', onPress: (text) => console.log('Cancel')}
    ],
    'default'
  );
}


  _acceptJob(){
    this.itemsRef.child(this.state.selectedMarker.key).update({                          
                          status: 'accepted', driver: this.state.user.email})

    ToastAndroid.show('A job has been accepted !', ToastAndroid.LONG);

    
    this.setState({selectedMarker: this.defaultMarker})

  }

  // goToAddJob(){
  //   this.props.navigator.push({
  //     component: AddJob
  //   });
  // }

  goToViewAccepted(){
    this.props.navigator.push({
      component: ViewAccepted
    });
  }

  goToViewCompleted(){
    this.props.navigator.push({
      component: ViewCompleted
    });
  }

  


}

