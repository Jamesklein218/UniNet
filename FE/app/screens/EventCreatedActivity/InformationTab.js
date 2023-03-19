import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {useTheme, Images} from '@config';
import {Card, Text, RegisterRole, Button, Icon} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import * as Utils from '@utils';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';

export default function InformationTab(props) {
  const {event, onRefresh} = props;
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const dispatch = useDispatch();
  const [detailState, setDetailState] = useState(false);
  let key = 0;
  if (event == null || event.information == null) {
    return null;
  }
  const renderRole = (item, i) => {
    return (
      <View key={i}>
        <RegisterRole
          style={styles.text}
          name={item.roleName}
          reward={item.socialDay}
          isPublic={item.isPublic}
          status={
            event.eventState != 'FINISH' &&
            event.eventState != 'CLOSING' &&
            event.verifyStatus != 'WAITING' ? (
              <Icon
                name="edit"
                size={15}
                color={colors.primary}
                onPress={() => {
                  navigation.navigate('RoleEdit', {
                    role: item,
                    eventId: event._id,
                    onRefresh,
                  });
                }}
              />
            ) : null
          }
          description={item.description}
          max_register={item.maxRegister}
          permission={item.eventPermission}
        />
      </View>
    );
  };

  const renderAttendance = (item, i) => {
    return (
      <View key={i}>
        <RegisterRole
          style={styles.text}
          name={item.roleName}
          reward={item.socialDay}
          isPublic={item.isPublic}
          isAttendance={true}
          status={
            event.eventState != 'FINISH' &&
            event.eventState != 'CLOSING' &&
            event.verifyStatus != 'WAITING' ? (
              <Icon
                name="edit"
                size={15}
                color={colors.primary}
                onPress={() => {
                  navigation.navigate('RoleEditAtt', {
                    role: item,
                    eventId: event._id,
                    eventStart: event.information.eventStart,
                    eventEnd: event.information.eventEnd,
                    index: i,
                    onRefresh,
                  });
                }}
              />
            ) : null
          }
          description={`Attendance check from ${
            Utils.formatDate(event.information.eventStart) +
            ' ' +
            Utils.formatTime(event.information.eventStart)
          } to ${
            Utils.formatDate(event.information.eventEnd) +
            ' ' +
            Utils.formatTime(event.information.eventEnd)
          }`}
          max_register={item.maxRegister}
          permission={item.eventPermission}
        />
      </View>
    );
  };

  const renderAddedAttendance = (item, i) => {
    console.log(item);
    console.log('event', event);
    return (
      <View key={i}>
        <RegisterRole
          style={styles.text}
          name={item.title}
          reward={0}
          isPublic={true}
          isAttendance={true}
          status={
            event.eventState != 'FINISH' &&
            event.eventState != 'CLOSING' &&
            event.verifyStatus != 'WAITING' ? (
              <Icon
                name="edit"
                size={15}
                color={colors.primary}
                onPress={() => {
                  navigation.navigate('RoleEditAtt', {
                    role: item,
                    eventId: event._id,
                    eventStart: event.information.eventStart,
                    eventEnd: event.information.eventEnd,
                    index: i,
                    onRefresh,
                  });
                }}
              />
            ) : null
          }
          description={`Attendance check from ${
            Utils.formatDate(item.checkStart) +
            ' ' +
            Utils.formatTime(item.checkStart)
          } to ${
            Utils.formatDate(item.checkEnd) +
            ' ' +
            Utils.formatTime(item.checkEnd)
          }`}
          max_register={0}
          permission=""
        />
      </View>
    );
  };

  const renderMedia = media => {
    if (media.length == 0) {
      return null;
    }
    return (
      <View key={t('media')}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <Text headline semibold>
            {t('Images')}
          </Text>
          {event.eventState != 'FINISH' &&
          event.eventState != 'CLOSING' &&
          event.verifyStatus != 'WAITING' ? (
            <View style={{}}>
              <Icon
                name="edit"
                size={20}
                color={colors.primary}
                enableRTL={true}
                onPress={() => {
                  navigation.navigate('EventFormEdit', {eventId: event._id});
                }}
              />
            </View>
          ) : null}
        </View>
        {media.length < 4 ? (
          <View style={styles.contentImageGird}>
            <View style={{flex: 4}}>
              <Card image={{uri: Utils.getMediaURL(event.media[0].original)}}>
                <Text headline semibold whiteColor>
                  {media.length}+
                </Text>
              </Card>
            </View>
          </View>
        ) : (
          <View style={styles.contentImageGird}>
            <View style={{flex: 4, marginRight: 10}}>
              <Card
                image={{uri: Utils.getMediaURL(event.media[0].thumbnail)}}
              />
            </View>
            <View style={{flex: 6}}>
              <View style={{flex: 1}}>
                <Card
                  image={{uri: Utils.getMediaURL(event.media[1].thumbnail)}}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View style={{flex: 6, marginRight: 10}}>
                  <Card
                    image={{uri: Utils.getMediaURL(event.media[2].thumbnail)}}
                  />
                </View>
                <View style={{flex: 4}}>
                  <Card
                    image={{uri: Utils.getMediaURL(event.media[3].thumbnail)}}>
                    <Text headline semibold whiteColor>
                      {media.length}+
                    </Text>
                  </Card>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const submit = eventId => {
    // dispatch(ApplicationActions.onShowLoading());
    const {eventActions} = props;
    EventActions.submitEvent(eventId)
      .then(res => {
        onRefresh();
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in submit event', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  const renderBottom = event => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <Text caption1 semibold grayColor>
            {t('status')}
          </Text>
          <Text title3 primaryColor semibold>
            {event.verifyStatus}
          </Text>
          <Text caption2 primaryColor semibold>
            {/* Message: {event.eventVerification.verifiedMessage} */}
            Message:
          </Text>
          {event.submitAt ? (
            <Text caption1 semibold grayColor style={{marginTop: 5}}>
              {t('submit_time') +
                ': ' +
                Utils.formatDate(event.submitAt) +
                ' at ' +
                Utils.formatTime(event.submitAt)}
            </Text>
          ) : null}
          {event.verifiedAt ? (
            <Text caption1 semibold grayColor style={{marginTop: 5}}>
              {'Verify Time' +
                ': ' +
                Utils.formatDate(event.eventVerification.verifiedAt) +
                ' at ' +
                Utils.formatTime(event.eventVerification.verifiedAt)}
            </Text>
          ) : null}
        </View>
        {event.verifyStatus == 'PREPARING' || event.verifyStatus == 'FAILED' ? (
          <Button
            onPress={() => {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('submit_event_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    submit(event._id);
                  },
                ),
              );
            }}>
            {t('submit')}
          </Button>
        ) : null}
      </View>
    );
  };

  const renderField = (title, detail, sub_detail = null) => {
    return (
      <View
        style={[styles.lineInformation, {borderBottomColor: colors.border}]}
        key={title}>
        <Text body2 grayColor>
          {t(title)}
        </Text>
        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <Text body2 semibold accentColor>
            {detail}
          </Text>
          {sub_detail ? (
            <Text body2 semibold accentColor>
              {sub_detail}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      <ScrollView
        contentContainerStyle={{padding: 10}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {/* {renderMedia(event.media)} */}

        <Text key={key} title1 semibold numberOfLines={1} style={styles.text}>
          {event.information.title}
        </Text>
        <View key={++key}>
          <Text headline semibold style={styles.text}>
            {t('description')}
          </Text>
          <Text
            style={styles.text}
            body2
            lineHeight={20}
            numberOfLines={detailState ? 100 : 4}>
            {event.information.description
              ? event.information.description
              : t('update_later')}
          </Text>
        </View>

        <Text headline semibold style={styles.text}>
          {t('recruitment')}
        </Text>
        <View key={++key}>
          {event.participantRole.map((item, i) => renderRole(item, i))}
        </View>
        {event.eventState != 'FINISH' &&
        event.eventState != 'CLOSING' &&
        event.verifyStatus != 'WAITING' &&
        event.verifyStatus != 'SUCCESSFUL' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RoleAdd', {event, onRefresh});
            }}
            style={{paddingTop: 10}}>
            <View
              style={[
                styles.containRole,
                {
                  backgroundColor: colors.card,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 16,
                },
              ]}>
              <Icon name="plus-circle" size={24} color={colors.primary} />
              <Text body2 style={{paddingLeft: 10}}>
                {t('add_role')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <Text headline semibold style={styles.text}>
          {t('Attendance')}
        </Text>
        <View key={++key}>
          {/* {event.participantRole.map((item, i) => renderAttendance(item, i))} */}
          {event.attendancePeriods.map((item, i) =>
            renderAddedAttendance(item, i),
          )}
        </View>

        {event.eventState != 'FINISH' &&
        event.eventState != 'CLOSING' &&
        event.eventState != 'START' &&
        event.verifyStatus != 'WAITING' &&
        event.verifyStatus != 'SUCCESSFUL' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RoleAddAtt', {event, onRefresh});
            }}
            style={{paddingTop: 10}}>
            <View
              style={[
                styles.containRole,
                {
                  backgroundColor: colors.card,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 16,
                },
              ]}>
              <Icon name="plus-circle" size={24} color={colors.primary} />
              <Text body2 style={{paddingLeft: 10}}>
                Add Attendance
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {renderField(
          'type',
          event.information.type === 0
            ? t('normal')
            : event.information.type === 1
            ? t('chain')
            : t('other'),
        )}
        {renderField(
          'event_start',
          event.information.eventStart
            ? Utils.formatDate(event.information.eventStart)
            : t('update_later'),
          event.information.eventStart
            ? Utils.formatTime(event.information.eventStart)
            : '',
        )}
        {renderField(
          'event_end',
          event.information.eventEnd
            ? Utils.formatDate(event.information.eventEnd)
            : t('update_later'),
          event.information.eventEnd
            ? Utils.formatTime(event.information.eventEnd)
            : '',
        )}
        {renderField(
          'form_start',
          Utils.formatDate(event.information.formStart),
          Utils.formatTime(event.information.formStart),
        )}
        {renderField(
          'form_close',
          Utils.formatDate(event.information.formEnd),
          Utils.formatTime(event.information.formEnd),
        )}
      </ScrollView>
      <View
        style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
        {renderBottom(event)}
      </View>
    </SafeAreaView>
  );
}
