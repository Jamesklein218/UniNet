import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Text, Icon} from '@components';
import {useTranslation} from 'react-i18next';
import {TabView, TabBar} from 'react-native-tab-view';
import styles from './styles';
import EventTab from './EventTab';
import ReportTab from './ReportTab';
import {useSelector} from 'react-redux';
import _ from 'lodash';

export default function Activity(props) {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const profile = useSelector(state => state.auth.profile);

  const me = profile;
  console.log(profile);
  const [index, setIndex] = useState(0);
  const routes = [
    {key: 'PARTICIPATED', title: t('participated_event')},
    // {key: 'CREATED', title: t('created_event')},
    // {key: 'VERIFIED', title: t('verified_event')},
  ];

  me.role &&
    _.map(me.role, item => {
      if (item == 'CREATOR') {
        routes.push({key: 'CREATED', title: t('created_event')});
      } else if (item == 'CENSOR') {
        routes.push({key: 'VERIFIED', title: t('verified_event')});
      }
    });

  const handleIndexChange = index => {
    setIndex(index);
  };

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
        <View style={{flex: 1, alignItems: 'center', width: 100}}>
          <Text headline semibold={focused} style={{color, fontSize: 14}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  // Render correct screen container when tab is activated
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'PARTICIPATED':
        return (
          <EventTab
            key="1"
            eventType={route.key}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'CREATED':
        return (
          <EventTab
            key="2"
            eventType={route.key}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'VERIFIED':
        return (
          <EventTab
            key="3"
            eventType={route.key}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
    }
  };

  /**
   * @description Loading booking item history one by one
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      forceInset={{top: 'always', bottom: 'always'}}>
      <Header title={t('activity_history')} />
      <TabView
        lazy
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('EventFormCreate')}
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
    </SafeAreaView>
  );
}
