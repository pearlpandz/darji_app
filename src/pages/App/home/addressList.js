import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, ToastAndroid, View, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { setLoader } from '../../../redux/slices/loader';
import { updateOrder } from '../../../redux/slices/order';
import Loader from '../../../reusables/loader';
import AttributeView from './attributeView';
import { HOST } from '../../../../env';
import Button from '../../../reusables/button';
import { useNavigation } from '@react-navigation/native';
import Address from './address';

function AddressList({ route }) {
    const isOrder = route?.params?.isOrder;
    const addressFor = route?.params?.addressFor;
    const selectedAddress = route?.params?.selectedAddress;

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const loader = useSelector(state => state.loader);
    const order = useSelector(state => state.orders);
    const [addresses, setAddresses] = useState([])
    const [selected, setSelected] = useState(selectedAddress)
    const [address, setAddress] = useState()
    const [actionSheet, setActionSheet] = useState(false);

    const getData = async () => {
        try {
            dispatch(setLoader(true));
            const url = `${HOST}/api/addresses`;
            const { data } = await axios.get(url, {
                withCredentials: true,
                headers: {
                    Authorization: await AsyncStorage.getItem('token'),
                },
            });
            if (data) {
                console.log('data.length', data.length)
                setAddresses(data);
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

    const addNewAddress = async (address) => {
        try {
            dispatch(setLoader(true));
            const url = `${HOST}/api/address`;
            const payload = {
                ...address
            }
            const { data } = await axios.post(url, payload, {
                withCredentials: true,
                headers: {
                    Authorization: await AsyncStorage.getItem('token'),
                },
            });
            if (data) {
                console.log('data.length', data.length)
                getData();
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
    }

    const AddressModal = useMemo(
        () => (
            <Modal
                isVisible={actionSheet}
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                }}>
                <View>
                    <Address
                        setActionSheet={setActionSheet}
                        setAddress={address => {
                            setAddress(address);
                            addNewAddress(address);
                        }}
                    />
                </View>
            </Modal>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actionSheet],
    );

    const handleOrderAddressUpdate = () => {
        console.log('selected', selected)
        const payload = {
            [addressFor]: selected
        }
        dispatch(updateOrder(payload));
        switch (addressFor) {
            case 'measurementAddress':
                navigation.navigate('Common', { screen: 'clothcategory' });
                break;

            case 'cloth_pickuplocation':
                if (order?.id) {
                    navigation.navigate('Common', {
                        screen: 'vieworder',
                    });
                } else {
                    navigation.navigate('summary');
                }
                break;

            case 'deliveryAddress':
                navigation.goBack()
                break;

            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <Loader msg="Fetching Measuremnts..." />
            <ScrollView >
                {
                    !loader && (
                        addresses.length > 0 ?
                            addresses.map((address) => {
                                const { type, house_number, id, street, area_name, city, state, pincode, landmark, contact_number } = address;
                                const isSelected = selected?.id === id;
                                return (
                                    <View key={id} style={[styles.detailContainer, styles.boxWithShadow, {
                                        backgroundColor: isSelected ? '#ffeb3b' : '#fff'
                                    }]}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 10,
                                        }}>
                                            <Text style={[
                                                styles.title,
                                            ]}>{type}</Text>
                                            {isOrder && <Checkbox
                                                value={selected?.id === id}
                                                onValueChange={(event) => {
                                                    if (event) {
                                                        setSelected(address)
                                                    } else {
                                                        setSelected(null)
                                                    }
                                                }}
                                                style={styles.checkbox}
                                                tintColors={{ true: '#827500' }}
                                            />}
                                        </View>
                                        <Text>{house_number},{street},{area_name},{city},{state}-{pincode}</Text>
                                        {landmark && <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>Landmark:</Text> {landmark}</Text>}
                                        <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>Contact:</Text> {contact_number}</Text>
                                    </View>
                                )

                            }) :
                            <View style={{
                                height: Dimensions.get('window').height - 80,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{ marginBottom: 10 }}>No saved addresses</Text>
                                <TouchableOpacity onPress={() => setActionSheet(true)}>
                                    <Text style={styles.link}><Ionicons name="add" size={16} /> Add New Address</Text>
                                </TouchableOpacity>
                            </View>)
                }

                {
                    addresses?.length > 0 &&
                    <View style={styles.buttonContainer}>
                        <Button
                            label="Add New Address"
                            type="primary"
                            width={isOrder ? "49%" : '100%'}
                            onPress={() => setActionSheet(true)}
                        />
                        {isOrder && <Button
                            label="Select & Proceed"
                            type="primary"
                            width="49%"
                            onPress={() => handleOrderAddressUpdate()}
                        />}
                    </View>
                }
                {AddressModal}
            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    boxWithShadow: {
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 15,
    },
    link: {
        color: '#305F72',
        textTransform: 'capitalize',
    },
})

export default AddressList;