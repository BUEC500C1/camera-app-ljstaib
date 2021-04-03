//Luke Staib 2021 ljstaib@bu.edu
//Home Screen

import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, TouchableOpacity, Text } from 'react-native';
import { Styles } from '../Styles';

import * as firebase from 'firebase';

var MarkerArray = new Array(); //Store array of images and data

function HomeScreen({ navigation }) {
  const currentUser = firebase.auth().currentUser;
  const U_ID = currentUser.uid;
  const user_email = currentUser.email;
  
  const initial_region = { //At Boston University
    latitude: 42.3505,
    longitude: -71.1103,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  }
  const [the_region, setRegion] = useState(initial_region);
  
  const MarkerItem = ({coord, caption, descrip}) => (
    <Marker
      coordinate={coord}
      title={caption}
      description={descrip}
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
  //const renderMarker = ({item}) => <MarkerItem item.coord={item.coordinates} caption={item.title} descrip={item.description} />;
  
  useEffect(() => {
    const loadList = async () => {
      await getMarkers(U_ID);
      //setListItems(MarkerArray);
      console.log("INFO: Loaded array of images and metadata")
      console.log(MarkerArray)
    }
    loadList();
  }, []);
  
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
      {MarkerArray}
      </MapView>
      <View style={Styles.count_view}>
        <TouchableOpacity style={Styles.map_button}
          onPress = {() => {setRegion(initial_region)}}>
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

async function getMarkers(U_ID) {
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
          id = metadata.customMetadata.ID
          pic_name = metadata.customMetadata.Name
          if (pic_name.length > 20) { //Prevents problems on image list screen
            pic_name = pic_name.slice(0,20) + "..."
          }
          date_created = String(new Date(metadata.timeCreated)) //Just retrieving day, month, year
          date_created = date_created.split(" ").slice(1,4) //Display date: Month, Day, then Year
          date_created = date_created[0] + " " + date_created[1] + " " + date_created[2]
          latitude = metadata.customMetadata.Latitude
          longitude = metadata.customMetadata.Longitude
        })
        .catch((error) => {
          console.log("ERROR: Could not obtain metadata. Full error: " + String(error))
        })
        
        await picRef.getDownloadURL()
        .then((url) => {
          pic = url
          path = picRef._delegate._location.path_
          var data = {
            "Date": date_created,
            "ID": id,
            "Image Path": path,
            "Image": pic,
            "Image Name": pic_name,
            "Latitude": latitude,
            "Longitude": longitude
          }
          MarkerArray.push({data})
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
