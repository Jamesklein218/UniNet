import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',

    paddingTop: 5,
    paddingBottom: 5,
  },
  thumb: {width: 48, height: 48, marginRight: 10, borderRadius: 24},
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 7.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flex: 2.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
