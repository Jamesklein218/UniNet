import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Icon} from '@components';
import styles from './styles';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {BaseColor, useTheme, DefaultFont} from '@config';
import {useTranslation} from 'react-i18next';

export default function BookingTime(props) {
  const {t} = useTranslation();

  const [markedDatesIn, setMarkedDatesIn] = useState({});
  const [markedDatesOut, setMarkedDatesOut] = useState({});
  const [checkInTime, setCheckInTime] = useState(props.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(props.checkOutTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [startMode, setStartMode] = useState(true);
  const [renderCalendar, setRenderCalendar] = useState(true);
  const {style, onCancel, onChange, minDate, maxDate} = props;
  const {colors} = useTheme();

  const openModal = (startMode = true) => {
    setModalVisible(true);
    setStartMode(startMode);
  };

  const setDaySelected = (selected, startMode = true) => {
    let markedIn = {};
    let markedOut = {};

    if (startMode) {
      markedIn[selected] = {
        selected: true,
        marked: true,
        selectedColor: colors.primary,
      };
      setMarkedDatesIn(markedIn);
      setCheckInTime(selected);
    } else {
      markedOut[selected] = {
        selected: true,
        marked: true,
        selectedColor: colors.primary,
      };
      setMarkedDatesOut(markedOut);
      setCheckOutTime(selected);
    }
  };

  useEffect(() => {
    setRenderCalendar(false);
    setTimeout(() => {
      setRenderCalendar(true);
    }, 250);
  }, [colors.card]);

  useEffect(() => {
    let markedIn = {};
    let markedOut = {};
    markedIn[props.checkInTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    markedOut[props.checkOutTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDatesIn(markedIn);
    setMarkedDatesOut(markedOut);
  }, [props.checkInTime, props.checkOutTime, colors.primary]);

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
        {renderCalendar && (
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
              current={startMode ? checkInTime : checkOutTime}
              minDate={minDate}
              maxDate={maxDate}
              onDayPress={day => {
                setDaySelected(day.dateString, startMode);
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
                  onCancel();
                }}>
                <Text body1>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setStartMode(false);
                  onChange(checkInTime, checkOutTime);
                }}>
                <Text body1 primaryColor>
                  {t('done')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      <TouchableOpacity style={styles.itemPick} onPress={() => openModal()}>
        <Text caption1 light style={{marginBottom: 5}}>
          {t('check_in')}
        </Text>
        <Text headline semibold>
          {checkInTime}
        </Text>
      </TouchableOpacity>
      <View style={[styles.linePick, {backgroundColor: colors.border}]} />
      <TouchableOpacity
        style={styles.itemPick}
        onPress={() => openModal(false)}>
        <Text caption1 light style={{marginBottom: 5}}>
          {t('check_out')}
        </Text>
        <Text headline semibold>
          {checkOutTime}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

BookingTime.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  checkInTime: PropTypes.string,
  checkOutTime: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

BookingTime.defaultProps = {
  style: {},
  checkInTime: '2020-02-25',
  checkOutTime: '2020-02-29',
  minDate: '2019-05-10',
  maxDate: '2020-05-30',
  onCancel: () => {},
  onChange: () => {},
};
