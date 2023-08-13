/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  AlertIOS,
  Platform,
} from 'react-native';
import ClothList from './clothListView';
import {HOST} from '../../../../env';
import {setLoader} from '../../../redux/slices/loader';
import {useDispatch} from 'react-redux';
import Loader from '../../../reusables/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ClothSelection({navigation}) {
  const dispatch = useDispatch();
  const [cloths, setCloths] = useState([]);
  const [categories, setCategories] = useState([]);

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const url = `${HOST}/api/cloths`;
      const {data} = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      if (data) {
        setCloths(data);
        const _categories = data.map(a => a.material);
        const __categories = _categories.filter(onlyUnique);
        setCategories(__categories);
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error.response.data);
      const msg =
        Object.values(error.response.data)
          .map(a => a.toString())
          .join(', ') || 'Something went wrong!';
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
    }
  };

  const getCloths = category => {
    const _cloths = cloths.filter(a => a.material === category);
    return _cloths;
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Loader msg="Fetching Cloths..." />
      <ScrollView style={{flex: 1}}>
        <View style={{paddingTop: 20}}>
          {categories.map(category => (
            <ClothList
              key={category}
              title={category}
              navigation={navigation}
              cloths={getCloths(category)}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({});

export default ClothSelection;
