import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@config';
import PropTypes from 'prop-types';
import Text from '@components/Text';
import styles from './styles';

export default function Tag(props) {
  const {colors} = useTheme();
  const {
    style,
    textStyle,
    icon,
    primary,
    primaryIcon,
    outline,
    outlineIcon,
    outlineSecondary,
    outlineSecondaryIcon,
    small,
    light,
    gray,
    chip,
    status,
    rate,
    rateSmall,
    sale,
    children,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      {...rest}
      style={StyleSheet.flatten([
        styles.default,
        primary && [styles.primary, {backgroundColor: colors.primary}],
        primaryIcon && styles.primary,
        outline && [
          styles.outline,
          {borderColor: colors.primary, backgroundColor: colors.card},
        ],
        outlineIcon && styles.outline,
        outlineSecondary && styles.outlineSecondary,
        outlineSecondaryIcon && [
          styles.outlineSecondary,
          {borderColor: colors.accent},
        ],
        small && [styles.small, {backgroundColor: colors.primary}],
        light && [styles.light, {backgroundColor: colors.primary}],
        gray && styles.gray,
        chip && [
          styles.chip,
          {backgroundColor: colors.card, borderColor: colors.accent},
        ],
        status && [styles.status, {backgroundColor: colors.primary}],
        rate && [styles.rate, {backgroundColor: colors.primaryLight}],
        rateSmall && [styles.rateSmall, {backgroundColor: colors.primaryLight}],
        sale && [styles.sale, {backgroundColor: colors.primaryLight}],
        style,
      ])}
      activeOpacity={0.9}>
      {icon ? icon : null}
      <Text
        style={StyleSheet.flatten([
          primary && styles.textPrimary,
          primaryIcon && styles.textPrimary,
          outline && [styles.textOutline, {color: colors.primary}],
          outlineIcon && [styles.textOutline, {color: colors.primary}],
          outlineSecondary && [
            styles.textOutlineSecondary,
            {color: colors.accent},
          ],
          outlineSecondaryIcon && [
            styles.textOutlineSecondary,
            {color: colors.accent},
          ],
          small && styles.textSmall,
          light && [styles.textLight, {color: colors.primaryLight}],
          gray && styles.textGray,
          chip && [styles.textChip, {color: colors.accent}],
          status && styles.textStatus,
          rate && styles.textRate,
          rateSmall && styles.textRateSmall,
          sale && styles.textSale,
          textStyle,
        ])}
        numberOfLines={1}>
        {children || 'Tag'}
      </Text>
    </TouchableOpacity>
  );
}

Tag.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  primary: PropTypes.bool,
  primaryIcon: PropTypes.bool,
  outline: PropTypes.bool,
  outlineIcon: PropTypes.bool,
  outlineSecondary: PropTypes.bool,
  outlineSecondaryIcon: PropTypes.bool,
  small: PropTypes.bool,
  light: PropTypes.bool,
  gray: PropTypes.bool,
  chip: PropTypes.bool,
  rate: PropTypes.bool,
  rateSmall: PropTypes.bool,
  status: PropTypes.bool,
  sale: PropTypes.bool,
};

Tag.defaultProps = {
  style: {},
  textStyle: {},
  icon: null,
  primary: false,
  primaryIcon: false,
  outline: false,
  outlineIcon: false,
  outlineSecondary: false,
  outlineSecondaryIcon: false,
  small: false,
  light: false,
  gray: false,
  chip: false,
  status: false,
  rate: false,
  rateSmall: false,
  sale: false,
};
