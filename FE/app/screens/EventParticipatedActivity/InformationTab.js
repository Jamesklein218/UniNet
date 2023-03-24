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
import Khoa from '../../assets/images/tndk.jpeg';
import Minh from '../../assets/images/minh.jpeg';
import Hung from '../../assets/images/tqh.jpeg';
import Khoi from '../../assets/images/khoi.jpeg';

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
    return null;
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
          {title}
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
          Ôn thi cuối kỳ 1
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

        {renderField('Location', 'Trường Đại học Bách Khoa')}
        {renderField(
          'Type',
          event.information.type == 0
            ? t('normal')
            : event.information.type == 1
            ? t('chain')
            : t('other'),
        )}
        {renderField('Starts at', '25/03/2023', '8:00 AM')}
        {renderField('Ends at', '25/03/2023', '12:30 AM')}

        <View style={styles.contentContact}>
          <Text
            title3
            semibold
            style={{
              paddingBottom: 10,
            }}>
            Members
          </Text>
        </View>
        <ProfileDetail
          image={Khoa}
          textFirst={'Trần Ngọc Đăng Khoa'}
          textSecond="Creator"
          textThird={'khoa.tranngocdang@hcmut.edu.vn'}
          userId={event.userCreated._id}
          onPress={() =>
            navigation.navigate('ProfileView', {userInfo: event.userCreated})
          }
        />
        <ProfileDetail
          image={Minh}
          textFirst={'Trần Duy Minh'}
          textSecond="Member"
          textThird={'minh.tranduy@hcmut.edu.vn'}
          userId={event.userCreated._id}
          onPress={() =>
            navigation.navigate('ProfileView', {userInfo: event.userCreated})
          }
        />
        <ProfileDetail
          image={Hung}
          textFirst={'Trương Quốc Hưng'}
          textSecond="Member"
          textThird={'hung.truongquoc@hcmut.edu.vn'}
          userId={event.userCreated._id}
          onPress={() =>
            navigation.navigate('ProfileView', {userInfo: event.userCreated})
          }
        />
        <ProfileDetail
          image={Khoi}
          textFirst={'Nguyễn Trần Khôi'}
          textSecond="Member"
          textThird={'khoi.nguyentran@hcmut.edu.vn'}
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
