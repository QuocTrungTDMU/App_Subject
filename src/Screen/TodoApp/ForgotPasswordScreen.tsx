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
import MailIcon from '../../components/Icons/MailIcon';
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../../../firebaseConfig';

type ScreenName = 'Login' | 'ForgotPassword' | 'CreateNewAccount';

interface ForgotPasswordScreenProps {
  navigate: (screen: ScreenName) => void;
}

const ForgotPasswordScreen = ({navigate}: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleResetPassword = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'A reset link has been sent to your email');
      setEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
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
        <Text style={styles.titleText}>Reset your password</Text>
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
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleResetPassword}>
          Send Reset Email
        </Button>
        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text style={styles.linkText}>Go back to Login</Text>
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
  titleText: {
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

export default ForgotPasswordScreen;
