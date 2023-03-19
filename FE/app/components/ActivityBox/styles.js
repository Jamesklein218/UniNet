import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    shadowOffset: {height: 1},
    shadowOpacity: 1.0,
    elevation: 5,
  },
  nameContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  validContent: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 7,
    justifyContent: 'space-between',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  mainContent: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    flexDirection: 'row',
  },
});
