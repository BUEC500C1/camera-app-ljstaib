import React from 'react';
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
