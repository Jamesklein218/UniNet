import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {Image} from '@components';
import {Images, useTheme} from '@config';

export default function Card(props) {
  const {colors} = useTheme();
  const {style, children, styleContent, image, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={image} style={styles.imageBanner} />
      <View style={[styles.content, styleContent]}>{children}</View>
    </TouchableOpacity>
  );
}

Card.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onPress: PropTypes.func,
};

Card.defaultProps = {
  image: Images.event1,
  style: {},
  styleContent: {},
  onPress: () => {},
};
