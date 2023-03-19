import React, {useState} from 'react';
import {
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
  Button,
  Tag,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';

export default function MaterialCreate(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState({
    ComputerScience: false,
    Chemistry: false,
    Management: false,
  });

  const onCreateEvent = () => {};

  const onPress = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title="Create new Material"
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

          <View
            style={{
              marginTop: 10,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text body2>Tag</Text>
            <Tag
              outline={!tags.ComputerScience}
              primary={tags.ComputerScience}
              onPress={() =>
                setTags({
                  ...tags,
                  ComputerScience: !tags.ComputerScience,
                })
              }
              round
              style={{marginHorizontal: 8}}>
              Computer Science
            </Tag>
            <Tag
              outline={!tags.Chemistry}
              primary={tags.Chemistry}
              onPress={() =>
                setTags({
                  ...tags,
                  Chemistry: !tags.Chemistry,
                })
              }
              round
              style={{marginHorizontal: 8}}>
              Chemistry
            </Tag>
            <Tag
              outline={!tags.Management}
              primary={tags.Management}
              onPress={() =>
                setTags({
                  ...tags,
                  Management: !tags.Management,
                })
              }
              round
              style={{marginHorizontal: 8}}>
              Management
            </Tag>
          </View>
          <TouchableOpacity style={{marginTop: 10}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 20,
                justifyContent: 'center',
              }}>
              <Icon name="upload" color={colors.text} size={48} solid />
              <Text headline semibold style={{paddingVertical: 15}}>
                Upload a file
              </Text>
              <Text body2 style={{textAlign: 'center'}}>
                Upload a file to the forum
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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
