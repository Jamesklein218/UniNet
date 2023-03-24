import React, {useEffect, useState} from 'react';
import {
  View,
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {Text, SafeAreaView, EventCard} from '@components';
import CustomCard from '../../components/CustomCard';
import {Images, useTheme} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {EventActions} from '@actions';
import messaging from '@react-native-firebase/messaging';
import _ from 'lodash';
import {PostData} from '@data';
import {AuthAPI} from '../../api/auth';
import {ForumAPI} from '@api';
import {GET_ALL_POST} from '../../actions/actionTypes';

export default function Home({navigation}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const me = useSelector(state => state.auth.profile);
  const {posts} = useSelector(state => state.forum);
  const [waitingEvent, setwaitingEvent] = useState([]);

  useEffect(() => {
    async function onAppBootstrap() {
      await messaging().registerDeviceForRemoteMessages();
      const deviceToken = await messaging().getToken();
      const {data} = await AuthAPI.registerDeviceToken(deviceToken);
      await AuthAPI.registerUserToDeviceToken(data.payload);
    }

    void onAppBootstrap();

    return messaging().onTokenRefresh(async token => {
      const data = await AuthAPI.registerDeviceToken(token);
      await AuthAPI.registerUserToDeviceToken(data.payload);
    });
  }, []);

  let [icons] = useState([
    {
      icon: 'calendar',
      name: 'Event',
      route: 'EventFormCreate',
    },
    {
      icon: 'book',
      name: 'Material',
      route: 'MaterialCreate',
    },
    {
      icon: 'people-arrows',
      name: 'Post',
      route: 'PostCreate',
    },
  ]);

  if (me?.role && _.find(me.role, item => item === 'CENSOR')) {
    icons[3] = {
      icon: 'calendar-check',
      name: 'Verification',
      route: 'Verification',
    };
  } else {
    icons = [
      {
        icon: 'calendar',
        name: 'Event',
        route: 'EventFormCreate',
      },
      {
        icon: 'book',
        name: 'Material',
        route: 'MaterialCreate',
      },
      {
        icon: 'people-arrows',
        name: 'Post',
        route: 'PostCreate',
      },
    ];
  }

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [refreshing, setRefreshing] = useState(false);
  const event = useSelector(state => state.event);
  const deltaY = new Animated.Value(0);

  const materialList = [
    {
      title: 'Computer Science',
      image: Images.cs,
    },
    {
      title: 'Chemistry',
      image: Images.chemistry,
    },
    {
      title: 'Biology',
      image: Images.biology,
    },
    {
      title: 'Civil Engineer',
      image: Images.civilEngineer,
    },
    {
      title: 'Management',
      image: Images.management,
    },
    {
      title: 'Economics',
      image: Images.economic,
    },
  ];

  const heightImageBanner = Utils.scaleWithPixel(150);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const isCensor = me?.role && _.find(me.role, item => item === 'CENSOR');

  const getWaitingEvent = () => {
    if (isCensor) {
      EventActions.getWaitingEvent()
        .then(res => {
          console.log('Get waiting event successful', res);
          setwaitingEvent(res.data.payload);
          console.log(res.data.payload[0]);
        })
        .catch(err => {
          console.log('Error in get waiting event', err);
        });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      EventActions.getEventNewsfeed(() => {
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
      }),
    );
    getWaitingEvent();
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}} edges={['right', 'left']}>
        <Animated.Image
          source={require('../../assets/images/home_banner.jpg')}
          style={[
            styles.imageBackground,
            {
              height: deltaY.interpolate({
                inputRange: [
                  0,
                  Utils.scaleWithPixel(100),
                  Utils.scaleWithPixel(100),
                ],
                outputRange: [heightImageBanner, heightHeader, 0],
              }),
            },
          ]}
        />
        <ScrollView
          style={{flex: 1}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: deltaY}}}],
            {
              useNativeDriver: false,
            },
          )}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <FlatList
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {y: deltaY},
                  },
                },
              ],
              {useNativeDriver: false},
            )}
            onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
            scrollEventThrottle={8}
            ListFooterComponent={
              <View style={{marginTop: 180}}>
                <View>
                  {isCensor && (
                    <>
                      <View style={styles.titleView}>
                        <Text title3 semibold style={{fontSize: 18}}>
                          Verify Activity (For Censor Only)
                        </Text>
                      </View>
                      <FlatList
                        contentContainerStyle={{
                          paddingLeft: 5,
                          paddingRight: 20,
                        }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={waitingEvent}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item, index}) => (
                          <EventCard
                            title={item.information.title}
                            time={item.information.eventStart}
                            onPress={() =>
                              navigation.navigate('VerificationDetail', {
                                event: item,
                              })
                            }
                            style={{marginLeft: 15}}
                            image={item.media.origin}
                          />
                        )}
                      />
                    </>
                  )}
                  <View style={styles.titleView}>
                    <Text title3 semibold>
                      Popular
                    </Text>
                  </View>
                  <FlatList
                    contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={event.eventsNewfeed}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => (
                      <EventCard
                        title={item.information.title}
                        time={item.information.eventStart}
                        onPress={() =>
                          navigation.navigate('EventDetail', {
                            eventId: item._id,
                            index: index,
                          })
                        }
                        style={{marginLeft: 15}}
                        image={Images[`event${(index % 7) + 1}`]}
                      />
                    )}
                  />
                  <View style={styles.titleView}>
                    <Text title3 semibold>
                      Today
                    </Text>
                  </View>
                  <FlatList
                    contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={event.eventsNewfeed.slice(1)}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => (
                      <EventCard
                        title={item.information.title}
                        time={item.information.eventStart}
                        onPress={() =>
                          navigation.navigate('EventDetail', {
                            eventId: item._id,
                            index: index,
                          })
                        }
                        style={{marginLeft: 15}}
                        image={Images[`event${(index % 7) + 2}`]}
                      />
                    )}
                  />
                  <View style={styles.titleView}>
                    <Text title3 semibold>
                      This Week
                    </Text>
                  </View>
                  <FlatList
                    contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={event.eventsNewfeed}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => (
                      <EventCard
                        title={item.information.title}
                        time={item.information.eventStart * 1000}
                        onPress={() =>
                          navigation.navigate('EventDetail', {
                            eventId: item._id,
                            index: index,
                          })
                        }
                        style={{marginLeft: 15}}
                        image={Images[`event${(index % 7) + 1}`]}
                      />
                    )}
                  />
                </View>
              </View>
            }
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
