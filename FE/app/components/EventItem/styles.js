import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';

export default StyleSheet.create({
  //block css
  blockImage: {
    height: Utils.scaleWithPixel(120),
    width: '100%',
  },
  blockContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tagStatus: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  iconLike: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  blockLineMap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockContentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  blockContentPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  //list css
  listContent: {
    padding: 10,
    borderRadius: 10,
  },
  listLineMap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  //gird css
  girdImage: {
    borderRadius: 8,
    height: Utils.scaleWithPixel(120),
    width: '100%',
  },
  girdContent: {
    flex: 1,
  },
  tagGirdStatus: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  iconGirdLike: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  girdRowRate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
  },
});
