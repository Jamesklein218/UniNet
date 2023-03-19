import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const RailSelected = props => {
  return <View style={[styles.root, {backgroundColor: props.color}]} />;
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 4,
    borderRadius: 2,
  },
});
