
console.disableYellowBox = true;

import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, TextInput, Alert, Picker, ScrollView } from 'react-native';
// import {Actions} from 'react-native-router-flux';
import firebase from '../../modules/firebase.js';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import ActionButton from '../components/ActionButton';
import ActionButton2 from '../components/ActionButton2';

import ListItem from '../components/ListItem';
import styles from '../styles/styles.js';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';


import AdminMain from './AdminMain';

var index = 0;

export default class AdminAddJob extends Component {

  constructor(props) {

    super(props);      
      this.state = {
        name: '', //*
        contactNo:'',//*
        address: '', //Show //*
        postalCode: '', //Show //*
        turnaround: '', //Show //*
        type: '', //*
        item: '', //*
        remarks: '', //Show
        email: '', 
        preferredPickupDate: '', //Show 
        preferredPickupTime: '', //Show  
        status: 'pending',
        invoiceNo: '',
        driver: '',
        amount: '',
    }; 
    this.itemsRef = this.props.firebaseApp.database().ref("jobs");    
    this.usersRef = this.props.firebaseApp.database().ref("users");
    this.driverList = [];

  }
  componentDidMount() {
    this.listenForItems(this.usersRef);
  }
  listenForItems(usersRef) {
    usersRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        if(child.val().priviledge=='driver'){
          items.push({
            name: child.val().name, 
            
          });
        }
      });
      
      this.driverList = items;
      
    });
  }
  render() {
    return (
      <ScrollView style={{
        flex: 1,
        flexDirection: 'column',
        marginLeft: 5,
        marginRight:5,

      }}>
        <ActionButton2 title="Back" onPress={this.goToAdminMain.bind(this)}/>

        
        <GiftedForm 
          clearOnClose={false} // delete the values of the form when unmounted

         validators={{
            fullName: {
              title: 'Full name',
              validate: [{
                validator: 'isLength',
                arguments: [2, 23],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              }]
            },

            contactNo: {
              title: 'Contact Number',
              validate: [{
                validator: 'isLength',
                arguments: [8, 11],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters. Please make sure its a SG number'
              }]
            },
                                  

            address: {
              title: 'Address',
              validate: [{
                validator: 'isLength',
                arguments: [0, 512],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              }]
            },

            postalCode: {
              title: 'Postal Code',
              validate: [{
                validator: 'isLength',
                arguments: [6],
                message: '{TITLE} must be {ARGS[0]} characters'
              }]
            },


            turnaround: {
              title: 'Turnaround',
              validate: [{
                validator: (...args) => {
                  if (args[0] === undefined) {
                    return false;
                  }
                  return true;
                },
                message: '{TITLE} is required',
              }]
            },

            type: {
              title: 'Type',
              validate: [{
                validator: (...args) => {
                  if (args[0] === undefined) {
                    return false;
                  }
                  return true;
                },
                message: '{TITLE} is required',
              }]
            },


            item: {
              title: 'Item',
              validate: [{
                validator: 'isLength',
                arguments: [1, 512],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              }]
            },
            remarks: {
              title: 'Remarks',
              validate: [{
                validator: 'isLength',
                arguments: [0, 512],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              }]
            },

            preferredPickupTime: {
              title: 'preferredPickupTime',
              validate: [{
                validator: (...args) => {
                  if (args[0] === undefined) {
                    return false;
                  }
                  return true;
                },
                message: '{TITLE} is required',
              }]
            },            
            

             email: {
              title: 'Email address',
              validate: [{
                validator: 'isLength',
                arguments: [6, 255],
              },{
                validator: 'isEmail',
              }]
            },
          }}
        >

        <GiftedForm.TextInputWidget
          name='fullName' // mandatory
          title='Full name *'

          //image={require('../../assets/icons/color/user.png')}
          onChangeText={(val)=>this.setState({name:val})}
          placeholder='Enter full name'
          clearButtonMode='while-editing'
        />
        

          <GiftedForm.TextInputWidget
            name='contactNo' // mandatory
            title='Contact No *'

            placeholder='Enter contact number (+65)'
            keyboardType='numeric'

            onChangeText={(val)=>this.setState({contactNo:val})}
            clearButtonMode='while-editing'
            //secureTextEntry={true}
            //image={require('../../assets/icons/color/lock.png')}
          />

          <GiftedForm.TextInputWidget
            name='address' // mandatory
            title='Address *'

            //image={require('../../assets/icons/color/user.png')}
            onChangeText={(val)=>this.setState({address:val})}
            placeholder='Enter address'
            clearButtonMode='while-editing'
          />
          <GiftedForm.TextInputWidget
            name='postalCode' // mandatory
            title='Postal Code *'
            placeholder='Enter postal code'

            keyboardType='numeric'
            clearButtonMode='while-editing'
            onChangeText={(val)=>this.setState({postalCode:val})}

          />

          <View style={{flexDirection: 'row'}}>
            <Text style={{flex:1, textAlignVertical:'center', textAlign:'center', color:'black', fontSize:16}}>Turnaround *</Text>
            <Picker
              style={{flex:3}}
              mode='dropdown'
              selectedValue= {this.state.turnaround}
              onValueChange={(val) => this.setState({turnaround:val})}>
              <Picker.Item label="-" value="" selected/>
              <Picker.Item label="Normal (5-6 days)" value="normal" />
              <Picker.Item label="Express (3-4 days)" value="express_3to4" />
              <Picker.Item label="Express (1-2 days)" value="express_1to2" />
              <Picker.Item label="SuperExpress (Same day)" value="superExpress" />
            </Picker>
          </View>

          
          <View style={{flexDirection: 'row'}}>
            <Text style={{flex:1, textAlignVertical:'center', textAlign:'center', color:'black', fontSize:16}}>Type *</Text>
            <Picker
              style={{flex:3}}
              mode='dropdown'
              selectedValue= {this.state.type}            
              onValueChange={(val) => this.setState({type:val})}>
              <Picker.Item label="-" value="" selected/>
              <Picker.Item label="Dry Clean" value="dry" />
              <Picker.Item label="Normal Clean" value="normal" />
              <Picker.Item label="Load Wash" value="load" />
            </Picker>
          </View>

           <GiftedForm.TextInputWidget
              name='item' // mandatory
              title='Item *'
              //image={require('../../assets/icons/color/user.png')}
              onChangeText={(val)=>this.setState({item:val})}
              placeholder='Enter item to be washed'
              clearButtonMode='while-editing'
            />

            <GiftedForm.TextInputWidget
              name='remarks'
              title='Remarks'
              placeholder='Any remarks?'
              onChangeText={(val)=>this.setState({remarks:val})}
              clearButtonMode='while-editing'

            />


          <GiftedForm.GroupWidget
            title = 'Preferred Pickup Date'
            name = 'preferredPickupDate'>
            <DatePicker
            style={{width: 200}}
            date={this.state.preferredPickupDate}
            minDate={new Date().toString()}
            // maxDate="2016-06-01"
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(date) => {this.setState({preferredPickupDate: date})}}
            />
           </GiftedForm.GroupWidget>

            


          <View style={{flexDirection: 'row'}}>
            <Text style={{flex:1, textAlignVertical:'center', textAlign:'center', color:'black', fontSize:16}}>Preferred Pickup Time</Text>
            <Picker
              style={{flex:2}}
              mode='dropdown'
              selectedValue= {this.state.preferredPickupTime}
              onValueChange={(val) => this.setState({preferredPickupTime:val})}>
              <Picker.Item label="-" value="" selected/>
              <Picker.Item label="Morning" value="morning" />
              <Picker.Item label="Early Afternoon" value="earlyAfternoon" />
              <Picker.Item label="Late Afternoon" value="lateAfternoon" />
              <Picker.Item label="Night" value="night" />
            </Picker>
          </View>
          

          <GiftedForm.TextInputWidget
            name='email' // mandatory
            title='Email address'
            placeholder='example@gmail.com'
            onChangeText={(val)=>this.setState({email:val})}
            keyboardType='email-address'
            clearButtonMode='while-editing'/>
           <GiftedForm.SeparatorWidget />

           <View style={{flexDirection: 'row'}}>
            <Text style={{flex:1, textAlignVertical:'center', textAlign:'center', color:'black', fontSize:16}}>Assigned Driver</Text>
            <Picker
              style={{flex:2}}
              mode='dropdown'
              selectedValue= {this.state.driver}
              onValueChange={(val) => this.setState({driver:val})}>
              <Picker.Item label="None" value="" selected/>
              <Picker.Item label="yuxuan" value="yuxuan" />              
            </Picker>
          </View>
          <ActionButton title="Add" onPress={() => this._submitForm()}/>
           <GiftedForm.SeparatorWidget />

         </GiftedForm>

      </ScrollView>
    );
  }


  _submitForm(){
    var errors = [];
    if(this.state.name.length==0){
      errors.push(" 'Full Name'");
    }
    if(this.state.contactNo==0){
      errors.push(" 'Contact Number'");
    }
     if(this.state.address.length==0){
      errors.push(" 'Address'");
    }
     if(this.state.postalCode.length==0){
      errors.push(" 'Postal Code'");
    }
    if(this.state.turnaround==0){
      errors.push(" 'Turnaround'")
    }
     if(this.state.type.length==0){
      errors.push(" 'Type'");
    }
     if(this.state.item.length==0){
      errors.push(" 'Item'");
    }

    if(errors.length>0){
      Alert.alert(
        'Unfilled Fields',
        errors+' are fields that are required (marked *). Please fill them up before submitting again.',
        [
          {text: 'Ok', onPress: () => console.log('Ok Pressed'), style: 'cancel'},          
        ],
        'plain-text'
      );
    }
    else{
      this._addItem();
    }

  }

   _addItem() {
      Alert.alert(
        'Add New Item',
        'Are you sure you want to add '+ this.state.name +'?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {
            text: 'Add',
            onPress: (text) => {
              this.itemsRef.push(this.state);
              this.goToAdminMain.bind(this)
            }
          },
        ],
        'plain-text'
      );
    }

    goToAdminMain(){
    this.props.navigator.push({
      component: AdminMain
    });

  }
    


}
