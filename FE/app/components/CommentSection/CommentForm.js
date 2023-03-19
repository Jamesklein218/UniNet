import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import SendIcon from '../../assets/svgs/SendIcon.svg';
import {TextInput} from '@components';
import {useTheme} from '@config';

export default function CommentForm({comment, setComment, onSubmitEditing}) {
  const {colors} = useTheme();

  return (
    <View>
      <Text />
      <TextInput
        onChangeText={text => setComment(text)}
        placeholder="Type your comment"
        success={true}
        value={comment}
        multiline={true}
        style={{textAlignVertical: 'top'}}
        onSubmitEditing={() => onSubmitEditing(comment)}
        icon={
          <>
            <TouchableOpacity
              onPress={() => onSubmitEditing(comment)}
              activeOpacity={0.6}>
              <SendIcon style={{color: colors.primary}} />
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}
