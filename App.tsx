import React, {useState} from 'react';
import LoginScreen from './src/Screen/LoginScreen';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';
import CreateNewAccountScreen from './src/Screen/CreateNewAccountScreen';
import {PaperProvider} from 'react-native-paper';

type ScreenName = 'Login' | 'ForgotPassword' | 'CreateNewAccount';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  return (
    <PaperProvider>
      {currentScreen === 'Login' && <LoginScreen navigate={navigate} />}
      {currentScreen === 'ForgotPassword' && (
        <ForgotPasswordScreen navigate={navigate} />
      )}
      {currentScreen === 'CreateNewAccount' && (
        <CreateNewAccountScreen navigate={navigate} />
      )}
    </PaperProvider>
  );
};

export default App;
