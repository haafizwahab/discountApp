import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import uuid from 'react-native-uuid';
import { Input } from 'react-native-elements';

export default function componentName({ navigation }) {
  const [result, setResult] = useState('');
  const [price, setPrice] = useState('');
  const [percentage, setPercentage] = useState('');
  const [data, setData] = useState([
    {
      price: '100',
      discount: '20',
      discountedPrice: '80',
    },
    {
      price: '100',
      discount: '25',
      discountedPrice: '75',
    },
    {
      price: '100',
      discount: '50',
      discountedPrice: '50',
    },
  ]);

  const [object, setObject] = useState({
    id: '',
    price: '',
    discount: '',
    discountedPrice: '',
  });

  navigation.setOptions({
    title: 'Discount Calculator',
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <Button
          title='History'
          onPress={() => navigation.navigate('History')}
        />
      </View>
    ),
    headerStyle: {
      backgroundColor: '#b0e37d',
    },
  });

  const calculate = () => {
    // var actualPrice = price;
    // var percent = percentage;
    if (percentage >= 0 && price >= 0 && percentage <= 100) {
      var discounted = (price * percentage) / 100;
      var newPrice = price - discounted;
      setResult(newPrice.toFixed(2));
      setObject((object) => ({ ...object, id: uuid.v1() }));
      setObject((object) => ({ ...object, price: price }));
      setObject((object) => ({ ...object, discount: percentage + '%' }));
      setObject((object) => ({ ...object, discountedPrice: result }));
      console.log(object.id);
      // console.log(object);
    } else if (percentage > 100) {
      console.log(':error');
    } else if (percentage < 0 || actualPrice < 0) {
      console.log('errr');
    }

    // Keyboard.dismiss();
  };

  useEffect(() => {
    calculate();
  }, [percentage, price, result]);

  const storeData = async () => {
    try {
      let data = object;
      let jsonValue = await AsyncStorage.getItem('@History:key');
      let prevData = jsonValue != null ? JSON.parse(jsonValue) : [];
      if (prevData.length > 0) {
        prevData = [...prevData, data];
      } else {
        prevData = [];
        prevData.push(data);
      }
      jsonValue = JSON.stringify(prevData);
      await AsyncStorage.setItem('@History:key', jsonValue);
      setPrice('');
      setPercentage('');
      console.log(jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.result}>{result}</Text>

      <Input
        placeholder='Price'
        keyboardType='numeric'
        value={price}
        onChangeText={(text) => setPrice(text)}
      />

      <Input
        placeholder='Percentage %'
        keyboardType='numeric'
        value={percentage}
        onChangeText={(text) => setPercentage(text)}
      />
      <TouchableOpacity style={styles.btn} onPress={storeData}>
        <Text style={styles.btnText}> Save</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 75,
  },
  inputField: {
    marginTop: 10,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  result: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#a2de66',
  },
  btn: {
    height: 40,
    width: 100,
    backgroundColor: '#a2de66',
    alignSelf: 'center',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});
