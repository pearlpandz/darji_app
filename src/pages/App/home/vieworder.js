/* eslint-disable react-native/no-inline-styles */
import React, { Fragment } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Platform,
  Alert,
  AlertIOS,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Shirt from '../../../reusables/customization/shirt';
import AttributeView from './attributeView';
import Button from '../../../reusables/button';
import { launchImageLibrary } from 'react-native-image-picker';
import Cloth from './../../../assets/images/cloth.jpg';
import { useDispatch, useSelector } from 'react-redux';
import MyPant from '../../../reusables/customization/mypant';
import { HOST } from '../../../../env';
import MyShirt from '../../../reusables/customization/myshirt';
import { updateOrder } from '../../../redux/slices/order';

function ViewOrder({ navigation }) {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders);
  const {
    orderType,
    measurements,
    cloth_length,
    cloth_total_price,
    cloth,
    measurementAddress,
    cloth_pickuplocation,
    cloth_couriered,
    reference,
    deliveryAddress,
    orderDeliveryDate,
    orderDeliveryStatus,
    orderPaymentStatus,
    totalPrice,
    alreadyPaid,
    orderStatus,
    orderedDesign,
  } = orders;
  const config = { ...measurements };
  const selectedCloth = {
    ...cloth,
    size: cloth_length,
    price: cloth_total_price,
  };

  const handleContinue = () => {
    navigation.navigate('Common', { screen: 'summary' });
  };

  const handleCancelOrder = () => {
    console.log('cancel the order by id');
  };

  const handleCustomization = () => {
    switch (orderType) {
      case 'shirt':
        navigation.navigate('Common', { screen: 'shirtCustomization' });
        break;

      case 'pant':
        navigation.navigate('Common', { screen: 'pantCustomization' });
        break;

      default:
        break;
    }
  };

  const handleMeasurements = () => {
    switch (orderType) {
      case 'shirt':
        navigation.navigate('Common', { screen: 'measurement' });
        break;

      case 'pant':
        navigation.navigate('Common', { screen: 'pantCustomization' });
        break;

      default:
        break;
    }
  };

  const handleCloths = () => {
    navigation.navigate('Common', { screen: 'clothcategory' });
  };

  const handleFileUpload = () => {
    // launchCamera({
    //     saveToPhotos: true,
    //     mediaType: 'photo',
    //     includeBase64: false,
    // }, setResponse)
    console.log('calling file picker...');
    launchImageLibrary(
      {
        // selectionLimit: 0,
        // mediaType: 'photo',
        // includeBase64: false,
        noData: true,
      },
      ({ assets }) => {
        if (assets) {
          const updateList = [...reference, ...assets];
          handleImgUpload(updateList);
        }
      },
    );
  };

  const handleImgUpload = async _imageList => {
    try {
      const formdata = new FormData();
      await Promise.all(
        _imageList.map(item => {
          console.log('reference', item);
          formdata.append('reference', {
            uri: item.uri,
            type: item.type,
            name: item.fileName,
          });
        }),
      );
      const payload = { reference: _imageList };
      dispatch(updateOrder(payload));
    } catch (error) {
      console.log(error);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#87BCBF' }}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 10, backgroundColor: '#fff' }}>
          <View style={[styles.horizontalAlign]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color="#000"
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontWeight: '500',
                marginLeft: 10,
              }}>
              View Order
            </Text>
          </View>
        </View>

        {/* Customization */}
        <View>
          <View style={[styles.flex, { paddingHorizontal: 20 }]}>
            <Text style={[styles.title]}>customization</Text>
            {!reference && (
              <Pressable onPress={() => handleCustomization()}>
                <Text>
                  <Ionicons name="pencil-outline" size={14} /> Edit
                </Text>
              </Pressable>
            )}
          </View>
          {reference.length > 0 ? (
            // Reference Cloth for customization
            <Fragment>
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
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Pressable
                  // onPress={handleImgUpload}
                  onPress={handleFileUpload}
                  style={{
                    borderColor: '#87BCBF',
                    borderWidth: 1,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      padding: 12,
                      fontSize: 14,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    }}>
                    {reference.length > 0
                      ? 'Add More Image(s)'
                      : 'Select Image(s)'}
                  </Text>
                </Pressable>
              </View>
            </Fragment>
          ) : (
            // Customization by App
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
            <Pressable onPress={() => handleMeasurements()}>
              <Text>
                <Ionicons name="pencil-outline" size={14} /> Edit
              </Text>
            </Pressable>
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
              <Text>{measurementAddress.house_number},{measurementAddress.street},{measurementAddress.area_name},{measurementAddress.city},{measurementAddress.state} - {measurementAddress.pincode}</Text>
              {measurementAddress.landmark && <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold', color: '#000' }}>Landmark:</Text> {measurementAddress.landmark}</Text>}
              <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold', color: '#000' }}>Contact:</Text> {measurementAddress.contact_number}</Text>
            </View>
          )}
        </View>

        {/* cloth realted content Visualization */}
        <View
          style={{
            backgroundColor: '#334856',
            padding: 20,
          }}>
          <View style={[styles.flex, { marginBottom: 20 }]}>
            <Text style={[styles.title, { color: '#fff' }]}>Cloth Details</Text>
            <Pressable onPress={() => handleCloths()}>
              <Text style={{ color: '#fff' }}>
                <Ionicons name="pencil-outline" size={14} color="#fff" /> Edit
              </Text>
            </Pressable>
          </View>
          <View style={styles.titleCard}>
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
                <Text style={{ color: '#fff' }}>{cloth_pickuplocation.house_number},{cloth_pickuplocation.street},{cloth_pickuplocation.area_name},{cloth_pickuplocation.city},{cloth_pickuplocation.state} - {cloth_pickuplocation.pincode}</Text>
                {cloth_pickuplocation.landmark && <Text style={{ color: '#fff', marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>Landmark:</Text> {cloth_pickuplocation.landmark}</Text>}
                <Text style={{ color: '#fff', marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>Contact:</Text> {cloth_pickuplocation.contact_number}</Text>
              </View>
            )}
          </View>
        </View>

        {/* order delivery details */}
        {orderStatus !== 'draft' && (
          <View style={[styles.references, { backgroundColor: '#fff' }]}>
            <Text style={styles.title}>Delivery Details</Text>
            <View style={{ marginVertical: 20 }}>
              <Text style={[styles.subtitle, { marginBottom: 0 }]}>Address</Text>
              <Fragment>
                <Text>{deliveryAddress.house_number},{deliveryAddress.street},{deliveryAddress.area_name},{deliveryAddress.city},{deliveryAddress.state} - {deliveryAddress.pincode}</Text>
                {deliveryAddress.landmark && <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: '500', color: '#334856' }}>Landmark:</Text> {deliveryAddress.landmark}</Text>}
                <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: '500', color: '#334856' }}>Contact:</Text> {deliveryAddress.contact_number}</Text>
              </Fragment>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={[styles.subtitle, { marginBottom: 0 }]}>Date of Delivery</Text>
              <Text>{orderDeliveryDate || 'Yet to decided'}</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={[styles.subtitle, { marginBottom: 0 }]}>Status</Text>
              <Text>{orderDeliveryStatus}</Text>
            </View>
          </View>
        )}

        {/* Payment details */}
        {orderStatus !== 'draft' && (
          <View style={[styles.references]}>
            <Text style={[styles.title, { marginBottom: 20 }]}>
              Payment Details
            </Text>
            <View
              style={[
                styles.detailContainer,
                { marginTop: 0, borderRadius: 10 },
              ]}>
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
                <Text style={[styles.value, styles.active]}>{totalPrice}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Already Paid</Text>
                <Text style={[styles.value, styles.active]}>{alreadyPaid}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Remaining</Text>
                <Text style={[styles.value, styles.active]}>
                  {totalPrice - alreadyPaid}
                </Text>
              </View>
            </View>
          </View>
        )}

        {(orderDeliveryStatus !== 'complete' ||
          orderPaymentStatus !== 'complete') && (
            <View
              style={[
                styles.addressSection,
                {
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingTop: 10,
                },
              ]}>
              <Button
                type="primaryoutline"
                label="cancel order"
                width={(Dimensions.get('window').width - 50) / 2}
                onPress={() => handleCancelOrder()}
              />
              <Button
                type="primary"
                label="continue"
                width={(Dimensions.get('window').width - 50) / 2}
                onPress={() => handleContinue()}
              />
            </View>
          )}
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
  titleCard: {
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
    textTransform: 'capitalize',
  },
  active: {
    color: '#E8875C',
  },
  hr: {
    height: 1,
    width: '100%',
    backgroundColor: '#d0d0d0',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default ViewOrder;
