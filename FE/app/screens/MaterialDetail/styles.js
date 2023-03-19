import {StyleSheet} from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
    elevation: 1000,
  },
  contentImageFollowing: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(160),
    marginTop: 10,
  },
});
