import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Animated, TouchableOpacity} from 'react-native';
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  Button,
  RegisterRole,
} from '@components';
import {useTranslation} from 'react-i18next';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Utils from '@utils';
import {EventActions} from '@actions';
import styles from './styles';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {UserData} from '@data';

export default function VerificationDetail(props) {
  const {navigation} = props;
  const deltaY = new Animated.Value(0);
  const heightImageBanner = Utils.scaleWithPixel(150, 1);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const profile = useSelector(state => state.auth.profile);

  const dispatch = useDispatch();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [region] = useState({
    latitude: 10.772075,
    longitude: 106.6572839,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });
  const [loadMoreDescription, setLoadMoreDescription] = useState(false);
  const [numOfLines, setNumOfLines] = useState(0);
  const [event, setEvent] = useState([]);
  const {onRefresh} = props.route.params;

  const onTextLayout = useCallback(e => {
    if (numOfLines === 0) {
      setNumOfLines(e.nativeEvent.lines.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log('verify event', props.route.params.event);
  useEffect(() => {
    getWaitingEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWaitingEvent = () => {
    // dispatch(ApplicationActions.onShowLoading());
    EventActions.getWaitingEventDetail(props.route.params.event._id)
      .then(res => {
        console.log('Get waiting event successful', res);
        setEvent(res.data);
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in get waiting event', err);
      });
  };

  const verify = (status, text) => {
    // dispatch(ApplicationActions.onShowLoading());
    EventActions.verifyEvent(event._id, status, text)
      .then(res => {
        console.log('Verify Event successful', res);
        onRefresh;
        navigation.goBack();
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in verify event', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  if (_.isEmpty(event)) {
    return null;
  }

  const renderBottom = event => {
    if (_.find(profile.role, item => item == 'CENSOR')) {
      return (
        <>
          <View>
            <Text caption1 semibold grayColor>
              {t('status')}
            </Text>
            <Text title3 primaryColor semibold>
              {event.verifyStatus}
            </Text>
            <Text caption1 semibold grayColor style={{marginTop: 5}}>
              {t('submit_time') +
                ': ' +
                Utils.formatDate(event.submitAt) +
                ' at ' +
                Utils.formatTime(event.submitAt)}
            </Text>
          </View>
          <Button
            onPress={() =>
              navigation.navigate('Selector', {
                defaultValue: 1,
                onPress: verify,
                option: [
                  {
                    title: 'SUCCESSFUL',
                    value: 'SUCCESSFUL',
                  },
                  {
                    title: 'FAILED',
                    value: 'FAILED',
                  },
                ],
                onMessage: true,
              })
            }>
            {' '}
            {t('verify')}{' '}
          </Button>
        </>
      );
    }
    return null;
  };

  const renderRole = (item, i) => {
    return (
      <View key={i}>
        <RegisterRole
          style={styles.text}
          name={item.roleName}
          reward={item.socialDay}
          status={
            item.isPublic ? (
              <Text body2 bold lightPrimaryColor>
                {t('public')}
              </Text>
            ) : (
              <Text body2 bold darkPrimaryColor>
                {t('private')}
              </Text>
            )
          }
          max_register={item.maxRegister}
          description={item.description}
          permission={item.eventPermission}
        />
      </View>
    );
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
                Utils.scaleWithPixel(150),
                Utils.scaleWithPixel(150),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Image source={Images.cover2} style={{flex: 1}} />
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
            <Image
              source={
                // {
                //   uri: Utils.getMediaURL(
                //     event.userCreated.profilePicture.thumbnail,
                //   ),
                // }
                UserData[1].image
              }
              style={styles.userIcon}
            />
            <View style={{alignItems: 'flex-start'}}>
              <Text headline semibold whiteColor>
                {event.userCreated.name}
              </Text>
              <Text footnote whiteColor>
                {event.userCreated.email}
              </Text>
            </View>
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
          <View style={{height: 140 - heightHeader}} />
          <View style={{paddingHorizontal: 20, marginBottom: 20}}>
            <Text title1 semibold numberOfLines={1} style={styles.text}>
              {event.information.title}
            </Text>

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
            <Text body2 grayColor style={styles.text}>
              {t('update_later')}
            </Text>
            <View style={{...styles.text, height: 180}}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChange={() => {}}>
                <Marker
                  coordinate={{
                    latitude: 10.772075,
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
              {event.information.type == 0
                ? 'General'
                : event.information.type == 1
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
        </ScrollView>

        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          {renderBottom(event)}
        </View>
      </SafeAreaView>
    </View>
  );
}
