import React, {useState} from 'react';
import {RefreshControl, FlatList, View} from 'react-native';
import {BaseStyle, useTheme, Images} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, ListThumbCircle} from '@components';
import {useFocusEffect} from '@react-navigation/native';
import {EventActions} from '@actions';
import * as Utils from '@utils';

export default function Notification({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    console.log('ReFRESH ');
    EventActions.getNotification().then(res => {
      console.log('Call back', res.data);
      setRefreshing(false);
      setNotification(res.data.payload);
    });
  };
  console.log('noti', notification[0]);
  return (
    <View style={{flex: 1}}>
      <Header
        title={t('notification')}
        // renderLeft={() => {
        //   return (
        //     <Icon
        //       name="arrow-left"
        //       size={20}
        //       color={colors.primary}
        //       enableRTL={true}
        //     />
        //   );
        // }}
        // onPressLeft={() => {
        //   navigation.goBack();
        // }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 10}}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={notification}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => (
            <ListThumbCircle
              // image={item.image}
              image={Images.logo}
              txtLeftTitle={item.message}
              txtContent={item.title}
              txtRight={Utils.formatDate(item.createdAt)}
              onPress={() => {
                navigation.navigate('EventDetail', {
                  eventId: item.refId,
                });
              }}
              style={{marginBottom: 5}}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}
