import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import {AuthActions} from '@actions';

export default function ChangePassword({navigation}) {
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {colors} = useTheme();

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('change_password')}
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
          style={{flex: 1, justifyContent: 'center'}}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              padding: 20,
            }}>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('current_password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setCurrentPassword(text)}
              secureTextEntry={true}
              placeholder="Current Password"
              value={currentPassword}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
              placeholder="Password"
              value={password}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('re_password')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setRepassword(text)}
              secureTextEntry={true}
              placeholder={t('password_confirm')}
              value={repassword}
            />
            <Text style={{color: 'red'}}>{errorMsg}</Text>
            <View style={{paddingVertical: 15}}>
              <Button
                loading={loading}
                full
                onPress={() => {
                  if (repassword !== password) {
                    setErrorMsg('Repassword mismatch');
                  } else {
                    setLoading(true);
                    AuthActions.changePassword(currentPassword, password)
                      .then(e => {
                        setErrorMsg('');
                        navigation.goBack();
                      })
                      .catch(e => {
                        // navigation.goBack();
                        setErrorMsg('Wrong password');
                        setLoading(false);
                        console.log(e);
                      });
                  }
                }}>
                {t('confirm')}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
