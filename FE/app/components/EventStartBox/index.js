import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, Icon, Button} from '@components';
import {useTheme} from '@config';
import styles from './styles';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

export default function EventStartBox(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const {style, onPress, eventState, eventStatus} = props;

  return (
    <View style={[styles.contain, {backgroundColor: colors.card}, style]}>
      <View style={styles.packageTitleContent}>
        <Text title2 semibold>
          {t('guide')}
        </Text>
      </View>
      <Text body2 numberOfLines={5} style={{marginTop: 10}}>
        {t('event_guide_1')}
      </Text>
      <Text body2 numberOfLines={5} style={{marginTop: 10}}>
        {t('event_guide_2')}
      </Text>
      <Text body2 numberOfLines={5} style={{marginTop: 10}}>
        {t('event_guide_3')}
      </Text>
      <Text body2 numberOfLines={5} style={{marginTop: 10}}>
        {t('event_guide_4')}
      </Text>
      {/* {eventState == 'PREPARE' && eventStatus == 'SUCCESSFUL' ? (
        <Button full style={{marginTop: 10}} onPress={onPress}>
          Start Event
        </Button>
      ) : eventState == 'END_SECOND_CHECK' ? (
        <Button full style={{marginTop: 10}} onPress={onPress}>
          Finish Event
        </Button>
      ) : (
        <></>
      )} */}
    </View>
  );
}

EventStartBox.propTypes = {
  eventStatus: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  eventState: PropTypes.string,
  onPress: PropTypes.func,
};

EventStartBox.defaultProps = {
  eventStatus: '',
  eventState: '',
  style: {},
  onPress: () => {},
};
