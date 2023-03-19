import React, {useEffect, useState} from 'react';
import {Images, BaseStyle, useTheme} from '@config';
import {
  SafeAreaView,
  Header,
  Icon,
  Text,
  Button,
  ProfileAuthor,
} from '@components';
import {Touchable, TouchableOpacity, View} from 'react-native';
import profileimg from '../../assets/images/avata-02.jpeg';
import * as Utils from '@utils';

export default function MaterialDetail({navigation, route}) {
  const {colors} = useTheme();
  const item = route.params;

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={item.name}
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
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
        <ProfileAuthor
          image={Images.anonymous}
          name={'Anonymous'}
          description={'@anonymous'}
          textRight="May 2022"
          style={{
            marginTop: 20,
          }}
        />
        <Text body2 style={{marginTop: 5}}>
          {item.description}
        </Text>
        <View
          activeOpacity={0.9}
          style={{
            flex: 1,
            minWidth: 200,
            minHeight: 200,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {item.files?.map(item => (
            <Icon
              name={`file-${item}`}
              size={100}
              // style={{heigth: '100%', size: 200}}
              style={{padding: 20}}
              color={colors.primary}
            />
          ))}
        </View>
        <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
          <Button full onPress={() => alert('Downloaded')}>
            Download
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
