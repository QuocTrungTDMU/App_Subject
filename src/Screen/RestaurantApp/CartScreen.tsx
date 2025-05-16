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
import {useMyContext} from '../../Context/context';
import {firebase} from '@react-native-firebase/firestore';

const TAX_RATE = 0.08;

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const {state, dispatch} = useMyContext();
  const [billDetails, setBillDetails] = useState({
    itemsTotal: 0,
    offerDiscount: -18,
    taxes: 0,
    deliveryCharges: 30,
    totalPay: 0,
  });

  // Hàm tính toán hóa đơn dựa trên giỏ hàng
  const calculateBill = (items: any) => {
    const itemsTotal = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0,
    );
    const taxes = itemsTotal * TAX_RATE;
    const deliveryCharges = 30; // Cố định
    const offerDiscount = -18; // Cố định
    const totalPay = itemsTotal + taxes + deliveryCharges + offerDiscount;

    return {
      itemsTotal,
      offerDiscount,
      taxes,
      deliveryCharges,
      totalPay,
    };
  };

  // Cập nhật hóa đơn khi giỏ hàng thay đổi
  useEffect(() => {
    setBillDetails(calculateBill(state.cartItems));
  }, [state.cartItems]);

  // Hàm xử lý tăng số lượng
  const increaseQuantity = (id: string) => {
    const item = state.cartItems.find((item: any) => item.id === id);
    if (item) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {id, quantity: item.quantity + 1},
      });
    }
  };

  // Hàm xử lý giảm số lượng
  const decreaseQuantity = (id: string) => {
    const item = state.cartItems.find((item: any) => item.id === id);
    if (item && item.quantity > 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {id, quantity: item.quantity - 1},
      });
    } else if (item && item.quantity === 1) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: {id},
      });
    }
  };

  // Hàm xử lý xóa món ăn khỏi giỏ hàng
  const removeFromCart = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa món ăn này khỏi giỏ hàng?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          dispatch({
            type: 'REMOVE_FROM_CART',
            payload: {id},
          });
        },
      },
    ]);
  };

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!state.userLogin) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để đặt hàng!');
      navigation.navigate('Login');
      return;
    }

    try {
      const ordersCollection = firebase.firestore().collection('orders');
      const orderData = {
        userId: state.userLogin.uid, // Sử dụng uid từ Firebase Authentication
        items: state.cartItems,
        billDetails,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending', // Trạng thái ban đầu
      };

      // Thêm đơn hàng vào Firestore
      const orderRef = await ordersCollection.add(orderData);
      console.log('Order created with ID:', orderRef.id);

      // Xóa giỏ hàng
      dispatch({type: 'CLEAR_CART'});

      // Điều hướng đến OrderNotice với orderId
      navigation.navigate('OrderNotice', {orderId: orderRef.id});

      Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt thành công!');
    } catch (error: any) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', `Không thể đặt hàng: ${error.message}`);
    }
  };

  const renderCartItem = ({item}: any) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(item.id)}>
          <Text style={styles.quantityText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => increaseQuantity(item.id)}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemPrice}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {state.cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống!</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('HomeStack')}>
            <Text style={styles.shopButtonText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Danh sách món ăn trong giỏ hàng */}
          <FlatList
            data={state.cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />

          {/* Thông tin hóa đơn */}
          <View style={styles.billContainer}>
            <Text style={styles.billTitle}>Hóa đơn</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Tổng tiền món ăn</Text>
              <Text style={styles.billValue}>
                ${billDetails.itemsTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Giảm giá</Text>
              <Text style={styles.billValue}>
                ${billDetails.offerDiscount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Thuế (8%)</Text>
              <Text style={styles.billValue}>
                ${billDetails.taxes.toFixed(2)}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Phí giao hàng</Text>
              <Text style={styles.billValue}>
                ${billDetails.deliveryCharges.toFixed(2)}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Tổng thanh toán</Text>
              <Text style={styles.billValue}>
                ${billDetails.totalPay.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Nút thanh toán */}
          <View style={styles.payButtonContainer}>
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePlaceOrder}>
              <Text style={styles.payButtonText}>Tiến hành đặt hàng</Text>
              <Text style={styles.payButtonPrice}>
                ${billDetails.totalPay.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
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

export default CartScreen;
