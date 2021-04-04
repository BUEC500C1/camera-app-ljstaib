//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { Styles } from '../Styles';

import * as firebase from 'firebase';
import * as ImageManipulator from 'expo-image-manipulator';

var MarkerArray = new Array(); //Store array of images and data
var Markers = new Array(); //Make into map markers
var loaded = false; //Waits until map markers are loaded
var map_reload = false;

function HomeScreen({ navigation }) {
  const currentUser = firebase.auth().currentUser;
  const U_ID = currentUser.uid;
  const user_email = currentUser.email;
  
  const [loadState, setLoadState] = useState(false);
  
  const initial_region = { //At Boston University
    latitude: 42.3505,
    longitude: -71.1103,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  }
  const [the_region, setRegion] = useState(initial_region);
  
  const MarkerItem = ({latitude, longitude, caption, image}) => (
    <Marker
      coordinate={coord}
      title={caption}
      image={image}
    />
  );
  
  /*
  const markers = [
    {
      latitude: 42.3505,
      longitude: -71.1103,
      title: "Boston University",
      subtitle: "A nice place"
    }
  ];
  */
  
  useEffect(() => {
    const loadList = async () => {
      await getMarkers(U_ID);
      //setListItems(MarkerArray);
      console.log("INFO: Loaded array of images and metadata")
      console.log(MarkerArray)
      var img, title, lat, long; //Create the marker modules themselves
      for (var i = 0; i < MarkerArray.length; i++) { //0: image, 1: title, 2: latitude, 3: longitude
        img = MarkerArray[i][0]
        title = MarkerArray[i][1]
        lat = MarkerArray[i][2]
        long = MarkerArray[i][3]
        
        if ((typeof lat !== 'undefined' && lat !== null) && (typeof long !== 'undefined' && long !== null)) {
          //Resize image for map marker
          const newImg = await ImageManipulator.manipulateAsync(
            img,
            [{ resize: {width: 50, height: 50} }],
            {compress: 1, format: ImageManipulator.SaveFormat.PNG}
          );
          lat = parseFloat(lat)
          long = parseFloat(long)
          Markers.push([{latitude: lat, longitude: long}, newImg, title])
        }
      }
      console.log(Markers)
      loaded = true
      map_reload = false
    }
    loadList();
  }, [map_reload]);
  
  useEffect(() => { //Updates every second, for now.
    var timer = setInterval(() => {
      setLoadState(loaded)
    }, 1000);
    return () => {
      clearInterval(timer)
      loaded = false
      setLoadState(false)
    }
  }, []);
  
  if (loaded === false) {
    return (
      <View style={Styles.container}>
        <Text style={{fontSize: 32, marginBottom: 10, textAlign: "center"}}>Loading map...</Text>
        <ActivityIndicator color="#b1b800" size="large" />
      </View>
    );
  }
  else {
    return (
      <View style={Styles.container}>
        <Text style={Styles.home_title}>Welcome, {user_email}</Text>
        <MapView style={Styles.map}
          region={{
            latitude: the_region.latitude,
            longitude: the_region.longitude,
            latitudeDelta: the_region.latitudeDelta,
            longitudeDelta: the_region.longitudeDelta
          }}
        >
        {Markers.map((marker_info, idx) => {
          return (
            <Marker key={idx}
              coordinate={marker_info[0]}
              image={marker_info[1]}
              title={marker_info[2]}
            />
          )
        })}
        </MapView>
        <View style={Styles.count_view}>
          <TouchableOpacity style={Styles.map_button}
            onPress = {() => {setRegion(initial_region); map_reload = true; loaded = false;}}>
            <Text style={Styles.button_text}>Reset Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.nav_button}
            onPress = {() => navigation.navigate('CameraScreen')}>
            <Text style={Styles.button_text}>To Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.nav_button}
            onPress = {() => navigation.navigate('PhotoList')}>
            <Text style={Styles.button_text}>View Pictures</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.count_view}>
          <TouchableOpacity style={Styles.log_out_button}
            onPress = {() => signOut(navigation)}>
            <Text style={Styles.button_text}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  async function getMarkers(U_ID) { //Get data for markers
    console.log("INFO: getMarkers() called")
    var folderRef, picRef, storageRef
    var date_created, id, path, pic, pic_name
    var latitude, longitude
    var picPaths = new Array();
    
    var storageRef = firebase.storage().ref()
    var folderRef = storageRef.child(`pictures/${U_ID}`)
    await folderRef.listAll()
    .then((result) => {
      result.items.forEach((itemRef) => { //Each item
        if (picPaths.indexOf(itemRef._delegate._location.path_) === -1) { //Each unique item
          picPaths.push(itemRef._delegate._location.path_) //Get paths to each item
        }
      });
    })
    .then(async function() {
      if (typeof picPaths !== 'undefined') {
        for (var i = 0; i < picPaths.length; i++) {
          picRef = storageRef.child(`${picPaths[i]}`)
          await picRef.getMetadata() //Load IDs
          .then((metadata) => {
            pic_name = metadata.customMetadata.Name
            if (pic_name.length > 20) { //Prevents problems on image list screen
              pic_name = pic_name.slice(0,20) + "..."
            }
            latitude = metadata.customMetadata.Latitude
            longitude = metadata.customMetadata.Longitude
          })
          .catch((error) => {
            console.log("ERROR: Could not obtain metadata. Full error: " + String(error))
          })
          
          await picRef.getDownloadURL()
          .then((url) => {
            pic = url
            var data = [pic, pic_name, latitude, longitude]
            MarkerArray.push(data)
          })
          .catch((error) => {
            console.log("ERROR: Could not download images. Full error: " + String(error))
          });
        }
      }
      else {
        console.log("INFO: No images to load.")
      }
    })
    .catch((error) => {
      console.log("ERROR: Could not list images. Full error: " + String(error))
    });
  }
}


async function signOut(navigation) {
  firebase.auth().signOut()
  .then(function() {
    navigation.navigate('LoginScreen')
  })
  .catch(function(e) {
    var errorCode = e.code;
    var errorMessage = e.message;
    console.log("ERROR: Code " + String(errorCode) + " with message " + String(errorMessage));
  });
}

export default HomeScreen;
