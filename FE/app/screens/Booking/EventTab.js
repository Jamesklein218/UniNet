import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, Animated, View} from 'react-native';
import {useTheme} from '@config';
import {ActivityBox} from '@components';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import {EventActions} from '@actions';
import {useDispatch, useSelector} from 'react-redux';

export default function EventTab(props) {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const dispatch = useDispatch();
  const event = useSelector(state => state.event);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = React.useCallback(value => {
    dispatch(EventActions.getEventActivity(props.eventType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = item => {
    console.log('a', item);
    return (
      <ActivityBox
        name={item.information.title}
        time={Utils.formatDate(item.information.eventStart)}
        amount={
          t('status') +
          ': ' +
          (props.eventType == 'PARTICIPATED'
            ? item.eventEnd === 0
              ? 'END'
              : item.eventState
            : item.verifyStatus)
        }
        style={{paddingVertical: 10, marginHorizontal: 20}}
        type={item.information.type}
        role={
          props.eventType == 'PARTICIPATED'
            ? t('participator')
            : props.eventType == 'CREATED'
            ? t('creator')
            : t('censor')
        }
        onPress={() => {
          if (props.eventType == 'CREATED') {
            navigation.navigate('EventCreatedActivity', {eventId: item._id});
          } else if (props.eventType == 'VERIFIED') {
            navigation.navigate('EventVerifiedActivity', {eventId: item._id});
          } else {
            navigation.navigate('EventParticipatedActivity', {
              eventId: item._id,
            });
          }
        }}
      />
    );
  };

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
  const navbarTranslate = clampedScroll.interpolate({
    inputRange: [0, 40],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  return (
    <>
      <View style={{padding: 10, paddingBottom: 0, flex: 1}}>
        <FlatList
          data={
            props.eventType == 'PARTICIPATED'
              ? event.eventParticipantHistory.slice().reverse()
              : props.eventType == 'CREATED'
              ? event.eventCreatedHistory.slice().reverse()
              : event.eventVerifiedHistory.slice().reverse()
          }
          keyExtractor={(item, index) => item._id}
          renderItem={({item}) => renderItem(item)}
          refreshing={false}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </>
  );
}
