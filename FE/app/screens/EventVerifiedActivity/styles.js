import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default StyleSheet.create({
  tabbar: {
    height: 40,
  },
  tab: {
    flex: 1,
  },
  indicator: {
    height: 1,
  },
  lineInformation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  contentImageGird: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(160),
    marginTop: 10,
    marginBottom: 20,
  },
  contentContact: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 20,
    // paddingHorizontal: 20,
  },
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containRole: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  text: {
    marginVertical: 10
  }
});
