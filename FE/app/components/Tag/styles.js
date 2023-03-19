import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor, Typography, FontWeight} from '@config';

export default StyleSheet.create({
  default: {
    flexDirection: 'row',
  },
  primary: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrimary: StyleSheet.flatten([
    Typography.caption1,
    {color: BaseColor.whiteColor},
  ]),
  outline: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOutline: Typography.caption1,
  outlineSecondary: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: BaseColor.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOutlineSecondary: Typography.caption1,
  small: {
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSmall: StyleSheet.flatten([
    Typography.caption2,
    {color: BaseColor.whiteColor},
  ]),
  light: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLight: Typography.caption2,
  gray: {
    padding: 5,
    backgroundColor: BaseColor.fieldColor,
    borderColor: BaseColor.fieldColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGray: StyleSheet.flatten([Typography.caption2]),
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  textChip: Typography.overline,
  status: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStatus: StyleSheet.flatten([
    Typography.caption2,
    {color: BaseColor.whiteColor, fontWeight: FontWeight.bold},
  ]),
  rate: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRate: StyleSheet.flatten([
    Typography.headline,
    {color: BaseColor.whiteColor, fontWeight: FontWeight.bold},
  ]),
  rateSmall: {
    borderRadius: 3,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRateSmall: StyleSheet.flatten([
    Typography.caption2,
    {color: BaseColor.whiteColor, fontWeight: FontWeight.bold},
  ]),
  sale: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSale: StyleSheet.flatten([
    Typography.headline,
    {color: BaseColor.whiteColor, fontWeight: FontWeight.bold},
  ]),
});
