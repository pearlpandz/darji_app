/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BG from './../../../assets/profile-bg.webp';
import AVATAR from './../../../assets/images/avatar.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../../services/context';

function Profile({ navigation }) {
  const { setAuthStatus } = useContext(AuthContext);
  const [userinfo, setUserInfo] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      const _userinfo = JSON.parse(await AsyncStorage.getItem('userinfo'));
      setUserInfo(_userinfo);
    };

    getUserInfo();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
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
        <View style={{ position: 'relative' }}>
          <View style={{ height: 150, overflow: 'hidden' }}>
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
                overflow: 'hidden',
              }}>
              <Image
                source={userinfo?.profilePic || AVATAR}
                style={{
                  resizeMode: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000',
                marginTop: 10,
              }}>
              {userinfo?.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Common', {
                  screen: 'editprofile',
                });
              }}
              style={{
                backgroundColor: '#045fc8',
                paddingHorizontal: 15,
                paddingVertical: 7,
                borderRadius: 5,
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 30,
              paddingHorizontal: 15,
            }}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => {
                navigation.navigate('Common', {
                  screen: 'viewprofile',
                });
              }}>
              <View style={{ flexDirection: 'row' }}>
                <IonIcon name="person-outline" size={18} color="#000" />
                <Text style={styles.menuitem}>Account Information</Text>
              </View>
              <IonIcon name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>

            {/* Future Scope  */}
            {/* <TouchableOpacity style={styles.menu}>
              <View style={{flexDirection: 'row'}}>
                <IonIcon name="settings-outline" size={18} color="#000" />
                <Text style={styles.menuitem}>Settings</Text>
              </View>
              <IonIcon name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.menu}
              onPress={() => {
                navigation.navigate('Common', {
                  screen: 'changepassword',
                });
              }}>
              <View style={{ flexDirection: 'row' }}>
                <IonIcon name="lock-closed-outline" size={18} color="#000" />
                <Text style={styles.menuitem}>Change Password</Text>
              </View>
              <IonIcon name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menu}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'cart',
                    },
                  ],
                });
                navigation.navigate('cart');
              }}>
              <View style={{ flexDirection: 'row' }}>
                <IonIcon name="cart-outline" size={18} color="#000" />
                <Text style={styles.menuitem}>My Orders</Text>
              </View>
              <IonIcon name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menu, { borderBottomWidth: 0 }]}
              onPress={async () => {
                setAuthStatus(false);
                await AsyncStorage.removeItem('userinfo');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('isAuthenticated');
              }}>
              <View style={{ flexDirection: 'row' }}>
                <IonIcon name="power-outline" size={18} color="#000" />
                <Text style={styles.menuitem}>Logout</Text>
              </View>
              <IonIcon name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#334856',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 10,
    borderRadius: 12,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  menuitem: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
    color: '#4c4c4c',
  },
});

export default Profile;
