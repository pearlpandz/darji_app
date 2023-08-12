/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Pressable,
  Image,
  Platform,
  Alert,
  AlertIOS,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Button from '../../../reusables/button';
import BG from './../../../assets/profile-bg.webp';
import AVATAR from './../../../assets/images/avatar.png';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import GenderActionSheet from '../../../reusables/gendersheet';
import {HOST} from '../../../../env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../reusables/loader';
import {useDispatch} from 'react-redux';
import {setLoader} from '../../../redux/slices/loader';
import {CurrentUserContext} from '../../../services/context';

const ACTIONITEMS = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

function EditProfile({navigation}) {
  const dispatch = useDispatch();
  const {setSession} = useContext(CurrentUserContext);
  const [submitted, setSubmitted] = useState(false);
  const [actionSheet, setActionSheet] = useState(false);
  const [formdata, setFormdata] = useState({
    name: {value: '', isValid: false},
    email: {value: '', isValid: false},
    mobile: {value: '', isValid: false},
    gender: {value: '', isValid: false},
  });

  const handleChange = (field, value) => {
    const _formdata = {...formdata};
    _formdata[field].value = value;

    if (field === 'password') {
      if (value.length > 4) {
        _formdata[field].isValid = true;
      } else {
        _formdata[field].isValid = false;
      }
    } else {
      if (value) {
        _formdata[field].isValid = true;
      } else {
        _formdata[field].isValid = false;
      }
    }
    setFormdata({..._formdata});
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setGender = (name, value) => {
    handleChange(name, value);
  };

  const ActionSheetModal = useMemo(
    () => (
      <Modal
        isVisible={actionSheet}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <GenderActionSheet
          actionItems={ACTIONITEMS}
          onCancel={() => setActionSheet(false)}
          onSelect={value => {
            setGender('gender', value);
            setActionSheet(false);
          }}
        />
      </Modal>
    ),
    [actionSheet, setGender],
  );

  const isFormValid = () => {
    return Object.keys(formdata).every(a => formdata[a].isValid);
  };

  const reset = () => {
    setFormdata({
      name: {value: '', isValid: false},
      email: {value: '', isValid: false},
      mobile: {value: '', isValid: false},
      gender: {value: '', isValid: false},
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    dispatch(setLoader(true));
    try {
      if (isFormValid()) {
        const url = `${HOST}/api/updateinfo`;
        const _payload = {
          name: formdata.name.value,
          email: formdata.email.value,
          mobile_number: formdata.mobile.value,
          gender: formdata.gender.value,
        };
        const {data} = await axios.patch(url, _payload, {
          headers: {
            Authorization: await AsyncStorage.getItem('token'),
          },
        });
        if (data) {
          setSession(data);
          setSubmitted(false);
          if (Platform.OS === 'android') {
            Alert.alert('Update Info', 'Successfully updated!');
          } else {
            AlertIOS.alert('Successfully updated!');
          }
        }
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
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
      dispatch(setLoader(false));
    }
  };

  const getUserData = async () => {
    dispatch(setLoader(true));
    try {
      const url = `${HOST}/api/profile`;
      const {data} = await axios.get(url, {
        headers: {
          Authorization: await AsyncStorage.getItem('token'),
        },
      });
      if (data) {
        setFormdata({
          name: {value: data.name, isValid: data.name ? true : false},
          email: {value: data.email, isValid: data.email ? true : false},
          mobile: {
            value: data.mobile_number,
            isValid: data.mobile_number ? true : false,
          },
          gender: {value: data.gender, isValid: data.gender ? true : false},
        });
        setTimeout(() => {
          dispatch(setLoader(false));
        }, 1000);
      }
    } catch (error) {
      console.log(error);
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
      setTimeout(() => {
        dispatch(setLoader(false));
      }, 1000);
    }
  };

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
      <Loader msg="loading..." />
      <ScrollView>
        <Pressable
          style={{
            padding: 20,
            position: 'absolute',
            top: 0,
            zIndex: 10,
            left: 0,
          }}
          onPress={() => navigation.goBack()}>
          <IonIcon name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <View style={{position: 'relative'}}>
          <View style={{height: 150, overflow: 'hidden'}}>
            <Image
              source={BG}
              alt="profile background"
              style={{
                objectFit: 'cover',
              }}
            />
          </View>
          <View
            style={{
              marginTop: -50,
              alignItems: 'center',
            }}>
            <View
              style={{
                borderWidth: 3,
                borderColor: '#fff',
                backgroundColor: 'red',
                borderRadius: 50,
                width: 100,
                height: 100,
              }}>
              <Image
                source={AVATAR}
                style={{
                  resizeMode: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              padding: 20,
            }}>
            {/* Full Name */}
            <View style={styles.info}>
              <Text style={styles.title}>Name</Text>
              <View style={[styles.inputContainer, {marginBottom: 5}]}>
                <IonIcons
                  style={styles.inputInsideIcon}
                  name="person-outline"
                  size={18}
                  color="#b9b9b9"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formdata.name.value.toString() || ''}
                  onChangeText={searchString => {
                    handleChange('name', searchString);
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              {submitted && !formdata.name.value && (
                <Text style={{color: 'red', marginBottom: 15}}>
                  Please enter your name!
                </Text>
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.title}>Email</Text>
              <View style={[styles.inputContainer, {marginBottom: 5}]}>
                <IonIcons
                  style={styles.inputInsideIcon}
                  name="mail-outline"
                  size={18}
                  color="#b9b9b9"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  value={formdata.email.value.toString() || ''}
                  onChangeText={searchString => {
                    handleChange('email', searchString);
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              {submitted && !formdata.email.value && (
                <Text style={{color: 'red', marginBottom: 15}}>
                  Please enter your email!
                </Text>
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.title}>Mobile Number</Text>
              <View style={[styles.inputContainer, {marginBottom: 5}]}>
                <IonIcons
                  style={styles.inputInsideIcon}
                  name="call-outline"
                  size={18}
                  color="#b9b9b9"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={formdata.mobile.value.toString() || ''}
                  onChangeText={searchString => {
                    handleChange('mobile', searchString);
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              {submitted && !formdata.mobile.value && (
                <Text style={{color: 'red', marginBottom: 15}}>
                  Please enter your mobile number!
                </Text>
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.title}>Gender</Text>
              <Pressable
                onPress={() => setActionSheet(true)}
                style={[
                  styles.select,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <IonIcons name="person-outline" size={18} color="#b9b9b9" />
                  <Text style={{color: '#424242', marginLeft: 10}}>
                    {formdata.gender.value
                      ? ACTIONITEMS.find(a => a.value === formdata.gender.value)
                          ?.label
                      : 'Please select your gender'}
                  </Text>
                </View>
                <IonIcons name="chevron-down" size={14} color="#000" />
              </Pressable>
            </View>

            <View style={{marginTop: 15}}>
              <Button
                label="update info"
                type="primary"
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {ActionSheetModal}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  info: {
    marginBottom: 15,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
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
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0,
    color: '#424242',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    padding: 15,
    width: Dimensions.get('screen').width,
    backgroundColor: '#f6f6f6',
  },
  submitBtn: {
    textTransform: 'capitalize',
    backgroundColor: '#0c5190',
    width: 150,
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  select: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#b9b9b9',
  },
});

export default EditProfile;
