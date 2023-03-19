import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function SignIn({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState({
    id: true,
    password: true,
    errorMsg: '',
  });

  /**
   * call when action login
   *
   */
  const onLogin = async () => {
    if (id == '' || password == '') {
      setErrorMsg('Missing fields.');
      setSuccess({
        ...success,
        id: false,
        password: false,
      });
    } else {
      setLoading(true);
      try {
        await dispatch(
          AuthActions.authentication(
            {id: id.toLowerCase(), password},
            response => {
              setLoading(false);
              navigation.goBack();
            },
          ),
        );
      } catch (error) {
        console.log(error);
        setLoading(false);
        setErrorMsg(error.data);
        setSuccess({
          ...success,
          id: false,
          password: false,
        });
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_in')}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <View style={styles.contain}>
            <TextInput
              onChangeText={text => setId(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  id: true,
                });
                setErrorMsg('');
              }}
              placeholder={t('input_id')}
              success={success.id}
              value={id}
            />
            <TextInput
              style={{marginTop: 10}}
              autoCapitalize={'none'}
              onChangeText={text => setPassword(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
                setErrorMsg('');
              }}
              placeholder={t('input_password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <Text style={{color: 'red', marginTop: 10}}>{errorMsg}</Text>
            <Button
              style={{marginTop: 20}}
              full
              loading={loading}
              onPress={() => {
                onLogin();
              }}>
              {t('sign_in')}
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{marginTop: 25}}>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
