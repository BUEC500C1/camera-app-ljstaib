# camera-app-ljstaib

Homework #4 for EC500 at Boston University, Spring 2021. Luke Staib (ljstaib@bu.edu) @2021. I chose Option 1, cloud based for this assignment.

# Please see "FinalDemo.mp4" for a working demonstration of my application.

# Builds
I have built an Android Package File (APK) of this assignment. Please email me if you would like to see this.

# Expo
I will be using the Expo framework for this assignment. Expo is useful as it is an add-on to the standard React library. Using Expo makes development, testing, and deployment more simple. For development, there are extra useful libraries (expo-camera, expo-maps, expo-face-detector, and so on). For testing, I am able to use the "Expo Go" mobile application for iOS and Android to see how the application will look on a local device before deployment. Finally, deployment is straightforward since I can utilize a few terminal commands to package the application.

# Testing
- I have some basic unit tests for this application using Jest. The tests feature coverage for all of the screens and other JavaScript files in the application. Please see "CoverageTesting.png" for an example. There are large gaps in the coverage testing because of the React Native and Expo functions/syntax that I implemented, but I made sure to add "catch" statements for most functions.
- I have a test for the login screen and the sign up screen to test that everything renders as intended. Unfortunately, I am unable to do the same tests for the camera screen, home screen, and photo list screen since Jest will throw an error because these screens need to have an authenticated Firebase session to work.

# Running the application
- Upon downloading the repository, run "expo start" to load the Expo interface. From here, you can use the "Expo Go" application (in the app store) to run the application using a QR code. Or, you can type "a" to run the application on an Android emulator or you can press "i" to run the application on an iPhone simulator.
- To run my unit tests using Jest, run "npm run test"

# Status
- Step 1: Completed
- Step 2: Completed
- Step 3: Completed
- Step 4: Completed
- Step 5: Completed
- Step 6: Completed
- Step 7: App can detect faces, but face blurring proved to be very difficult under normal circumstances unless I am missing something.
- Step 8: Completed
- Step 9: Completed
- Putting images on a map: Completed

# Steps
- Step 1:  Setup your REACT Native Environment
- Step 2:  Go through REACT native Tutorial, build Hello Applications, run Hello applications on emulator and phone
- Step 3:  Develop use case to display a map.  (react-native-maps)
- Step 4:  Develop use case to take a picture  (react-native-camera)
- Step 5:  Setup your Firebase (react-native-firebase), setup authentication, database, and storage
- Step 6:  Store cloud data in the cloud and display as list on the phone
- Step 7:  Detect Faces and blur them before storage
- Step 8:  Scan barcodes and save the data per image
- Step 9:  Store images and barcode in Firebase

# Deadlines
- Step 1, 2: 3/24/2021
- Steps 3, 4: 3/28/2021
- Step 5, 6: 3/30/2021
- Step 7: 4/1/2021
- Step 8: 4/2/2021
- Step 9: 4/4/2021
