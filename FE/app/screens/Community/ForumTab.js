import React, {useState} from 'react';
import {RefreshControl, FlatList, View, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme, Images} from '@config';
import {
  Header,
  SafeAreaView,
  ForumItem,
  ProfileAuthor,
  Icon,
} from '@components';
import styles from './styles';
import {PostData} from '@data';
import {useTranslation} from 'react-i18next';
import {EventActions} from '@actions';
import {useFocusEffect} from '@react-navigation/native';
import profileimg from '../../assets/images/avata-02.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {ForumAPI} from '@api';
import {GET_ALL_POST} from '../../actions/actionTypes';

export default function ForumTab({navigation}) {
  const {colors} = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  const {posts} = useSelector(state => state.forum);

  const dispatch = useDispatch();

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
        const {data} = await ForumAPI.getAllPost();
        dispatch({
          type: GET_ALL_POST,
          payload: data.payload,
        });
      } catch (err) {
        console.log(err);
      }
      setRefreshing(false);
    })();
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={[...posts].sort((a, b) => b.at - a.at)}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => (
            <ForumItem
              image={PostData[index % PostData.length].image}
              title={item.title}
              description={item.content}
              item={item}
              onPress={() => navigation.navigate('ForumDetail', {item, index})}>
              <ProfileAuthor
                image={profileimg}
                name={
                  item.author_name === ''
                    ? item.author_username
                    : item.author_name
                }
                username={item.author_username}
                style={{paddingHorizontal: 20}}
                textRight={item.at}
              />
            </ForumItem>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
