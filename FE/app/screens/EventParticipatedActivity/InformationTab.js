import React, {useState, useEffect} from 'react';
import {View, ScrollView, RefreshControl, SafeAreaView} from 'react-native';
import {useTheme} from '@config';
import {Card, ProfileDetail, Text, Button} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import * as Utils from '@utils';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';
import {UserData} from '@data';

export default function InformationTab(props) {
  const {event, onRefresh} = props;
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const dispatch = useDispatch();
  const [detailState] = useState(false);
  if (event == null || event.information == null) {
    return null;
  }
  let key = 0;

  const unRegister = () => {
    EventActions.unRegisterEvent(event._id)
      .then(res => {
        console.log('Un-register event successful', res);
        navigation.navigate('Home');
        // onRefresh();
      })
      .catch(err => {
        console.log('Error in Un-register event', err);
      });
  };

  const renderBottom = event => {
    return (
      <>
        <View>
          <Text caption1 semibold grayColor>
            {t('status')}
          </Text>
          <Text title3 primaryColor semibold>
            {event.eventEnd == 0 ? 'END' : event.eventState}
          </Text>
          <Text caption1 semibold grayColor style={{marginTop: 5}}>
            {t('social_day') + ': ' + event.suggestSocialDay}
          </Text>
        </View>
        {Date.now() < event.information.formEnd &&
        (event.eventState == 'PREPARE' || event.eventState == 'FORM_START') ? (
          <Button
            onPress={() => {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('cancel_event_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    unRegister();
                  },
                ),
              );
            }}>
            {t('un_register')}
          </Button>
        ) : null}
      </>
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

        {event.information.description ? (
          <View key={++key}>
            <Text headline semibold style={styles.text}>
              {t('description')}
            </Text>
            <Text
              style={styles.text}
              body2
              lineHeight={20}
              numberOfLines={detailState ? 100 : 4}>
              {event.information.description}
            </Text>
          </View>
        ) : null}

        {renderField('participant_role', event.roleName)}
        {renderField('received_social_day', event.suggestSocialDay)}
        {renderField(
          'unit_held',
          event.information.unitHeld
            ? event.information.unitHeld
            : t('update_later'),
        )}
        {renderField(
          'type',
          event.information.type == 0
            ? t('normal')
            : event.information.type == 1
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

        <View style={styles.contentContact}>
          <Text
            title3
            semibold
            style={{
              paddingBottom: 10,
            }}>
            {t('contact')}
          </Text>
        </View>
        <ProfileDetail
          image={
            //   {
            //   uri: Utils.getMediaURL(event.userCreated.profilePicture.thumbnail),
            // }
            UserData[2].image
          }
          textFirst={event.userCreated.name}
          textSecond="CREATOR"
          textThird={event.userCreated.email}
          userId={event.userCreated._id}
          onPress={() =>
            navigation.navigate('ProfileView', {userInfo: event.userCreated})
          }
        />
      </ScrollView>

      <View
        style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
        {renderBottom(event)}
      </View>
    </SafeAreaView>
  );
}
