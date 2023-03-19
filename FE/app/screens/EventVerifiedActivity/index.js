import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import {TabView, TabBar} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationActions} from '@actions';

import InformationTab from './InformationTab';

export default function EventVerifiedActivity(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [routes, setRoute] = useState([
    {key: 'information', title: t('information')},
  ]);
  const [event, setEvent] = useState(null);
  const {eventId} = props.route.params;
  const {eventActions} = props;

  const onRefresh = () => {
    // dispatch(ApplicationActions.onShowLoading());
    EventActions.getEventCensorActivity(eventId)
      .then(res => {
        console.log('Get Event Creator Activity successful', res);
        setEvent(res.data);
        // dispatch(ApplicationActions.onHideLoading());
      })
      .catch(err => {
        console.log('Error in Get Event Creator Activity Detail', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (_.isEmpty(event)) return null;

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
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('event_activity')}
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
        renderRight={() => {
          return (
            <Icon
              name="file-alt"
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
          navigation.navigate('EventDetailConfirm', {
            role: 'CENSOR',
            eventId: eventId,
            event: event,
            onRefresh,
          });
        }}
      />
      <TabView
        lazy
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />
    </SafeAreaView>
  );
}
