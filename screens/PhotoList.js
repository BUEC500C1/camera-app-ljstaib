//Luke Staib 2021 ljstaib@bu.edu
//Photo List Screen

import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import firebase from 'firebase/app';
import { Styles } from '../Styles';

var PictureArray = new Array(); //Store array of images and data

//View at end is a temporary space in between list elements
const ListItem = ({date, name, pic}) => (
  <View style={{borderColor: 'black', borderWidth: 2, padding: 5, marginBottom: 30, marginLeft: 20, marginRight: 20, marginTop: 10, width: 145}}>
    <View>
      <Image style={Styles.list_pic} resizeMode={'contain'} source={{uri: pic}}/>
    </View>
    <View>
      <Text style={Styles.list_text}>{name}</Text>
      <Text style={Styles.list_text}>{date}</Text>
    </View>
  </View>
);

function PhotoList({ navigation }) {
  const [listItems, setListItems] = useState(null);
  const renderListItem = ({item}) => <ListItem pic={item.pic} name={item.pic_name} date={item.date_created} />;
  
  const currentUser = firebase.auth().currentUser;
  const U_ID = currentUser.uid;

  useEffect(() => {
    const loadList = async () => {
      await getRooms(U_ID);
      setListItems(PictureArray);
      PictureArray = [];
      console.log("INFO: Loaded array of images and metadata")
    }
    loadList();
  }, []);
  
  return (
    <View style={Styles.container}>
      <FlatList data={listItems} renderItem={renderListItem} numColumns={2} keyExtractor={(item, index) => index.toString()} />
    </View>
  );
}

async function getRooms(U_ID) {
  console.log("INFO: getRooms() called")
  var folderRef, picRef, storageRef
  var date_created, id, path, pic, pic_name
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
        })
        .catch((error) => {
          console.log("ERROR: Could not obtain metadata. Full error: " + String(error))
        })
        
        await picRef.getDownloadURL()
        .then((url) => {
          pic = url
          path = picRef._delegate._location.path_
          PictureArray.push({date_created, id, path, pic, pic_name})
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

export default PhotoList;
