import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Button, Icon} from '@components';
import styles from './styles';
import Modal from 'react-native-modal';
import {useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';

export default function EventTypeOption(props) {
  const {t} = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [option, setOption] = useState(props.option);
  const [value, setValue] = useState(props.value);
  const {colors} = useTheme();
  const {style, label, onCancel, onChange} = props;

  useEffect(() => {
    setOption(
      option.map(item => {
        return {
          ...item,
          checked: item.value == value,
        };
      }),
    );
  }, []);

  const openModal = () => {
    setModalVisible(true);
    setOption(
      option.map(item => {
        return {
          ...item,
          checked: item.value == value,
        };
      }),
    );
  };

  const onSelect = select => {
    setOption(
      option.map(item => {
        return {
          ...item,
          checked: item.value == select.value,
        };
      }),
    );
  };

  const onApply = () => {
    const selected = option.filter(item => item.checked);
    console.log(selected);
    if (selected.length > 0) {
      setValue(selected[0].value);
      setModalVisible(false);
      onChange(selected[0].value);
    }
  };

  return (
    <View>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setOption(props.option);
          onCancel();
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, {backgroundColor: colors.card}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {option.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.contentActionModalBottom,
                {borderBottomColor: colors.border},
              ]}
              key={item.value}
              onPress={() => onSelect(item)}>
              <Text body2 semibold primaryColor={item.checked}>
                {item.text}
              </Text>
              {item.checked && (
                <Icon name="check" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          <Button
            full
            style={{marginTop: 10, marginBottom: 20}}
            onPress={() => onApply()}>
            {t('apply')}
          </Button>
        </View>
      </Modal>
      <TouchableOpacity
        style={[styles.contentForm, {backgroundColor: colors.card}, style]}
        onPress={() => openModal()}>
        <Text caption2 light style={{marginBottom: 5}}>
          {label}
        </Text>
        <Text body1>{_.find(option, {value: value}).text}</Text>
      </TouchableOpacity>
    </View>
  );
}

EventTypeOption.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  value: PropTypes.number,
  option: PropTypes.array,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

EventTypeOption.defaultProps = {
  style: {},
  label: '',
  value: 0,
  option: [],
  onCancel: () => {},
  onChange: () => {},
};
