import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor, BaseStyle} from '@config';

export default StyleSheet.create({
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockView: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  lineTicket: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
});
