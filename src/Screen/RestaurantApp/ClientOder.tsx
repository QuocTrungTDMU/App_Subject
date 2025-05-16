import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useMyContext} from '../../Context/context';

const MyOrder = () => {
  const navigation = useNavigation<any>();
  const {state} = useMyContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách đơn hàng từ Firestore và lọc theo userId
  const fetchOrders = async () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để xem đơn hàng!');
      navigation.navigate('Login');
      return;
    }

    try {
      const ordersCollection = firebase.firestore().collection('orders');
      const querySnapshot = await ordersCollection.get(); // Lấy toàn bộ dữ liệu

      const ordersList = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((order: any) => order.userId === user.uid); // Lọc theo userId

      setOrders(ordersList);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      let errorMessage = 'Không thể lấy danh sách đơn hàng. Vui lòng thử lại.';
      if (error.code === 'permission-denied') {
        errorMessage =
          'Bạn không có quyền xem đơn hàng. Vui lòng đăng nhập lại.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra mạng.';
      }
      Alert.alert('Lỗi', errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, );

  const renderOrderItem = ({item}: any) => {
    const createdAt = item.createdAt?.toDate
      ? item.createdAt.toDate().toLocaleString()
      : 'Không xác định';
    const totalPay = item.billDetails?.totalPay
      ? item.billDetails.totalPay.toFixed(2)
      : 'Không xác định';
    const status = item.status || 'Không xác định';

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetail', {orderId: item.id})}>
        <Text style={styles.orderId}>Mã đơn hàng: {item.id}</Text>
        <Text style={styles.orderDate}>Ngày đặt: {createdAt}</Text>
        <Text style={styles.orderTotal}>Tổng tiền: ${totalPay}</Text>
        <Text style={styles.orderStatus}>Trạng thái: {status}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng của tôi</Text>
      {loading ? (
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('HomeStack')}>
            <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#800000',
  },
  list: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  orderStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyOrder;