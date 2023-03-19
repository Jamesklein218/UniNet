import React, {useState, useEffect} from 'react';
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
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default function EventFormEdit(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const dispatch = useDispatch();
  const {event, onRefresh} = props.route.params;

  const [title, setTitle] = useState(event.information.title);
  const [unitHeld, setUnitHeld] = useState(event.information.unitHeld);
  const [eventStart, setEventStart] = useState(event.information.eventStart);
  const [eventEnd, setEventEnd] = useState(event.information.eventEnd);
  const [formStart, setFormStart] = useState(event.information.formStart);
  const [formEnd, setFormEnd] = useState(event.information.formEnd);
  const [description, setDescription] = useState(event.information.description);
  const [eventType, setEventType] = useState(event.information.type);
  const [urgent, setUrgent] = useState(event.information.isUrgent);
  console.log('a');

  /**
   * @description Call when reminder option switch on/off
   */
  const toggleSwitch = value => {
    setUrgent(value);
  };

  useEffect(() => {
    // dispatch(ApplicationActions.onShowLoading());
    // const {eventActions} = props;
    // eventActions
    //   .getCreatedEventById(eventId)
    //   .then(res => {
    //     console.log('Get Created Event By Id successful', res);
    //     setTitle(res.data.information.title);
    //     setUnitHeld(res.data.information.unitHeld);
    //     setEventStart(res.data.information.eventStart);
    //     setEventEnd(res.data.information.eventEnd);
    //     setFormStart(res.data.information.formStart);
    //     setFormEnd(res.data.information.formEnd);
    //     setDescription(res.data.information.description);
    //     setUrgent(res.data.information.isUrgent);
    //     dispatch(ApplicationActions.onHideLoading());
    //   })
    //   .catch(err => {
    //     console.log('Error in Get Created Event By Id', err);
    //     dispatch(ApplicationActions.onHideLoading());
    //   });
  }, []);

  // const GooglePlacesInput = () => {
  //   return (
  //     <GooglePlacesAutocomplete
  //       placeholder="Search"
  //       onPress={(data, details = null) => {
  //         // 'details' is provided when fetchDetails = true
  //         console.log('Change');
  //         console.log(data, details);
  //       }}
  //       fetchDetails={true}
  //       onFail={err => console.log(err)}
  //       currentLocation={true}
  //       query={{
  //         key: 'AIzaSyCot56wWh3R96fs3l-SHLyCNS9Zv8SsrxU',
  //         language: 'en',
  //       }}
  //     />
  //   );
  // };

  /**
   * @description Call when add Payment
   */
  const onEditEvent = () => {
    // dispatch(ApplicationActions.onShowLoading());
    const data = {
      title: title,
      // unitHeld: unitHeld,
      description: description,
      type: eventType,
      eventStart: eventStart,
      eventEnd: eventEnd,
      formStart: formStart,
      formEnd: formEnd,
      isUrgent: urgent,
    };
    EventActions.editEvent(event._id, data)
      .then(res => {
        console.log('Edit Event successful', res);
        onRefresh();
        // dispatch(ApplicationActions.onHideLoading());
        navigation.goBack();
      })
      .catch(err => {
        console.log('Error in Edit Event', err);
        // dispatch(ApplicationActions.onHideLoading());
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

  if (eventStart == 0 || eventEnd == 0 || formStart == 0 || formEnd == 0) {
    return null;
  }

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('event_form_edit')}
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
        {/* <View style={{marginTop: 10, flex: 1}}>
          <Text body2>Places</Text>
          <GooglePlacesInput></GooglePlacesInput>
        </View> */}
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button full onPress={() => onEditEvent()}>
            {t('update')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
