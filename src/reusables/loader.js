import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';

const Loader = ({msg}) => {
  const loader = useSelector(state => state.loader);
  console.log('loader');
  return (
    loader && (
      <View style={[styles.container, styles.horizontal]}>
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.label}>{msg}</Text>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  contentContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  label: {
    color: '#fff',
  },
});

export default Loader;
