import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import AVATAR from './../assets/images/avatar.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrentUserContext} from '../services/context';

/* eslint-disable react-native/no-inline-styles */
export default function DrawerContentComp() {
  const {session: userinfo} = useContext(CurrentUserContext);

  return (
    <View
      style={{
        backgroundColor: '#87BCBF',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image
        source={AVATAR}
        style={{width: 60, height: 60, resizeMode: 'contain'}}
      />
      <View style={{marginLeft: 10}}>
        <Text style={{color: '#fff', fontWeight: '600', fontSize: 16}}>
          {userinfo?.name || 'Anonymous'}
        </Text>
        <Text style={{color: '#fff', fontWeight: '300'}}>
          {userinfo?.mobile_number}
        </Text>
      </View>
    </View>
  );
}
