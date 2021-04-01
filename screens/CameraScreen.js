//Luke Staib 2021 ljstaib@bu.edu
//Camera Screen

//React Native and Firebase
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firebase from 'firebase/app';

//Camera, Pictures, Face Detection
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FaceDetector from 'expo-face-detector';
import { BlurView } from 'expo-blur';

//Barcodes
import { BarCodeScanner} from 'expo-barcode-scanner';

//Styling, Icons
import { MaterialIcons } from '@expo/vector-icons';
import { Styles } from '../Styles';

//Storing a UUIDv4 for each image
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

//URI of captured image
var pic_saved = null;

function CameraScreen({ navigation }) {
  //Camera
  const [permissionCam, setPermissionCam] = useState(null);
  const [camRef, setCamRef] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [pic, setPic] = useState(null);
  const [pictureName, setPictureName] = useState("");
  
  //Barcodes
  const [permissionBarcode, setPermissionBarcode] = useState(null);
  const [scanState, setScanState] = useState(false);
  const [barcodeType, setBarcodeType] = useState(null);
  const [barcodeData, setBarcodeData] = useState(null);
  
  //User ID
  const currentUser = firebase.auth().currentUser;
  const U_ID = currentUser.uid;
  
  const handleBarcodeScan = ({ type, data }) => {
    setScanState(true);
    setBarcodeType(type);
    setBarcodeData(data);
    savePic(camRef)
    alert("Bar code scanned!")
    console.log(`Bar code with type "${type}" and data "${data}" has been scanned.`)
  };
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermissionCam(status === 'granted');
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermissionBarcode(status === 'granted');
    })();
  }, []);
  
  useEffect(() => {
    var timer = setInterval(() => {
      setPic(pic_saved)
    }, 100);
    return () => { //Clean up to avoid memory leaks
      clearInterval(timer)
      pic_saved = null
    }
  }, []);

  if (permissionCam === null || permissionBarcode === null) {
    return <Text>Unable to start camera. Please enable camera permissions for this application.</Text>;
  }
  if (permissionCam === false || permissionBarcode === false) {
    return <Text>No access to camera. Please enable camera permissions for this application.</Text>;
  }
  if (pic === null) {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          ref={ref => setCamRef(ref)}
          type={camType}
          useCamera2Api={true}
          onBarCodeScanned={scanState ? undefined : handleBarcodeScan}
        >
          <View style={Styles.camera}>
            <TouchableOpacity
              style={Styles.camButtons}
              onPress={() => {
                setCamType(
                  camType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
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
        <TouchableOpacity onPress = {() => {pic_saved = null; setPictureName(null); setScanState(false); setBarcodeType(null); setBarcodeData(null);} } style={Styles.generalButton}>
          <Text style={Styles.white_text}>Take another picture!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => {Keyboard.dismiss(); storePic(U_ID, pic_saved, pictureName, barcodeType, barcodeData); setPictureName(null); setPictureName(null); setScanState(false); setBarcodeType(null); setBarcodeData(null);}} style={Styles.generalButton}>
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
      quality: 0.75,
    })
    pic_saved = photo.uri
    console.log(pic_saved)
  }
}

async function storePic(U_ID, uri, pic_name, bar_type, bar_data)
{
  pic_name = pic_name.trim() //Delete extra whitespace
  var file_name = pic_name.replace(/  +/g, '_'); //Replace spaces with underscores for storage
  file_name = pic_name.replace(' ', '_'); //Replace spaces with underscores for storage
  console.log("File name:")
  console.log(file_name)
  pic_name = pic_name.replace(/  +/g, ' ');
  
  //Check if barcode data, if not set data field to N/A
  bar_type = bar_type ? bar_type : "N/A";
  bar_data = bar_data ? bar_data : "N/A";
  
  if (pic_name !== null && pic_name !== "") {
    console.log("INFO: storePic() called")
    console.log("INFO: Storing picture with uri " + String(uri))
    var uid = uuidv4()
    var metadata = { //Store the ID as custom metadata
      customMetadata: {
        'ID': uid,
        'Name': pic_name,
        'Barcode Type': bar_type,
        'Barcode Data': bar_data,
      }
    };
    
    //Face detection and blurring
    let faceQuery = await FaceDetector.detectFacesAsync(uri, { mode: FaceDetector.Constants.fast });
    if (faceQuery.faces.length !== 0)
    {
      console.log("Face detected, blurring now.")
      //Need to figure out how to blur only a certain area
    }
    
    console.log(uri)
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`pictures/${U_ID}/${file_name}`); //Store by user IDs
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
