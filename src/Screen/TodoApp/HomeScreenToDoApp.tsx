import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {firestore} from '../../../firebaseConfig';
import TaskItem from '../TodoApp/TaskItem';
import {Task} from '../../types';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Enum cho các trạng thái hiển thị công việc
enum TaskFilter {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>(TaskFilter.ALL);
  const navigation = useNavigation<NavigationProp>();

  const loadTasks = useCallback(async () => {
    try {
      const tasksRef = collection(firestore, 'notes');
      const q = query(tasksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedTasks = snapshot.docs.map(doc => ({
        ...(doc.data() as Task),
        id: doc.id,
      }));

      setTasks(loadedTasks);
      applyFilters(loadedTasks, activeFilter, searchQuery);
    } catch (error) {
      console.error('Lỗi khi tải công việc:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách công việc. Vui lòng thử lại!',
      );
    }
  }, [activeFilter, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  // Hàm lọc công việc dựa trên filter và search query
  const applyFilters = (
    tasksList: Task[],
    filter: TaskFilter,
    query: string,
  ) => {
    let filtered = [...tasksList];

    // Áp dụng filter trạng thái
    if (filter === TaskFilter.PENDING) {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === TaskFilter.COMPLETED) {
      filtered = filtered.filter(task => task.completed);
    }

    // Áp dụng tìm kiếm
    if (query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.text.toLowerCase().includes(lowerQuery) ||
          (task.title && task.title.toLowerCase().includes(lowerQuery)),
      );
    }

    setFilteredTasks(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(tasks, activeFilter, query);
  };

  const handleFilterChange = (filter: TaskFilter) => {
    setActiveFilter(filter);
    applyFilters(tasks, filter, searchQuery);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const taskRef = doc(firestore, 'notes', task.id);
      await updateDoc(taskRef, {
        completed: !task.completed,
      });
      loadTasks();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái công việc:', error);
      Alert.alert(
        'Lỗi',
        'Không thể cập nhật trạng thái công việc. Vui lòng thử lại!',
      );
    }
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa công việc này không?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'notes', id));
              loadTasks();
            } catch (error) {
              console.error('Lỗi khi xóa công việc:', error);
              Alert.alert('Lỗi', 'Không thể xóa công việc. Vui lòng thử lại!');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tìm kiếm công việc..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === TaskFilter.ALL && styles.activeFilter,
          ]}  
          onPress={() => handleFilterChange(TaskFilter.ALL)}>
          <Text
            style={[
              styles.filterText,
              activeFilter === TaskFilter.ALL && styles.activeFilterText,
            ]}>
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === TaskFilter.PENDING && styles.activeFilter,
          ]}
          onPress={() => handleFilterChange(TaskFilter.PENDING)}>
          <Text
            style={[
              styles.filterText,
              activeFilter === TaskFilter.PENDING && styles.activeFilterText,
            ]}>
            Chưa hoàn thành
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === TaskFilter.COMPLETED && styles.activeFilter,
          ]}
          onPress={() => handleFilterChange(TaskFilter.COMPLETED)}>
          <Text
            style={[
              styles.filterText,
              activeFilter === TaskFilter.COMPLETED && styles.activeFilterText,
            ]}>
            Đã hoàn thành
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Thêm công việc mới"
        onPress={() => navigation.navigate('AddNote')}
        color="#2196F3"
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TaskItem
            task={item}
            onEdit={() => navigation.navigate('AddNote', {note: item})}
            onDelete={() => handleDeleteTask(item.id)}
            onPress={() => navigation.navigate('Detail', {note: item})}
            onToggleComplete={() => handleToggleComplete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Không tìm thấy công việc nào phù hợp'
                : 'Danh sách công việc trống'}
            </Text>
          </View>
        }
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#616161',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  list: {
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default HomeScreen;
