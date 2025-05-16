import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {firestore} from '../../../firebaseConfig';

type RouteProps = RouteProp<RootStackParamList, 'AddNote'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddNote'>;

const AddNoteScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const noteToEdit = route.params?.note;

  const [text, setText] = useState(noteToEdit?.text || '');
  const [title, setTitle] = useState(noteToEdit?.title || '');

  const isFormValid = title.trim() !== '' && text.trim() !== '';

  useEffect(() => {
    navigation.setOptions({
      title: noteToEdit ? 'Sửa công việc' : 'Thêm công việc',
    });
  }, [noteToEdit, navigation]);

  const saveNote = async () => {
    if (!isFormValid) {
      Alert.alert('Lỗi', 'Nội dung  không được để trống');
      return;
    }

    try {
      if (noteToEdit) {
        const noteRef = doc(firestore, 'notes', noteToEdit.id);
        await updateDoc(noteRef, {
          text,
          title,
          createdAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(firestore, 'notes'), {
          text,
          title,
          createdAt: serverTimestamp(),
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu công việc:', error);
      Alert.alert('Lỗi', 'Không thể lưu công việc. Vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nhập tiêu đề công việc"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Nhập nội dung công việc"
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline
      />
      <Button title="Lưu" onPress={saveNote} disabled={!isFormValid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default AddNoteScreen;
