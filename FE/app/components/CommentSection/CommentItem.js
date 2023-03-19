import React from 'react';
import {View} from 'react-native';
import {Images, useTheme} from '@config';
import {Text, Image, VoteBox} from '@components';
import PropTypes from 'prop-types';
import styles from './styles';

export default function CommentItem(props) {
  const {colors} = useTheme();
  const cardColor = colors.card;
  const {
    style,
    image,
    name,
    username,
    date,
    title,
    upvotes,
    downvotes,
    id,
    userId,
    comment,
  } = props;
  return (
    <View style={[styles.contain, {backgroundColor: cardColor}, style]}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.contentLeft}>
          <Image source={image} style={styles.thumb} />
          <View>
            <Text headline semibold numberOfLines={1}>
              {name === '' || !name ? username : name}
            </Text>
            <Text footnote grayColor numberOfLines={1}>
              @{username ? username : 'anonymous'}
            </Text>
          </View>
        </View>
        <View style={styles.contentRight}>
          <Text caption2 grayColor numberOfLines={1}>
            {new Date(date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>
      <View>
        <Text
          body2
          grayColor
          style={{
            marginTop: 10,
          }}>
          {comment}
        </Text>
        <VoteBox
          key={`${upvotes.length - downvotes.length}-${new Date()}-${id}`}
          type="comment"
          userId={userId}
          id={id}
          upvotes={upvotes}
          downvotes={downvotes}
        />
      </View>
    </View>
  );
}

CommentItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  rate: PropTypes.number,
  date: PropTypes.string,
  title: PropTypes.string,
  comment: PropTypes.string,
};

CommentItem.defaultProps = {
  style: {},
  image: Images.profile2,
  name: '',
  rate: 0,
  date: '',
  title: '',
  comment: '',
};
