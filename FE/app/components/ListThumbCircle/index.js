import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import {useTheme} from '@config';
export default function ListThumbCircle(props) {
  const {colors} = useTheme();
  const {
    style,
    imageStyle,
    image,
    txtLeftTitle,
    txtContent,
    txtRight,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      style={[
        styles.contain,
        {borderBottomWidth: 1, borderBottomColor: colors.border},
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image source={image} style={[styles.thumb, imageStyle]} />
      <View style={styles.content}>
        <View style={styles.left}>
          <Text headline semibold>
            {txtLeftTitle}
          </Text>
          <Text
            note
            numberOfLines={1}
            footnote
            grayColor
            style={{
              paddingTop: 5,
            }}>
            {txtContent}
          </Text>
        </View>
        <View style={styles.right}>
          <Text caption2 grayColor numberOfLines={1}>
            {txtRight}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

ListThumbCircle.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageStyle: PropTypes.object,
  image: PropTypes.node.isRequired,
  txtLeftTitle: PropTypes.string,
  txtContent: PropTypes.string,
  txtRight: PropTypes.string,
  onPress: PropTypes.func,
};

ListThumbCircle.defaultProps = {
  style: {},
  imageStyle: {},
  image: '',
  txtLeftTitle: '',
  txtContent: '',
  txtRight: '',
  onPress: () => {},
};
