import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, TouchableOpacity, Switch, ScrollView} from 'react-native';
import {BaseStyle, BaseSetting, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import styles from './styles';

export default function Setting({navigation}) {
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const forceDark = useSelector(state => state.application.force_dark);
  const font = useSelector(state => state.application.font);

  const [reminders, setReminders] = useState(true);

  /**
   * @description Call when reminder option switch on/off
   */
  const toggleSwitch = value => {
    setReminders(value);
  };

  const darkOption = forceDark
    ? t('always_on')
    : forceDark != null
    ? t('always_off')
    : t('dynamic_system');

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('setting')}
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
        <ScrollView contentContainerStyle={styles.contain}>
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('ChangeLanguage');
            }}>
            <Text body1>{t('language')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                {Utils.languageFromCode(i18n.language)}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('ThemeSetting');
            }}>
            <Text body1>{t('theme')}</Text>
            <View
              style={[styles.themeIcon, {backgroundColor: colors.primary}]}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => navigation.navigate('SelectFontOption')}>
            <Text body1>{t('font')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                {font ?? t('default')}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
            ]}
            onPress={() => {
              navigation.navigate('SelectDarkOption');
            }}>
            <Text body1>{t('dark_theme')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text body1 grayColor>
                {darkOption}
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </View>
          </TouchableOpacity> */}
          <View
            style={[
              styles.profileItem,
              {borderBottomColor: colors.border, borderBottomWidth: 1},
              {paddingVertical: 15},
            ]}>
            <Text body1>{t('reminders')}</Text>
            <Switch size={18} onValueChange={toggleSwitch} value={reminders} />
          </View>
          <View style={styles.profileItem}>
            <Text body1>{t('app_version')}</Text>
            <Text body1 grayColor>
              {BaseSetting.appVersion}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
