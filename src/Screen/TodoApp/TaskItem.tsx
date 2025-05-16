import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Task} from '../../../src/types';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckBoxIcon from '../../components/Icons/CheckboxIcon';
import BoxOutlineIcon from '../../components/Icons/BoxOutlineIconProps ';
import EditIcon from '../../components/Icons/EditIcon';
import TrashIcon from '../../components/Icons/Trashicon';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'dd/MM/yyyy HH:mm', {locale: vi});
  };

  // Determine priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#FF5252';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return {text: 'Không có hạn', color: '#757575'};

    const dueDate = task.dueDate.toDate
      ? task.dueDate.toDate()
      : new Date(task.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now && !task.completed;

    return {
      text: format(dueDate, 'dd/MM/yyyy', {locale: vi}),
      color: isOverdue ? '#FF5252' : '#757575',
    };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <TouchableOpacity
      style={[styles.container, task.completed && styles.completedTask]}
      onPress={onPress}>
      <TouchableOpacity style={styles.checkbox} onPress={onToggleComplete}>
        {task.completed ? (
          <CheckBoxIcon height={24} width={24} />
        ) : (
          <BoxOutlineIcon height={24} width={24} />
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, task.completed && styles.completedText]}
            numberOfLines={1}>
            {task.title || task.text || 'Công việc không có tiêu đề'}
          </Text>

          {task.priority && (
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: getPriorityColor()},
              ]}>
              <Text style={styles.priorityText}>
                {task.priority === 'high'
                  ? 'Cao'
                  : task.priority === 'medium'
                  ? 'TB'
                  : 'Thấp'}
              </Text>
            </View>
          )}
        </View>

        {task.text && task.title && (
          <Text
            style={[styles.text, task.completed && styles.completedText]}
            numberOfLines={2}>
            {task.text}
          </Text>
        )}

        <View style={styles.metaContainer}>
          <View style={styles.dateContainer}>
            <Icon name="access-time" size={14} color="#757575" />
            <Text style={styles.date}>{formatDate(task.createdAt)}</Text>
          </View>

          {task.dueDate && (
            <View style={styles.dateContainer}>
              <Icon name="event" size={14} color={dueDateInfo.color} />
              <Text style={[styles.dueDate, {color: dueDateInfo.color}]}>
                {dueDateInfo.text}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <EditIcon height={24} width={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <TrashIcon height={24} width={24} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  completedTask: {
    backgroundColor: '#F5F5F5',
    opacity: 0.8,
  },
  checkbox: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  date: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default TaskItem;
