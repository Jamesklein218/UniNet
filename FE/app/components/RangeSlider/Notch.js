import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

const Notch = props => {
  return (
    <View style={[styles.root, {borderTopColor: props.color}]} {...props} />
  );
};

export default memo(Notch);

const styles = StyleSheet.create({
  root: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
});
