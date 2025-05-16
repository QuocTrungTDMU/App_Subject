import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {useMyContext} from '../../Context/context';

type FoodDetailScreenRouteProp = RouteProp<
  {
    params: {
      food: {
        id: string;
        name: string;
        price: number;
        description: string;
        imagePath: string;
        topicId: string;
      };
    };
  },
  'params'
>;

const FoodDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<FoodDetailScreenRouteProp>();
  const {dispatch} = useMyContext();

  const {food} = route.params || {
    food: {
      id: '1',
      name: 'Mì Xào',
      price: 8,
      description:
        'Mì xào giòn với rau củ tươi và thịt heo, đậm đà hương vị Trung Hoa.',
      imagePath: '../../../../Asset/images/mi-xao.png',
      topicId: '1',
    },
  };

  // Hàm xử lý khi nhấn "Add to Cart"
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: food.id + '-' + food.topicId, // Đảm bảo ID duy nhất
        name: food.name,
        price: food.price,
      },
    });
    Alert.alert('Thành công', `${food.name} đã được thêm vào giỏ hàng!`);
    // Có thể điều hướng đến CartScreen nếu cần
    // navigation.navigate('CartStack');
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh món ăn */}
      <Image
        source={require('../../../../Asset/images/biryani.png')}
        style={styles.foodImage}
      />

      {/* Tên món ăn */}
      <Text style={styles.foodName}>{food.name}</Text>

      {/* Giá tiền */}
      <Text style={styles.foodPrice}>${food.price.toFixed(2)}</Text>

      {/* Mô tả món ăn */}
      <Text style={styles.foodDescription}>
        {food.description ||
          'Món ăn thơm ngon được chế biến từ nguyên liệu tươi sạch.'}
      </Text>

      {/* Nút Add to Cart */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
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
  },
  foodImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  foodPrice: {
    fontSize: 20,
    color: '#555',
    marginBottom: 15,
  },
  foodDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodDetailScreen;
