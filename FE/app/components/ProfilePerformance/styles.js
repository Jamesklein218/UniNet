import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
  },
  contentLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemInfor: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
