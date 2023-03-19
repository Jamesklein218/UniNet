import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from '@components';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTheme} from '@config';
import {useTranslation} from 'react-i18next';

export default function BookingHistory(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {style, name, checkIn, checkOut, price, total, onPress} = props;

  return (
    <TouchableOpacity
      style={[styles.contain, {shadowColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View
        style={[
          styles.nameContent,
          {
            borderBottomColor: colors.card,
            backgroundColor: colors.primaryLight,
          },
        ]}>
        <Text body2 whiteColor semibold>
          {name}
        </Text>
      </View>
      <View
        style={[styles.mainContent, {backgroundColor: colors.primaryLight}]}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text caption2 whiteColor>
            {t('check_in')}
          </Text>
          <Text body1 whiteColor semibold>
            {checkIn}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text caption2 whiteColor>
            {t('check_out')}
          </Text>
          <Text body1 whiteColor semibold>
            {checkOut}
          </Text>
        </View>
      </View>
      <View style={[styles.validContent, {backgroundColor: colors.card}]}>
        <Text overline semibold>
          {total}
        </Text>
        <Text overline semibold>
          {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

BookingHistory.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  total: PropTypes.string,
  price: PropTypes.string,
  onPress: PropTypes.func,
};

BookingHistory.defaultProps = {
  style: {},
  name: '',
  checkIn: '',
  checkOut: '',
  total: '',
  price: '',
  onPress: () => {},
};
