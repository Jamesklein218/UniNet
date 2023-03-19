import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    address: true,
  });

  /**
   * call when action signup
   *
   */
  const onSignUp = () => {
    if (name == '' || email == '' || address == '') {
      setSuccess({
        ...success,
        name: name != '' ? true : false,
        email: email != '' ? true : false,
        address: address != '' ? true : false,
      });
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('SignIn');
      }, 500);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_up')}
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
              onChangeText={text => setName(text)}
              placeholder={t('input_id')}
              success={success.name}
              value={name}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setEmail(text)}
              placeholder={t('input_email')}
              keyboardType="email-address"
              success={success.email}
              value={email}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setAddress(text)}
              placeholder={t('input_address')}
              success={success.address}
              value={address}
            />
            <Button
              full
              style={{marginTop: 20}}
              loading={loading}
              onPress={() => onSignUp()}>
              {t('sign_up')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
