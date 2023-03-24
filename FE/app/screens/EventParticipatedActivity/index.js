/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import {TabView, TabBar} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {EventActions} from '@actions';
import _ from 'lodash';
import {useDispatch} from 'react-redux';

import ScanningTab from './ScanningTab';
import ForumTab from './ForumTab';
import MaterialTab from './MaterialTab';
import InformationTab from './InformationTab';
import AttendanceTab from './AttendanceTab';
import LeaderTab from './LeaderTab';
import RegisterTab from './RegisterTab';
import {useSelector} from 'react-redux';
import CheckInListTab from './CheckInListTab';

export default function EventParticipatedActivity(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [routes, setRoute] = useState([]);
  const [event, setEvent] = useState(null);
  const me = useSelector(state => state.auth.profile);
  const {eventId} = props.route.params;

  const onRefresh = () => {
    const {eventActions} = props;

    // dispatch(ApplicationActions.onShowLoading());

    EventActions.getEventParticipantActivity(eventId)
      .then(res => {
        console.log('Get Event Participant Activity successful', res.data);
        console.log(me);
        // let userRole = {};
        // res.data.participantRoles.map(e => {
        //   e.registeredParticipants.map(r => {
        //     if (r == me._id) userRole = e;
        //   });
        // });
        // let userParticipant = {};
        // res.data.participants.map(e => {
        //   if (e.userId == me._id) userParticipant = e;
        // });
        setRoute(updateRoute(res.data));
        setEvent({...res.data});
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in Get Event Participant Activity Detail', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const updateRoute = eventDetail => {
    if (!_.isEmpty(eventDetail)) {
      if (_.find(eventDetail.permission, item => item == 'SCANNER')) {
        return [
          {key: 'information', title: t('information')},
          {key: 'register', title: t('register')},
          {key: 'scanning', title: t('scanning')},
          {key: 'checkInList', title: t('checkInList')},
        ];
      } else if (_.find(eventDetail.permission, item => item == 'LEADER')) {
        return [
          {key: 'information', title: t('information')},
          {key: 'leader', title: t('leader')},
          {key: 'register', title: t('register')},
          {key: 'checkInList', title: t('checkInList')},
        ];
      } else {
        return [
          {key: 'information', title: t('information')},
          {key: 'forum', title: 'Forum'},
          {key: 'material', title: 'Material'},
        ];
      }
    }
  };
  if (_.isEmpty(event)) {
    return null;
  }

  // When tab is activated, set what's index value
  const handleIndexChange = i => {
    setIndex(i);
  };

  // Customize UI tab bar
  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, alignItems: 'center', width: 120}}>
          <Text headline semibold={focused} style={{color}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  // Render correct screen container when tab is activated
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'information':
        return (
          <InformationTab
            event={event}
            onRefresh={onRefresh}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'attendance':
        return (
          <AttendanceTab
            event={event}
            onRefresh={onRefresh}
            eventId={props.route.params.eventId}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'leader':
        return (
          <LeaderTab
            event={event}
            onRefresh={onRefresh}
            {...props}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'register':
        return (
          <RegisterTab
            event={event}
            onRefresh={onRefresh}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'scanning':
        return (
          <ScanningTab
            event={event}
            onRefresh={onRefresh}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'checkInList':
        return (
          <CheckInListTab
            event={event}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'forum':
        return (
          <ForumTab event={event} jumpTo={jumpTo} navigation={navigation} />
        );
      case 'material':
        return (
          <MaterialTab event={event} jumpTo={jumpTo} navigation={navigation} />
        );
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Session Detail"
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
        onPressRight={() => {
          navigation.navigate('Home');
        }}
      />
      <TabView
        lazy
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />
      {index == 0 || (
        <TouchableOpacity
          onPress={() => {
            if (index == 1) {
              navigation.navigate('PostCreate');
            } else if (index == 2) {
              navigation.navigate('MaterialCreate');
            }
          }}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            width: 50,
            height: 50,
            backgroundColor: colors.primary,
            borderRadius: 100,
            elevation: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon style={{elevation: 100}} name="plus" size={20} color="#ffff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
