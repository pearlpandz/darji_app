/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Platform,
  AlertIOS,
  Alert,
  TouchableOpacity,
} from 'react-native';

// third-party
import OTPInputView from '@twotalltotems/react-native-otp-input';
import IonIcons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import {AuthContext} from '../../../services/context';
import Button from '../../../reusables/button';

import {HOST} from '../../../../env';
import InputPassword from '../../../reusables/InputPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ForgetPassword({route, navigation}) {
  const [mobile, setMobileNumber] = useState(false);
  const [password, setPassword] = useState();
  const [enteredOtp, setEnteredOtp] = useState();
  const [confirm, setConfirm] = useState(null);
  const [showPasswordView, setPasswordView] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getCookie = name => {
    const value = `; ${document.cookie}`;
    console.log(value, 'test');
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  };

  const createPassword = async () => {
    setSubmitted(true);
    try {
      if (password.length > 4) {
        const url = `${HOST}/api/createpassword`;
        const _payload = {
          password: password,
        };
        const {data} = await axios.post(url, _payload, {
          withCredentials: true,
          headers: {
            Authorization: await AsyncStorage.getItem('token'),
          },
        });
        if (data) {
          setSubmitted(false);
          if (Platform.OS === 'android') {
            Alert.alert('Update Info', 'Successfully password changed!');
          } else {
            AlertIOS.alert('Successfully password changed!');
          }
          navigation.navigate('authindex');
        }
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
      setSubmitted(false);
    }
  };

  const getOtp = async () => {
    try {
      const url = `${HOST}/api/forgetpassword`;
      console.log(mobile);
      const _payload = {mobile_number: mobile};
      const {data} = await axios.post(url, _payload, {withCredentials: true});
      if (data) {
        console.log('data', data);
        setConfirm(true);
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
    }
  };

  const _verifyMobileNumber = async () => {
    try {
      console.log('-------------- otp verified -----------------');
      const url = `${HOST}/api/verifyMobileNumber`;
      const _payload = {mobile_number: mobile, otp: enteredOtp};
      const {data} = await axios.put(url, _payload, {
        withCredentials: true,
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      await AsyncStorage.setItem('token', data.token);
      if (data) {
        console.log('-------------- otp verified -----------------');
        setPasswordView(true);
      }
    } catch (error) {
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
      <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
        <Text style={styles.title}>forget password?</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginRight: 5, color: '#707070', marginBottom: 10}}>
            Do you remember your password?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('authindex')}>
            <Text style={{color: '#008efb', fontWeight: 'bold'}}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showPasswordView ? (
        <View style={{paddingHorizontal: 10}}>
          <View>
            <InputPassword
              placeholder="Current Password"
              value={password}
              onChangeText={pass => setPassword(pass)}
            />
          </View>
          {console.log('submitted', submitted, 'password', password)}
          {submitted &&
            (!password ? (
              <Text style={{color: 'red', paddingTop: 5}}>
                Please enter your password!
              </Text>
            ) : (
              password.length < 4 && (
                <Text style={{color: 'red', paddingTop: 5}}>
                  Password length must be atleast 4 characters
                </Text>
              )
            ))}
          <View style={{marginTop: 10}}>
            {/* <Button label="cancel" type="secondary" onPress={() => navigation.goBack()} /> */}
            <Button
              label="update password"
              type="primary"
              onPress={() => {
                createPassword();
              }}
            />
          </View>
        </View>
      ) : confirm ? (
        <View style={{paddingHorizontal: 10}}>
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
            <Text style={{fontWeight: 'bold'}}>{mobile},</Text>
          </Text>

          <View style={{alignItems: 'center', marginVertical: 25}}>
            <OTPInputView
              style={{width: '60%', height: 50}}
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
              onPress={() => {
                verifyMobileNumber();
              }}
            />
          </View>

          <View style={{alignItems: 'center'}}>
            <Button
              type="disabled"
              label="Resend code in 00:39"
              width={'auto'}
            />
            <View style={{marginVertical: 10}} />
            <Button
              type="primaryoutline"
              label="Resend Code"
              width={'auto'}
              onPress={() => {
                console.log('get the otp again....');
                getOtp();
              }}
            />
          </View>
        </View>
      ) : (
        <View style={{paddingHorizontal: 10}}>
          {/* Mobile Number */}
          <View style={[styles.inputContainer, {marginBottom: 15}]}>
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
          <View style={{alignItems: 'center'}}>
            <Button
              type="primary"
              label="verify"
              width={120}
              disabled={!mobile}
              onPress={() => {
                getOtp();
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
  modalHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    padding: 15,
  },
  modalBody: {
    padding: 15,
    paddingBottom: 0,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
});

export default ForgetPassword;
