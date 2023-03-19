import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, TextInput, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function ResetPassword({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, seteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({email: true});

  /**
   * call when action reset pass
   */
  const onReset = () => {
    if (email == '') {
      setSuccess({
        ...success,
        email: false,
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
        title={t('reset_password')}
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
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              onChangeText={text => seteEmail(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  email: true,
                });
              }}
              placeholder={t('email_address')}
              success={success.email}
              value={email}
              selectionColor={colors.primary}
            />
            <Button
              style={{marginTop: 20}}
              full
              onPress={() => {
                onReset();
              }}
              loading={loading}>
              {t('reset_password')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
