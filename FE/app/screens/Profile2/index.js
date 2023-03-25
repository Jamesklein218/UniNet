import React, {useMemo, useState} from 'react';
import {View, Animated, useWindowDimensions} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag} from '@components';
import {UserData} from '@data';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {TabBar, TabView} from 'react-native-tab-view';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import {useSelector} from 'react-redux';

export default function Profile({navigation}) {
  const layout = useWindowDimensions();
  const {colors} = useTheme();
  const {t} = useTranslation();
  const scrollY = new Animated.Value(0);
  const [userData] = useState(UserData[0]);
  const [photo, setPhoto] = useState(null);
  const [index, setIndex] = useState(0);

  const me = useSelector(state => state.auth.profile);

  const imageScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-5, 50],
    extrapolate: 'clamp',
  });

  const routes = useMemo(
    () => [
      {key: 'PROFILE', title: 'Profile'},
      {key: 'SETTING', title: 'Setting'},
    ],
    [],
  );

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      console.log(response);
      if (response) {
        setPhoto(response);
      }
    });
  };
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'PROFILE':
        return <ProfileTab navigation={navigation} />;
      case 'SETTING':
        return <SettingTab navigation={navigation} />;
    }
  };

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

  return (
    <View style={{flex: 1}}>
      <Header
        title="Profile"
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
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <View style={[styles.containField, {backgroundColor: colors.card}]}>
          <View style={styles.contentLeftItem}>
            <Text title2 semibold>
              15
            </Text>
            <Text caption1 grayColor>
              Social Days
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Animated.Image
              source={Images.profile2}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                position: 'absolute',
                alignSelf: 'center',
                bottom: 70,
                transform: [
                  {
                    scale: imageScale,
                  },
                  {
                    translateY: imageTranslateY,
                  },
                ],
              }}
            />
            <Text headline semibold numberOfLines={1}>
              {me.name}
            </Text>
            <Tag primary style={styles.tagFollow} onPress={handleChoosePhoto}>
              Change Image
            </Tag>
          </View>
          <View style={styles.contentLeftItem}>
            <Text title2 semibold>
              3
            </Text>
            <Text caption1 grayColor>
              Posts
            </Text>
          </View>
        </View>
        <TabView
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          initialLayout={{width: layout.width}}
          onIndexChange={i => setIndex(i)}
        />
      </SafeAreaView>
    </View>
  );
}
