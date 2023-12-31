import PropTypes from 'prop-types';
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const WHITE = '#ffffff';
const BORDER_COLOR = '#DBDBDB';

const GenderActionSheet = props => {
  const {actionItems} = props;
  const actionSheetItems = [...actionItems];
  return (
    <View style={styles.modalContent}>
      {actionSheetItems.map((actionItem, index) => {
        return (
          <Pressable
            style={[
              styles.actionSheetView,
              index === 0 && {
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              },
              index === actionSheetItems.length - 2 && {
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
              },
              index === actionSheetItems.length - 1 && {
                borderBottomWidth: 0,
                backgroundColor: WHITE,
                marginTop: 8,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
              },
            ]}
            underlayColor={'#f7f7f7'}
            key={index}
            onPress={() => {
              if (actionItem.value === 'cancel') {
                props.onCancel();
              } else {
                props.onSelect(actionItem.value);
              }
            }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.actionSheetText,
                props?.actionTextColor && {
                  color: props?.actionTextColor,
                },
                index === actionSheetItems.length - 1 && {
                  color: '#fa1616',
                },
              ]}>
              {actionItem.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
  },
  actionSheetText: {
    fontSize: 18,
    color: PRIMARY_COLOR,
  },
  actionSheetView: {
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR,
  },
});

GenderActionSheet.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      onPress: PropTypes.func,
    }),
  ).isRequired,
  onCancel: PropTypes.func,
  actionTextColor: PropTypes.string,
};

GenderActionSheet.defaultProps = {
  actionItems: [],
  onCancel: () => {},
  actionTextColor: null,
};

export default GenderActionSheet;
