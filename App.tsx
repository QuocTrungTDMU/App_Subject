import React from 'react';
import {SafeAreaView} from 'react-native';
import UserCard from './src/components/UserCard_Component';

const App = () => {
  return (
    <SafeAreaView>
      <UserCard name="Quốc Trung" />
    </SafeAreaView>
  );
};

export default App;
