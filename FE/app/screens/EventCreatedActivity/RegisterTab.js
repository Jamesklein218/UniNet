/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
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
  if (event == null) {
    return <></>;
  }
  const {participant: registerList} = event;
  const {t} = useTranslation();
  const {me} = props;
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const dispatch = useDispatch();
  const {navigation} = props;

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
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useFocusEffect(
    React.useCallback(async () => {
      await onRefresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const cancelRegister = userId => {
    // dispatch(ApplicationActions.onShowLoading());
    const {eventActions} = props;
    const data = {
      userRegister: userId,
    };
    EventActions.removeParticipant(event._id, data)
      .then(res => {
        console.log('Remove Register By Creator successful');
        onRefresh();
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(() => {
        console.log('Error in Remove Register By Creator');
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
      {event.eventState != 'FINISH' && event.eventState != 'CLOSING' ? (
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          // onPress={() => onChange('up')}
          onPress={() => {
            navigation.navigate('ParticipantAdd', {event: event});
          }}>
          <Icon name="plus-circle" size={24} color={colors.primary} />
          <Text body1 style={{paddingLeft: 10}}>
            {t('add_register')}
          </Text>
        </TouchableOpacity>
      ) : null}

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
          console.log(item);
          return (
            <AttendanceCheck
              image={
                //   {
                //   uri: Utils.getMediaURL(userList[index].profilePicture.filename),
                // }
                UserData[2].image
              }
              txtLeftTitle={
                registerList[index]?.basicInformation?.fullName
                  ? registerList[index]?.basicInformation?.fullName
                  : registerList[index]?.name
              }
              txtContent={
                // event.participantRoles.filter(
                //   e => e._id == item.participantRoleId,
                // )[0].roleName
                registerList[index].roleName
              }
              isCancel={
                event.eventState != 'FINISH' &&
                event.eventState != 'CLOSING' &&
                event.verifyStatus == 'SUCCESSFUL'
                  ? true
                  : false
              }
              onCancel={() => {
                dispatch(
                  ApplicationActions.onShowPopupSelection(
                    t('remove_event_participant_popup_selection'),
                    t('cancel'),
                    t('confirm'),
                    () => {},
                    () => {
                      cancelRegister(item._id);
                    },
                  ),
                );
              }}
              style={{marginBottom: 5}}
            />
          );
        }}
      />
    </ScrollView>
  );
}
