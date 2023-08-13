/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Shirt from '../../../reusables/customization/shirt';
import AttributeView from './attributeView';
import Button from '../../../reusables/button';

import Cloth from './../../../assets/images/cloth.jpg';
import {useSelector} from 'react-redux';
import MyPant from '../../../reusables/customization/mypant';
import {HOST} from '../../../../env';

function ViewOrder({navigation}) {
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
    totalPrice,
    alreadyPaid,
    orderStatus,
  } = orders;
  const config = {...measurements};
  const selectedCloth = {
    ...cloth,
    size: cloth_length,
    price: cloth_total_price,
  };

  const handleContinue = () => {
    console.log(
      'should analyse the response and redirect to the specific page',
    );
  };

  const handleCancelOrder = () => {
    console.log('cancel the order by id');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#87BCBF'}}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>
        <View style={{marginBottom: 20, backgroundColor: '#87BCBF'}}>
          <View style={[styles.horizontalAlign]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color="#fff"
              onPress={() => navigation.goBack()}
            />
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
              View Order
            </Text>
          </View>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {orderType === 'shirt' ? (
            <Shirt config={config} />
          ) : orderType === 'pant' ? (
            <MyPant config={config} />
          ) : (
            <></>
          )}
        </View>

        {/* Measurements */}
        <View style={styles.detailContainer}>
          {measurements ? (
            orderType === 'shirt' ? (
              <>
                <Text style={styles.title}>give measurements</Text>
                <View style={styles.measurements}>
                  <View style={styles.measurement}>
                    <AttributeView label="Body Type" value={config.bodyType} />
                  </View>
                  <View style={[styles.measurement, {marginRight: 0}]}>
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
                  <View style={[styles.measurement, {marginRight: 0}]}>
                    <AttributeView label="Height" value={config.height} />
                  </View>
                  <View style={styles.measurement}>
                    <AttributeView label="Preferred Fit" value={config.fit} />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Notes / Instructions</Text>
                  <Text style={styles.value}>{config.notes}</Text>
                </View>
              </>
            ) : orderType === 'pant' ? (
              <>
                <Text style={styles.title}>give measurements</Text>
                <View style={styles.measurements}>
                  <View style={styles.measurement}>
                    <AttributeView label="Pant Type" value={config.pant} />
                  </View>
                  <View style={[styles.measurement, {marginRight: 0}]}>
                    <AttributeView label="Rise Type" value={config.rise} />
                  </View>
                  <View style={styles.measurement}>
                    <AttributeView
                      label="Fastening Type"
                      value={config.fastening}
                    />
                  </View>
                  <View style={[styles.measurement, {marginRight: 0}]}>
                    <AttributeView label="Waist" value={config.waist} />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Notes / Instructions</Text>
                  <Text style={styles.value}>{config.note}</Text>
                </View>
              </>
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
                }}>
                Measurements will collect from:
              </Text>
              <Text>{measurementAddress}</Text>
            </View>
          )}
        </View>

        {/* Reference Image */}
        {reference.length > 0 && (
          <View style={[styles.references, {backgroundColor: '#f3f3f3'}]}>
            <Text style={styles.title}>Reference Images</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                flex: 1,
                flexGrow: 1,
              }}>
              {reference.map((img, key) => (
                <View
                  key={key}
                  style={{
                    width: Dimensions.get('screen').width / 3 - 60,
                    height: 100,
                  }}>
                  <Image
                    src={`${HOST}/media/${img.url}`}
                    alt={String(img.id)}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* cloth realted content Visualization */}
        <View style={styles.titleCard}>
          {selectedCloth.name ? (
            <>
              <View style={styles.iconContainer}>
                <Image source={Cloth} style={{flex: 1, width: '100%'}} />
              </View>
              <View>
                <Text style={styles.clothName}>{selectedCloth.name}</Text>
                <View style={styles.hr} />
                <Text style={styles.price}>
                  {selectedCloth.size} mtr ................. Rs.
                  {selectedCloth.price}
                </Text>
              </View>
            </>
          ) : cloth_couriered ? (
            <View>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 15,
                  marginBottom: 15,
                  color: '#fff',
                }}>
                Cloth will be couriered to the below mentioned address (Our
                Office Address)
              </Text>
              <Text style={{color: '#fff'}}>3/235</Text>
              <Text style={{color: '#fff'}}>test street,</Text>
              <Text style={{color: '#fff'}}>area</Text>
              <Text style={{color: '#fff'}}>district</Text>
              <Text style={{color: '#fff'}}>state</Text>
              <Text style={{color: '#fff'}}>PIN: 000 000</Text>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                  textDecorationLine: 'underline',
                }}>
                Cloth will pick up from:
              </Text>
              <Text style={{color: '#fff'}}>{cloth_pickuplocation}</Text>
            </View>
          )}
        </View>

        {/* order delivery details */}
        {orderStatus !== 'draft' && (
          <View style={[styles.references, {backgroundColor: '#f3f3f3'}]}>
            <Text style={styles.title}>Delivery Details</Text>
            <View style={{marginBottom: 20}}>
              <Text style={styles.subtitle}>Address</Text>
              <Text>{deliveryAddress}</Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.subtitle}>Date of Delivery</Text>
              <Text>{orderDeliveryDate || 'Yet to decided'}</Text>
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={styles.subtitle}>Status</Text>
              <Text>{orderDeliveryStatus}</Text>
            </View>
          </View>
        )}

        {/* Payment details */}
        {orderStatus !== 'draft' && (
          <View style={[styles.references]}>
            <Text style={styles.title}>Payment Details</Text>
            <View
              style={[
                styles.detailContainer,
                {marginTop: 0, borderRadius: 10},
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

        {orderStatus === 'draft' && (
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
              label="update order"
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
});

export default ViewOrder;
