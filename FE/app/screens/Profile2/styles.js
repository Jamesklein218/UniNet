import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  containField: {
    margin: 20,
    marginTop: 90,
    flexDirection: 'row',
    height: 140,
    borderRadius: 10,
  },
  contentLeftItem: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  tagFollow: {width: 150, margin: 10},
  tabbar: {
    height: 40,
  },
  tab: {
    width: Utils.getWidthDevice() / 3,
  },
  indicator: {
    height: 1,
  },
  label: {
    fontWeight: '400',
  },
  containProfileItem: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
});
