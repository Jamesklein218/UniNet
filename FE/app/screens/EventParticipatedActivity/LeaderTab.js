import React, {useState} from 'react';
import {View, ScrollView, FlatList, RefreshControl} from 'react-native';
import {
  Text,
  EventProgress,
  EventStartBox,
  StaffDescription,
} from '@components';
import {useTranslation} from 'react-i18next';
import {EventActions} from '@actions';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationActions} from '@actions';
import _ from 'lodash';
import * as Utils from '@utils';
import {useTheme} from '@config';

export default function LeaderTab(props) {
  const {event, onRefresh} = props;
  const me = useSelector(state => state.auth.profile);
  const {navigation} = props;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [refreshing] = useState(false);
  const {colors} = useTheme();
  if (_.isEmpty(event) || _.isEmpty(me)) {
    return null;
  }
  var status = {
    PREPARE: 0,
    START: 1,
    FORM_START: 2,
    FORM_END: 3,
    CHECKING_START: 4,
    CHECKING_END: 5,
    FINISH: 6,
    CLOSING: 7,
  };
  const content = [
    {
      id: '1',
      state: 1,
      step: 'Step 01',
      title: 'First Attendance Check',
      description: 'Event must be started before',
    },
    {
      id: '2',
      state: 3,
      step: 'Step 02',
      title: 'Second Attendance Check',
      description: 'First Check must finished before',
    },
    {
      id: '3',
      state: 6,
      step: 'Step 03',
      title: 'Confirm Report',
      description: 'Event must be ended before',
    },
  ];

  const startEvent = () => {
    dispatch(ApplicationActions.onShowLoading());
    console.log(props);
    EventActions.startEvent(event._id)
      .then(res => {
        console.log('Start event successful', res);
        EventActions.getEventCreatorActivity(event._id)
          .then(res => {
            console.log('Get Created Event Activity Detail successful: ', res);
            dispatch(ApplicationActions.onHideLoading());
          })
          .catch(err => {
            console.log('Error in Get Created Event Activity Detail', err);
            dispatch(ApplicationActions.onHideLoading());
          });
        dispatch(ApplicationActions.onHideLoading());
      })
      .catch(rej => {
        console.log('Error in start event', rej);
        dispatch(ApplicationActions.onHideLoading());
      });
  };

  const endEvent = () => {
    dispatch(ApplicationActions.onShowLoading());
    props.eventActions
      .endEvent(event._id)
      .then(res => {
        console.log('End event successful', res);
        props.eventActions
          .getEventCreatorActivity(event._id)
          .then(res => {
            console.log('Get Created Event Activity Detail successful: ', res);
            dispatch(ApplicationActions.onHideLoading());
          })
          .catch(err => {
            console.log('Error in Get Created Event Activity Detail', err);
            dispatch(ApplicationActions.onHideLoading());
          });
        dispatch(ApplicationActions.onHideLoading());
      })
      .catch(rej => {
        console.log('Error in end event', rej);
        dispatch(ApplicationActions.onHideLoading());
      });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
      <View style={{paddingHorizontal: 0}}>
        <StaffDescription
          image={{uri: Utils.getMediaURL(me.profilePicture.thumbnail)}}
          name={me.name}
          subName={me.email}
          style={{marginTop: 0, marginBottom: 15}}
        />
        <EventStartBox
          eventState={event.eventState}
          eventStatus={event.verifyStatus}
          onPress={() => {
            if (event.eventState == 'PREPARE') {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('start_event_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    startEvent();
                  },
                ),
              );
            } else {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('end_event_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    endEvent();
                  },
                ),
              );
            }
          }}
        />
      </View>
      <Text
        headline
        semibold
        style={{
          marginLeft: 20,
          marginTop: 20,
          marginBottom: 10,
        }}>
        {t('event_progress')}
      </Text>
      <FlatList
        contentContainerStyle={{
          paddingLeft: 5,
          paddingRight: 20,
          paddingBottom: 20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // data={[
        //   ...event.attendancePeriods,
        //   {
        //     _id: 1,
        //     title: 'Confirm Report',
        //     description: 'Event must be ended before',
        //   },
        // ]}
        data={content}
        keyExtractor={(item, index) => item._id}
        renderItem={({item, index}) => (
          <EventProgress
            style={{marginLeft: 15}}
            step={'Step ' + (index + 1)}
            title={item.title}
            description={'Attendance Check'}
            disable={status[event.eventState] < 4 ? true : false}
            onPress={
              item._id == 1
                ? () =>
                    navigation.navigate('EventDetailConfirm', {
                      role: 'LEADER',
                      event,
                      onRefresh,
                      attendance: item,
                      eventId: event._id,
                    })
                : () =>
                    navigation.navigate('FirstAttendanceDetail', {
                      role: 'LEADER',
                      event,
                      onRefresh,
                      attendance: item,
                    })
            }
          />
        )}
      />
    </ScrollView>
  );
}
