/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

function CollorOptions({data, selected, setSelected}) {
  return (
    <View style={styles.collors}>
      {data?.map((item, index) => (
        <Pressable
          key={item.name}
          onPress={() => setSelected(item.name)}
          style={[
            styles.collor,
            selected === item.name && styles.boxWithShadow,
            {
              borderColor: selected === item.name ? '#D97D54' : '#fff',
              marginRight: index === 2 || index === 5 || index === 8 ? 0 : 10,
              position: 'relative',
              overflow: 'hidden',
            },
          ]}>
          {item.isPopular && (
            <View style={{position: 'absolute'}}>
              <View
                style={{
                  width: 120,
                  padding: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'red',
                  borderTopRightRadius: 3,
                  borderBottomRightRadius: 3,
                  transform: [{rotate: '-45deg'}],
                  left: -37,
                  top: 5,
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontSize: 10,
                  }}>
                  Popular
                </Text>
              </View>
            </View>
          )}
          <Image style={styles.icon} source={item.icon} />
          <Text style={styles.name}>{item.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  collors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  collor: {
    width: (Dimensions.get('window').width - 80) / 3,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  icon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 12,
    color: '#334856',
    marginTop: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  boxWithShadow: {
    shadowColor: '#FC9667',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
});

export default CollorOptions;
