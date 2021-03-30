//Luke Staib 2021 ljstaib@bu.edu
//Stylesheet

import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  app_title: {
    color: "black",
    fontFamily: 'Helvetica-Bold',
    fontSize: 48,
    textAlign: "center",
  },
  app_title_marginbottom: {
    color: "black",
    fontFamily: 'Helvetica-Bold',
    fontSize: 48,
    marginBottom: 20,
    textAlign: "center",
  },
  small_text: {
    color: 'black',
    fontFamily: 'Helvetica',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  camera: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  map: {
    height: 300,
    width: 300
  },
  map_button: {
    backgroundColor: '#ffe29c',
    borderRadius: 5,
    padding: 1,
    marginTop: 10,
    marginBottom: 5,
    height: 50,
    justifyContent: "center",
    width: 115,
  },
  home_title: {
    color: "black",
    fontSize: 32,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    color: "black",
    fontSize: 36,
    textAlign: "center",
  },
  name_input_text: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    color: "black",
    fontSize: 32,
    textAlign: "center",
    width: "80%"
  },
  text: {
    color: "black",
    fontSize: 32,
    textAlign: "center",
  },
  white_text: {
    color: "white",
    fontSize: 32,
    textAlign: "center",
  },
  button_text: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
  nav_button: {
    backgroundColor: '#fec79c',
    borderRadius: 5,
    padding: 1,
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    justifyContent: "center",
    width: 115,
  },
  count_button: {
    backgroundColor: '#ffe29c',
    borderRadius: 5,
    padding: 1,
    marginTop: 10,
    marginBottom: 10,
    width: "20%",
  },
  snap_button: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderColor: "rgba(100, 100, 100, 0.75)",
    borderRadius: 25,
    borderWidth: 3,
    height: 50,
    marginBottom: 10,
    width: 50,
  },
  camButtons: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flex: 0.2,
  },
  generalButton: {
    backgroundColor: '#00246b',
    borderRadius: 5,
    padding: 3,
    marginTop: 10,
    width: "80%",
  },
  snap_text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15
  },
  count_view: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  list_text: {
    color: 'black',
    fontSize: 18,
  },
  list_pic: {
    height: 125,
    width: 125,
  },
  auth_input_text: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    color: "black",
    fontSize: 24,
    fontFamily: "Helvetica",
    marginBottom: 10,
    textAlign: "center",
    width: "80%"
  },
  auth_button: {
    backgroundColor: '#ffe29c',
    borderRadius: 30,
    padding: 1,
    marginBottom: 10,
    height: 50,
    justifyContent: "center",
    width: "60%",
  },
});
