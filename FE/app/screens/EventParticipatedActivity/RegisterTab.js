import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import {useTheme, Images} from '@config';
import {AttendanceCheck, Icon, Text, Button, TextInput} from '@components';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import * as Utils from '@utils';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';
import styles from './styles';
import _ from 'lodash';
import {UserData} from '@data';

export default function RegisterTab(props) {
  const {event, onRefresh} = props;
  const {t} = useTranslation();
  const {me} = props;
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const [userList, setUserList] = useState(props.event.participant);
  const dispatch = useDispatch();
  if (event == null) {
    return <></>;
  }
  const {navigation} = props;
  console.log(event);

  // useEffect(() => {
  //   async function fetchData() {
  //     await onRefresh();
  //     console.log('Fetch dataaaa');
  //     let userIds = event.participants.map(e => e.userId);
  //     EventActions.getUserListFromId(userIds)
  //       .then(res => {
  //         console.log('Get user successful', res.data.payload.users);
  //         setUserList(res.data.payload.users);
  //         onRefresh();
  //         // dispatch(ApplicationActions.onHideLoading());
  //       })
  //       .catch(err => {
  //         console.log('Error in Remove Register By Creator', err);
  //         // dispatch(ApplicationActions.onHideLoading());
  //       });
  //   }
  //   fetchData();
  // }, []);

  const cancelRegister = userId => {
    // dispatch(ApplicationActions.onShowLoading());
    const {eventActions} = props;
    const data = {
      participantId: userId,
    };
    EventActions.removeParticipant(event._id, data)
      .then(res => {
        console.log('Remove Register By Creator successful', res);
        onRefresh();
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in Remove Register By Creator', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  return (
    <ScrollView
      style={{paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 20}}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
      {/* {event.eventState != 'FINISH' &&
      event.eventState != 'CLOSING' &&
      event.verifyStatus == 'SUCCESSFUL' ? (
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          // onPress={() => onChange('up')}
          onPress={() => {
            navigation.navigate('ParticipantAdd', {eventId: event._id});
          }}>
          <Icon name="plus-circle" size={24} color={colors.primary} />
          <Text body1 style={{paddingLeft: 10}}>
            {t('add_register')}
          </Text>
        </TouchableOpacity>
      ) : null} */}

      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={event.participant}
        keyExtractor={(item, index) => item._id}
        renderItem={({item, index}) => {
          if (userList.length != event.participant.length) {
            return <></>;
          }
          return (
            <AttendanceCheck
              image={
                //   {
                //   uri: Utils.getMediaURL(
                //     userList[index].profilePicture.thumbnail,
                //   ),
                // }
                UserData[0].image
              }
              txtLeftTitle={
                userList[index]?.basicInformation?.fullName
                  ? userList[index]?.basicInformation?.fullName
                  : userList[index]?.name
              }
              txtContent={
                // event.participantRoles.filter(
                //   e => e._id == item.participantRoleId,
                // )[0].roleName
                userList[index].roleName
              }
              isCancel={false}
              //       isCancel={
              //         event.eventState != 'FINISH' &&
              //         event.eventState != 'CLOSING' &&
              //         event.eventVerification.verificationState == 'SUCCESSFUL'
              //           ? true
              //           : false
              //       }
              //       onCancel={() => {
              //         dispatch(
              //           ApplicationActions.onShowPopupSelection(
              //             t('remove_event_participant_popup_selection'),
              //             t('cancel'),
              //             t('confirm'),
              //             () => {},
              //             () => {
              //               cancelRegister(item.userId);
              //             },
              //           ),
              //         );
              //       }}
              //       style={{marginBottom: 5}}
            />
          );
        }}
      />
    </ScrollView>
  );
}
