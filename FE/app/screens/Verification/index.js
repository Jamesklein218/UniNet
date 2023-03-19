import React, {useState} from 'react';
import {RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  FilterSort,
  VerificationItem,
} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import {EventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {UserData} from '@data';

export default function Verification(props) {
  const {navigation} = props;
  const {t} = useTranslation();
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const dispatch = useDispatch();
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
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState('block');
  const [event, setEvent] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  const onRefresh = () => {
    EventActions.getWaitingEvent()
      .then(res => {
        console.log('Get waiting event successful', res);
        setEvent(res.data.payload);
        console.log(res.data.payload[0]);
      })
      .catch(err => {
        console.log('Error in get waiting event', err);
      });
  };

  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => {
    navigation.navigate('Filter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');
        break;
      case 'grid':
        setModeView('block');
        break;
      default:
        setModeView('block');
        break;
    }
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderContent = () => {
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
              data={event}
              key={'block'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <VerificationItem
                  block
                  image={item.media.origin}
                  author={item.userCreated}
                  status={item.verifyStatus}
                  title={item.information.title}
                  createdAt={item.submitAt}
                  isUrgent={item.information.isUrgent}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('VerificationDetail', {
                      event: item,
                    });
                  }}
                  onPressVerify={() => {}}
                  onPressUser={() => {
                    navigation.navigate('ProfileView', {
                      userInfo: item.userCreated,
                    });
                  }}
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
              data={event}
              key={'gird'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <VerificationItem
                  grid
                  image={item.media.origin}
                  author={item.userCreated}
                  status={item.verifyStatus}
                  title={item.information.title}
                  createdAt={item.submitAt}
                  isUrgent={item.information.isUrgent}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('VerificationDetail', {
                      event: item,
                    });
                  }}
                  onPressVerify={() => {}}
                  onPressUser={() => {
                    navigation.navigate('ProfileView', {
                      userInfo: item.userCreated,
                    });
                  }}
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
              data={event}
              key={'block'}
              keyExtractor={(item, index) => item._id}
              renderItem={({item, index}) => (
                <VerificationItem
                  block
                  image={
                    // {uri: Utils.getMediaURL(item.media[0].thumbnail)}
                    UserData[0].image
                  }
                  author={item.userCreated}
                  status={item.verifyStatus}
                  title={item.information.title}
                  createdAt={item.submitAt}
                  isUrgent={item.information.isUrgent}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('VerificationDetail', {
                      event: item,
                    });
                  }}
                  onPressVerify={() => {}}
                  onPressUser={() => {
                    navigation.navigate('ProfileView', {
                      userInfo: item.userCreated,
                    });
                  }}
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
      <Header
        title={t('verification')}
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
      {renderContent()}
    </SafeAreaView>
  );
}
