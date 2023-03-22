import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  Button,
  EventCard,
  RegisterRole,
} from '@components';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import {EventActions} from '@actions';
import styles from './styles';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default function EventDetail(props) {
  const {navigation} = props;
  const deltaY = new Animated.Value(0);
  const heightImageBanner = Utils.scaleWithPixel(140, 1);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const me = useSelector(state => state.auth.profile);
  const [region] = useState({
    latitude: 10.772075,
    longitude: 106.6572839,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [loadMoreDescription, setLoadMoreDescription] = useState(false);
  const [numOfLines, setNumOfLines] = useState(0);
  const [event, setEvent] = useState(null);
  const [relatedEvent, setRelatedEvent] = useState([]);
  const {eventId, index} = props.route.params;
  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    // dispatch(ApplicationActions.onShowLoading());
    EventActions.getEventById(eventId)
      .then(res => {
        console.log('Get Open Event Detail successful', res.data);
        setEvent(res.data);
        setRelatedEvent([]);
        console.log(res.data);
        console.log('rôle', res.data.participantRole);
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in get open event detail', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  const onTextLayout = useCallback(e => {
    if (numOfLines == 0) {
      setNumOfLines(e.nativeEvent.lines.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = roleId => {
    console.log(roleId);
    EventActions.registerEvent(event._id, roleId)
      .then(res => {
        console.log('Register event successful', res);
        navigation.pop();
        navigation.navigate('EventParticipatedActivity', {eventId: event._id});
      })
      .catch(err => {
        console.log('Error in register event', err);
      });
  };

  const unRegister = roleId => {
    EventActions.unRegisterEvent(event._id, roleId)
      .then(res => {
        console.log('Register event successful', res);
        navigation.pop();
        navigation.navigate('Home');
      })
      .catch(err => {
        console.log('Error in register event', err);
      });
  };

  if (_.isEmpty(event)) {
    return null;
  }

  const renderBottom = event => {
    let isRegistered = _.find(event.participantRole, item =>
      _.find(item.registerList, e => e == me._id),
    );
    console.log(me._id);
    if (
      event.information.formStart > Date.now() ||
      event.information.formEnd < Date.now()
    ) {
      return <></>;
    }
    return (
      <>
        <View />
        {!isRegistered ? (
          <Button
            onPress={() =>
              navigation.navigate('Selector', {
                defaultValue: '',
                onPress: register,
                placeholder: 'No Available Slots',
                option: _.filter(event.participantRole, item => {
                  console.log('role', item);
                  return (
                    item.isPublic && item.registerList.length < item.maxRegister //fix lại
                  );
                }).map(item => {
                  return {
                    title: item.roleName,
                    value: item.roleId,
                  };
                }),
              })
            }>
            {t('register')}
          </Button>
        ) : (
          <Button onPress={() => unRegister()}>{t('un_register')}</Button>
        )}
      </>
    );
  };

  const renderRole = (item, i) => {
    if (!item.isPublic) {
      return null;
    }
    return (
      <View key={i}>
        <RegisterRole
          style={styles.text}
          name={item.roleName}
          reward={item.socialDay}
          status={
            item.registerList.length < item.maxRegister ? (
              <Text body2 bold lightPrimaryColor>
                {t('available')}
              </Text>
            ) : (
              <Text body2 bold darkPrimaryColor>
                {t('full')}
              </Text>
            )
          }
          max_register={item.maxRegister}
          description={item.description}
        />
      </View>
    );
  };

  const renderParticipant = participant => {
    // if (participant.length > 1)
    //   return (
    //     <ProfileGroup
    //       name={
    //         event.participant[0].firstName +
    //         ', ' +
    //         event.participant[1].firstName
    //       }
    //       detail={event.participant.length}
    //       users={
    //         participant.length == 2
    //           ? [
    //               {
    //                 image: {
    //                   uri: Utils.getMediaURL(
    //                     event.participant[0].profilePicture.thumbnail,
    //                   ),
    //                 },
    //               },
    //               {
    //                 image: {
    //                   uri: Utils.getMediaURL(
    //                     event.participant[1].profilePicture.thumbnail,
    //                   ),
    //                 },
    //               },
    //             ]
    //           : [
    //               {
    //                 image: {
    //                   uri: Utils.getMediaURL(
    //                     event.participant[0].profilePicture.thumbnail,
    //                   ),
    //                 },
    //               },
    //               {
    //                 image: {
    //                   uri: Utils.getMediaURL(
    //                     event.participant[1].profilePicture.thumbnail,
    //                   ),
    //                 },
    //               },
    //               {
    //                 image: {
    //                   uri: Utils.getMediaURL(
    //                     event.participant[2].profilePicture.thumbnail,
    //                   ),
    //                 },
    //               },
    //             ]
    //       }
    //     />
    //   );

    return null;
  };

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Image
          source={Images[`event${(Number(index) % 7) + 1}`]}
          style={{flex: 1}}
        />
        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            width: '100%',
            bottom: 15,
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}>
          <TouchableOpacity
            style={styles.rowBanner}
            onPress={() =>
              navigation.navigate('ProfileView', {userInfo: event.userCreated})
            }>
            {/* <Image
              source={{
                uri: Utils.getMediaURL(
                  event.userCreated.profilePicture.thumbnail,
                ),
              }}
              style={styles.userIcon}
            /> */}
            {/* <View style={{alignItems: 'flex-start'}}>
              <Text headline semibold whiteColor>
                {event.userCreated.name}
              </Text>
              <Text footnote whiteColor>
                {event.userCreated.email}
              </Text>
            </View> */}
          </TouchableOpacity>
          <Tag rateSmall>
            {' '}
            {Math.round(
              event.information.formEnd - Date.now() < 0
                ? 0
                : (event.information.formEnd - Date.now()) /
                    (1000 * 60 * 60 * 24),
            )}{' '}
            {t('days_left')}{' '}
          </Tag>
        </Animated.View>
      </Animated.View>
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        {/* Header */}
        <Header
          title=""
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={BaseColor.whiteColor}
                enableRTL={true}
              />
            );
          }}
          // renderRight={() => {
          //   return (
          //     <Icon name="images" size={20} color={BaseColor.whiteColor} />
          //   );
          // }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          // onPressRight={() => {
          //   navigation.navigate('PreviewImage');
          // }}
        />
        <ScrollView
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: deltaY}}}],
            {useNativeDriver: false},
          )}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          <View style={{height: 150 - heightHeader}} />
          <View style={{paddingHorizontal: 20, marginBottom: 20}}>
            <Text title1 semibold numberOfLines={1} style={styles.text}>
              {event.information.title}
            </Text>

            {renderParticipant(event.participant)}

            <Text body2 semibold style={styles.text}>
              {t('title')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {event.information.title}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('description')}
            </Text>
            <Text
              body2
              grayColor
              lineHeight={20}
              numberOfLines={
                numOfLines == 0 ? null : loadMoreDescription ? numOfLines : 2
              }
              style={styles.text}
              onTextLayout={onTextLayout}>
              {event.information.description
                ? event.information.description
                : t('update_later')}
            </Text>
            {numOfLines > 2 && (
              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() => {
                  setLoadMoreDescription(!loadMoreDescription);
                }}>
                <Text caption1 accentColor>
                  {loadMoreDescription ? t('show_less') : t('show_more')}
                </Text>
              </TouchableOpacity>
            )}
            <Text body2 semibold style={styles.text}>
              {t('date_time')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {event.information.eventStart
                ? Utils.formatDate(event.information.eventStart) +
                  ' at ' +
                  Utils.formatTime(event.information.eventStart)
                : t('update_later')}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('location')}
            </Text>
            <View style={{...styles.text, height: 180}}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChange={() => {}}>
                <Marker
                  coordinate={{
                    latitude: 10.772205,
                    longitude: 106.6572839,
                  }}
                />
              </MapView>
            </View>
            <Text body2 semibold style={styles.text}>
              {t('unit_held')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {event.information.unitHeld
                ? event.information.unitHeld
                : t('update_later')}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('type')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {event.information.type === 0
                ? 'General'
                : event.information.type === 1
                ? 'Chain'
                : 'Other'}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('event_start')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {event.information.eventStart
                ? Utils.formatDate(event.information.eventStart) +
                  ' ' +
                  t('at') +
                  ' ' +
                  Utils.formatTime(event.information.eventStart)
                : t('update_later')}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('event_end')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {event.information.eventEnd
                ? Utils.formatDate(event.information.eventEnd) +
                  ' ' +
                  t('at') +
                  ' ' +
                  Utils.formatTime(event.information.eventEnd)
                : t('update_later')}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('form_start')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {Utils.formatDate(event.information.formStart) +
                ' ' +
                t('at') +
                ' ' +
                Utils.formatTime(event.information.formStart)}
            </Text>
            <Text body2 semibold style={styles.text}>
              {t('form_close')}
            </Text>
            <Text body2 grayColor style={styles.text}>
              {Utils.formatDate(event.information.formEnd) +
                ' ' +
                t('at') +
                ' ' +
                Utils.formatTime(event.information.formEnd)}
            </Text>
            <View>
              <Text body2 semibold style={styles.text}>
                {t('recruitment')}
              </Text>
              <View style={styles.text}>
                {event.participantRole.map((item, i) => renderRole(item, i))}
              </View>
            </View>
          </View>
          {relatedEvent.length == 0 ? null : (
            <>
              <Text title3 semibold style={{marginLeft: 20, marginBottom: 20}}>
                {t('you_may_also_like')}
              </Text>
              <FlatList
                contentContainerStyle={{
                  paddingLeft: 5,
                  paddingRight: 20,
                  marginBottom: 20,
                }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={relatedEvent}
                keyExtractor={(item, index) => item._id}
                renderItem={({item, index}) => (
                  <EventCard
                    image={{uri: Utils.getMediaURL(item.media[0].thumbnail)}}
                    title={item.information.title}
                    time={item.information.eventStart}
                    location={t('update_later')}
                    onPress={() =>
                      navigation.push('EventDetail', {eventId: item._id})
                    }
                    style={{marginLeft: 15}}
                  />
                )}
              />
            </>
          )}
        </ScrollView>

        {_.find(me.role, item => item == 'STUDENT') &&
        event.userCreated._id !== me._id ? (
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            {renderBottom(event)}
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}
