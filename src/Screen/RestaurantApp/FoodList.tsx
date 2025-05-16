import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import {useMyContext} from '../../Context/context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const initialFoods = {
  '1': [
    {
      id: '1',
      name: 'Mì Xào',
      price: 8,
      description:
        'Mì xào giòn với rau củ tươi và thịt heo, đậm đà hương vị Trung Hoa.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '2',
      name: 'Gà Kung Pao',
      price: 12,
      description:
        'Gà xào cay với ớt, đậu phộng và sốt đặc trưng, thơm ngon khó cưỡng.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '3',
      name: 'Vịt Quay Bắc Kinh',
      price: 20,
      description:
        'Vịt quay da giòn, thịt mềm, ăn kèm bánh tráng và sốt hoisin.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '4',
      name: 'Há Cảo Tôm',
      price: 10,
      description:
        'Há cảo hấp với nhân tôm tươi, vỏ mỏng dai, chấm cùng nước tương.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
  ],
  '2': [
    {
      id: '1',
      name: 'Dosa',
      price: 5,
      description:
        'Bánh xèo Ấn Độ mỏng giòn, ăn kèm với chutney dừa và sambar.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '2',
      name: 'Idli',
      price: 4,
      description:
        'Bánh gạo hấp mềm mịn, thường được ăn với sambar và chutney.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '3',
      name: 'Vada',
      price: 4,
      description: 'Bánh đậu lăng chiên giòn, thơm ngon, ăn kèm chutney cay.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '4',
      name: 'Uttapam',
      price: 6,
      description:
        'Bánh pancake Ấn Độ dày, phủ rau củ, ăn kèm sambar và chutney.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
  ],
  '3': [
    {
      id: '1',
      name: 'Butter Chicken',
      price: 15,
      description: 'Gà nấu sốt cà chua béo ngậy với bơ và kem, ăn kèm naan.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '2',
      name: 'Naan',
      price: 3,
      description:
        'Bánh mì Ấn Độ mềm, nướng lò đất sét, thích hợp ăn kèm cà ri.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '3',
      name: 'Paneer Tikka',
      price: 12,
      description: 'Phô mai Ấn Độ nướng than với gia vị tandoori, thơm lừng.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '4',
      name: 'Biryani',
      price: 18,
      description:
        'Cơm gạo basmati thơm ngon nấu với thịt và gia vị Ấn Độ đậm đà.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
  ],
  '4': [
    {
      id: '1',
      name: 'Nước Chanh',
      price: 2,
      description:
        'Nước chanh tươi mát lạnh, pha đường nhẹ, giải khát tức thì.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '2',
      name: 'Soda',
      price: 3,
      description: 'Nước ngọt có ga sảng khoái, nhiều hương vị để lựa chọn.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '3',
      name: 'Lassi',
      price: 4,
      description: 'Sữa chua Ấn Độ ngọt ngào, mát lạnh, có thể chọn vị xoài.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
    {
      id: '4',
      name: 'Trà Sữa',
      price: 5,
      description:
        'Trà sữa trân châu thơm ngon, ngọt dịu, thêm topping tùy chọn.',
      imagePath: '../../../../Asset/images/biryani.png',
    },
  ],
};

const FoodListScreen = ({route}: any) => {
  const navigation = useNavigation<any>();
  const {topicId} = route.params;
  const [foods, setFoods] = useState<any[]>([]);
  const {dispatch} = useMyContext();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState(''); // State cho từ khóa tìm kiếm

  const initializeFoods = async () => {
    console.log('Starting initializeFoods');
    try {
      const foodsCollection = firebase.firestore().collection('foods');
      const foodSnapshot = await foodsCollection
        .where('topicId', '==', topicId)
        .get();

      if (foodSnapshot.empty) {
        console.log(
          `Foods collection for topicId ${topicId} is empty, initializing...`,
        );
        const batch = firebase.firestore().batch();
        const foodsForTopic =
          initialFoods[topicId as keyof typeof initialFoods] || [];
        foodsForTopic.forEach(food => {
          const docRef = foodsCollection.doc(food.id + '-' + topicId);
          batch.set(docRef, {
            name: food.name,
            price: food.price,
            description: food.description,
            imagePath: food.imagePath,
            topicId: topicId,
          });
        });
        await batch.commit();
        console.log(`Foods initialized for topicId ${topicId} in Firestore`);
        Alert.alert(
          'Thành công',
          `Dữ liệu món ăn cho topicId ${topicId} đã được khởi tạo trên Firestore`,
        );
      } else {
        console.log(`Foods collection for topicId ${topicId} already exists`);
      }
    } catch (error: any) {
      console.error('Error initializing foods:', error);
      Alert.alert('Lỗi', `Không thể khởi tạo món ăn: ${error.message}`);
    }
  };

  const fetchFoods = async () => {
    console.log('Starting fetchFoods');
    try {
      const foodsCollection = firebase.firestore().collection('foods');
      const foodSnapshot = await foodsCollection
        .where('topicId', '==', topicId)
        .get();
      const foodList = foodSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched foods:', foodList);
      setFoods(foodList);
    } catch (error: any) {
      console.error('Error fetching foods:', error);
      Alert.alert('Lỗi', `Không thể lấy dữ liệu món ăn: ${error.message}`);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered for FoodListScreen');
    const initializeAndFetch = async () => {
      try {
        await initializeFoods();
        await fetchFoods();
      } catch (error) {
        console.error('Error in initializeAndFetch:', error);
      }
    };
    initializeAndFetch();
  }, [topicId]);

  const handleAddToCart = (food: any) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: food.id,
        name: food.name,
        price: food.price,
      },
    });
    Alert.alert('Thành công', `${food.name} đã được thêm vào giỏ hàng!`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  // Lọc danh sách món ăn dựa trên từ khóa tìm kiếm
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderFoodItem = ({item}: any) => (
    <View
      style={viewMode === 'list' ? styles.foodCardList : styles.foodCardGrid}>
      <Image
        source={require('../../../../Asset/images/biryani.png')}
        style={
          viewMode === 'list' ? styles.foodImageList : styles.foodImageGrid
        }
      />
      <Text
        style={viewMode === 'list' ? styles.foodNameList : styles.foodNameGrid}
        numberOfLines={1}
        ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text
        style={
          viewMode === 'list' ? styles.foodPriceList : styles.foodPriceGrid
        }>
        ${item.price}
      </Text>
      <View
        style={
          viewMode === 'list'
            ? styles.buttonContainerList
            : styles.buttonContainerGrid
        }>
        <TouchableOpacity
          style={
            viewMode === 'list' ? styles.addButtonList : styles.addButtonGrid
          }
          onPress={() => handleAddToCart(item)}>
          <Text
            style={
              viewMode === 'list'
                ? styles.buttonTextList
                : styles.buttonTextGrid
            }>
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            viewMode === 'list'
              ? styles.detailButtonList
              : styles.detailButtonGrid
          }
          onPress={() => navigation.navigate('FoodDetailScreen', {food: item})}>
          <Text
            style={
              viewMode === 'list'
                ? styles.buttonTextList
                : styles.buttonTextGrid
            }>
            View details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {topicId === '1'
            ? 'Chinese'
            : topicId === '2'
            ? 'South Indian'
            : topicId === '3'
            ? 'North Indian'
            : 'Beverages'}
        </Text>
        <TouchableOpacity onPress={toggleViewMode}>
          <Icon
            name={viewMode === 'list' ? 'grid-on' : 'list'}
            size={30}
            color="#800000"
          />
        </TouchableOpacity>
      </View>
      {/* Ô tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm món ăn..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#800000',
  },
  list: {
    paddingBottom: 20,
  },
  // Styles cho chế độ List
  foodCardList: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImageList: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodNameList: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  foodPriceList: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
    textAlign: 'center',
  },
  buttonContainerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  addButtonList: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  detailButtonList: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonTextList: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Styles cho chế độ Grid
  foodCardGrid: {
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '47%',
  },
  foodImageGrid: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  foodNameGrid: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  foodPriceGrid: {
    fontSize: 12,
    color: '#555',
    marginVertical: 3,
    textAlign: 'center',
  },
  buttonContainerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
    flexWrap: 'wrap',
  },
  addButtonGrid: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 2,
    flex: 1,
  },
  detailButtonGrid: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginLeft: 2,
    flex: 1,
  },
  buttonTextGrid: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Styles cho ô tìm kiếm
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default FoodListScreen;