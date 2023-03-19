import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Text,
  Card,
  AttendanceCheck,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {bindEventActions} from '@actions';
import {AuthActions, EventActions} from '@actions';
import * as Utils from '@utils';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';
import _ from 'lodash';
import {UserData} from '@data';

export default function ParticipantAdd(props) {
  const {navigation} = props;
  const {event, onRefresh} = props.route.params;
  // console.log(event.participantRole);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [search, setSearch] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    if (keyboardStatus == 'Keyboard Hidden') {
      onPress(search);
    }
  }, [keyboardStatus]);

  const _keyboardDidShow = () => setKeyboardStatus('Keyboard Shown');
  const _keyboardDidHide = () => {
    setKeyboardStatus('Keyboard Hidden');
  };
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [refreshing] = useState(false);

  /**
   * call when search data
   * @param {*} keyword
   */
  const onPress = keyword => {
    console.log(keyword);
    AuthActions.searchUser(keyword)
      .then(res => {
        console.log('Search User successful', res.data);
        setResult(res.data.payload);
      })
      .catch(rej => {
        console.log('Error in Search User', rej);
      });
  };

  const register = (userId, roleId) => {
    // dispatch(ApplicationActions.onShowLoading());
    // const {eventActions} = props;
    const data = {
      userRegister: userId,
      roleId: roleId,
    };
    EventActions.addParticipant(event._id, data)
      .then(res => {
        console.log('Add Register By Creator successful', res);
        // dispatch(ApplicationActions.onHideLoading());
        navigation.goBack();
      })
      .catch(err => {
        console.log('Error in Add Register By Creator', Object.keys(err));
        alert(
          'Add register failed. Make sure your event is verified and register slots are available',
        );
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('participant_add')}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{padding: 20}}>
          <TextInput
            onChangeText={text => setSearch(text)}
            placeholder={t('search')}
            value={search}
            onSubmitEditing={Keyboard.dismiss}
            icon={
              <TouchableOpacity
                onPress={e => {
                  setSearch(e.target.value);
                }}
                style={styles.btnClearSearch}>
                <Icon name="times" size={18} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
          />
          <FlatList
            data={result}
            keyExtractor={(item, index) => item._id}
            renderItem={({item}) => {
              return (
                <AttendanceCheck
                  image={
                    //   {
                    //   uri: Utils.getMediaURL(item.profilePicture.thumbnail),
                    // }
                    UserData[0].image
                  }
                  txtLeftTitle={item.username}
                  txtContent={item.name}
                  onPress={() =>
                    navigation.navigate('Selector', {
                      defaultValue: '',
                      onPress: value => register(item._id, value),
                      option: event.participantRole.map(item => {
                        return {
                          title: item.roleName,
                          value: item.roleId,
                        };
                      }),
                    })
                  }
                  style={{marginBottom: 5}}
                />
              );
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
