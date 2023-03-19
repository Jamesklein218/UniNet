import * as actionTypes from './actionTypes';
import {AuthAPI} from '@api';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {logToConsole} from 'react-native/Libraries/Utilities/RCTLog';

const onLogin = data => {
  return {
    type: actionTypes.LOGIN,
    data,
  };
};

const onGetProfile = data => {
  return {
    type: actionTypes.GET_PROFILE,
    data,
  };
};

const onLogout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

export const setToken = async token => {
  try {
    const deviceTokenId = JSON.parse(
      await AsyncStorage.getItem('DEVICE_TOKEN_ID'),
    );
    await AsyncStorage.setItem('TOKEN', JSON.stringify(token));
    Promise.resolve();
  } catch (error) {
    // Error saving data
  }
};

export const resetToken = async token => {
  try {
    // await AsyncStorage.removeItem('TOKEN');
    await AsyncStorage.clear();
  } catch (error) {
    // Error saving data
  }
};

export const authentication = (account, callback) => async dispatch => {
  //call api and dispatch action case
  try {
    const res = await AuthAPI.login(account.id, account.password);
    const data = {
      isLogin: res.data.success,
      token: res.data.payload.token,
      success: true,
    };
    console.log('ress', res);
    dispatch(onLogin(data));
    dispatch(getProfile());
    dispatch(setToken(res.data.payload.token));

    if (typeof callback === 'function') {
      callback({success: true});
    }
  } catch (err) {
    throw {data: err.response.data.message, success: false};
  }
};

export const loadLocal = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      console.log(token, 'Token');
      if (token) {
        const data = {
          isLogin: true,
          token: JSON.parse(token),
          success: true,
        };
        await dispatch(onLogin(data));
        await dispatch(getProfile());
        resolve({success: true});
      }
      SplashScreen.hide();
    } catch (err) {
      console.log('Error');
      await dispatch(onLogout());
      await dispatch(resetToken());
      SplashScreen.hide();
      reject(err);
    }
  });
};

export const logOut = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      await dispatch(onLogout());
      await dispatch(resetToken());

      resolve({success: true});
    } catch (err) {
      reject(err);
    }
  });
};

const getProfile = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await AuthAPI.getProfile();
      await dispatch(onGetProfile(data.payload));
      resolve({data: data, success: true});
    } catch (err) {
      console.log(err.response);
      reject({data: err.response.data.message, success: false});
    }
  });
};

export const updateProfile = data => async dispatch => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      await AuthAPI.updateProfile(data);
      await dispatch(getProfile());
      resolve({success: true});
    } catch (err) {
      console.log(err.response);
      reject({data: err.response.data.message, success: false});
    }
  });
};

export const changePassword = async (currentPassword, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('currentPassword: ', currentPassword);
      await AuthAPI.changePassword(currentPassword, newPassword);
      resolve({success: true});
    } catch (err) {
      console.log(err.response);
      reject({data: err.response.data.message, success: false});
    }
  });
};

export const searchUser = async keyword => {
  console.log('user', keyword);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await AuthAPI.searchUser(keyword);
      console.log(response);
      resolve({data: response.data, success: true});
    } catch (err) {
      console.log(err.response);
      reject({data: err.response.data.message, success: false});
    }
  });
};
