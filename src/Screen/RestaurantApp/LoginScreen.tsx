import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import MailIcon from '../../components/Icons/MailIcon';
import LockIcon from '../../components/Icons/LockIcon';

import auth from '@react-native-firebase/auth';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const isFormValid = validateEmail(email) && validatePassword(password);

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

  const handleLogin = async () => {
    if (!isFormValid) return;

    try {
      await auth().signInWithEmailAndPassword(email, password); // Sử dụng auth() đúng cách
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Homepage');
    } catch (error: any) {
      console.log('Firebase Error:', JSON.stringify(error));
      let message = 'Login failed!';
      if (error.code === 'auth/user-not-found') {
        message = 'User not found!';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Wrong password!';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email!';
      }
      Alert.alert('Login Failed', message);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  }; 

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Restaurant App</Text>

        <View style={styles.inputContainer}>
          <MailIcon width={24} height={24} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Test@gmail.com"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <LockIcon width={24} height={24} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="********"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
          />
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signInButton,
            {backgroundColor: isFormValid ? '#f28c38' : '#dcdcdc'},
          ]}
          onPress={handleLogin}
          disabled={!isFormValid}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
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
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#a50000',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  linkText: {
    color: '#d28c00',
    textAlign: 'center',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  signInButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#3d4db7',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
