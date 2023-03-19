import React, {useState} from 'react';
import {RefreshControl, FlatList, View} from 'react-native';
import {BaseStyle, useTheme, Images} from '@config';
import {Header, SafeAreaView, PostItem, ProfileAuthor} from '@components';
import styles from './styles';
import {PostData} from '@data';
import {useTranslation} from 'react-i18next';
import {EventActions} from '@actions';
import {useFocusEffect} from '@react-navigation/native';
import * as Utils from '@utils';

export default function Post({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPost] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    console.log('ReFRESH ');
    EventActions.getNews().then(res => {
      console.log('Call back', res.data);
      setRefreshing(false);
      setPost(res.data.payload);
    });
  };

  return (
    <View style={{flex: 1}}>
      <Header title={t('post')} />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={posts}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <PostItem
              image={{
                uri: Utils.getMediaURL(item.media[0].filename),
              }}
              title={item.title}
              description={item.content}
              onPress={() => navigation.navigate('PostDetail', {item})}>
              <ProfileAuthor
                image={Images.logo}
                name={'OISP Youth Union'}
                description={'@oispyoutuhunion'}
                style={{paddingHorizontal: 20}}
              />
            </PostItem>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
