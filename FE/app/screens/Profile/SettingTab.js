import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {BaseStyle, BaseSetting, useTheme} from '@config';
import {SafeAreaView, Icon, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ForumAPI} from '@api';
import * as Utils from '@utils';
import {GET_ALL_POST} from '../../actions/actionTypes';

export default function SettingTab({navigation}) {
  const {t, i18n} = useTranslation();
  const {colors} = useTheme();
  const forceDark = useSelector(state => state.application.force_dark);
  const font = useSelector(state => state.application.font);

  const [refreshing, setRefreshing] = useState(false);

  const {posts} = useSelector(state => state.forum);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      try {
        const {data} = await ForumAPI.getAllPost();
        dispatch({
          type: GET_ALL_POST,
          payload: data.payload,
        });
      } catch (err) {
        console.log(err);
      }
      setRefreshing(false);
    })();
  };

  console.log(posts);

  return (
    <View style={{flex: 1, margin: 20}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
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
