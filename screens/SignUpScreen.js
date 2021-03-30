//Luke Staib 2021 ljstaib@bu.edu
//Sign Up Screen

import React, { useState } from 'react';
import { Keyboard, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Styles } from '../Styles';

import * as firebase from 'firebase';

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  
  const resetVars = () => { //Reset fields upon leaving screen
    setEmail(null);
    setPassword(null);
  }
  
  return (
    <View style={Styles.container}>
      <Text style={Styles.app_title_marginbottom}>Sign Up</Text>
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
      <Text style={Styles.small_text}>Passwords must be at least 8 characters long.</Text>
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
          if (signUpEmailPass(navigation, email, password) === true) {
            resetVars();
          }
        }}
        style={Styles.auth_button}>
        <Text style={Styles.white_text}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = {() => {resetVars(); navigation.navigate('LoginScreen');}} style={Styles.auth_button}>
        <Text style={Styles.white_text}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

async function signUpEmailPass(navigation, email, password) {
  console.log("INFO: Sign up button pressed")
  if (email !== null && password.length >= 8) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        alert("User created successfully. Please verify your email before logging in.")
        navigation.navigate('LoginScreen')
        return true
      })
      .catch((e) => {
        console.log("ERROR: Code " + String(e.code) + " with message " + String(e.message))
        alert("Could not send email verification.")
        return false
      })
    })
    .catch((e) => {
      console.log("ERROR: Code " + String(e.code) + " with message " + String(e.message))
      if (e.code == "auth/email-already-in-use") {
        alert("This email already has an account assigned to it.")
      }
      else if (e.code == "auth/invalid-email") {
        alert("Please enter a valid email address.")
      }
      else {
        alert("Could not sign up due to an unknown error. Please try again later.")
      }
      return false
    });
  }
  else {
    alert("Please enter an email and password. Passwords must be at least 8 characters long.")
    return false
  }
}

export default SignUpScreen;
