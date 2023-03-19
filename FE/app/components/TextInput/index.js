import React from 'react';
import {TextInput, View, I18nManager} from 'react-native';
import PropTypes from 'prop-types';
import {BaseStyle, BaseColor, useTheme} from '@config';

export default function Index(props) {
  const {colors} = useTheme();
  const cardColor = colors.card;
  const {
    style,
    onChangeText,
    onFocus,
    placeholder,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    icon,
    onSubmitEditing,
    autoCapitalize,
  } = props;
  return (
    <View style={[BaseStyle.textInput, {backgroundColor: cardColor}, style]}>
      <TextInput
        style={{
          fontFamily: 'Raleway',
          flex: 1,
          height: '100%',
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          color: success ? colors.text : colors.primary,
          paddingTop: 5,
          paddingBottom: 5,
        }}
        onChangeText={text => onChangeText(text)}
        onFocus={() => onFocus()}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={success ? BaseColor.grayColor : colors.primary}
        secureTextEntry={secureTextEntry}
        value={value}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
      />
      {icon}
    </View>
  );
}

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeText: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  success: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  icon: PropTypes.node,
  onSubmitEditing: PropTypes.func,
  autoCapitalize: PropTypes.string,
};

Index.defaultProps = {
  style: {},
  onChangeText: text => {},
  onFocus: () => {},
  placeholder: 'Placeholder',
  value: '',
  success: true,
  secureTextEntry: false,
  keyboardType: 'default',
  multiline: false,
  textAlignVertical: 'center',
  icon: null,
  onSubmitEditing: () => {},
  autoCapitalize: 'sentences',
};
