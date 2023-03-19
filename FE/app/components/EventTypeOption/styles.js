import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contentForm: {
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'flex-start',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
});
