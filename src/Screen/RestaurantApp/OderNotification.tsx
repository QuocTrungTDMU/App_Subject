import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const OrderNotice = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {orderId} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt hàng thành công!</Text>
      <Text style={styles.message}>Mã đơn hàng: {orderId}</Text>
      <Text style={styles.message}>
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng sớm nhất!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeStack')}>
        <Text style={styles.buttonText}>Quay lại trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderNotice;