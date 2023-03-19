import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from '@components';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTheme} from '@config';
import {useTranslation} from 'react-i18next';

export default function ActivityBox(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {style, name, time, amount, type, role, onPress} = props;

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
          {type === 0 ? 'General Event' : type === 1 ? 'Chain Event' : 'Other'}
        </Text>
        <Text body2 whiteColor semibold>
          {role}
        </Text>
      </View>
      <View
        style={[styles.mainContent, {backgroundColor: colors.primaryLight}]}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text body1 whiteColor semibold numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
      <View style={[styles.validContent, {backgroundColor: colors.card}]}>
        <Text overline semibold>
          {t('date')} {time}
        </Text>
        <Text overline semibold>
          {amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

ActivityBox.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  type: PropTypes.number,
  role: PropTypes.string,
  content: PropTypes.string,
  time: PropTypes.string,
  amount: PropTypes.string,
  onPress: PropTypes.func,
};

ActivityBox.defaultProps = {
  style: {},
  name: '',
  type: 0,
  role: '',
  content: '',
  time: '',
  amount: '',
  onPress: () => {},
};
