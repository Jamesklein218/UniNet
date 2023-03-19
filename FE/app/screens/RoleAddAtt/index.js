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

export default function RoleAdd(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const dispatch = useDispatch();

  const [roleName, setRoleName] = useState('');
  const [maxRegister, setMaxRegister] = useState('0');
  const [socialDay, setSocialDay] = useState(0);
  const [description, setDescription] = useState('');
  const [eventPermission, setEventPermission] = useState('REGISTER');
  const [isPublic, setIsPublic] = useState(false);
  const [formStart, setFormStart] = useState(0);
  const [formEnd, setFormEnd] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  /**
   * @description Call when reminder option switch on/off
   */
  const toggleSwitch = value => {
    setIsPublic(value);
  };

  const setFormTime = (checkInTime, checkOutTime) => {
    setFormStart(checkInTime);
    setFormEnd(checkOutTime);
  };

  const checkAttDate = () => {
    const {eventStart, eventEnd} = props.route.params.event.information;
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
   * @description Call when add Payment
   */
  const onCreateRole = () => {
    // dispatch(ApplicationActions.onShowLoading());
    const {event, onRefresh} = props.route.params;
    console.log(event);
    if (!checkAttDate()) {
      return;
    }
    const form = {
      title: description,
      startAt: formStart,
      endAt: formEnd,
    };

    EventActions.addRoleAtt(form, event._id)
      .then(res => {
        console.log('Add role successful', res);
        // dispatch(ApplicationActions.onHideLoading());
        onRefresh();
        navigation.goBack();
      })
      .catch(err => {
        console.log('Error in add role', err);
        alert('Invalid Attendance Period');
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={'Attendance Period Add'}
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
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button full onPress={onCreateRole}>
            {t('add')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
