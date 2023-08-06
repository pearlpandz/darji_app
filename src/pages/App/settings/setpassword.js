/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Button from '../../../reusables/button';
import InputPassword from '../../../reusables/InputPassword';

function SetPassword({navigation}) {
  const [password, setPassword] = useState();

  return (
    <View style={styles.container}>
      {/* <Header title='change password' isIconRequired={true} icon="arrow-back" onPress={() => navigation.goBack()} /> */}

      <View style={[styles.changePassword]}>
        <View style={styles.passwordContainer}>
          <InputPassword
            placeholder="Set Your Password..."
            value={password}
            onChangeText={_password => setPassword(_password)}
          />
        </View>
        <TouchableOpacity
          style={styles.passwordContainer}
          onPress={() => navigation.navigate('forgetpassword')}>
          <Text style={{textTransform: 'capitalize', color: '#6da2d8'}}>
            forgetten password?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        {/* <Button label="cancel" type="secondary" onPress={() => navigation.goBack()} /> */}
        <Button
          label="verify"
          type="primary"
          onPress={() =>
            console.log('new password set, redirecting to login page')
          }
        />
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
});

export default SetPassword;
