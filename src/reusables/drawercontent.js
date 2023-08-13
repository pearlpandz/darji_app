import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import AVATAR from './../assets/images/avatar.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* eslint-disable react-native/no-inline-styles */
export default function DrawerContentComp() {
  const [userinfo, setUserInfo] = useState({});

  useEffect(() => {
    const getUserinfo = async () => {
      const _userinfo = JSON.parse(await AsyncStorage.getItem('userinfo'));
      setUserInfo(_userinfo);
    };
    getUserinfo();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#87BCBF',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          borderRadius: 50,
          width: 60,
          height: 60,
          overflow: 'hidden',
        }}>
        <Image
          source={userinfo.profilePic || AVATAR}
          style={{resizeMode: 'contain', width: '100%', height: '100%'}}
        />
      </View>
      <View style={{marginLeft: 10, width: 170}}>
        <Text
          style={{color: '#fff', fontWeight: '600', fontSize: 16}}
          numberOfLines={1}>
          {userinfo?.name || 'Anonymous'}
        </Text>
        <Text style={{color: '#fff', fontWeight: '300'}}>
          {userinfo?.mobile_number}
        </Text>
      </View>
    </View>
  );
}
