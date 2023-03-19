/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useTheme} from '@config';
import {AttendanceCheck, Button, QuantityPicker} from '@components';
import {EventActions} from '@actions';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';

export default function CheckInListTab(props) {
  const {event} = props;
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const [count, setCount] = useState(1);
  const {t} = useTranslation();

  const [userList, setUserList] = useState();

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (event == null) {
    return <></>;
  }

  const onRefresh = () => {
    EventActions.getNthAttendanceList(event._id, count - 1)
      .then(res => {
        console.log('Attendance List success', res);
        setUserList(res.data);
      })
      .catch(err => {
        console.log('AttendanceListTab.js error', JSON.stringify(err));
        setUserList('');
        alert('Check-in Period out of range');
      });
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        flex: 1,
      }}>
      <QuantityPicker
        label={t('attendanceCheckNumber')}
        value={count}
        onValueChange={setCount}
        detail=""
        style={{
          marginTop: 20,
          marginBottom: 10,
          marginLeft: 10,
          borderBottomColor: colors.border,
        }}
        period={1}
        min={1}
      />
      <FlatList
        style={{width: '100%'}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={userList}
        keyExtractor={(item, index) => item._id}
        renderItem={({item, index}) => {
          return (
            <AttendanceCheck
              image={UserData[0].image}
              txtLeftTitle={
                userList[index]?.basicInformation?.fullName
                  ? userList[index]?.basicInformation?.fullName
                  : userList[index]?.name
              }
              txtContent={userList[index].roleName}
              isCancel={false}
            />
          );
        }}
      />
      <View
        style={{
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}>
        <Button full onPress={() => onRefresh()}>
          {t('search')}
        </Button>
      </View>
    </View>
  );
}
