import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, SafeAreaView, Text, FlatList, RefreshControl} from 'react-native';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import {ForumAPI} from '@api';
import {useTheme, BaseStyle} from '@config';
import {useSelector} from 'react-redux';
import SendIcon from '../../assets/svgs/SendIcon.svg';

export default function CommentSection({postId}) {
  const {colors} = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const me = useSelector(state => state.auth.profile);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      try {
        const {data} = await ForumAPI.getAllComments(postId);
        setComments(data.payload);
      } catch (err) {
        console.log(err);
      }
      setRefreshing(false);
    })();
  };

  const onSubmitEditing = async text => {
    await ForumAPI.createComment(postId, text);
    const {data} = await ForumAPI.getAllComments(postId);
    setComments(data.payload);
    setComment('');
  };

  return (
    <>
      <Text
        headline
        semibold
        style={{
          marginTop: 20,
        }}>
        Comment
      </Text>
      <View style={{flex: 1}}>
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          edges={['right', 'left', 'bottom']}>
          <FlatList
            nestedScrollEnabled
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={[...comments].sort((a, b) => b.at - a.at)}
            keyExtractor={(item, index) => item._id}
            renderItem={({item, index}) => (
              <CommentItem
                style={{marginTop: 10}}
                image={item.source}
                name={item.author_name}
                username={item.author_username}
                date={item.at}
                comment={item.content}
                userId={me._id}
                id={item._id}
                upvotes={item.upvotes}
                downvotes={item.downvotes}
              />
            )}
          />
        </SafeAreaView>
      </View>
      <CommentForm
        comment={comment}
        setComment={setComment}
        onSubmitEditing={onSubmitEditing}
      />
    </>
  );
}
