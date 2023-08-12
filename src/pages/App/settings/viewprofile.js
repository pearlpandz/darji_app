/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
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
  TouchableHighlight,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../../reusables/button';
import BG from './../../../assets/profile-bg.webp';
import AVATAR from './../../../assets/images/avatar.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AuthContext} from '../../../services/context';

function ViewProfile({navigation}) {
  const {setAuthStatus} = useContext(AuthContext);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
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

            <TouchableHighlight
              onPress={() => {
                navigation.navigate('editprofile');
              }}
              style={{
                backgroundColor: '#045fc8',
                paddingHorizontal: 15,
                paddingVertical: 7,
                borderRadius: 5,
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                  }}>
                  Edit Profile
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View
            style={{
              marginTop: 10,
              padding: 20,
            }}>
            <View style={styles.info}>
              <Text style={styles.title}>Name</Text>
              <Text>Muthupandi Velmurugan</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>Email</Text>
              <Text>pearlpandzz@gmail.com</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>Mobile Number</Text>
              <Text>8610100498</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>Gender</Text>
              <Text>Male</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  info: {
    marginBottom: 30,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000',
  },
});

export default ViewProfile;
