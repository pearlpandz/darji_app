import React, { Fragment, useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { setLoader } from '../../../redux/slices/loader';
import { updateOrder } from '../../../redux/slices/order';
import Loader from '../../../reusables/loader';
import AttributeView from './attributeView';
import { HOST } from '../../../../env';
import Button from '../../../reusables/button';
import { useNavigation } from '@react-navigation/native';

function MeasurementList() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const order = useSelector(state => state.orders);
    const loader = useSelector(state => state.loader);
    const [measurements, setMeasurements] = useState([])
    const [selectedMeasurement, setSelectedMeasurement] = useState()

    const getData = async () => {
        try {
            dispatch(setLoader(true));
            const url = `${HOST}/api/measurements`;
            const { data } = await axios.get(url, {
                withCredentials: true,
                headers: {
                    Authorization: await AsyncStorage.getItem('token'),
                },
            });
            if (data) {
                console.log('data.length', data.length)
                setMeasurements(data);
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

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePickMeasurement = () => {
        const { value, id } = selectedMeasurement;
        const payload = {
            measurements: value,
            measurementId: id,
            should_tag: false,
        }
        dispatch(updateOrder(payload))
        if (order?.id) {
            navigation.navigate('Common', { screen: 'vieworder' });
        } else {
            navigation.navigate('Common', { screen: 'successMeasurement' });
        }
        ToastAndroid.show('Measurements updated!', ToastAndroid.SHORT);
    }

    return (
        <View style={styles.container}>
            <Loader msg="Fetching Measuremnts..." />
            {
                !loader && (
                    measurements.length > 0 ?
                        measurements.map((measurement) => {
                            const { type, value: config, id, measurement_for } = measurement;
                            const isSelected = selectedMeasurement?.id === id;
                            if (type === 'shirt') {
                                return (
                                    <View key={id} style={[styles.detailContainer, styles.boxWithShadow, {
                                        backgroundColor: isSelected ? '#ffeb3b' : '#fff'
                                    }]}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 20,
                                        }}>
                                            <Text style={[
                                                styles.title,
                                            ]}>{measurement_for}</Text>
                                            <Checkbox
                                                value={selectedMeasurement?.id === id}
                                                onValueChange={(event) => {
                                                    if (event) {
                                                        setSelectedMeasurement(measurement)
                                                    } else {
                                                        setSelectedMeasurement(null)
                                                    }
                                                }}
                                                style={styles.checkbox}
                                                tintColors={{ true: '#827500' }}
                                            />
                                        </View>
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
                                    </View>
                                )
                            } else if (orderType === 'pant') {
                                return (
                                    <Fragment>
                                        <Text style={styles.title}>{measurement_for}</Text>
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
                                    </Fragment>
                                )
                            } else {
                                return '';
                            }
                        }) :
                        <View style={{
                            height: Dimensions.get('window').height - 80,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text>No saved measurements</Text>
                            <Text>Please proceed other options!</Text>
                        </View>)
            }

            {
                measurements?.length > 0 && <View style={styles.buttonContainer}>
                    <Button
                        label="select & continue"
                        type="primary"
                        onPress={() => handlePickMeasurement()}
                        disabled={!selectedMeasurement}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    detailContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 6
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
    buttonContainer: {

    },
    boxWithShadow: {
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 15,
    },
})

export default MeasurementList;