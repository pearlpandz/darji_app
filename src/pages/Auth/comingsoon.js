/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, View, StyleSheet, Text, Image} from 'react-native';
import COMMING_SOON from './../../assets/commingsoon.png';
import TAILOR from './../../assets/tailor.png';
import Button from '../../reusables/button';

const CommingSoon = ({navigation, route}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#86bcbe'}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 30,
        }}>
        <View style={{width: '100%', marginBottom: 75}}>
          <Image
            source={COMMING_SOON}
            alt="Comming Soon"
            resizeMode="contain"
            style={{
              width: '100%',
              height: 200,
            }}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{width: 50}}>
            <Image
              style={{
                width: '100%',
              }}
              resizeMode="contain"
              source={TAILOR}
              alt="Comming Soon"
            />
          </View>

          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: '#fff',
              lineHeight: 25,
            }}>
            “We’re stitching together something amazing, coming your way soon!”
          </Text>
          <View style={{width: 120, marginTop: 32}}>
            <Button
              label="Back"
              type="secondary"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    height: 270,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  logo: {
    height: 100,
    width: 90,
    position: 'absolute',
    zIndex: 2,
  },
});

export default CommingSoon;
