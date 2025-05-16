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
} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';

const initialCuisines = [
  {
    id: '1',
    name: 'Chinese',
    imagePath: '../../../Images/CountryFoodImage/chinese.png',
  },
  {
    id: '2',
    name: 'South Indian',
    imagePath: '../../../Images/CountryFoodImage/south-indian.png',
  },
  {
    id: '3',
    name: 'North Indian',
    imagePath: '../../../Images/CountryFoodImage/north-indian.png',
  },
  {
    id: '4',
    name: 'Beverages',
    imagePath: '../../../Images/CountryFoodImage/beverages.png',
  },
  {
    id: '5',
    name: 'Mexican',
    imagePath: '../../../Images/CountryFoodImage/mexican.png',
  },
  {
    id: '6',
    name: 'Biryani',
    imagePath: '../../../Images/CountryFoodImage/biryani.png',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [cuisines, setCuisines] = useState<any[]>([]);

  const initializeCuisines = async () => {
    console.log('Starting initializeCuisines');
    try {
      const cuisinesCollection = firebase.firestore().collection('cuisines');
      console.log('Fetching cuisines collection');
      const cuisineSnapshot = await cuisinesCollection.get();

      if (cuisineSnapshot.empty) {
        console.log('Cuisines collection is empty, initializing...');
        const batch = firebase.firestore().batch();
        initialCuisines.forEach(cuisine => {
          const docRef = cuisinesCollection.doc(cuisine.id);
          batch.set(docRef, {
            name: cuisine.name,
            imagePath: cuisine.imagePath,
          });
        });
        await batch.commit();
        console.log('Cuisines initialized in Firestore');
        Alert.alert(
          'Thành công',
          'Dữ liệu cuisines đã được khởi tạo trên Firestore',
        );
      } else {
        console.log('Cuisines collection already exists');
      }
    } catch (error: any) {
      console.error('Error initializing cuisines:', error);
      Alert.alert('Lỗi', `Không thể khởi tạo cuisines: ${error.message}`);
    }
  };

  const fetchCuisines = async () => {
    console.log('Starting fetchCuisines');
    try {
      const cuisinesCollection = firebase.firestore().collection('cuisines');
      const cuisineSnapshot = await cuisinesCollection.get();
      const cuisineList = cuisineSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched cuisines:', cuisineList);
      setCuisines(cuisineList);
      console.log(cuisines);
    } catch (error: any) {
      console.error('Error fetching cuisines:', error);
      Alert.alert('Lỗi', `Không thể lấy dữ liệu cuisines: ${error.message}`);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    const initializeAndFetch = async () => {
      try {
        await initializeCuisines();
        await fetchCuisines();
      } catch (error) {
        console.error('Error in initializeAndFetch:', error);
      }
    };
    initializeAndFetch();
  });

  const renderCuisine = ({item}: any) => (
    <TouchableOpacity
      style={styles.cuisineCard}
      onPress={() => navigation.navigate('FoodListScreen', {topicId: item.id})}>
      <Image
        source={require('../../../Images/CountryFoodImage/beverages.png')}
        style={styles.cuisineImage}
      />
      <Text style={styles.cuisineText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuisine</Text>
      <FlatList
        data={cuisines}
        renderItem={renderCuisine}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
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
  cuisineCard: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuisineImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  cuisineText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
