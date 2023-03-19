import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Icon} from '@components';
import styles from './styles';
import {BaseColor, useTheme} from '@config';

export default function QuantityPicker(props) {
  const {style, small, label, detail, value, onValueChange, min, period} =
    props;
  const {colors} = useTheme();

  const onChange = type => {
    console.log(type);
    if (type == 'up') {
      onValueChange(value + period);
    } else {
      onValueChange(value - period > min ? value - period : min);
    }
  };

  return (
    <View style={[styles.contentPicker, style]}>
      {!small ? (
        <>
          <Text body1 numberOfLines={1} style={{marginLeft: 10}}>
            {label}
          </Text>
          <Text caption1 light style={{marginLeft: 10}}>
            {detail}
          </Text>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => onChange('down')}>
            <Icon name="minus-circle" size={24} color={BaseColor.grayColor} />
          </TouchableOpacity>
          <Text title3 style={{width: 50, textAlign: 'center'}}>
            {value}
          </Text>
          <TouchableOpacity onPress={() => onChange('up')}>
            <Icon name="plus-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text body2 semibold numberOfLines={1}>
            {label}
          </Text>
          <Text caption1 light>
            {detail}
          </Text>

          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => onChange('down')}>
            <Icon name="minus-circle" size={22} color={BaseColor.grayColor} />
          </TouchableOpacity>
          <Text body2 style={{width: 30, textAlign: 'center'}}>
            {value}
          </Text>
          <TouchableOpacity onPress={() => onChange('up')}>
            <Icon name="plus-circle" size={22} color={colors.primary} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

QuantityPicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  small: PropTypes.bool,
  label: PropTypes.string,
  detail: PropTypes.string,
  value: PropTypes.number,
  onValueChange: PropTypes.func,
  min: PropTypes.number,
  period: PropTypes.number,
};

QuantityPicker.defaultProps = {
  style: {},
  small: false,
  label: '',
  detail: '',
  value: 0,
  onValueChange: () => {},
  min: 0,
  period: 0.5,
};
