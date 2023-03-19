import React, {useState} from 'react';
import {
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
  Button,
  EventTypeOption,
  QuantityPicker,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
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
  const {role} = props.route.params;
  const roleId = role.roleId;
  const [roleName, setRoleName] = useState(role.roleName);
  const [maxRegister, setMaxRegister] = useState(role.maxRegister.toString());
  const [socialDay, setSocialDay] = useState(role.socialDay);
  const [description, setDescription] = useState(role.description);
  const [eventPermission, setEventPermission] = useState(
    role.eventPermission[0],
  );
  const [errorMsg, setErrorMsg] = useState('');

  const [isPublic, setIsPublic] = useState(role.isPublic);
  console.log('role', role);
  /**
   * @description Call when reminder option switch on/off
   */
  const toggleSwitch = value => {
    setIsPublic(value);
  };

  /**
   * @description Call when add Payment
   */
  const onEditRole = () => {
    // dispatch(ApplicationActions.onShowLoading());
    const data = {
      roleId: roleId,
      roleName: roleName,
      description: description,
      eventPermission: eventPermission,
      socialDay: socialDay,
      maxRegister: maxRegister,
      isPublic: isPublic,
    };

    if (roleName.trim() == '') {
      setErrorMsg('Please provide the Role Name');
      return;
    }

    EventActions.editRole(data, eventId, roleId)
      .then(res => {
        console.log('Edit role successful');
        setErrorMsg('');
        // dispatch(ApplicationActions.onHideLoading());
        onRefresh();

        navigation.goBack();
      })
      .catch(res => {
        setErrorMsg('An error has occured.');
        console.log('Error in edit role', JSON.stringify(res.error));
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
    EventActions.deleteRole(eventId, roleId)
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
        title={t('role_edit')}
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
          <View>
            <Text body2>{t('role_name')}</Text>
            <TextInput
              onChangeText={text => setRoleName(text)}
              placeholder={t('input_role_name')}
              success={true}
              value={roleName}
            />
          </View>

          <View style={{marginTop: 10}}>
            <Text body2>{t('max_register')}</Text>
            <TextInput
              onChangeText={text => setMaxRegister(text)}
              placeholder={t('input_max_register')}
              success={true}
              value={maxRegister}
              keyboardType="numeric"
            />
          </View>

          <View style={{marginTop: 10}}>
            <Text body2>{t('description')}</Text>
            <TextInput
              style={{height: 100}}
              onChangeText={text => setDescription(text)}
              placeholder={t('input_description')}
              success={true}
              value={description}
              multiline={true}
            />
          </View>

          <View style={{marginTop: 10}}>
            <EventTypeOption
              label={t('permission')}
              option={[
                {value: 'REGISTER', text: 'Register'},
                {value: 'LEADER', text: 'Leader'},
                {value: 'SCANNER', text: 'Scanner'},
              ]}
              value={eventPermission}
              onChange={setEventPermission}
            />
          </View>

          <QuantityPicker
            label={t('social_day')}
            value={socialDay}
            onValueChange={setSocialDay}
            detail=""
            style={{marginTop: 20, marginBottom: 10}}
          />

          <View style={[styles.checkDefault, {borderTopColor: colors.border}]}>
            <Text body2>{t('public')}</Text>
            <Switch
              name="angle-right"
              size={18}
              onValueChange={toggleSwitch}
              value={isPublic}
            />
          </View>
        </ScrollView>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            display: 'flex',
          }}>
          <Text style={{color: 'red'}}>{errorMsg}</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <Button style={{flex: 1, marginRight: 10}} onPress={onEditRole}>
              {t('update')}
            </Button>
            <Button
              style={{flex: 1}}
              onPress={() => {
                dispatch(
                  ApplicationActions.onShowPopupSelection(
                    t('remove_event_role_popup_selection'),
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
