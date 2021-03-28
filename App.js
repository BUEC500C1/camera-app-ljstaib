//Luke Staib 2021 ljstaib@bu.edu
//Application Organization

import React from 'react';
import * as firebase from 'firebase';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home Screen' }}/>
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Camera Screen' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const firebaseConfig = {
    apiKey: "AIzaSyDveyLpqBpUOC7TBnITMNW9anyOFxUpHfg",
    authDomain: "scannerappec500.firebaseapp.com",
    projectId: "scannerappec500",
    storageBucket: "scannerappec500.appspot.com",
    messagingSenderId: "78270138749",
    appId: "1:78270138749:web:4768a1da87f3b3345f6414",
    measurementId: "G-MVQ1H96EM1"
};
firebase.initializeApp(firebaseConfig);
