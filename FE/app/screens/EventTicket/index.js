import React from 'react';
import {View, ScrollView} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';

export default function BusTicket({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('tickets')}
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
          <Text headline bold numberOfLines={1}>
            Truckfighters: Performing Gravity X
          </Text>
          <Text caption1 light style={{marginTop: 10}}>
            {t('address')}
          </Text>
          <Text headline style={{marginTop: 5}}>
            0408 Collier Falls Apt. 921
          </Text>
          <Text caption1 light style={{marginTop: 10}}>
            {t('date_time')}
          </Text>
          <Text headline style={{marginTop: 5}}>
            Mon 29 Sep, 19:00 - 22:00
          </Text>
          <View style={styles.line} />
          <View style={styles.code}>
            <Text
              headline
              semibold
              style={{marginTop: 10, textAlign: 'center'}}>
              {t('show_qr_code_title')}
            </Text>
            <Icon
              name="qrcode"
              size={150}
              color={colors.text}
              style={{marginVertical: 10}}
            />
            <Text headline semibold>
              {t('thanks')}
            </Text>
          </View>
        </ScrollView>
        <View style={{margin: 20}}>
          <Button full>{t('download')}</Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
