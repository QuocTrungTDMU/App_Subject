// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import HomeScreen from './src/Screen/HomeScreen';
// import DetailsScreen from './src/Screen/DetailScreen';
// import {RootStackParamList} from './src/types/index';

// const Stack = createStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Details" component={DetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Screen/TH3/HomeNoteScreen_TH2';
import AddNoteScreen from './src/Screen/TH3/AddNoteScreen';
import DetailScreen from './src/Screen/TH3/DetailScreen';
import { Note } from '../LocationSharingApp/src/types';

export type RootStackParamList = {
  Home: undefined;
  AddNote: { note?: Note } | undefined;
  Detail: { note: Note };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddNote" component={AddNoteScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
