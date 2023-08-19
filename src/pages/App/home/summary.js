/* eslint-disable react-native/no-inline-styles */
import React, { Fragment, useContext, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Platform,
  Alert,
  AlertIOS,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Shirt from '../../../reusables/customization/shirt';
import AttributeView from './attributeView';
import Button from '../../../reusables/button';

import Cloth from './../../../assets/images/cloth.jpg';
import axios from 'axios';
import { HOST } from '../../../../env';
import { updateOrder, resetOrder } from '../../../redux/slices/order';
import { useDispatch, useSelector } from 'react-redux';
import MyPant from '../../../reusables/customization/mypant';
import { setLoader } from '../../../redux/slices/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../services/context';
import MyShirt from '../../../reusables/customization/myshirt';

function Summary({ navigation }) {
  const dispatch = useDispatch();
  const { setAuthStatus } = useContext(AuthContext);
  const orders = useSelector(state => state.orders);
  const {
    orderType,
    measurements,
    cloth_length,
    cloth_total_price,
    measurementAddress,
    cloth_pickuplocation,
    cloth_couriered,
    reference,
    cloth,
    orderedDesign,
    deliveryAddress,
  } = orders;
  const config = { ...measurements };
  const selectedCloth = {
    size: cloth_length,
    price: cloth_total_price,
    ...cloth,
  };

  const [address, setAddress] = useState(deliveryAddress || '');

  const addMeasurement = async (payload) => {
    try {
      const url = `${HOST}/api/measurement`;
      const _payload = {
        value: payload?.measurements,
        type: payload?.orderType,
        measurement_for: payload?.measurement_for,
        should_tag: payload?.should_tag
      }
      const response = await axios.post(url, _payload, {
        withCredentials: true,
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      if (response?.data) {
        return response.data.id;
      }
    } catch (error) {
      console.error(error);
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
        if (Platform.OS === 'android') {
          Alert.alert('Warning', msg);
        } else {
          AlertIOS.alert(msg);
        }
      }
    }
  }

  const createOrder = async (url, _payload1, isDraft) => {
    dispatch(setLoader(true))
    let measurementId = _payload1?.measurementId;
    console.log('_payload?.measurementId', _payload1);
    if (_payload1?.measurements && !measurementId) {
      measurementId = await addMeasurement(_payload1);
    }

    let _payload = _payload1;
    _payload['measurementId'] = measurementId;

    const response = await axios.post(url, _payload, {
      withCredentials: true,
      headers: {
        Authorization: await AsyncStorage.getItem('token'),
      },
    });
    console.log('response', response);
    const { data } = response;
    if (data) {
      console.log('order created', data.id);
      if (reference?.length > 0) {
        const formdata = new FormData();
        await Promise.all(
          orders.reference
            .filter(a => !a.id)
            .map(item => {
              console.log('reference', item);
              formdata.append('reference', {
                uri: item.uri,
                type: item.type,
                name: item.fileName,
              });
            }),
        );
        const url1 = `${HOST}/api/orderReferenceImage/${data.id}`;
        await axios.post(url1, formdata, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: await AsyncStorage.getItem('token'),
          },
        });
      }
      console.log('order saved in draft');
      dispatch(setLoader(false));

      if (!isDraft) {
        navigation.navigate('finalquote', { orderId: data.id });
      } else {
        dispatch(resetOrder());
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'cart',
            },
          ],
        });
        navigation.navigate('cart');
      }
    }
  };

  const updateOrderDetails = async (url, _payload1, isDraft) => {
    const response = await axios.put(url, _payload1, {
      withCredentials: true,
      headers: {
        Authorization: await AsyncStorage.getItem('token'),
      },
    });
    console.log('response', response);
    const { data } = response;
    if (data) {
      console.log('order created', data.id);
      if (reference.filter(a => !a.id)?.length > 0) {
        const formdata = new FormData();
        await Promise.all(
          orders.reference
            .filter(a => !a.id)
            .map(item => {
              console.log('reference', item);
              formdata.append('reference', {
                uri: item.uri,
                type: item.type,
                name: item.fileName,
              });
            }),
        );
        const url1 = `${HOST}/api/orderReferenceImage/${data.id}`;
        await axios.post(url1, formdata, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: await AsyncStorage.getItem('token'),
          },
        });
      }
      console.log('order saved in draft');
      dispatch(setLoader(false));
      console.log('isDraft', !isDraft);
      if (!isDraft) {
        navigation.navigate('finalquote', { orderId: data.id });
      } else {
        dispatch(resetOrder());
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'cart',
            },
          ],
        });
        navigation.navigate('cart');
      }
    }
  };

  const updateDeliveryAddress = async isDraft => {
    try {
      dispatch(setLoader(true));
      const payload = {
        deliveryAddress: address,
        orderStatus: 'draft',
        orderDeliveryStatus: 'pending',
        orderPaymentStatus: 'pending',
      };
      dispatch(updateOrder(payload));

      const _orders = { ...orders };
      const id = _orders.cloth.id;
      delete _orders.cloth;
      const _payload1 = {
        ..._orders,
        cloth: id,
        deliveryAddress: address,
        orderStatus: 'draft',
        orderDeliveryStatus: 'pending',
        orderPaymentStatus: 'pending',
      };
      delete _payload1.reference;

      if (orders?.id) {
        // edit mode
        const url = `${HOST}/api/updateOrder/${orders.id}`;
        updateOrderDetails(url, _payload1, isDraft);
      } else {
        // add mode
        const url = `${HOST}/api/order`;
        createOrder(url, _payload1, isDraft);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.error(error);
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
        if (Platform.OS === 'android') {
          Alert.alert('Warning', msg);
        } else {
          AlertIOS.alert(msg);
        }
      }
    }
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
              Summary
            </Text>
          </View>
        </View>

        {/* Customization */}
        <View>
          <View style={[styles.flex, { paddingHorizontal: 20 }]}>
            <Text style={[styles.title]}>customization</Text>
          </View>
          {reference.length > 0 ? (
            // Reference Cloth for customization
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                flex: 1,
                flexGrow: 1,
                paddingHorizontal: 20,
              }}>
              {reference.map((img, key) => (
                <View
                  key={key}
                  style={{
                    width: Dimensions.get('screen').width / 3 - 60,
                    height: 100,
                  }}>
                  <Image
                    src={img.uri || `${HOST}/media/${img.url}`}
                    alt={img.fileName || String(img.id)}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              ))}
            </View>
          ) : (
            // Customization by App
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
              {orderType === 'shirt' ? (
                <MyShirt
                  config={{
                    collor: orderedDesign.collor || '',
                    pocket: orderedDesign.pocket || '',
                    sleeve: orderedDesign.sleeve || '',
                    cuff: orderedDesign.cuff || '',
                    cuffStyle: orderedDesign.cuffStyle || '',
                    back: orderedDesign.back || '',
                    stamp: orderedDesign.stamp || '',
                  }}
                />
              ) : orderType === 'pant' ? (
                <MyPant config={config} />
              ) : (
                <></>
              )}
            </View>
          )}
        </View>

        {/* Measurements */}
        <View style={styles.detailContainer}>
          <View style={[styles.flex]}>
            <Text style={styles.title}>measurements</Text>
          </View>
          {measurements ? (
            orderType === 'shirt' ? (
              <Fragment>
                <View style={styles.measurements}>
                  <View style={styles.measurement}>
                    <AttributeView label="Body Type" value={config.bodyType} />
                  </View>
                  <View style={[styles.measurement, { marginRight: 0 }]}>
                    <AttributeView
                      label="Shirt Size"
                      value={config.shirtSize}
                    />
                  </View>
                  <View style={styles.measurement}>
                    <AttributeView
                      label="Shoulder Type"
                      value={config.shoulderType}
                    />
                  </View>
                  <View style={[styles.measurement, { marginRight: 0 }]}>
                    <AttributeView label="Height" value={config.height} />
                  </View>
                  <View style={styles.measurement}>
                    <AttributeView label="Preferred Fit" value={config.fit} />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Notes / Instructions</Text>
                  <Text style={[styles.value, { fontSize: 14 }]}>
                    {config.notes}
                  </Text>
                </View>
              </Fragment>
            ) : orderType === 'pant' ? (
              <Fragment>
                <Text style={styles.title}>give measurements</Text>
                <View style={styles.measurements}>
                  <View style={styles.measurement}>
                    <AttributeView label="Pant Type" value={config.pant} />
                  </View>
                  <View style={[styles.measurement, { marginRight: 0 }]}>
                    <AttributeView label="Rise Type" value={config.rise} />
                  </View>
                  <View style={styles.measurement}>
                    <AttributeView
                      label="Fastening Type"
                      value={config.fastening}
                    />
                  </View>
                  <View style={[styles.measurement, { marginRight: 0 }]}>
                    <AttributeView label="Waist" value={config.waist} />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Notes / Instructions</Text>
                  <Text style={styles.value}>{config.note}</Text>
                </View>
              </Fragment>
            ) : (
              <></>
            )
          ) : (
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                  color: '#000',
                  marginBottom: 5,
                }}>
                Measurements will collect from:
              </Text>
              <Text>{measurementAddress}</Text>
            </View>
          )}
        </View>

        {/* cloth realted content Visualization */}
        <View
          style={{
            backgroundColor: '#334856',
            padding: 20,
          }}>
          <View style={[styles.flex]}>
            <Text style={[styles.title, { color: '#fff' }]}>Cloth Details</Text>
          </View>
          <View style={[styles.titleCard, { padding: 0 }]}>
            {selectedCloth.name ? (
              // ---------- Cloth selected from app -------------- //
              <Fragment>
                <View style={styles.iconContainer}>
                  <Image source={Cloth} style={{ flex: 1, width: '100%' }} />
                </View>
                <View>
                  <Text style={styles.clothName}>{selectedCloth.name}</Text>
                  <View style={styles.hr} />
                  <Text style={styles.price}>
                    {selectedCloth.size} mtr ................. Rs.
                    {selectedCloth.price}
                  </Text>
                </View>
              </Fragment>
            ) : cloth_couriered ? (
              // -------------- Cloth will courier to office address -------------- //
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                    marginBottom: 5,
                  }}>
                  Cloth will be couriered to the below mentioned address (Our
                  Office Address)
                </Text>
                <Text style={{ color: '#fff' }}>3/235</Text>
                <Text style={{ color: '#fff' }}>test street,</Text>
                <Text style={{ color: '#fff' }}>area</Text>
                <Text style={{ color: '#fff' }}>district</Text>
                <Text style={{ color: '#fff' }}>state</Text>
                <Text style={{ color: '#fff' }}>PIN: 000 000</Text>
              </View>
            ) : (
              // -------------- Cloth will pickup from customer location -------------- //
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                    marginBottom: 5,
                  }}>
                  Cloth will pick up from:
                </Text>
                <Text style={{ color: '#fff' }}>{cloth_pickuplocation}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.addressSection, { paddingBottom: 0 }]}>
          <Text style={styles.subtitle}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            placeholder="H. No, Street, City, State, Pincode"
            multiline
            numberOfLines={7}
            value={address}
            onChangeText={_address => {
              setAddress(_address);
            }}
            underlineColorAndroid="transparent"
            textAlignVertical="top"
          />
        </View>

        <View
          style={[
            styles.addressSection,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingTop: 0,
            },
          ]}>
          <Button
            type="primaryoutline"
            label="save for later"
            width={(Dimensions.get('window').width - 50) / 2}
            disabled={!address}
            onPress={() => updateDeliveryAddress(true)}
          />
          <Button
            type="primary"
            label="continue to checkout"
            width={(Dimensions.get('window').width - 50) / 2}
            disabled={!address}
            onPress={() => updateDeliveryAddress()}
          />
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
  references: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#324755',
    fontSize: 18,
    marginBottom: 20,
  },
  measurements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  measurement: {
    width: Dimensions.get('window').width / 2 - 40,
    marginBottom: 20,
    marginRight: 20,
    textTransform: 'capitalize',
  },
  label: {
    color: '#7D8184',
    textTransform: 'capitalize',
  },
  value: {
    color: '#324755',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  titleCard: {
    backgroundColor: '#334856',
    padding: 20,
    flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 75,
    height: 75,
    overflow: 'hidden',
    marginRight: 20,
  },
  clothName: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  hr: {
    height: 1,
    width: 50,
    backgroundColor: '#fff',
  },
  price: {
    color: '#fff',
    fontSize: 18,
  },
  addressSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 20,
    borderRadius: 12,
  },
  subtitle: {
    color: '#334856',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
});

export default Summary;
