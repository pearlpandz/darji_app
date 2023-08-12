import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  AlertIOS,
  Text,
} from 'react-native';
import Button from '../../../reusables/button';
import InputPassword from '../../../reusables/InputPassword';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {HOST} from '../../../../env';
import {setLoader} from '../../../redux/slices/loader';

function ChangePassword({navigation}) {
  const dispatch = useDispatch();
  const [currentpassword, setCurrentPassword] = useState();
  const [newpassword, setNewPassword] = useState();
  const [confirmNewpassword, setConfirmNewPassword] = useState();
  const [submitted, setSubmitted] = useState();

  const isFormValid = () => {
    return currentpassword && newpassword && confirmNewpassword;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    dispatch(setLoader(true));
    try {
      if (isFormValid()) {
        const url = `${HOST}/api/changepassword`;
        const _payload = {
          oldPassword: currentpassword,
          newPassword: confirmNewpassword,
        };
        console.log(_payload);
        const {data} = await axios.put(url, _payload, {
          headers: {
            Authorization: await AsyncStorage.getItem('token'),
          },
        });
        if (data) {
          if (Platform.OS === 'android') {
            Alert.alert('Update Info', 'Successfully password changed!');
          } else {
            AlertIOS.alert('Successfully password changed!');
          }
        }
        dispatch(setLoader(false));
        setSubmitted(false);
        navigation.goBack();
      }
    } catch (error) {
      console.log(error?.response?.data);
      const msg = error.response.data.error || 'Something went wrong';
      if (Platform.OS === 'android') {
        Alert.alert('Warning', msg);
      } else {
        AlertIOS.alert(msg);
      }
      dispatch(setLoader(false));
      setSubmitted(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header title='change password' isIconRequired={true} icon="arrow-back" onPress={() => navigation.goBack()} /> */}

      <View style={[styles.changePassword]}>
        <View style={styles.passwordContainer}>
          <Text style={styles.title}>Current Password</Text>
          <InputPassword
            placeholder="Current Password"
            value={currentpassword}
            onChangeText={password => setCurrentPassword(password)}
          />
          {submitted && !currentpassword && (
            <Text style={styles.error}>Please enter current password!</Text>
          )}
        </View>

        <View style={styles.passwordContainer}>
          <Text style={styles.title}>New Password</Text>
          <InputPassword
            placeholder="New Password"
            value={newpassword}
            onChangeText={password => setNewPassword(password)}
          />
          {submitted &&
            (!newpassword ? (
              <Text style={styles.error}>Please enter new password!</Text>
            ) : newpassword.length < 4 ? (
              <Text style={styles.error}>
                Password length must be atleast 4 characters!
              </Text>
            ) : (
              ''
            ))}
        </View>

        <View style={styles.passwordContainer}>
          <Text style={styles.title}>Confirm New Password</Text>
          <InputPassword
            placeholder="Confirm New Password"
            value={confirmNewpassword}
            onChangeText={password => setConfirmNewPassword(password)}
          />
          {submitted &&
            (!confirmNewpassword ? (
              <Text style={styles.error}>Please enter confirm password!</Text>
            ) : confirmNewpassword.length < 4 ? (
              <Text style={styles.error}>
                Password length must be atleast 4 characters!
              </Text>
            ) : newpassword !== confirmNewpassword ? (
              <Text style={styles.error}>
                New Password is not match with Confirm Password!
              </Text>
            ) : (
              ''
            ))}
        </View>
      </View>
      <View style={styles.btnContainer}>
        {/* <Button label="cancel" type="secondary" onPress={() => navigation.goBack()} /> */}
        <Button label="verify" type="primary" onPress={() => handleSubmit()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', position: 'relative'},
  changePassword: {padding: 10, marginVertical: 20},
  passwordContainer: {marginBottom: 20},
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default ChangePassword;
