import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
  Button,
  EventTime,
} from '@components';
import {useTranslation} from 'react-i18next';
import {EventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';

export default function RoleEdit(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const dispatch = useDispatch();
  const {eventId, onRefresh} = props.route.params;
  const {role: data} = props.route.params;
  const {index} = props.route.params;
  const [description, setDescription] = useState(data.title);
  const [formStart, setFormStart] = useState(
    data.formStart ? data.formStart : data.checkStart,
  );
  const [formEnd, setFormEnd] = useState(
    data.formEnd ? data.formEnd : data.checkEnd,
  );
  const [errorMsg, setErrorMsg] = useState('');
  const setFormTime = (checkInTime, checkOutTime) => {
    setFormStart(checkInTime);
    setFormEnd(checkOutTime);
  };
  console.log(props.route.params);

  const checkAttDate = () => {
    const {eventStart, eventEnd} = props.route.params;
    console.log(eventEnd);
    if (!description.trim()) {
      setErrorMsg('Missing title');
      return false;
    }

    if (!formStart || !formEnd) {
      setErrorMsg('Missing attendance Time');
      return false;
    }

    if (formStart > formEnd) {
      setErrorMsg('Invalid attendance period');
      return false;
    }

    if (formStart < eventStart || formEnd > eventEnd) {
      setErrorMsg('Attendance period must occurs during the event');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  /**
   * @description Call when reminder option switch on/off
   */
  // const toggleSwitch = value => {
  //   setIsPublic(value);
  // };

  /**
   * @description Call when add Payment
   */
  const onEditRole = () => {
    // dispatch(ApplicationActions.onShowLoading());
    const dataRes = {
      title: description,
      checkStart: formStart,
      checkEnd: formEnd,
    };
    console.log('i', index);
    EventActions.editRoleAtt(dataRes, eventId, index)
      .then(res => {
        console.log('Edit role successful', res);
        // dispatch(ApplicationActions.onHideLoading());
        onRefresh();

        navigation.goBack();
      })
      .catch(err => {
        console.log('Error in edit role', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  const onDeleteRole = () => {
    // dispatch(ApplicationActions.onShowLoading());
    // const data = {
    //   permissions: [eventPermission],
    //   roleName: roleName,
    //   description: description,
    //   socialDays: socialDay,
    //   maxRegistration: maxRegister,
    //   isPublic: isPublic,
    // };
    EventActions.deleteRoleAtt(eventId, index)
      .then(res => {
        console.log('Edit role successful', res);
        // dispatch(ApplicationActions.onHideLoading());
        onRefresh();
        navigation.goBack();
      })
      .catch(err => {
        console.log('Error in edit role', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={'Attendance Period'}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flex: 1, padding: 20, paddingTop: 10}}>
          <View style={{marginTop: 10}}>
            <Text body2>{t('title')}</Text>
            <TextInput
              style={{height: 50}}
              onChangeText={text => setDescription(text)}
              placeholder={t('title')}
              success={true}
              value={description}
            />
          </View>
          <Text body2>Check-in time</Text>
          <EventTime
            checkInTitle={t('start')}
            CheckOutTitle={t('close')}
            // minDate="2021-03-27"
            // maxDate="2021-04-27"
            checkInTime={formStart}
            checkOutTime={formEnd}
            onChange={setFormTime}
          />
        </ScrollView>
        <Text style={{paddingHorizontal: 20, color: 'red'}}>{errorMsg}</Text>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Button
            style={{flex: 1, marginRight: 10}}
            onPress={() => {
              if (!checkAttDate()) {
                return;
              }
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('update_event_attendance_period_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    onEditRole();
                  },
                ),
              );
            }}>
            {t('update')}
          </Button>
          <Button
            style={{flex: 1}}
            onPress={() => {
              dispatch(
                ApplicationActions.onShowPopupSelection(
                  t('remove_event_attendance_period_popup_selection'),
                  t('cancel'),
                  t('confirm'),
                  () => {},
                  () => {
                    onDeleteRole();
                  },
                ),
              );
            }}>
            {t('delete')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
