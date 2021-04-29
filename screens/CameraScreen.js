//Luke Staib 2021 ljstaib@bu.edu
//Camera Screen

//React Native and Firebase
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firebase from 'firebase/app';

//Camera, Face Detection, Location Storage
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';

//Barcodes
import { BarCodeScanner } from 'expo-barcode-scanner';

//Styling, Icons
import { MaterialIcons } from '@expo/vector-icons';
import { Styles } from '../Styles';

//Storing a UUIDv4 for each image
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

//URI of captured image
var pic_saved = null;

//Current location of user
var location = new Array();

//Loading variable
var loading = false;

function CameraScreen({ navigation }) {
  //Camera
  const [permissionCam, setPermissionCam] = useState(null);
  const [camRef, setCamRef] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [pic, setPic] = useState(null);
  const [pictureName, setPictureName] = useState("");
  const [camReady, setCamReady] = useState(false);
  
  //Barcodes
  const [permissionBarcode, setPermissionBarcode] = useState(null);
  const [scanState, setScanState] = useState(false);
  const [barcodeType, setBarcodeType] = useState(null);
  const [barcodeData, setBarcodeData] = useState(null);
  
  //Location
  const [permissionLocation, setPermissionLocation] = useState(null);
  const [loc, setLoc] = useState(null);
  
  //Loading
  const [loadState, setLoadState] = useState(false);
  
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
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      setPermissionLocation(status === 'granted');
    })();
  }, []);
  
  const onCamReady = () => {
    setCamReady(true)
  }
  
  useEffect(() => {
    var timer = setInterval(() => {
      setPic(pic_saved)
      setLoc(location)
      setLoadState(loading)
    }, 100);
    return () => { //Clean up to avoid memory leaks
      clearInterval(timer)
      pic_saved = null
    }
  }, []);

  if (permissionCam === null || permissionBarcode === null || permissionLocation === null) {
    return <Text>Unable to start camera. Please enable camera and location permissions for this application.</Text>;
  }
  if (permissionCam === false || permissionBarcode === false || permissionLocation === false) {
    return <Text>No access to camera. Please enable camera and location permissions for this application.</Text>;
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
          onCameraReady={onCamReady}
        >
          <View style={Styles.camera}>
            <TouchableOpacity
              style={Styles.camButtons}
              disabled={!camReady}
              onPress={() => {
                setCamType(
                  camType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
                );
              }}>
              <MaterialIcons style={{marginBottom: 5}} name="flip-camera-ios" size={44} color="white" />
            </TouchableOpacity>
            <TouchableOpacity disabled={!camReady} onPress = {() => {
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
    if (loadState === false) {
      return (
        <View style={Styles.container}>
          <Text style={Styles.title}>View your picture below:</Text>
          <Image source={{ uri: pic }} resizeMethod="scale" resizeMode="contain" style={{ marginTop: 5, marginBottom: 5, width: 250, height: 333}}/>
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
          <TouchableOpacity onPress = {() => {pic_saved = null; location = []; setPictureName(null); setScanState(false); setBarcodeType(null); setBarcodeData(null);} } style={Styles.generalButton}>
            <Text style={Styles.white_text}>Take another picture!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress = {() => {Keyboard.dismiss(); storePic(U_ID, pic_saved, pictureName, barcodeType, barcodeData, location); setPictureName(null); setPictureName(null); setScanState(false); setBarcodeType(null); setBarcodeData(null);}} style={Styles.generalButton}>
            <Text style={Styles.white_text}>Save picture!</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return (
        <View style={Styles.container}>
          <Text style={{fontSize: 32, marginBottom: 10, textAlign: "center"}}>Saving image...</Text>
          <ActivityIndicator color="#b1b800" size="large" />
        </View>
      );
    }
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
      exif: true,
    })
    //The method below is much faster than getCurrentPositionAsync() and is still accurate
    let current_loc = await Location.getLastKnownPositionAsync({})
    console.log(current_loc)
    location.push(current_loc.coords.latitude)
    location.push(current_loc.coords.longitude)
    //console.log(`INFO: User's latitude and longitude: ${location}`)
    pic_saved = photo.uri
  }
  else {
    console.log("ERROR: No camera reference.")
  }
}

async function storePic(UID, uri, pic_name, bar_type, bar_data, loc)
{
  loading = true
  pic_name = pic_name.trim() //Delete extra whitespace
  var file_name = pic_name.replace(/  +/g, '_'); //Replace spaces with underscores for storage
  file_name = pic_name.replace(' ', '_'); //Replace spaces with underscores for storage
  console.log("File name:")
  console.log(file_name)
  pic_name = pic_name.replace(/  +/g, ' ');
  
  //Check if barcode type and data exists, if not set barcode fields to N/A
  if (bar_type === null) {
    bar_type = "N/A"
  }
  if (bar_data === null) {
    bar_data = "N/A"
  }
  
  if (pic_name !== null && pic_name !== "") {
    console.log("INFO: storePic() called")
    console.log("INFO: Storing picture with uri " + String(uri))
    var uid = uuidv4()
    var metadata = { //Store the ID as custom metadata
      customMetadata: {
        'ID': uid,
        'Name': pic_name,
        'Barcode_Type': bar_type,
        'Barcode_Data': bar_data,
        'Latitude': loc[0],
        'Longitude': loc[1],
      }
    };
    
    //Face detection and blurring
    let faceQuery = await FaceDetector.detectFacesAsync(uri, { mode: FaceDetector.Constants.fast });
    if (faceQuery.faces.length !== 0)
    {
      console.log("Face detected, blurring now.")
      //Looked everywhere and couldn't find a way to blur a detected face...
    }
    
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`pictures/${UID}/${file_name}`); //Store by user IDs
    ref.put(blob, metadata).then((snapshot) => {
      console.log("INFO: User uploaded a picture named " + pic_name);
      alert("Picture successfully uploaded.");
      loading = false
    })
    .catch((error) => {
      console.log("ERROR: " + String(error))
      alert("Picture could not be uploaded, please try later.");
      loading = false
    });
  }
  else { //Makes sure user enters a location name
    alert("Please enter a name for this image.")
    loading = false
  }
}

export default CameraScreen;
