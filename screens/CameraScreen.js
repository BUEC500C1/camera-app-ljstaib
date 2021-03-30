//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { Styles } from '../Styles';
import firebase from 'firebase/app';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

var pic_saved = null;

function CameraScreen({ navigation }) {
  const [permission, setPermission] = useState(null);
  const [camRef, setCamRef] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [pic, setPic] = useState(null);
  const [pictureName, setPictureName] = useState("");
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);
  
  useEffect(() => {
    var timer = setInterval(() => {
      setPic(pic_saved)
    }, 100);
    return () => {
      clearInterval(timer)
      pic_saved = null
    }
  }, []);

  if (permission === null) {
    return <Text>Unable to start camera</Text>;
  }
  if (permission === false) {
    return <Text>No access to camera</Text>;
  }
  if (pic === null) {
    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} ref={ref => setCamRef(ref)} type={camType} useCamera2Api={true}>
          <View style={Styles.camera}>
            <TouchableOpacity
              style={Styles.camButtons}
              onPress={() => {
                setCamType(
                  camType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <MaterialIcons style={{marginBottom: 5}} name="flip-camera-ios" size={44} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => {
                  savePic(camRef);
                }
              } style={Styles.snap_button}>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => {
                navigation.navigate('HomeScreen')}
              }
              style={Styles.camButtons}>
              <Text style={Styles.snap_text}> Back </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
  else {
    return (
      <View style={Styles.container}>
        <Text style={Styles.title}>View your picture below:</Text>
        <Image source={{ uri: pic }} resizeMethod="scale" resizeMode="contain" style={{ marginTop: 5, marginBottom: 5, width: 300, height: 400}}/>
        <TextInput
            autoCapitalize = "none"
            autoCompleteType = "off"
            autoCorrect = {false}
            maxLength = {32}
            onChangeText = {pictureName => setPictureName(pictureName)}
            onSubmitEditing = {()=> Keyboard.dismiss()}
            placeholder = "Enter Name"
            style = {Styles.name_input_text}
            value = {pictureName}
        />
        <TouchableOpacity onPress = {() => {pic_saved = null; setPictureName(null);} } style={Styles.generalButton}>
          <Text style={Styles.white_text}>Take another picture!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => {Keyboard.dismiss(); storePic(pic_saved, pictureName); setPictureName(null);}} style={Styles.generalButton}>
          <Text style={Styles.white_text}>Save picture!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

async function savePic(camRef)
{
  console.log("INFO: savePic() called")
  if (camRef) {
    //This crashes the app on an Android simulator...
    let photo = await camRef.takePictureAsync({
      aspect: [4,3],
      quality: 0.8,
    })
    pic_saved = photo.uri
  }
}

async function storePic(uri, pic_name)
{
  pic_name = pic_name.trim() //Delete extra whitespace
  var file_name = pic_name.replace(/  +/g, '_'); //Replace spaces with underscores for storage
  file_name = pic_name.replace(' ', '_'); //Replace spaces with underscores for storage
  pic_name = pic_name.replace(/  +/g, ' ');
  
  if (pic_name !== null && pic_name !== "") {
    console.log("INFO: storePic() called")
    console.log("INFO: Storing picture with uri " + String(uri))
    var uid = uuidv4()
    var metadata = { //Store the ID as custom metadata
      customMetadata: {
        'ID': uid,
        'Name': pic_name,
      }
    };
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`pictures/${file_name}`);
    ref.put(blob, metadata)
    .then((snapshot) => {
      console.log("INFO: User uploaded a picture named " + pic_name);
      alert("Picture successfully uploaded.");
    })
    .catch((error) => {
      console.log("ERROR: " + String(error))
      alert("Picture could not be uploaded, please try later.");
    });
  }
  else { //Makes sure user enters a location name
    alert("Please enter a name for this image.")
  }
}


export default CameraScreen;
