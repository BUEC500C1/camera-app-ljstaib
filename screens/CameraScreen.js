//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { Styles } from '../Styles'

var uri;

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
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
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
              style={{
                alignItems: 'center',
                alignSelf: 'flex-end',
                flex: 0.2,
              }}
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
                takePicture(camRef);
                }
              } style={Styles.snap_button}>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => {
                navigation.navigate('HomeScreen')}
              }
              style={{
                flex: 0.2,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}>
              <Text style={Styles.snap_text}> Back </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

export default CameraScreen;
