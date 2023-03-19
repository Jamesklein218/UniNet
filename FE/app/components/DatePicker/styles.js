import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contentPickDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 10,
  },
  itemPick: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentCalendar: {
    borderRadius: 8,
    width: '100%',
  },
  contentActionCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
});
