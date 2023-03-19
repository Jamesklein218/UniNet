import React, {useState, useEffect} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import {useTheme} from '@config';
import {Text} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import * as Utils from '@utils';
import QRCode from 'react-native-qrcode-svg';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {bindEventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';
import _ from 'lodash';
import {useSelector} from 'react-redux';
import {Button} from 'react-native';
import {EventActions} from '@actions';

export default function AttendanceTab(props) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {event, onRefresh} = props;
  // const me = props.me.profile;
  const [code, setCode] = useState('');
  const [refreshing] = useState(false);
  const me = useSelector(state => state.auth.profile);
  console.log('test', event);

  // useEffect(() => {
  //   onRefresh();
  // }, []);

  const getQR = () => {
    dispatch(ApplicationActions.onShowLoading());
    EventActions.getQRcode(event._id)
      .then(res => {
        console.log('Res: ', res.data.payload);
        if (res.data.payload === '') {
          alert(
            'Generate QR Code failed. Make sure the attendance period has started',
          );
        } else {
          setCode(res.data.payload);
        }
        dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(ApplicationActions.onHideLoading());
        alert(
          'Generate QR Code failed. Make sure the attendance period has started',
        );
      });
  };

  // if (_.isEmpty(event) || _.isEmpty(me)) return <></>;

  const renderFirstCheckStatus = e => {
    if (_.filter(e.checkedParticipants, i => i == me._id).length > 0) {
      return t('successful');
    } else if (e.startAt * 1000 > Date.now()) {
      return t('not_started');
    } else if (e.endAt * 1000 < Date.now()) {
      return t('failed');
    }
    return t('pending');
  };

  const renderChecking = e => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text caption1 light>
            {e.title}
          </Text>
          <Text headline style={{marginTop: 5}}>
            {renderFirstCheckStatus(e)}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text caption1 light>
            {t('Start')}
          </Text>
          <Text caption1 style={{marginTop: 5}}>
            {Utils.formatDate(e.startAt * 1000)}
          </Text>
          <Text caption1 style={{marginTop: 5}}>
            {Utils.formatTime(e.startAt * 1000)}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text caption1 light>
            {t('End')}
          </Text>
          <Text caption1 style={{marginTop: 5}}>
            {Utils.formatDate(e.endAt * 1000)}
          </Text>
          <Text caption1 style={{marginTop: 5}}>
            {Utils.formatTime(e.endAt * 1000)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{padding: 20, alignItems: 'center'}}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
      {/* {event.userParticipant.qrCode == '' ? null : ( */}
      {code == '' ? null : (
        <View style={styles.code}>
          <QRCode
            // value={event.userParticipant.qrCode}
            value={code}
            // logo={{
            //   url:
            //     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HCMUT_official_logo.png/760px-HCMUT_official_logo.png',
            // }}
            logoSize={30}
            logoMargin={2}
            logoBorderRadius={15}
            logoBackgroundColor="white"
            size={200}
          />
        </View>
      )}
      <View style={styles.contain}>
        <Button full style={{marginTop: 10}} onPress={getQR} title={'Get QR'}>
          'Get QR Code'
        </Button>
        {/* {event.attendancePeriods.map(e => renderChecking(e))} */}
        {!(
          event.eventState == 'FINISH' || event.eventState == 'CLOSING'
        ) ? null : (
          <View>
            <View style={{flexDirection: 'row', marginTop: 25}}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption1 light>
                  {t('leader_confirm')}
                </Text>
                <Text headline style={{marginTop: 5}}>
                  {event.eventConfirmation.confirmedByLeaderAt
                    ? t('successful')
                    : t('pending')}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption1 light>
                  {t('time')}
                </Text>
                <Text headline style={{marginTop: 5}}>
                  {!event.eventConfirmation.confirmedByLeaderAt
                    ? 'Pending'
                    : Utils.formatDateTime(
                        event.eventConfirmation.confirmedByLeaderAt * 1000,
                      )}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 25}}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption1 light>
                  {t('creator_confirm')}
                </Text>
                <Text headline style={{marginTop: 5}}>
                  {event.eventConfirmation.confirmedByCreatorAt
                    ? t('successful')
                    : t('pending')}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption1 light>
                  {t('time')}
                </Text>
                <Text headline style={{marginTop: 5}}>
                  {!event.eventConfirmation.confirmedByCreatorAt
                    ? 'Pending'
                    : Utils.formatDateTime(
                        event.eventConfirmation.confirmedByCreatorAt * 1000,
                      )}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: 25}}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption1 light>
                  {t('mybk_confirm')}
                </Text>
                <Text headline style={{marginTop: 5}}>
                  {event.eventConfirmation.confirmedByCensorAt
                    ? t('successful')
                    : t('pending')}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption1 light>
                  {t('time')}
                </Text>
                <Text headline style={{marginTop: 5}}>
                  {!event.eventConfirmation.confirmedByCensorAt
                    ? 'Pending'
                    : Utils.formatDateTime(
                        event.eventConfirmation.confirmedByCensorAt * 1000,
                      )}
                </Text>
              </View>
            </View>
          </View>
        )}
        {/* <View>
          <View style={styles.line} />
          <View style={{alignItems: 'flex-end'}}>
            <Text caption1 light>
              {t('social_day')}
            </Text>
            <Text title3 semibold>
              {event.socialDay} {t('day')}
            </Text>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}
