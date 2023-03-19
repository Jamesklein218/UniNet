/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from 'app/index.js';
import {BaseSetting} from '@config';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message in background', remoteMessage);
});

AppRegistry.registerComponent(BaseSetting.name, () => App);
