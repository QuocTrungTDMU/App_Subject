import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Note} from '../types';
import TrashIcon from './Icons/Trashicon';
import EditIcon from './Icons/EditIcon';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onPress: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({note, onEdit, onDelete}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{note.text}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(note)}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(note.id)}>
          <TrashIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
});

export default NoteItem;
