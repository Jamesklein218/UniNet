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
  EventTime,
  EventTypeOption,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';
import {ForumAPI} from '../../api/forum';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default function PostCreate(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const checkEventDate = () => {
    if (title.trim() === '') {
      setErrorMsg('Missing title');
      return false;
    }

    if (content.trim() === '') {
      setErrorMsg('Missing content');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const onCreateEvent = () => {
    ForumAPI.createForumPost(title, content)
      .then(res => {
        console.log('SUCEEDDDDDDDDDDDDD');
        navigation.pop();
      })
      .catch(err => {
        console.log('ERRRRRRORRR', err);
        setErrorMsg('');
      });
  };

  const onPress = () => {
    if (!checkEventDate()) {
      return;
    }
    dispatch(
      ApplicationActions.onShowPopupSelection(
        'Are you sure you want to creat this post?',
        t('cancel'),
        t('confirm'),
        () => {},
        () => {
          onCreateEvent();
        },
      ),
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Create New Post"
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
        <ScrollView contentContainerStyle={{padding: 20, paddingTop: 10}}>
          <View>
            <Text body2>{t('title')}</Text>
            <TextInput
              onChangeText={text => setTitle(text)}
              placeholder={t('input_title')}
              success={true}
              value={title}
            />
          </View>
          <View>
            <Text body2>Content</Text>
            <TextInput
              style={{height: 100}}
              onChangeText={text => setContent(text)}
              placeholder="Input your content here"
              success={true}
              value={content}
            />
          </View>
        </ScrollView>
        {/* <View style={{marginTop: 10, flex: 1}}>
          <Text body2>Places</Text>
          <GooglePlacesInput></GooglePlacesInput>
        </View> */}
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Text style={{color: 'red'}}>{errorMsg}</Text>
          <Button full onPress={() => onPress()}>
            {t('create')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
