//Luke Staib 2020-2021
//Home Screen

import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { View, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { Styles } from '../Styles'

function HomeScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const counter = () => setCount(prevCount => prevCount + 1);
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Hello, world!</Text>
      <Text style={Styles.text}>Counter: {count}</Text>
      <TouchableOpacity style={Styles.button}
        onPress = {() => {counter()} }>
        <Text style={Styles.button_text}>+1</Text>
      </TouchableOpacity>
      <MapView style={Styles.map} />
    </View>
  )
}

export default HomeScreen;
