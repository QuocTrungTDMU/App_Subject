import React, { useState, useCallback } from 'react';
import { View, FlatList, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import NoteItem from '../../components/NoteItem';
import { Note } from '../../types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const loadNotes = async () => {
    try {
      const notesRef = collection(firestore, 'notes');
      const q = query(notesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedNotes = snapshot.docs.map(doc => ({
        ...(doc.data() as Note),
        id: doc.id,
      }));

      setNotes(loadedNotes);
      setFilteredNotes(loadedNotes); 
    } catch (error) {
      console.error('Lỗi khi tải ghi chú:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNotes(notes); 
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = notes.filter(
        note =>
          // note.title.toLowerCase().includes(lowerQuery) ||
          note.text.toLowerCase().includes(lowerQuery)
      );
      setFilteredNotes(filtered);
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa ghi chú này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'notes', id));
              loadNotes();
            } catch (error) {
              console.error('Lỗi khi xóa ghi chú:', error);
              Alert.alert('Lỗi', 'Không thể xóa ghi chú. Vui lòng thử lại!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tìm kiếm ghi chú..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />
      <Button
        title="Thêm ghi chú"
        onPress={() => navigation.navigate('AddNote')}
      />
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onEdit={() => navigation.navigate('AddNote', { note: item })}
            onDelete={() => handleDeleteNote(item.id)}
            onPress={() => navigation.navigate('Detail', { note: item })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default HomeScreen;