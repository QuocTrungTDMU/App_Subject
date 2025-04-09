import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

type UserCardProps = {
  name: string;
};

const UserCard = ({name}: UserCardProps) => {
  const [bgColor, setBgColor] = useState('#f0f0f0');

  const changeColor = () => {
    const newColor = bgColor === '#f0f0f0' ? '#add8e6' : '#f0f0f0';
    setBgColor(newColor);
  };

  return (
    <View style={[styles.card, {backgroundColor: bgColor}]}>
      <Text style={styles.name}>Hello, {name}!</Text>
      <Button title="Change Background" onPress={changeColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  name: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default UserCard;
