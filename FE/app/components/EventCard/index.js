import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {Image, Text} from '@components';
import {Images, useTheme} from '@config';
import * as Utils from '@utils';

export default function EventCard(props) {
  const {colors} = useTheme();
  const {style, title, description, time, image, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.content, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={image} style={styles.imageBanner} />
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
        }}>
        <View style={{alignItems: 'center', marginRight: 10}}>
          <Text body2 primaryColor semibold>
            {Utils.formatDate(time, 'MMM')}
          </Text>
          <Text body1 grayColor semibold>
            {Utils.formatDate(time, 'DD')}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text body2 semibold numberOfLines={1} style={{flex: 1}}>
            {title}
          </Text>
          <Text overline grayColor style={{marginVertical: 5}}>
            {Utils.formatDate(time, 'DD/MM/YYYY')}
          </Text>
          <Text overline grayColor>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

EventCard.propTypes = {
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  time: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

EventCard.defaultProps = {
  image: Images.event5,
  title: 'BBC Music Introducing',
  time: 'Thu, Oct 31, 9:00am',
  location: 'Tobacco Dock, London',
  style: {},
  onPress: () => {},
};
