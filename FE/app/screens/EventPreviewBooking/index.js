import React from 'react';
import {View, ScrollView} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function EventPreviewBooking({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  return (
    <View style={{flex: 1}}>
      <Header
        title={t('preview_booking')}
        subTitle="Booking Number GAX02"
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
        <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 20}}>
          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body1 semibold numberOfLines={1}>
              Truckfighters: Performing Gravity X
            </Text>
            <Text body2 semibold style={{marginTop: 15}}>
              {t('date_time')}
            </Text>
            <Text body2 grayColor style={{marginTop: 10, marginBottom: 20}}>
              Mon 29 Sep, 19:00 - 22:00
            </Text>
            <Text body2 semibold>
              {t('address')}
            </Text>
            <Text body2 grayColor style={{marginVertical: 10}}>
              0408 Collier Falls Apt. 921
            </Text>
          </View>
          <View style={styles.lineTicket}>
            <Text body2>#{t('ticket_general')}</Text>
            <Text body2 semibold>
              1 {t('tickets')}
            </Text>
          </View>
          <View style={styles.lineTicket}>
            <Text body2>#{t('ticket_vip')}</Text>
            <Text body2 semibold>
              2 {t('tickets')}
            </Text>
          </View>
          <View style={styles.lineTicket}>
            <Text body2>#{t('ticket_reserved')}</Text>
            <Text body2 semibold>
              2 {t('tickets')}
            </Text>
          </View>
          <View style={styles.lineTicket}>
            <Text body2>{t('total_ticket')}</Text>
            <Text body2 semibold>
              2 {t('tickets')}
            </Text>
          </View>
        </ScrollView>
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View style={{alignItems: 'flex-start'}}>
            <Text caption1 semibold grayColor>
              2 {t('days')} / 1 {t('night')}
            </Text>
            <Text title3 primaryColor semibold>
              $399.99
            </Text>
            <Text caption1 semibold grayColor style={{marginTop: 5}}>
              2 {t('adults')} / 1 {t('children')}
            </Text>
          </View>
          <Button
            onPress={() =>
              navigation.navigate('CheckOut', {
                bookingType: 'Event',
              })
            }>
            {t('continue')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
