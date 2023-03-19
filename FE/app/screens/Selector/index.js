import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {SafeAreaView, Icon, Text, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function Selector(props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {onPress, option, defaultValue, onMessage, placeholder} =
    props.route.params;
  const [value, setValue] = useState(defaultValue ? defaultValue : undefined);
  const [text, setText] = useState('');
  const onChange = value => {
    onPress(value, text);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <View style={styles.contain}>
        <View style={[styles.contentModal, {backgroundColor: colors.card}]}>
          <View style={{padding: 8}}>
            {!option.length && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text body1 style={{marginHorizontal: 8}}>
                  {placeholder ? placeholder : ''}
                </Text>
              </View>
            )}
            {option.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.item,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: index == option.length - 1 ? 0 : 1,
                    },
                  ]}
                  onPress={() => setValue(item.value)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text body1 style={{marginHorizontal: 8}}>
                      {item.title}
                    </Text>
                  </View>
                  {item.value == value && (
                    <Icon name="check" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
            {onMessage && (
              <TextInput
                style={{marginTop: 10}}
                onChangeText={text => setText(text)}
                placeholder={'Your comment here !!!'}
                // keyboardType="numeric"
                value={text}
              />
            )}
          </View>
          <View style={styles.contentAction}>
            <TouchableOpacity
              style={{padding: 8, marginHorizontal: 24}}
              onPress={() => navigation.goBack()}>
              <Text body1 grayColor>
                {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={value === undefined}
              style={{padding: 8}}
              onPress={() => onChange(value)}>
              <Text body1 primaryColor={value !== undefined} grayColor>
                {t('apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
