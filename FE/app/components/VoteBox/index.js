import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Upvote from '../../assets/svgs/Upvote.svg';
import Downvote from '../../assets/svgs/Downvote.svg';
import {ForumAPI} from '@api';
import PropTypes from 'prop-types';
import {useTheme} from '@config';

export default function VoteBox(props) {
  const {type, userId, upvotes, downvotes, id} = props;
  const [vote, setVote] = useState(upvotes.length - downvotes.length);
  const [upvote, setUpvote] = useState(upvotes.includes(userId));
  const [downvote, setDownvote] = useState(downvotes.includes(userId));
  const {colors} = useTheme();

  const onPress = async typeOfVote => {
    try {
      if (type === 'comment') {
        if (typeOfVote === 'upvote') {
          await ForumAPI.upvoteComment(id);
        } else {
          await ForumAPI.downvoteComment(id);
        }

        const {data} = await ForumAPI.getCommentById(id);
        setVote(data.payload.upvotes.length - data.payload.downvotes.length);
        setUpvote(data.payload.upvotes.includes(userId));
        setDownvote(data.payload.downvotes.includes(userId));
      } else {
        if (typeOfVote === 'upvote') {
          await ForumAPI.upvotePost(id);
        } else {
          await ForumAPI.downvotePost(id);
        }

        const {data} = await ForumAPI.getPostById(id);
        setVote(data.payload.upvotes.length - data.payload.downvotes.length);
        setUpvote(data.payload.upvotes.includes(userId));
        setDownvote(data.payload.downvotes.includes(userId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{flexDirection: 'row', marginTop: 8}}>
      <TouchableOpacity onPress={() => onPress('upvote')} activeOpacity={0.6}>
        <Upvote
          style={{color: upvote ? colors.primary : 'rgb(220, 220, 220)'}}
        />
      </TouchableOpacity>
      <Text headline style={{marginHorizontal: 4}}>
        {vote}
      </Text>
      <TouchableOpacity onPress={() => onPress('downvote')} activeOpacity={0.6}>
        <Downvote
          style={{
            color: downvote ? colors.primary : 'rgb(220, 220, 220)',
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

VoteBox.propTypes = {
  userId: PropTypes.string,
  type: PropTypes.string,
  item: PropTypes.object,
};

VoteBox.defaultProps = {
  userId: '',
  type: 'post',
  item: {},
};
