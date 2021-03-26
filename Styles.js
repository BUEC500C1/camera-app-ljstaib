import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffed',
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    color: "black",
    fontSize: 48,
    textAlign: "center",
  },
  text: {
    color: "black",
    fontSize: 32,
    textAlign: "center",
  },
  button_text: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  nav_button: {
    backgroundColor: '#707070',
    borderRadius: 5,
    padding: 1,
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    justifyContent: "center",
    width: "40%",
  },
  count_button: {
    backgroundColor: '#707070',
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
  snap_text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15
  },
  count_view: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
    width: "100%",
  },
});
