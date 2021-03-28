//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, TouchableOpacity, Text } from 'react-native';
import { Styles } from '../Styles'

function HomeScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const count_up = () => setCount(prevCount => prevCount + 1);
  const count_down = () => setCount(prevCount => prevCount - 1);
  const reset_count = () => setCount(0);
  
  const initial_region = { //At Boston University
    latitude: 42.3505,
    longitude: -71.1103,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  }
  
  const markers = [
    {
      latitude: 42.3505,
      longitude: -71.1103,
      title: "Boston University",
      subtitle: "A nice place"
    }
  ];
  
  const [the_region, setRegion] = useState(initial_region);
  
  return (
    <View style={Styles.container}>
      <Text style={Styles.home_title}>Home Screen</Text>
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
      <MapView style={Styles.map}
        region={{
          latitude: the_region.latitude,
          longitude: the_region.longitude,
          latitudeDelta: the_region.latitudeDelta,
          longitudeDelta: the_region.longitudeDelta
        }}
      >
        <Marker
          coordinate={{latitude: 42.3505,
          longitude: -71.1103}}
          title={"Boston University"}
          description={"A nice place"}
        />
      </MapView>
      <View style={Styles.count_view}>
        <TouchableOpacity style={Styles.map_button}
          onPress = {() => {setRegion(initial_region)}}>
          <Text style={Styles.button_text}>Reset Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.map_button}
          onPress = {() => {setRegion(zoomOut(the_region))}}>
          <Text style={Styles.button_text}>Zoom Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.map_button}
          onPress = {() => {setRegion(zoomIn(the_region))}}>
          <Text style={Styles.button_text}>Zoom In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={Styles.nav_button}
        onPress = {() => navigation.navigate('CameraScreen')}>
        <Text style={Styles.button_text}>To Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

function zoomIn(reg) {
  const new_region = {
    latitude: reg.latitude,
    longitude: reg.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0
  }
  if ((reg.latitudeDelta - 0.005) > 0) {
    new_region.latitudeDelta = reg.latitudeDelta - 0.005
  }
  if ((reg.longitudeDelta - 0.005) > 0) {
    new_region.longitudeDelta = reg.longitudeDelta - 0.005
  }
  return new_region
}

function zoomOut(reg) {
  const new_region = {
    latitude: reg.latitude,
    longitude: reg.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2
  }
  if ((reg.latitudeDelta + 0.01) < 0.20) {
    new_region.latitudeDelta = reg.latitudeDelta + 0.01
  }
  if ((reg.longitudeDelta + 0.01) < 0.20) {
    new_region.longitudeDelta = reg.longitudeDelta + 0.01
  }
  return new_region
}

export default HomeScreen;
