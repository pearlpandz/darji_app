/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Platform,
  AlertIOS,
  Alert,
  ToastAndroid,
} from 'react-native';

// third-party
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../../services/context';
import Button from '../../reusables/button';

import IonIcons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import { HOST } from '../../../env';
import Loader from '../../reusables/loader';
import { setLoader } from '../../redux/slices/loader';
import { useDispatch } from 'react-redux';

function OtpValidation({ route, navigation }) {
  const { payload, type = 'register' } = route.params;
  const mobileNumber = payload.mobile_number;

  const dispatch = useDispatch();

  const [mobile, setMobileNumber] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState();
  const { setAuthStatus } = useContext(AuthContext);
  const [confirm, setConfirm] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => {
      setCounter(counter - 1)
    }, 1000)

    return () => {
      clearInterval(timer);
    }
  }, [counter])

  const isExisting = async () => {
    try {
      const url = `${HOST}/api/isExisting`;
      const _payload = {
        email: payload.email,
        mobile_number: mobile,
      };
      const data = await axios.post(url, _payload);
      if (!data.isExisting) {
        registerUser();
      }
    } catch (error) {
      const msg = error?.response?.data
        ? Object.values(error.response.data.error)
          .map(a => a.toString())
          .join(', ')
        : 'Something went wrong!';
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
    }
  };

  const registerUser = async () => {
    try {
      const url = `${HOST}/api/register`;
      const _payload = payload;
      _payload.mobile_number = mobile;
      await axios.post(url, payload);
      setConfirm(true);
      setCounter(20);
    } catch (error) {
      const msg = error?.response?.data
        ? Object.values(error.response.data.error)
          .map(a => a.toString())
          .join(', ')
        : 'Something went wrong!';
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
    }
  };

  const getOtp = async () => {
    try {
      dispatch(setLoader(true));
      const url = `${HOST}/api/forgetpassword`;
      const _payload = { mobile_number: mobile };
      await axios.post(url, _payload);
      dispatch(setLoader(false));
      setCounter(20);
      setConfirm(true);
    } catch (error) {
      console.log(JSON.stringify(error.response.data));
      dispatch(setLoader(false));
      const msg =
        Object.values(error.response.data.error)
          .map(a => a.toString())
          .join(', ') || 'Something went wrong!';
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
    }
  };

  const _verifyMobileNumber = async () => {
    try {
      dispatch(setLoader(true));
      console.log('-------------- otp verified -----------------');
      const url = `${HOST}/api/verifyMobileNumber`;
      const _payload = { mobile_number: mobile, otp: enteredOtp };
      const { data } = await axios.put(url, _payload);
      await AsyncStorage.setItem('token', data.token);
      if (data) {
        dispatch(setLoader(false));
        console.log('-------------- otp verified -----------------');
        if (type === 'register') {
          await AsyncStorage.setItem('isAuthenticated', String(true));
          await AsyncStorage.setItem('userinfo', JSON.stringify(data.userinfo));
          setAuthStatus(true);
          ToastAndroid.show('Mobile Number verified!', ToastAndroid.SHORT);
        } else {
          navigation.navigate('setpassword');
        }
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error);
      console.log(JSON.stringify(error));
      const msg = error?.response?.data
        ? Object.values(error.response.data.error)
          .map(a => a.toString())
          .join(', ')
        : 'Something went wrong!';
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
    }
  };

  const verifyMobileNumber = async () => {
    try {
      console.log(enteredOtp);
      await _verifyMobileNumber();
    } catch (error) {
      console.log('Invalid code.');
    }
  };

  return (
    <View style={styles.container}>
      <Loader />
      {confirm ? (
        <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
          <Text
            style={{
              textTransform: 'uppercase',
              fontSize: 16,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              marginBottom: 20,
            }}>
            enter 6-digit code
          </Text>
          <Text
            style={{
              color: '#585758',
            }}>
            We have sent a code to{' '}
            <Text style={{ fontWeight: 'bold' }}>{mobileNumber || mobile},</Text>
          </Text>

          <View style={{ alignItems: 'center', marginVertical: 25 }}>
            <OTPInputView
              style={{ width: '60%', height: 50 }}
              pinCount={6}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              placeholderTextColor="red"
              onCodeFilled={code => {
                setEnteredOtp(code);
                console.log(`Code is ${code}, you are good to go!`);
              }}
            />
          </View>

          <View style={[styles.btnContainer]}>
            {/* <Button label='cancel' type='secondary' onPress={() => navigation.goBack()} width={150} /> */}
            <Button
              label="verify"
              type="primary"
              onPress={async () => {
                verifyMobileNumber();
              }}
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <Button
              type="disabled"
              label={`Resend code in 00:${counter.toString().padStart(2, '0')}`}
              width={200}
            />
            <View style={{ marginVertical: 10 }} />
            <Button
              type={counter > 0 ? "disabled" : "primaryoutline"}
              disabled={counter > 0}
              label="Resend Code"
              width={120}
              onPress={() => {
                console.log('get the otp again....');
                getOtp();
              }}
            />
          </View>
        </View>
      ) : (
        <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
          {/* Mobile Number */}
          <View style={[styles.inputContainer, { marginBottom: 15 }]}>
            <IonIcons
              style={styles.inputInsideIcon}
              name="call-outline"
              size={18}
              color="#b9b9b9"
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={searchString => {
                setMobileNumber(searchString);
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button
              type="primary"
              label="get otp"
              width={120}
              disabled={!mobile}
              onPress={() => {
                isExisting();
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    backgroundColor: '#f1f3f4',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 15,
    width: Dimensions.get('screen').width - 20,
    // backgroundColor: '#f3f3f3',
  },
  borderStyleHighLighted: {
    borderColor: '#2b3a7c',
    borderBottomWidth: 2,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#000',
    fontWeight: 'bold',
  },
  underlineStyleHighLighted: {
    borderColor: '#2b3a7c',
    borderBottomWidth: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b9b9b9',
    borderRadius: 6,
  },
  inputInsideIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 0,
    color: '#424242',
  },
});

export default OtpValidation;
