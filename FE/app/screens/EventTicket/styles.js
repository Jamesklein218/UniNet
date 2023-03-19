import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    padding: 20,
    flex: 1,
    // alignItems: 'flex-start',
  },
  line: {
    width: '100%',
    height: 1,
    borderWidth: 0.5,
    borderColor: BaseColor.dividerColor,
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  code: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
