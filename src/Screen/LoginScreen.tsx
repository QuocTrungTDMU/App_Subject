import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginVisible, setLoginVisible] = useState<boolean>(false);

  const handleLogin = (): void => {
    if (isLoginVisible == false) {
      setLoginVisible(true);
    }
    // else if (isLoginVisible == true) {
    //   setLoginVisible(false);
    // }
    else {
      Alert.alert(
        'Thông Tin Người Dùng',
        `Username: ${username}\nPassword: ${password}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://img.lovepik.com/bg/20240119/HD-Pok-mon-Eevee-Wallpapers-Enhancing-Your-Background_2779885_wh1200.jpg',
        }}
        style={styles.logo}
        resizeMode="cover"
      />

      <Text style={styles.registerText}>REGISTER</Text>

      {isLoginVisible && (
        <>
          <TextInput
            style={styles.input}
            placeholder="USERNAME"
            placeholderTextColor="#333"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor="#333"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2A600',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 350,
    height: 200,
    marginBottom: 20,
    marginTop: 100,
  },
  registerText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    fontStyle: 'italic',
    alignSelf: 'flex-end',
    paddingRight: 30,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
    color: '#000',
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#c6766f',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
