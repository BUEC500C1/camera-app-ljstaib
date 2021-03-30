//Luke Staib 2021 ljstaib@bu.edu
//Login Screen

import React, { useState } from 'react';
import { Keyboard, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Styles } from '../Styles';

import * as firebase from 'firebase';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  
  const resetVars = () => { //Reset fields upon leaving screen
    console.log("a")
    setEmail(null);
    setPassword(null);
  }
  
  return (
    <View style={Styles.container}>
      <Text style={Styles.app_title}>Scanner Application</Text>
      <Image source={require('../assets/barcode.png')} resizeMethod="scale" resizeMode="contain" style={{ marginTop: 5, marginBottom: 5, width: 150, height: 200}}/>
      <TextInput
          autoCapitalize = "none"
          autoCompleteType = "off"
          autoCorrect = {false}
          maxLength = {32}
          onChangeText = {email => setEmail(email)}
          onSubmitEditing = {()=> Keyboard.dismiss()}
          placeholder = "Email"
          style = {Styles.auth_input_text}
          value = {email}
      />
      <TextInput
          autoCapitalize = "none"
          autoCompleteType = "off"
          autoCorrect = {false}
          maxLength = {32}
          onChangeText = {password => setPassword(password)}
          onSubmitEditing = {()=> Keyboard.dismiss()}
          placeholder = "Password"
          secureTextEntry
          style = {Styles.auth_input_text}
          value = {password}
      />
      <TouchableOpacity onPress = {() => {
          if (loginEmailPass(navigation, email, password) === true) {
            resetVars();
          }
        }} style={Styles.auth_button}>
        <Text style={Styles.white_text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = {() => {resetVars(); navigation.navigate('SignUpScreen');}} style={Styles.auth_button}>
        <Text style={Styles.white_text}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

async function loginEmailPass(navigation, email, password) {
  console.log("INFO: Login button pressed")
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(() => {
    if (firebase.auth().currentUser.emailVerified == true)
    {
      //Signed in
      navigation.navigate('HomeScreen')
      alert("Successfully logged in.")
      return true
    }
    else
    {
      //Email not verified
      console.log("ERROR: Email not verified.")
      alert("Please verify your email before logging in.")
      signOut()
      return false
    }
  })
  .catch((e) => {
    //Error logging in
    console.log("ERROR: Code " + String(e.code) + " with message " + String(e.message))
    if (e.code == "auth/user-not-found") {
      alert("User not found. Please create an account on the sign up screen.")
    }
    else if (e.code == "auth/invalid-email") {
      alert("Please enter a valid email address.")
    }
    else if (e.code == "auth/wrong-password") {
      alert("Email and password do not match.")
    }
    else {
      alert("Could not log in due to an unknown error. Please try again later.")
    }
    return false
  });
}

async function signOut() {
  firebase.auth().signOut()
  .catch(function(e) {
    var errorCode = e.code;
    var errorMessage = e.message;
    console.log("ERROR: Code " + String(errorCode) + " with message " + String(errorMessage));
  });
}

export default LoginScreen;
