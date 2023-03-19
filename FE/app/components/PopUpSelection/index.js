import React, {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {View, TouchableOpacity} from 'react-native';
import {useTheme} from '@config';
import {Text} from '@components';
import styles from './styles';
import {channingActions} from '@utils';
import {ApplicationActions} from '@actions';
import {useSelector} from 'react-redux';

export default function PopUpSelection(props) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {visible, data} = useSelector(state => state.popupSelection);

  if (!visible) return null;
  console.log('Data in selection', data);
  return (
    <View style={styles.notification}>
      <View style={styles.contain}>
        <View style={[styles.contentModal, {backgroundColor: colors.card}]}>
          <View style={{padding: 8}}>
            <View style={[styles.item]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text body1 style={{marginHorizontal: 8}}>
                  {data.content}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contentAction}>
            <TouchableOpacity
              style={{padding: 8, marginHorizontal: 24}}
              onPress={() => {
                data.onPressLeft && data.onPressLeft();
                dispatch(ApplicationActions.onHidePopupSelection());
              }}>
              <Text body1 grayColor>
                {data.leftContent}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{padding: 8}}
              onPress={() => {
                data.onPressLeft && data.onPressRight();
                dispatch(ApplicationActions.onHidePopupSelection());
              }}>
              <Text body1 primaryColor>
                {data.rightContent}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
