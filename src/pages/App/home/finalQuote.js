/* eslint-disable react-native/no-inline-styles */
import React, { Fragment, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AlertIOS,
  Platform,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Shirt from '../../../reusables/customization/shirt';
import Button from '../../../reusables/button';

import { useDispatch, useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import { HOST, PAYMENT_KEY } from '../../../../env';
import MyPant from '../../../reusables/customization/mypant';
import { updateOrder } from '../../../redux/slices/order';
import axios from 'axios';
import { setLoader } from '../../../redux/slices/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FinalQuote({ navigation, route }) {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders);
  const { orderType, measurements, deliveryAddress } = orders;
  const { orderId } = route.params;
  const config = { ...measurements };

  const updateOrderInfo = async payload => {
    try {
      dispatch(setLoader(true));
      const url = `${HOST}/api/updateOrder/${orderId}`;
      const response = await axios.put(url, payload, {
        withCredentials: true,
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      console.log('response', response);
      const { data } = response;
      if (data) {
        dispatch(setLoader(false));
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'cart',
            },
          ],
        });
        navigation.navigate('cart');
      } else {
        console.log('something went wrong', data);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.error(error);
      // const msg = Object.values(error.response.data).map(a => a.toString()).join(', ') || 'Something went wrong!';
      // if (Platform.OS === 'android') {
      //     Alert.alert('Warning', msg);
      // } else {
      //     AlertIOS.alert(msg);
      // }
    }
  };

  const paymentInitiate = async () => {
    console.log('initiate payment gateway');
    console.log(
      'once payment done, create order and update orderReferenceImage for the orderId',
    );
    const userinfo = JSON.parse(await AsyncStorage.getItem('userinfo'));
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: PAYMENT_KEY,
      amount: 1000,
      name: 'Darji',
      // order_id: 'order_DslnoIgkIDL8Zt',//Replace this with an order_id created using Orders API.
      prefill: {
        email: userinfo.email, // get from async storage
        contact: userinfo.mobile_number, // get from async storage
        name: userinfo.name, // get from async storage
      },
      theme: { color: '#53a20e' },
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        console.log('payment done, payment information below');
        console.log('Razorpay Payment Id:', data);
        const payload = {
          orderStatus: 'complete',
          orderDeliveryStatus: 'pending',
          orderPaymentStatus: 'partial',
          totalPrice: 1000,
          alreadyPaid: 600,
          razorpayPaymentId: data.razorpay_payment_id,
        };
        dispatch(updateOrder(payload));
        updateOrderInfo(payload);
      })
      .catch(error => {
        // handle failure
        console.log(error);
        if (Platform.OS === 'android') {
          Alert.alert('Error', `Error: ${error.code} | ${error.description}`);
        } else {
          AlertIOS.alert(`Error: ${error.code} | ${error.description}`);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#87BCBF' }}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 20, backgroundColor: '#87BCBF' }}>
          <View style={[styles.horizontalAlign]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color="#fff"
              onPress={() => navigation.goBack()}
            />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
              Final Quote
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {orderType === 'shirt' ? (
            <Shirt config={config} />
          ) : orderType === 'pant' ? (
            <MyPant config={config} />
          ) : (
            <></>
          )}
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Stitching Price</Text>
            <Text style={styles.value}>1000</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fabric Charges</Text>
            <Text style={styles.value}>100</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Customisation Cost</Text>
            <Text style={styles.value}>00</Text>
          </View>
          <View style={[styles.hr, styles.row]} />
          <View style={styles.row}>
            <Text style={styles.label}>Total</Text>
            <Text style={[styles.value, styles.active]}>1100</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Advance Min 60%</Text>
            <Text style={[styles.value, styles.active]}>700</Text>
          </View>
          <View style={[styles.hr, styles.row]} />
          <View style={styles.row}>
            <View>
              <View style={[styles.flex, { marginBottom: 10 }]}>
                <Text style={[styles.title, { marginBottom: 0 }]}>Delivery Address</Text>
                {deliveryAddress && <Pressable onPress={() => {
                  navigation.push('Common', {
                    screen: 'addresses',
                    params: {
                      isOrder: true,
                      addressFor: 'deliveryAddress',
                      selectedAddress: deliveryAddress
                    }
                  })
                }}>
                  <Text style={{ color: '#000' }}>
                    <Ionicons name="pencil-outline" size={14} color="#000" /> Edit
                  </Text>
                </Pressable>}
              </View>



              {deliveryAddress && (
                <Fragment>
                  <Text>{deliveryAddress.house_number},{deliveryAddress.street},{deliveryAddress.area_name},{deliveryAddress.city},{deliveryAddress.state} - {deliveryAddress.pincode}</Text>
                  {deliveryAddress.landmark && <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold', color: '#000' }}>Landmark:</Text> {deliveryAddress.landmark}</Text>}
                  <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold', color: '#000' }}>Contact:</Text> {deliveryAddress.contact_number}</Text>
                </Fragment>
              )}
            </View>

          </View>
          {/* <View style={styles.row}>
                        <Text style={{fontWeight: '500'}}>{cloth_name}</Text>
                    </View> */}
          <View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => paymentInitiate()}>
              <Text style={styles.btnLabel}>place order</Text>
              <Text style={styles.btnInfo}>
                (payment advance min 60% - Rs.700)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  horizontalAlign: {
    flexDirection: 'row',
    padding: 15,
  },
  detailContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    color: '#7D8184',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  value: {
    color: '#324755',
    fontWeight: '500',
    fontSize: 18,
  },
  active: {
    color: '#E8875C',
  },
  hr: {
    height: 1,
    width: '100%',
    backgroundColor: '#d0d0d0',
  },
  btn: {
    backgroundColor: '#E8875C',
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
  },
  btnLabel: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  btnInfo: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#324755',
    fontSize: 18,
    marginBottom: 20,
  },
});

export default FinalQuote;
