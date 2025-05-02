import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {PaperProvider, Button} from 'react-native-paper';
import MailIcon from '../IconComponents/MailIcon';
import LockIcon from '../IconComponents/LockIcon';
type ScreenName = 'Login' | 'ForgotPassword' | 'CreateNewAccount';

interface LoginScreenProps {
  navigate: (screen: ScreenName) => void;
}

const LoginScreen = ({navigate}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError('Email is a required field');
    } else if (!validateEmail(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is a required field');
    } else if (!validatePassword(text)) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = () => {
    let isValid = true;

    if (!email || !validateEmail(email)) {
      isValid = false;
    }

    if (!password || !validatePassword(password)) {
      isValid = false;
    }

    if (isValid) {
      Alert.alert('Success', 'Login successful!');
      console.log('Login with:', {email, password});
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../Images/logo_telegram.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <View style={styles.inputContainer}>
          <MailIcon width={24} height={24} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.inputContainer}>
          <LockIcon width={24} height={24} color="#007AFF" />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <Button mode="contained" style={styles.button} onPress={handleLogin}>
          Login
        </Button>
        <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('CreateNewAccount')}>
          <Text style={styles.linkText}>Create a new account?</Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    height: 200,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  button: {marginVertical: 10, backgroundColor: '#f28c38'},
  linkText: {color: '#f28c38', textAlign: 'center', marginVertical: 5},
  errorText: {color: 'red', fontSize: 12, marginBottom: 10},
});

export default LoginScreen;
