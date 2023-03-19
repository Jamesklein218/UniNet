import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme, Images} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  EventItem,
  ActivityEventFilter,
  FilterSort,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import {EventListData} from '@data';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationActions} from '@actions';
import {useFocusEffect} from '@react-navigation/native';
import _ from 'lodash';

export default function Event(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const event = useSelector(state => state.event);
  const me = useSelector(state => state.auth.profile);

  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [modeView, setModeView] = useState('block');
  const [list] = useState(EventListData);

  const onRefresh = () => {
    setRefreshing(true);
    console.log('ReFRESH ');
    dispatch(
      EventActions.getEventNewsfeed(() => {
        console.log('Call back');
        setRefreshing(false);
      }),
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  /**
   * call when on change Sort
   */
  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onFilter = () => {
    navigation.navigate('EventFilter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('list');
        break;
      case 'grid':
        setModeView('block');
        break;
      case 'list':
        setModeView('grid');
        break;
      default:
        setModeView('block');
        break;
    }
  };

  const renderList = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              data={event.eventsNewfeed}
              key={'block'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <EventItem
                  block
                  image={Images.cover2}
                  // image={{uri: Utils.getMediaURL(item.media[0].original)}}
                  title={item.information.title}
                  description={item.information.description}
                  location={t('update_later')}
                  eventType={item.information.type}
                  eventStart={Utils.formatDate(item.information.eventStart)}
                  dayLeft={Math.round(
                    (item.information.formEnd - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  isUrgent={item.information.isUrgent}
                  participant={item.participants}
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                  // onPressTag={() => navigation.navigate('Review')}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );

      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={event.eventsNewfeed}
              key={'gird'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <EventItem
                  grid
                  image={Images.cover2}
                  title={item.information.title}
                  description={item.information.description}
                  location={t('update_later')}
                  eventType={item.information.type}
                  eventStart={Utils.formatDate(item.information.eventStart)}
                  slot={2}
                  dayLeft={Math.round(
                    (item.information.formEnd - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  liked={list[0].liked}
                  isUrgent={item.information.isUrgent}
                  participant={item.participants}
                  style={{marginLeft: 15, marginBottom: 20}}
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                  onPressTag={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );

      case 'list':
        return (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
            }}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              data={event.eventsNewfeed}
              key={'list'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <EventItem
                  list
                  // image={list[0].image}
                  title={item.information.title}
                  description={item.information.description}
                  location={t('update_later')}
                  eventType={item.information.type}
                  eventStart={Utils.formatDateTime(item.information.eventStart)}
                  slot={5}
                  dayLeft={Math.round(
                    (item.information.formEnd - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  isUrgent={item.information.isUrgent}
                  participant={item.participants}
                  liked={list[0].liked}
                  style={{
                    marginBottom: 20,
                  }}
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                  onPressTag={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );

      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              data={event.newsfeed}
              key={'block'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <EventItem
                  block
                  // image={list[0].image}
                  title={item.information.title}
                  description={item.information.description}
                  location={t('update_later')}
                  eventType={item.information.type}
                  eventStart={Date(item.information.eventStart)}
                  slot={5}
                  dayLeft={Math.round(
                    (item.information.formEnd - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  isUrgent={item.information.isUrgent}
                  participant={item.participants}
                  liked={list[0].liked}
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                  onPressTag={() =>
                    navigation.navigate('EventDetail', {
                      eventId: item._id,
                    })
                  }
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      {_.find(me.role, item => item === 'CREATOR') ? (
        <Header
          title={t('event')}
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          renderRight={() => {
            return <Icon name="plus" size={20} color={colors.primary} />;
          }}
          // renderRightSecond={() => {
          //   return <Icon name="search" size={20} color={colors.primary} />;
          // }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          // onPressRightSecond={() => {
          //   navigation.navigate('SearchHistory');
          // }}
          onPressRight={() => {
            navigation.navigate('EventFormCreate');
          }}
        />
      ) : (
        <Header
          title={t('event')}
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          // renderRight={() => {
          //   return <Icon name="search" size={20} color={colors.primary} />;
          // }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          // onPressRight={() => {
          //   navigation.navigate('SearchHistory');
          // }}
        />
      )}
      {renderList()}
    </SafeAreaView>
  );
}
