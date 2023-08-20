/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  AlertIOS,
  ScrollView,
} from 'react-native';
import { HOST } from '../../../../env';
import Button from '../../../reusables/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Address({ setAddress, setActionSheet }) {
  const [address, setCompleteAddress] = useState({
    "type": { value: "", isValid: false },
    "house_number": { value: "", isValid: false },
    "street": { value: "", isValid: false },
    "area_name": { value: "", isValid: false },
    "city": { value: "", isValid: false },
    "state": { value: "", isValid: false },
    "pincode": { value: "", isValid: false },
    "landmark": { value: "", isValid: true },
    "contact_number": { value: "", isValid: false }
  });
  const [pincodes, setCodes] = useState([]);

  const getCodes = async () => {
    try {
      const url = `${HOST}/api/pincodes`;
      const { data } = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      if (data) {
        setCodes(data.map(a => a.pincode));
      }
    } catch (error) {
      console.error(error);
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

  const isValid = useMemo(
    () => pincodes.includes(address.pincode?.value),
    [address.pincode, pincodes],
  );

  const isFormValid = useMemo(() => {
    return Object.values(address)?.every(a => a.isValid)
  })

  useEffect(() => {
    getCodes();
  }, []);

  const handleForm = (name, value) => {
    switch (name) {
      case 'house_number':
        if (value?.length > 0) {
          setCompleteAddress({ ...address, house_number: { value, isValid: true } })
        } else {
          setCompleteAddress({ ...address, house_number: { value, isValid: false } })
        }
        break;

      case 'pincode':
        if (value?.length >= 6) {
          setCompleteAddress({ ...address, pincode: { value, isValid: true } })
        } else {
          setCompleteAddress({ ...address, pincode: { value, isValid: false } })
        }
        break;

      case 'landmark':
        setCompleteAddress({ ...address, landmark: { value, isValid: true } })
        break;

      case 'contact_number':
        if (value?.length >= 10) {
          setCompleteAddress({ ...address, contact_number: { value, isValid: true } })
        } else {
          setCompleteAddress({ ...address, contact_number: { value, isValid: false } })
        }
        break;

      default:
        if (value?.length > 3) {
          setCompleteAddress({ ...address, [name]: { value, isValid: true } })
        } else {
          setCompleteAddress({ ...address, [name]: { value, isValid: false } })
        }
        break;
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add your address</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Type of Address (Ex: Home/Office/Mom Home)"
          name="type"
          value={address?.type?.value}
          onChangeText={(value) => handleForm("type", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
        <TextInput
          style={styles.input}
          placeholder="House Number"
          name="house_number"
          value={address?.house_number?.value}
          onChangeText={(value) => handleForm("house_number", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
        <TextInput
          style={styles.input}
          placeholder="Street"
          name="street"
          value={address?.street?.value}
          onChangeText={(value) => handleForm("street", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
        <TextInput
          style={styles.input}
          placeholder="Area Name"
          name="area_name"
          value={address?.area_name?.value}
          onChangeText={(value) => handleForm("area_name", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          name="city"
          value={address?.city?.value}
          onChangeText={(value) => handleForm("city", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          name="state"
          value={address?.state?.value}
          onChangeText={(value) => handleForm("state", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
        <TextInput
          style={styles.input}
          placeholder="PIN Code"
          name="pincode"
          value={address?.pincode?.value}
          onChangeText={(value) => handleForm("pincode", value)}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Nearby landmark (Optional)"
          name="landmark"
          value={address?.landmark?.value}
          onChangeText={(value) => handleForm("landmark", value)}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          name="contact_number"
          value={address?.contact_number?.value}
          onChangeText={(value) => handleForm("contact_number", value)}
          underlineColorAndroid="transparent"
          keyboardType='phone-pad'
        />

        {address?.pincode?.value?.length === 6 && (
          <>
            {!isValid ? (
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="information-circle" size={20} color="red" />
                <Text style={{ color: 'red', marginBottom: 15, marginLeft: 5, width: '90%' }}>
                  We are providing limited services, please contact our office
                  to add your pincode +91-7502022870
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="checkmark-circle" size={20} color="green" />
                <Text style={{ color: 'green', marginBottom: 15, marginLeft: 5 }}>
                  Pin Code is valid
                </Text>
              </View>
            )}
          </>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            type="secondary"
            label="cancel"
            onPress={() => setActionSheet(false)}
            width="49%"
          />
          <Button
            type="primary"
            label="save address & next"
            width="49%"
            disabled={!isFormValid}
            onPress={() => {
              if (isValid) {
                const keys = Object.keys(address);

                let payload = {}
                keys.forEach(key => {
                  payload[key] = address[key].value
                })
                setAddress(payload);
                setActionSheet(false);
              }
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 46
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
});

export default Address;
