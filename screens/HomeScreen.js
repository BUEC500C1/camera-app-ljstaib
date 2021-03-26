//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { View, TouchableOpacity, Text } from 'react-native';
import { Styles } from '../Styles'

function HomeScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const count_up = () => setCount(prevCount => prevCount + 1);
  const count_down = () => setCount(prevCount => prevCount - 1);
  const reset_count = () => setCount(0);
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Hello, map!</Text>
      <Text style={Styles.text}>Counter: {count}</Text>
      <View style={Styles.count_view}>
        <TouchableOpacity style={Styles.count_button}
          onPress = {() => {count_up()} }>
          <Text style={Styles.button_text}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.count_button}
          onPress = {() => {count_down()} }>
          <Text style={Styles.button_text}>-1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.count_button}
          onPress = {() => {reset_count()} }>
          <Text style={Styles.button_text}>Reset</Text>
        </TouchableOpacity>
      </View>
      <MapView style={Styles.map} />
      <TouchableOpacity style={Styles.nav_button}
        onPress = {() => navigation.navigate('CameraScreen')}>
        <Text style={Styles.button_text}>To Camera</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen;
