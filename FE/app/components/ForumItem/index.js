import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import {BaseColor, useTheme} from '@config';
import VoteBox from '../VoteBox';
import {useSelector} from 'react-redux';

export default function ForumItem(props) {
  const me = useSelector(state => state.auth.profile);
  const {colors} = useTheme();
  const {item, style, children, title, description, onPress, image} = props;
  return (
    <View style={style}>
      {children}
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image style={styles.imagePost} source={image} />
      </TouchableOpacity>
      <View style={[styles.content, {borderBottomColor: colors.border}]}>
        <Text headline semibold style={{marginBottom: 6}}>
          {title}
        </Text>
        <Text body2 numberOfLines={3}>
          {description}
        </Text>
        <VoteBox
          key={`${item.upvotes.length - item.downvotes.length}-${new Date()}-${
            item._id
          }`}
          type="post"
          userId={me._id}
          id={item._id}
          upvotes={item.upvotes}
          downvotes={item.downvotes}
        />
      </View>
    </View>
  );
}

ForumItem.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
  upvotes: PropTypes.array,
  downvotes: PropTypes.array,
  onPress: PropTypes.func,
};

ForumItem.defaultProps = {
  image: '',
  title: '',
  description: '',
  style: {},
  onPress: () => {},
};
