import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
export default StyleSheet.create({
  imageBanner: {
    height: Utils.scaleWithPixel(120),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  content: {
    borderRadius: 5,
    borderWidth: 0.5,
    width: Utils.scaleWithPixel(200),
  },
});
