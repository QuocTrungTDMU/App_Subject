import {useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export const DemoButton = () => {
  const [count, setCount] = useState(0);
  const onPress = () => {
    setCount(count + 1);
  };
  return (
    <View style={myStyles.container}>
      <Text style={myStyles.textButton}>Count: {count}</Text>
      <TouchableHighlight style={myStyles.button} onPress={onPress}>
        <Text style={myStyles.textButton}>Press This Button</Text>
      </TouchableHighlight>
    </View>
  );
};

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textButton: {
    alignSelf: 'center',
    color: 'blue',
  },
  button: {
    backgroundColor: 'aqua',
    height: 50,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 50,
  },
});
