import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {BaseColor, useTheme, useFont} from '@config';
import {useTranslation} from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import {Icon} from '@components';
import Community from '@screens/Community';
import Notification from '@screens/Notification';
import Walkthrough from '@screens/Walkthrough';
import SignUp from '@screens/SignUp';
import SignIn from '@screens/SignIn';
import ResetPassword from '@screens/ResetPassword';
import ChangePassword from '@screens/ChangePassword';
import ProfileEdit from '@screens/ProfileEdit';
import ChangeLanguage from '@screens/ChangeLanguage';
import PostCreate from '@screens/PostCreate';
import PostDetail from '@screens/PostDetail';
import MaterialCreate from '@screens/MaterialCreate';
import ForumDetail from '@screens/ForumDetail';
import Event from '@screens/Event';
import EventDetail from '@screens/EventDetail';
import EventPreviewBooking from '@screens/EventPreviewBooking';
import EventTicket from '@screens/EventTicket';
import Setting from '@screens/Setting';
import MaterialDetail from '@screens/MaterialDetail';
import Home from '@screens/Home';
import Booking from '@screens/Booking';
import Profile from '@screens/Profile';
import EventVerifiedActivity from '@screens/EventVerifiedActivity';
import EventCreatedActivity from '@screens/EventCreatedActivity';
import EventParticipatedActivity from '@screens/EventParticipatedActivity';
import RoleEdit from '@screens/RoleEdit';
import RoleAdd from '@screens/RoleAdd';
import RoleEditAtt from '@screens/RoleEditAtt';
import RoleAddAtt from '@screens/RoleAddAtt';
import EventFormEdit from '@screens/EventFormEdit';
import Verification from '@screens/Verification';
import VerificationDetail from '@screens/VerificationDetail';
import EventFormCreate from '@screens/EventFormCreate';
import FirstAttendanceDetail from '@screens/FirstAttendanceDetail';
import EventDetailConfirm from '@screens/EventDetailConfirm';
import ParticipantAdd from '@screens/ParticipantAdd';
import PDFList from '@screens/PDFList';
import PDF from '@screens/PDF';
import {useNavigation} from '@react-navigation/native';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState('BottomTabNavigator');

  useEffect(() => {
    messaging().onNotificationOpenedApp(({data}) => {
      if (login && data && data.type && navigation) {
        navigation.navigate(data.type, {eventId: data.eventId, index: 0});
      }
    });

    messaging().getInitialNotification(({data}) => {
      if (login && data && data.type) {
        setInitialRoute(data.type);
      }
    });
  }, [navigation, login]);

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={login ? initialRoute : 'Walkthrough'}>
      {login ? (
        <>
          <MainStack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
          />
          <MainStack.Screen name="Community" component={Community} />
          {/* <MainStack.Screen name="Notification" component={Notification} /> */}
          <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
          <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />

          <MainStack.Screen name="PostDetail" component={PostDetail} />
          <MainStack.Screen name="ForumDetail" component={ForumDetail} />
          <MainStack.Screen name="Event" component={Event} />
          <MainStack.Screen name="EventDetail" component={EventDetail} />
          <MainStack.Screen
            name="EventPreviewBooking"
            component={EventPreviewBooking}
          />
          <MainStack.Screen name="EventTicket" component={EventTicket} />
          <MainStack.Screen name="Setting" component={Setting} />
          <MainStack.Screen name="RoleEdit" component={RoleEdit} />
          <MainStack.Screen name="RoleAdd" component={RoleAdd} />
          <MainStack.Screen name="RoleEditAtt" component={RoleEditAtt} />
          <MainStack.Screen name="RoleAddAtt" component={RoleAddAtt} />
          <MainStack.Screen name="EventFormEdit" component={EventFormEdit} />
          <MainStack.Screen name="Verification" component={Verification} />
          <MainStack.Screen name="ParticipantAdd" component={ParticipantAdd} />
          <MainStack.Screen name="PDFList" component={PDFList} />
          <MainStack.Screen name="PDF" component={PDF} />
          <MainStack.Screen name="ChangePassword" component={ChangePassword} />

          <MainStack.Screen
            name="EventDetailConfirm"
            component={EventDetailConfirm}
          />

          <MainStack.Screen
            name="FirstAttendanceDetail"
            component={FirstAttendanceDetail}
          />

          <MainStack.Screen
            name="VerificationDetail"
            component={VerificationDetail}
          />
          <MainStack.Screen
            name="EventFormCreate"
            component={EventFormCreate}
          />
          <MainStack.Screen name="PostCreate" component={PostCreate} />
          <MainStack.Screen name="MaterialCreate" component={MaterialCreate} />
          <MainStack.Screen name="MaterialDetail" component={MaterialDetail} />

          <MainStack.Screen
            name="EventVerifiedActivity"
            component={EventVerifiedActivity}
          />
          <MainStack.Screen
            name="EventCreatedActivity"
            component={EventCreatedActivity}
          />
          <MainStack.Screen
            name="EventParticipatedActivity"
            component={EventParticipatedActivity}
          />
        </>
      ) : (
        <>
          <MainStack.Screen name="Walkthrough" component={Walkthrough} />
          <MainStack.Screen name="SignUp" component={SignUp} />
          <MainStack.Screen name="SignIn" component={SignIn} />
          <MainStack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const font = useFont();
  const auth = useSelector(state => state.auth);
  const login = auth.login.success;

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: font,
          paddingBottom: 2,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('home'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Booking"
        component={Booking}
        options={{
          title: t('Event'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="bookmark" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Community"
        component={Community}
        options={{
          title: t('Community'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="globe-asia" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: t('notification'),
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="envelope" size={20} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={login ? Profile : Walkthrough}
        options={{
          title: t('account'),
          tabBarIcon: ({color}) => {
            return <Icon solid color={color} name="user-circle" size={20} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
