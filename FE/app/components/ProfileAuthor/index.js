import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';

export default function ProfileAuthor(props) {
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    name,
    username,
    textRight,
  } = props;
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.contentLeft, styleLeft]}>
        <Image source={image} style={[styles.thumb, styleThumb]} />
        <View>
          <Text headline semibold numberOfLines={1}>
            {name === '' || !name ? username : name}
          </Text>
          <Text footnote grayColor numberOfLines={1}>
            @{username ? username : 'anonymous'}
          </Text>
        </View>
      </View>
      <View style={[styles.contentRight, styleRight]}>
        <Text caption2 grayColor numberOfLines={1}>
          {new Date(textRight).toLocaleDateString('vi-VN', options)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

ProfileAuthor.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  username: PropTypes.string,
  textRight: PropTypes.number,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

ProfileAuthor.defaultProps = {
  image: '',
  name: '',
  username: '',
  textRight: 0,
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  style: {},
  onPress: () => {},
};
