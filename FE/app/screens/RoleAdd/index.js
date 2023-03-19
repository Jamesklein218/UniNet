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

  /**
   * @description Call when reminder option switch on/off
   */
  const toggleSwitch = value => {
    setIsPublic(value);
  };

  /**
   * @description Call when add Payment
   */
  const onCreateRole = () => {
    // dispatch(ApplicationActions.onShowLoading());
    const {event, onRefresh} = props.route.params;
    console.log(props);
    const data = {
      eventPermission: [eventPermission],
      roleName: roleName,
      description: description,
      socialDay: socialDay,
      maxRegister: maxRegister,
      isPublic: isPublic,
    };
    EventActions.addRole(data, event._id)
      .then(res => {
        console.log('Add role successful', res);
        // dispatch(ApplicationActions.onHideLoading());
        onRefresh();
        navigation.goBack();
      })
      .catch(err => {
        console.log('Error in add role', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('role_add')}
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
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button full onPress={onCreateRole}>
            {t('add')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
