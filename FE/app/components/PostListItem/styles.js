import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {flexDirection: 'row', width: Utils.scaleWithPixel(300)},
  imageBanner: {
    width: Utils.scaleWithPixel(100),
    height: Utils.scaleWithPixel(100),
  },
  content: {
    height: Utils.scaleWithPixel(100),
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  contentTitle: {
    paddingTop: 5,
    justifyContent: 'flex-start',
  },
  contentDate: {
    paddingBottom: 5,
    justifyContent: 'flex-end',
  },
});
