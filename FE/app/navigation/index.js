import React, {useEffect} from 'react';
import {StatusBar, Platform, useColorScheme} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useTheme, BaseSetting} from '@config';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {useSelector} from 'react-redux';
import Selector from '@screens/Selector';

/* Main Stack Navigator */
import Main from './main';
/* Modal Screen only affect iOS */
import Loading from '@screens/Loading';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';

const RootStack = createStackNavigator();

export default function Navigator() {
  const language = useSelector(state => state.application.language);
  const {theme, colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();
  const ref = React.useRef(null);

  useEffect(() => {
    messaging().onNotificationOpenedApp(({data}) => {
      if (data && data.type && ref) {
        ref.current?.navigate(data.type);
      }
    });
  }, []);

  /**
   * init language
   */
  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
      compatibilityJSON: 'v3',
    });
    dispatch(AuthActions.loadLocal());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * when reducer language change
   */
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  /**
   * when theme change
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [colors.primary, isDarkMode]);

  return (
    <NavigationContainer ref={ref} theme={theme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Loading">
        <RootStack.Screen
          name="Loading"
          component={Loading}
          options={{gestureEnabled: false}}
        />
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen
          name="Selector"
          component={Selector}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
