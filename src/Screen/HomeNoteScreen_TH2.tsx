import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteItem from '../components/NoteItem';
import {Note} from '../types';

const HomeScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    } catch (error) {
      console.error('Lỗi khi lưu ghi chú:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Lỗi khi tải ghi chú:', error);
    }
  };

  const handleAddOrEditNote = () => {
    if (noteText.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung ghi chú!');
      return;
    }

    let updatedNotes: Note[];
    if (editingNoteId) {
      updatedNotes = notes.map(note =>
        note.id === editingNoteId ? {...note, text: noteText} : note,
      );
      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText,
      };
      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNoteText('');
  };

  const handleEditNote = (note: Note) => {
    setNoteText(note.text);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa ghi chú này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const updatedNotes = notes.filter(note => note.id !== id);
          setNotes(updatedNotes);
          saveNotes(updatedNotes);
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require('../../Images/bg.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nhập ghi chú..."
          value={noteText}
          onChangeText={setNoteText}
        />
        <Button
          title={editingNoteId ? 'Cập nhật' : 'Thêm'}
          onPress={handleAddOrEditNote}
          color="#007AFF"
        />
        <FlatList
          data={notes}
          renderItem={({item}) => (
            <NoteItem
              note={item}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          )}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: 50,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  list: {
    marginTop: 20,
  },
});

export default HomeScreen;
