/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {View, ScrollView, Animated} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme, Images} from '@config';
import {PostData} from '@data';
import {
  SafeAreaView,
  Text,
  ProfileAuthor,
  CommentSection,
  PostListItem,
  Header,
  VoteBox,
  Icon,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import profileimg from '../../assets/images/avata-02.jpeg';
import {ForumAPI} from '@api';
import {useSelector} from 'react-redux';

export default function ForumDetail(props) {
  const {t} = useTranslation();
  const {navigation} = props;
  const deltaY = new Animated.Value(0);
  const heightHeader = Utils.heightHeader();
  const heightImageBanner = Utils.scaleWithPixel(250);
  const marginTopBanner = heightImageBanner - heightHeader - 30;
  const {item: routeItem, index} = props.route.params;
  const [post, setPost] = useState(routeItem);
  const me = useSelector(state => state.auth.profile);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const {data} = await ForumAPI.getPostById(routeItem._id);
          setPost(data.payload);
        } catch (err) {
          console.log(err);
        }
      })();
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={PostData[index % PostData.length].image}
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(195),
                Utils.scaleWithPixel(195),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
      />
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color="#ffffff"
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('PreviewImage');
        }}
      />
      <SafeAreaView style={{flex: 1}} edges={[]}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          scrollEventThrottle={8}>
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
              marginTop: marginTopBanner + 40,
            }}>
            <ProfileAuthor
              image={profileimg}
              name={
                post.author_name === ''
                  ? post.author_username
                  : post.author_name
              }
              username={post.author_name}
              textRight={post.at}
              style={{
                marginTop: 20,
              }}
            />
            {/* Main Content Here */}
            <Text header semibold>
              {post.title}
            </Text>
            <Text body2 style={{marginTop: 5}}>
              {post.content}
            </Text>
            <VoteBox
              key={`${
                post.upvotes.length - post.downvotes.length
              }-${new Date()}-${post._id}`}
              type="post"
              userId={me._id}
              id={post._id}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
            />

            {/* Comment */}
            <CommentSection key={post._id} postId={post._id} />
            {/* Featured Posts */}
            <Text
              headline
              semibold
              style={{
                marginTop: 20,
              }}>
              {t('feature_post')}
            </Text>
            <PostListItem
              title="See The Unmatched"
              description="Diffie on Friday announced he had contracted the coronavirus, becoming the first country star to go public with such a diagnosis."
              style={{marginTop: 10, width: '100%'}}
              image={Images.trip9}
              onPress={() => {
                navigation.navigate('Post');
              }}
            />
            <PostListItem
              description="Diffie on Friday announced he had contracted the coronavirus, becoming the first country star to go public with such a diagnosis."
              title="Top 15 Things Must To Do"
              style={{marginTop: 10, width: '100%'}}
              image={Images.trip8}
              onPress={() => {
                navigation.navigate('Post');
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
