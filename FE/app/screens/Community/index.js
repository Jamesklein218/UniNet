import React, {useMemo, useState} from 'react';
import {View, useWindowDimensions, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Text, Icon} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {TabBar, TabView} from 'react-native-tab-view';
import ForumTab from './ForumTab';
import MaterialTab from './MaterialTab';

export default function Community({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const routes = useMemo(
    () => [
      {key: 'FORUM', title: t('forum')},
      {key: 'MATERIAL', title: t('material')},
    ],
    [t],
  );

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, alignItems: 'center', width: 100}}>
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
      case 'FORUM':
        return (
          <ForumTab
            key="1"
            eventType={route.key}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
      case 'MATERIAL':
        return (
          <MaterialTab
            key="1"
            eventType={route.key}
            jumpTo={jumpTo}
            navigation={navigation}
          />
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title={t('Community')} />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <TabView
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          initialLayout={{width: layout.width}}
          onIndexChange={i => setIndex(i)}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(index == 0 ? 'PostCreate' : 'MaterialCreate')
          }
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
    </View>
  );
}
