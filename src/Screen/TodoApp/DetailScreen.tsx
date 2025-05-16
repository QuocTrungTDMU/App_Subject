import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RouteProps = RouteProp<RootStackParamList, 'Detail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

const DetailScreen = () => {
  const { note } = useRoute<RouteProps>().params;
  const navigation = useNavigation<NavigationProp>();

  const formattedDate = note.createdAt
    ? new Date(note.createdAt.seconds * 1000).toLocaleString()
    : 'Không có thời gian';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{note.text}</Text>
      <Text style={styles.date}>Thời gian: {formattedDate}</Text>
      <Button
        title="Sửa công việc"
        onPress={() => navigation.navigate('AddNote', { note })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 18, marginBottom: 10 },
  date: { fontSize: 14, color: '#666', marginBottom: 10 },
});

export default DetailScreen;