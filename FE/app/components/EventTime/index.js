import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  SegmentedControlIOSComponent,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Icon} from '@components';
import styles from './styles';
import {Calendar, CalendarList} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {BaseColor, FontFamily, useTheme, DefaultFont} from '@config';
import {useTranslation} from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import * as Utils from '@utils';
import moment from 'moment';

export default function EventTime(props) {
  const {t} = useTranslation();
  const {checkInTitle, CheckOutTitle} = props;

  const [markedDatesIn, setMarkedDatesIn] = useState({});
  const [markedDatesOut, setMarkedDatesOut] = useState({});
  const [checkInTime, setCheckInTime] = useState(props.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(props.checkOutTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [startMode, setStartMode] = useState(true);
  const [isSecond, setIsSecond] = useState(false);
  const [renderCalendar, setRenderCalendar] = useState(true);
  const {style, onCancel, onChange, minDate, maxDate} = props;
  const {colors} = useTheme();

  const openModal = (startMode = true) => {
    if (checkInTime == 0) {
      setCheckInTime(Date.now());
    }
    if (checkOutTime == 0) {
      setCheckOutTime(Date.now());
    }
    setModalVisible(true);
    setStartMode(startMode);
  };

  const setDaySelected = (selected, startMode = true) => {
    let markedIn = {};
    let markedOut = {};

    if (startMode) {
      markedIn[moment(selected).format('YYYY-MM-DD')] = {
        selected: true,
        marked: true,
        selectedColor: colors.primary,
      };
      setMarkedDatesIn(markedIn);
      setCheckInTime(selected);
    } else {
      markedOut[moment(selected).format('YYYY-MM-DD')] = {
        selected: true,
        marked: true,
        selectedColor: colors.primary,
      };
      setMarkedDatesOut(markedOut);
      setCheckOutTime(selected);
    }
  };

  useEffect(() => {
    if (isSecond == false) {
      setRenderCalendar(false);
      setTimeout(() => {
        setRenderCalendar(true);
      }, 250);
    }
  }, [isSecond]);

  useEffect(() => {
    let markedIn = {};
    let markedOut = {};
    markedIn[checkInTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    markedOut[checkOutTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDatesIn(markedIn);
    setMarkedDatesOut(markedOut);
  }, []);
  console.log(1);
  return (
    <View
      style={[styles.contentPickDate, {backgroundColor: colors.card}, style]}>
      <Modal
        isVisible={modalVisible}
        backdropColor="rgba(0, 0, 0, 0.5)"
        backdropOpacity={1}
        animationIn="fadeIn"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        {renderCalendar &&
          (!isSecond ? (
            <View
              style={[styles.contentCalendar, {backgroundColor: colors.card}]}>
              <Calendar
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.card,
                }}
                renderArrow={direction => {
                  return (
                    <Icon
                      name={direction == 'left' ? 'angle-left' : 'angle-right'}
                      size={14}
                      color={colors.primary}
                      enableRTL={true}
                    />
                  );
                }}
                markedDates={startMode ? markedDatesIn : markedDatesOut}
                current={
                  startMode
                    ? moment(checkInTime).format('YYYY-MM-DD')
                    : moment(checkOutTime).format('YYYY-MM-DD')
                }
                minDate={minDate}
                // maxDate={maxDate}
                // showWeekNumbers={true}
                // enableSwipeMonths={true}
                // horizontal={true}
                // pagingEnabled={true}
                // calendarWidth={350}
                onDayPress={day => {
                  console.log(day);
                  setDaySelected(day.timestamp, startMode);
                }}
                monthFormat={'dd-MM-yyyy'}
                theme={{
                  calendarBackground: colors.card,
                  textSectionTitleColor: colors.text,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: colors.primary,
                  dayTextColor: colors.text,
                  textDisabledColor: BaseColor.grayColor,
                  dotColor: colors.primary,
                  selectedDotColor: '#ffffff',
                  arrowColor: colors.primary,
                  monthTextColor: colors.text,
                  textDayFontFamily: DefaultFont,
                  textMonthFontFamily: DefaultFont,
                  textDayHeaderFontFamily: DefaultFont,
                  textMonthFontWeight: 'bold',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 14,
                }}
              />
              <View style={styles.contentActionCalendar}>
                <TouchableOpacity
                  onPress={() => {
                    if (startMode) {
                      setModalVisible(false);
                      setStartMode(true);
                      setCheckInTime(props.checkInTime);
                    } else {
                      setModalVisible(false);
                      setStartMode(false);
                      setCheckOutTime(props.checkOutTime);
                    }
                    setIsSecond(false);
                    onCancel();
                  }}>
                  <Text body1>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // setModalVisible(false);
                    // setStartMode(false);
                    // onChange(checkInTime, checkOutTime);
                    console.log(checkInTime, checkOutTime);
                    setIsSecond(true);
                  }}>
                  <Text body1 primaryColor>
                    {t('done')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={[styles.contentCalendar, {backgroundColor: colors.card}]}>
              <DatePicker
                date={
                  startMode ? new Date(checkInTime) : new Date(checkOutTime)
                }
                onDateChange={time => setDaySelected(time.getTime(), startMode)}
              />

              <View style={styles.contentActionCalendar}>
                <TouchableOpacity
                  onPress={() => {
                    if (startMode) {
                      setModalVisible(false);
                      setStartMode(true);
                      setCheckInTime(props.checkInTime);
                    } else {
                      setModalVisible(false);
                      setStartMode(false);
                      setCheckOutTime(props.checkOutTime);
                    }
                    setIsSecond(false);
                    setRenderCalendar(false);

                    onCancel();
                  }}>
                  <Text body1>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setStartMode(false);
                    setIsSecond(false);
                    onChange(checkInTime, checkOutTime);
                  }}>
                  <Text body1 primaryColor>
                    {t('done')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </Modal>
      <TouchableOpacity style={styles.itemPick} onPress={() => openModal()}>
        <Text caption1 light style={{marginBottom: 5}}>
          {checkInTitle}
        </Text>
        <Text headline semibold>
          {checkInTime == 0 ? '' : Utils.formatDateTime(checkInTime)}
        </Text>
      </TouchableOpacity>
      <View style={[styles.linePick, {backgroundColor: colors.border}]} />
      <TouchableOpacity
        style={styles.itemPick}
        onPress={() => openModal(false)}>
        <Text caption1 light style={{marginBottom: 5}}>
          {CheckOutTitle}
        </Text>
        <Text headline semibold>
          {checkOutTime == 0 ? '' : Utils.formatDateTime(checkOutTime)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

EventTime.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  checkInTime: PropTypes.string,
  checkInTitle: PropTypes.string,
  checkOutTitle: PropTypes.string,
  checkOutTime: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

EventTime.defaultProps = {
  style: {},
  checkInTime: '',
  checkInTitle: '',
  checkOutTitle: '',
  checkOutTime: '',
  minDate: '',
  maxDate: '',
  onCancel: () => {},
  onChange: () => {},
};
