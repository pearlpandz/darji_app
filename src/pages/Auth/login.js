/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  TextInput,
  Dimensions,
  LogBox,
  ToastAndroid,
  Platform,
  AlertIOS,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Button from '../../reusables/button';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {AuthContext} from '../../services/context';
import axios from 'axios';
import {HOST} from '../../../env';
import {useDispatch} from 'react-redux';
import {setLoader} from '../../redux/slices/loader';

const ANDROID_CLIENT_ID =
  '280676335640-s4fv6lmjr0tqlb81thts0lnmct5d9ig6.apps.googleusercontent.com';
const IOS_CLIENT_ID =
  '280676335640-bmdv3027s2i362t30arsd17s0k40o9b0.apps.googleusercontent.com';
GoogleSignin.configure({
  androidClientId: ANDROID_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
});

LogBox.ignoreLogs(['new NativeEventEmitter']);

function Login({navigation}) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const {setAuthStatus} = useContext(AuthContext);
  const [formdata, setFormdata] = useState({
    mobileNumber: {value: '', isValid: false},
    password: {value: '', isValid: false},
  });

  const handleChange = (field, value) => {
    const _formdata = {...formdata};
    _formdata[field].value = value;
    if (value) {
      _formdata[field].isValid = true;
    } else {
      _formdata[field].isValid = false;
    }
    setFormdata({..._formdata});
  };

  const socialLogin = async payload => {
    try {
      dispatch(setLoader(true));
      const url = `${HOST}/api/socialLogin`;
      console.log('--------------social login------------');
      const {data} = await axios.post(url, payload);
      if (data) {
        await AsyncStorage.setItem('isAuthenticated', String(true));
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userinfo', JSON.stringify(data.userinfo));
        ToastAndroid.show('Successfully Loggedin!', ToastAndroid.SHORT);
        dispatch(setLoader(false));
        setAuthStatus(true);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log('error.status', error);
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

  const registerByGoogle = user => {
    const {name, email} = user;
    const payload = {name, email, provider: 'google'};
    socialLogin(payload);
  };

  const registerByFacebook = result => {
    const {name, email} = result;
    const payload = {name, email, provider: 'facebook'};
    socialLogin(payload);
  };

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name, email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + JSON.stringify(error));
        } else {
          registerByFacebook(result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const simpleLogin = async () => {
    try {
      dispatch(setLoader(true));
      const url = `${HOST}/api/login`;
      const payload = {
        mobile_number: formdata.mobileNumber.value,
        password: formdata.password.value,
      };
      console.log(payload);
      const {data} = await axios.post(url, payload);
      if (data) {
        console.log('user info:', data);
        await AsyncStorage.setItem('isAuthenticated', String(true));
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userinfo', JSON.stringify(data.userinfo));
        ToastAndroid.show('Successfully LoggedIn!', ToastAndroid.SHORT);
        dispatch(setLoader(false));
        setAuthStatus(true);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error.status);
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

  const isFormValid = () => {
    return Object.keys(formdata).every(a => formdata[a].isValid);
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {user} = await GoogleSignin.signIn();
      registerByGoogle(user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.warn(
          statusCodes.SIGN_IN_CANCELLED,
          'user cancelled the login flow',
        );
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.info(
          statusCodes.IN_PROGRESS,
          'operation is in progress already',
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.info(
          statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
          'play services not available or outdated',
        );
      } else {
        console.error(
          'ERROR IS: ' + JSON.stringify(error),
          'some other error happened',
        );
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <View>
        <View style={styles.modalBody}>
          {/* Login Form */}
          <View style={{marginTop: 10}}>
            <View style={[styles.inputContainer, {marginBottom: 15}]}>
              <IonIcons
                style={styles.inputInsideIcon}
                name="call"
                size={18}
                color="#b9b9b9"
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="number-pad"
                value={formdata.mobileNumber.value.toString()}
                onChangeText={searchString => {
                  handleChange('mobileNumber', searchString);
                }}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.inputContainer}>
              <IonIcons
                style={styles.inputInsideIcon}
                name="key"
                size={18}
                color="#b9b9b9"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={formdata.password.value.toString()}
                onChangeText={searchString => {
                  handleChange('password', searchString);
                }}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <IonIcons
                  style={styles.inputInsideIcon}
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={18}
                  color={showPassword ? '#000' : '#b9b9b9'}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 15}}>
              <Button
                label="sign in"
                type="primary"
                onPress={async () => simpleLogin()}
                disabled={!isFormValid()}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('forgetpassword')}>
              <Text
                style={{
                  textTransform: 'capitalize',
                  textAlign: 'right',
                  marginVertical: 15,
                  color: '#e8875b',
                }}>
                forget your password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* separator */}
          <View
            style={{
              marginVertical: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Text>or sign in with</Text>
          </View>

          {/* social login */}
          <View style={{flexDirection: 'row'}}>
            <View style={styles.googleBtn}>
              <Pressable onPress={() => googleSignIn()}>
                <IonIcons
                  name="logo-google"
                  color="#1f212a"
                  size={20}
                  style={{marginRight: 10}}
                />
              </Pressable>
            </View>
            <View style={styles.fbBtn}>
              <Pressable
                onPress={() => {
                  LoginManager.logInWithPermissions([
                    'public_profile',
                    'email',
                  ]).then(
                    login => {
                      if (login.isCancelled) {
                        console.log('Login cancelled');
                      } else {
                        AccessToken.getCurrentAccessToken().then(data => {
                          const accessToken = data.accessToken.toString();
                          getInfoFromToken(accessToken);
                        });
                      }
                    },
                    error => {
                      console.log('Login fail with error: ' + error);
                    },
                  );
                  // navigation.navigate('otp')
                }}>
                <IonIcons
                  name="logo-facebook"
                  color="#fff"
                  size={20}
                  style={{marginRight: 10}}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 50,
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
  fbBtn: {
    backgroundColor: '#495993',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: 0,
    width: (Dimensions.get('screen').width - 30) / 2,
  },
  googleBtn: {
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderColor: '#b9b9b9',
    borderWidth: 1,
    marginRight: 15,
    width: (Dimensions.get('screen').width - 60) / 2,
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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    width: Dimensions.get('screen').width,
    // backgroundColor: '#f6f6f6'
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
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    marginVertical: 8,
  },
});

export default Login;
