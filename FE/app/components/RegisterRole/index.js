import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useTheme} from '@config';
import {Text} from '@components';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './styles';

export default function RegisterRole(props) {
  const {colors} = useTheme();
  const {
    style,
    name,
    reward,
    status,
    isAttendance,
    description,
    max_register,
    permission,
    isPublic,
    note,
    key,
  } = props;
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsOpen(!isOpen);
      }}>
      <View style={[styles.contain, {backgroundColor: colors.card}, style]}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.contentLeft}>
            {/* <Image source={image} style={styles.thumb} /> */}
            <View>
              <Text subhead semibold numberOfLines={1}>
                {name}
              </Text>
              {!isAttendance ? (
                <View style={styles.contentRate}>
                  <Text caption2 grayColor numberOfLines={1}>
                    {t('social_day')} {reward}
                  </Text>
                </View>
              ) : (
                <Text body2 semibold style={{marginTop: 10}}>
                  <Text
                    body2
                    grayColor
                    style={{
                      // marginTop: 5,
                      marginLeft: 5,
                    }}>
                    {description}
                  </Text>
                </Text>
              )}
            </View>
          </View>
          <View style={styles.contentRight}>{status}</View>
        </View>
        {!isOpen ? null : (
          <View style={{marginTop: 10}}>
            {isPublic == undefined ? null : (
              <Text body2 semibold style={{marginTop: 10}}>
                {t('type') + ' '}
                <Text
                  body2
                  grayColor
                  style={{
                    // marginTop: 5,
                    marginLeft: 5,
                  }}>
                  {isPublic ? t('public') : t('private')}
                </Text>
              </Text>
            )}
            {!description || isAttendance ? null : (
              <Text body2 semibold style={{marginTop: 10}}>
                {t('description') + ' '}
                <Text
                  body2
                  grayColor
                  style={{
                    // marginTop: 5,
                    marginLeft: 5,
                  }}>
                  {description}
                </Text>
              </Text>
            )}
            {!max_register ? null : (
              <Text body2 semibold style={{marginTop: 10}}>
                {t('max_register') + ' '}
                <Text
                  body2
                  grayColor
                  style={{
                    // marginTop: 5,
                    marginLeft: 5,
                  }}>
                  {max_register}
                </Text>
              </Text>
            )}
            {permission.length == 0 ? null : (
              <Text body2 semibold style={{marginTop: 10}}>
                {t('permission') + ' '}
                <Text
                  body2
                  grayColor
                  style={{
                    // marginTop: 5,
                    marginLeft: 5,
                  }}>
                  {permission[0]}
                </Text>
              </Text>
            )}
            {!note ? null : (
              <Text body2 semibold style={{marginTop: 10}}>
                {t('note') + ' '}
                <Text
                  body2
                  grayColor
                  style={{
                    // marginTop: 5,
                    marginLeft: 5,
                  }}>
                  {note}
                </Text>
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

RegisterRole.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  reward: PropTypes.number,
  description: PropTypes.string,
  max_register: PropTypes.number,
  note: PropTypes.string,
  key: PropTypes.number,
  permission: PropTypes.array,
  isPublic: PropTypes.bool,
  isAttendance: PropTypes.bool,
};

RegisterRole.defaultProps = {
  style: {},
  name: '',
  reward: 0,
  description: null,
  max_register: null,
  note: null,
  key: 0,
  permission: [],
  isPublic: undefined,
};
