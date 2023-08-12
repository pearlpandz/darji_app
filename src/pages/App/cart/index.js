/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-native-modal';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Platform,
  Alert,
  AlertIOS,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ActionSheet from '../../../reusables/actionsheet';
import Loader from '../../../reusables/loader';

import {setLoader} from '../../../redux/slices/loader';

import {HOST} from '../../../../env';
import MEN_IMAGE from './../../../assets/images/men.png';
import {AuthContext} from '../../../services/context';

function CartPage({navigation}) {
  const dispatch = useDispatch();
  const {setAuthStatus} = useContext(AuthContext);
  const ACTIONITEMS = [
    {
      id: 1,
      label: 'Draft',
      value: 'orderStatus.draft',
    },
    {
      id: 2,
      label: 'Payment Pending',
      value: 'orderPaymentStatus.pending',
    },
    {
      id: 3,
      label: 'Partially Paid',
      value: 'orderPaymentStatus.partial',
    },
    {
      id: 4,
      label: 'Delivery Pending',
      value: 'orderDeliveryStatus.pending',
    },
    {
      id: 5,
      label: 'Delivered',
      value: 'orderDeliveryStatus.complete',
    },
  ];
  const [selectedType, setType] = useState(ACTIONITEMS[0].value);
  const [actionSheet, setActionSheet] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderid] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const ActionSheetModal = useMemo(
    () => (
      <Modal
        isVisible={actionSheet}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <ActionSheet
          actionItems={ACTIONITEMS}
          onCancel={() => setActionSheet(false)}
          onSelect={type => {
            setType(type);
            setActionSheet(false);
          }}
        />
      </Modal>
    ),
    [ACTIONITEMS, actionSheet],
  );

  const redirectTo = (item, status) => {
    console.log(item[status]);
  };

  const resultView = useMemo(() => {
    let orderList = [...orders];
    let className;
    let orderStatus = 'draft';
    if (orderId) {
      orderList = orderList.filter(a => String(a.id).includes(orderId));
    }
    if (selectedType) {
      const field = selectedType.split('.');
      orderList = orderList.filter(a => a[field[0]] === field[1]);
      className = field[0];
      if (field[0] === 'orderPaymentStatus') {
        orderStatus = 'payment ' + field[1];
      } else if (field[0] === 'orderStatus') {
        orderStatus = field[1];
      } else if (field[0] === 'orderDeliveryStatus') {
        orderStatus = 'delivery ' + field[1];
      }
    }
    return (
      <>
        {orderList.length > 0 ? (
          orderList.map((item, key) => (
            <Pressable
              onPress={() => redirectTo(item, className)}
              style={[styles.cardContainer, styles.boxWithShadow]}
              key={key}>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <Image source={MEN_IMAGE} style={styles.imageView} />
                <View style={{position: 'relative'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#324755',
                        fontSize: 15,
                        textTransform: 'capitalize',
                      }}>
                      {item.orderType}
                    </Text>
                    <Text
                      style={[
                        {
                          marginLeft: 10,
                          fontSize: 12,
                          fontWeight: '400',
                          marginTop: 5,
                          paddingHorizontal: 5,
                          paddingVertical: 1,
                          borderRadius: 5,
                        },
                        styles[className],
                      ]}>
                      {orderStatus}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#324755',
                      fontWeight: '300',
                      marginTop: 5,
                    }}>
                    ID: {item.id}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#324755',
                      fontWeight: '300',
                      marginTop: 5,
                    }}>
                    {moment(item.orderDate).format('DD-MMM-YYYY hh:mm A')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 13, marginBottom: 5}}>
                  Total: <Text>Rs.{item.totalPrice}</Text>
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: 5,
                  }}>
                  Already Paid: <Text>Rs.{item.alreadyPaid}</Text>
                </Text>
                <Text style={{fontSize: 13, marginBottom: 10}}>
                  Pending: <Text>Rs.{item.totalPrice - item.alreadyPaid}</Text>
                </Text>
                {/* <Text style={styles.saved}>{item.orderDeliveryStatus}</Text> */}
              </View>
            </Pressable>
          ))
        ) : (
          <View
            style={[
              styles.cardContainer,
              styles.boxWithShadow,
              {height: 100, alignItems: 'center', justifyContent: 'center'},
            ]}>
            <Text>No {orderStatus} orders found</Text>
          </View>
        )}
      </>
    );
  }, [selectedType, orderId, orders]);

  const getOrders = useCallback(async () => {
    try {
      dispatch(setLoader(true));
      const url = `${HOST}/api/orders`;
      const token = await AsyncStorage.getItem('token');
      console.log('token', token);
      const {data} = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      if (data) {
        console.log(data);
        setOrders(data);
        setRefreshing(false);
        dispatch(setLoader(false));
      }
    } catch (error) {
      setRefreshing(false);
      dispatch(setLoader(false));
      const status_code = error.response.status;
      if (status_code === 403 || status_code === 401) {
        setAuthStatus(false);
        if (Platform.OS === 'android') {
          Alert.alert('Warning', 'Session Expired!');
        } else {
          AlertIOS.alert('Session Expired!');
        }
      } else {
        const msg =
          Object.values(error.response.data)
            .map(a => a.toString())
            .join(', ') || 'Something went wrong!';
        console.log(msg);
        if (Platform.OS === 'android') {
          Alert.alert('Warning', msg);
        } else {
          AlertIOS.alert(msg);
        }
      }
    }
  }, [refreshing]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      <Loader />
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }>
        <View style={[styles.banner, styles.horizontalAlign]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Order ID"
            underlineColorAndroid="transparent"
            value={orderId}
            onChangeText={id => {
              setOrderid(id);
            }}
          />
          <Pressable
            onPress={() => setActionSheet(true)}
            style={[
              styles.select,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <Text style={{color: '#324755'}}>
              {ACTIONITEMS.find(a => a.value === selectedType)?.label}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#000" />
          </Pressable>
        </View>
        <View style={styles.cardView}>{resultView}</View>
      </ScrollView>
      {ActionSheetModal}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    width: (Dimensions.get('screen').width - 60) / 2,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 20,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  cardDetails: {
    padding: 10,
    paddingTop: 30,
    position: 'relative',
    width: '100%',
  },
  iconView: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    top: -20,
    left: '42%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  boxWithShadow: {
    shadowColor: '#666',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 15,
  },
  cardImage: {
    height: 120,
    flex: 1,
    width: '100%',
    color: '#75bbb9',
  },
  horizontalAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginLeft: 15,
    color: '#fff',
    width: Dimensions.get('screen').width - 200,
  },
  banner: {
    backgroundColor: '#000000',
    paddingVertical: 30,
    paddingHorizontal: 20,
    position: 'relative',
    paddingBottom: 50,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 1,
  },
  bannerDesc: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  hr: {
    height: 1,
    width: 50,
    backgroundColor: '#fff',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    width: Dimensions.get('screen').width - 40,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  inputInsideIcon: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#e8865b',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    height: 42,
  },
  select: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '48%',
    height: 42,
  },
  blog: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardView: {
    paddingHorizontal: 20,
    position: 'relative',
    top: -30,
    marginBottom: -20,
  },
  imageView: {
    height: 65,
    width: 65,
    borderRadius: 12,
    marginRight: 10,
  },
  saved: {
    backgroundColor: '#e8875c4d',
    color: '#E8875C',
    fontSize: 14,
    textAlign: 'center',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 15,
    textTransform: 'capitalize',
  },
  orderPaymentStatus: {
    backgroundColor: '#22C55E',
    color: '#fff',
  },
  orderStatus: {
    backgroundColor: '#64748B', //'#3B82F6',
    color: '#fff',
  },
  orderDeliveryStatus: {
    backgroundColor: '#F59E0B',
    color: '#fff',
  },
});

export default CartPage;
