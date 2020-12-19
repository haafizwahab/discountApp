import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = ({ navigation }) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@History:key');
      setData(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      // error reading value
      console.log('error getting data');
    }
  };

  const storeData = async () => {
    try {
      const value = JSON.stringify(data);
      await AsyncStorage.setItem('@History:key', value);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    storeData();
  }, [data]);

  const clear = async () => {
    await AsyncStorage.removeItem('@History:key');
    setData([]);
  };

  const deleteRow = (e) => {
    setData(data.filter((data) => data.id != e));
  };

  navigation.setOptions({
    title: 'Discount Calculator',
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <Button title='Clear' onPress={() => clear()} />
      </View>
    ),
    headerStyle: {
      backgroundColor: '#b0e37d',
    },
  });

  return (
    <ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
        }}
      >
        <Text style={styles.title}>Price</Text>
        <Text style={styles.title}>Discount</Text>
        <Text style={styles.title}>Discount Rice</Text>
      </View>
      {data.map((item) => (
        <Pressable
          style={styles.container}
          onPress={() => {
            deleteRow(item.id);
          }}
        >
          <Text>{item.price}</Text>
          <Text>{item.discount}</Text>
          <Text>{item.discountedPrice}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#b0e37d',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
