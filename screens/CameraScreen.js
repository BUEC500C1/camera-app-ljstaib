//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { Styles } from '../Styles'

var pic_saved = null;

function CameraScreen({ navigation }) {
  const [permission, setPermission] = useState(null);
  const [camRef, setCamRef] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [pic, setPic] = useState(null);
  
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
        <Image source={{ uri: pic }} resizeMode="center" style={{width: 350, height: 467}}/>
        <TouchableOpacity onPress = {() => {pic_saved = null} } style={Styles.generalButton}>
          <Text style={Styles.white_text}>Take another picture!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => {navigation.navigate('HomeScreen')} } style={Styles.generalButton}>
          <Text style={Styles.white_text}>Back to home</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

async function savePic(camRef)
{
  if (camRef) {
    //This crashes the app on an Android simulator...
    let photo = await camRef.takePictureAsync({
      aspect: [4,3],
      quality: 0.8,
    })
    pic_saved = photo.uri
  }
}

export default CameraScreen;
