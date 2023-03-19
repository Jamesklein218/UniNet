import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Animated,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  AttendanceCheck,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {bindEventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';
import * as Utils from '@utils';
import _ from 'lodash';
import {EventActions} from '@actions';

export default function FirstAttendanceDetail(props) {
  const {navigation} = props;
  const {role, event, onRefresh, attendance} = props.route.params;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const [checked, setChecked] = useState(attendance.startAt < Date.now());
  const [participant, setParticipant] = useState(
    attendance.checkedParticipants,
  );
  const [userList, setUserList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      await onRefresh();
      console.log('Fetch dataaaa');
      let userIds = event.participants.map(e => e.userId);
      EventActions.getUserListFromId(userIds)
        .then(res => {
          console.log('Get user successful', res.data.payload.users);
          setUserList(res.data.payload.users);
          onRefresh();
          // dispatch(ApplicationActions.onHideLoading());
        })
        .catch(err => {
          console.log('Error in Remove Register By Creator', err);
          // dispatch(ApplicationActions.onHideLoading());
        });
    }
    fetchData();
  }, []);

  const startFirstCheck = () => {
    dispatch(ApplicationActions.onShowLoading());
    props.eventActions
      .firstCheckStart(event._id)
      .then(res => {
        console.log('Start first attendance check successful', res);
        if (role == 'CREATOR') {
          props.eventActions
            .getEventCreatorActivity(event._id)
            .then(res => {
              console.log(
                'Get Event Creator Activity Detail successful: ',
                res,
              );
              dispatch(ApplicationActions.onHideLoading());
            })
            .catch(err => {
              console.log('Error in Get Event Creator Activity Detail', err);
              dispatch(ApplicationActions.onHideLoading());
            });
        } else if (role == 'LEADER') {
          props.eventActions
            .getEventParticipantActivity(event._id)
            .then(res => {
              console.log(
                'Get Event Participant Activity Detail successful: ',
                res,
              );
              dispatch(ApplicationActions.onHideLoading());
            })
            .catch(err => {
              console.log(
                'Error in Get Event Participant Activity Detail',
                err,
              );
              dispatch(ApplicationActions.onHideLoading());
            });
        }
      })
      .catch(err => {
        console.log('Error in start first attendance check', error);
      });
    dispatch(ApplicationActions.onHideLoading());
  };

  const endFirstCheck = () => {
    dispatch(ApplicationActions.onShowLoading());
    props.eventActions
      .firstCheckEnd(event._id)
      .then(res => {
        console.log('End first attendance check successful', res);
        if (role == 'CREATOR') {
          props.eventActions
            .getEventCreatorActivity(event._id)
            .then(res => {
              console.log(
                'Get Event Creator Activity Detail successful: ',
                res,
              );
              dispatch(ApplicationActions.onHideLoading());
            })
            .catch(err => {
              console.log('Error in Get Event Creator Activity Detail', err);
              dispatch(ApplicationActions.onHideLoading());
            });
        } else if (role == 'LEADER') {
          props.eventActions
            .getEventParticipantActivity(event._id)
            .then(res => {
              console.log(
                'Get Event Participant Activity Detail successful: ',
                res,
              );
              dispatch(ApplicationActions.onHideLoading());
            })
            .catch(err => {
              console.log(
                'Error in Get Event Participant Activity Detail',
                err,
              );
              dispatch(ApplicationActions.onHideLoading());
            });
        }
      })
      .catch(err => {
        console.log('Error in end first attendance check', error);
      });
    dispatch(ApplicationActions.onHideLoading());
  };

  if (checked == null || participant == null) return null;

  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      <Header
        title={'Checking'}
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
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 10}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={userList}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => (
          <AttendanceCheck
            // image={{uri: Utils.getMediaURL(item.profilePicture.thumbnail)}}
            txtLeftTitle={
              userList[index]?.basicInformation?.fullName
                ? userList[index]?.basicInformation?.fullName
                : userList[index]?.username
            }
            txtContent={
              event?.participantRoles.filter(
                e => e._id == item.participantRoleId,
              )[0]?.roleName
            }
            txtRight={t('register')}
            style={{marginBottom: 5}}
          />
        )}
      />
      <View
        style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
        <View>
          <Text caption1 semibold grayColor>
            {t('checked')}
          </Text>
          <Text title3 primaryColor semibold>
            {participant.length} / {event.participants.length}
          </Text>
          <Text caption1 semibold grayColor style={{marginTop: 5}}>
            {t('total')}: {participant.length}
          </Text>
        </View>
        {event.eventState == 'START' ? (
          <Button
            onPress={() => {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('start_event_first_check_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    startFirstCheck();
                  },
                ),
              );
            }}>
            {t('Start Checking')}
          </Button>
        ) : event.eventState == 'FIRST_CHECK' ? (
          <Button
            onPress={() => {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('finish_event_first_check_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    endFirstCheck();
                  },
                ),
              );
            }}>
            {t('Finish Checking')}
          </Button>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}
