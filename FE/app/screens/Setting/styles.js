import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  themeIcon: {
    width: 16,
    height: 16,
  },
});
