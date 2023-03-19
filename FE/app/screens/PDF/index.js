import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from '@components';
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import Pdf from 'react-native-pdf';
import data from './data';
export default function Profile(props) {
  const {_id} = props.route.params;
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [userData] = useState(UserData[0]);
  const dispatch = useDispatch();

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = () => {
    dispatch(AuthActions.logOut());
  };

  const source = {
    uri: data[_id],
    cache: true,
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Văn Kiện"
        // renderRight={() => {
        //   return <Icon name="bell" size={24} color={colors.primary} />;
        // }}
        // onPressRight={() => {
        //   navigation.navigate('Notification');
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
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
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </SafeAreaView>
    </View>
  );
}
