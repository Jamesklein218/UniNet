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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';

export default function EventFormCreate(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [unitHeld, setUnitHeld] = useState('');
  const [eventStart, setEventStart] = useState(0);
  const [eventEnd, setEventEnd] = useState(0);
  const [formStart, setFormStart] = useState(0);
  const [formEnd, setFormEnd] = useState(0);
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState(0);
  const [urgent, setUrgent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activityType, setActivityType] = useState(0);

  /**
   * @description Call when reminder option switch on/off
   */
  const toggleSwitch = value => {
    setUrgent(value);
  };
  const checkEventDate = () => {
    if (!title.trim()) {
      setErrorMsg('Missing title');
      return false;
    }

    if (!eventStart || !eventEnd) {
      setErrorMsg('Missing Event Time');
      return false;
    }

    if (!formStart || !formEnd) {
      setErrorMsg('Missing Form Time');
      return false;
    }

    if (eventStart > eventEnd) {
      setErrorMsg("Invalid Event's period");
      return false;
    }
    if (formStart > formEnd) {
      setErrorMsg("Invalid Form's period");
      return false;
    }
    if (formStart > eventStart) {
      setErrorMsg("Form's period must occurs before Event");
      return false;
    }
    if (formEnd >= eventStart) {
      setErrorMsg("Form's period must occurs before Event");
      return false;
    }
    setErrorMsg('');
    return true;
  };

  /**
   * @description Call when add Payment
   */
  const onCreateEvent = () => {
    dispatch(ApplicationActions.onShowLoading());
    const data = {
      title: title,
      description: description,
      type: eventType,
      isUrgent: urgent,
      eventStart: eventStart,
      eventEnd: eventEnd,
      formStart: formStart,
      formEnd: formEnd,
      // unitHeld: unitHeld,
      // coordinate: [],
    };
    EventActions.createEvent(data)
      .then(res => {
        console.log('Create Event successful', res);
        //dispatch(ApplicationActions.onHideLoading());
        navigation.pop();
        navigation.navigate('EventCreatedActivity', {eventId: res.data});
      })
      .catch(err => {
        console.log('Error in Create Event', err, data);
        //dispatch(ApplicationActions.onHideLoading());
        if (err?.message) {
          setErrorMsg(err?.message);
        }
      });
  };

  const setEventTime = (checkInTime, checkOutTime) => {
    setEventStart(checkInTime);
    setEventEnd(checkOutTime);
  };

  const setFormTime = (checkInTime, checkOutTime) => {
    setFormStart(checkInTime);
    setFormEnd(checkOutTime);
  };

  const onPress = () => {
    if (!checkEventDate()) {
      return;
    }
    dispatch(
      ApplicationActions.onShowPopupSelection(
        t('create_event_popup_selection'),
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
        title={t('event_form_create')}
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
          contentContainerStyle={{padding: 20, paddingTop: 10}}
          keyboardShouldPersistTaps={'handled'}>
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
            <Text body2>{t('event_time')}</Text>
            <EventTime
              checkInTitle={t('event_start')}
              CheckOutTitle={t('event_end')}
              // minDate="2021-03-27"
              // maxDate="2021-04-27"
              checkInTime={eventStart}
              checkOutTime={eventEnd}
              onChange={setEventTime}
            />
          </View>
          <View style={{marginTop: 10}}>
            <Text body2>{t('form_time')}</Text>
            <EventTime
              checkInTitle={t('form_start')}
              CheckOutTitle={t('form_close')}
              // minDate="2021-03-27"
              // maxDate="2021-04-27"
              checkInTime={formStart}
              checkOutTime={formEnd}
              onChange={setFormTime}
            />
          </View>

          <View style={{marginTop: 10}}>
            <EventTypeOption
              label={t('type')}
              option={[
                {value: 0, text: 'Event'},
                {value: 1, text: 'Study Session'},
              ]}
              onChange={value => setActivityType(value)}
              value={activityType}
            />
          </View>

          <View style={{marginTop: 10}}>
            <EventTypeOption
              label={t('property')}
              option={[
                {value: 0, text: 'General'},
                {value: 1, text: 'Chain'},
              ]}
              onChange={value => setEventType(value)}
              value={eventType}
            />
          </View>

          <View style={{marginTop: 20}}>
            <Text body2>{t('unit_held')}</Text>
            <TextInput
              onChangeText={text => setUnitHeld(text)}
              placeholder={t('input_unit_held')}
              success={true}
              value={unitHeld}
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
            <Text body2>Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                console.log('PLaces API test', data, details);
              }}
              minLength={5}
              query={{
                key: Config.GOOGLE_MAPS_API_KEY,
                language: 'vn',
                components: 'country:vn',
              }}
              styles={{
                textInputContainer: {
                  backgroundColor: colors.card,
                  height: 46,
                  borderRadius: 5,
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                },
                textInput: {
                  backgroundColor: colors.card,
                  fontFamily: 'Raleway',
                  flex: 1,
                  // height: '100%',
                  color: colors.text,
                },
              }}
              fetchDetails={true}
              onFail={err => console.log('ERROR', err)}
            />
          </View>

          <View style={[styles.checkDefault, {borderTopColor: colors.border}]}>
            <Text body2>{t('urgent')}</Text>
            <Switch
              name="angle-right"
              size={18}
              onValueChange={toggleSwitch}
              value={urgent}
            />
          </View>
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
