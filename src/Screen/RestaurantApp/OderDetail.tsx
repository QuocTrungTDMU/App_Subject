import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/firestore';

const OrderDetail = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {orderId} = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  
  const fetchOrderDetails = async () => {
    try {
      const orderRef = firebase.firestore().collection('orders').doc(orderId);
      const doc = await orderRef.get();
      if (doc.exists()) {
        setOrder({id: doc.id, ...doc.data()});
      } else {
        Alert.alert('Lỗi', 'Đơn hàng không tồn tại!');
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      Alert.alert('Lỗi', `Không thể lấy chi tiết đơn hàng: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handlePayment = () => {
    // if (order.status !== 'pending') {
    //   Alert.alert('Thông báo', 'Đơn hàng này không thể thanh toán!');
    //   return;
    // }
    // navigation.navigate('PaymentScreen', {orderId: order.id});
    navigation.navigate('PaymentScreen');
  };

  const renderOrderItem = ({item}: any) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
      <Text style={styles.itemPrice}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Không tìm thấy đơn hàng!</Text>
      </View>
    );
  }

  const createdAt = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleString()
    : 'Đang tải...';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết đơn hàng</Text>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>Mã đơn hàng: {order.id}</Text>
        <Text style={styles.orderDate}>Ngày đặt: {createdAt}</Text>
        <Text style={styles.orderStatus}>Trạng thái: {order.status}</Text>
      </View>

      {/* Danh sách món ăn trong đơn hàng */}
      <Text style={styles.sectionTitle}>Món ăn đã đặt</Text>
      <FlatList
        data={order.items}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Thông tin hóa đơn */}
      <View style={styles.billContainer}>
        <Text style={styles.billTitle}>Hóa đơn</Text>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Tổng tiền món ăn</Text>
          <Text style={styles.billValue}>
            ${order.billDetails.itemsTotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Giảm giá</Text>
          <Text style={styles.billValue}>
            ${order.billDetails.offerDiscount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Thuế (8%)</Text>
          <Text style={styles.billValue}>
            ${order.billDetails.taxes.toFixed(2)}
          </Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Phí giao hàng</Text>
          <Text style={styles.billValue}>
            ${order.billDetails.deliveryCharges.toFixed(2)}
          </Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Tổng thanh toán</Text>
          <Text style={styles.billValue}>
            ${order.billDetails.totalPay.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Nút thanh toán */}
      {order.status === 'pending' && (
        <View style={styles.payButtonContainer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Thanh toán</Text>
            <Text style={styles.payButtonPrice}>
              ${order.billDetails.totalPay.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
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
  orderInfo: {
    marginBottom: 20,
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
  orderStatus: {
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  quantity: {
    fontSize: 14,
    color: '#555',
    marginRight: 15,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  billContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  billLabel: {
    fontSize: 16,
    color: '#555',
  },
  billValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
});

export default OrderDetail;