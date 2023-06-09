import {combineReducers} from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import EventReducer from './event';
import ForumReducer from './forum';
import PopUpSelection from './popUpSelection';
import NotificationReducer from './notification';
export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  event: EventReducer,
  popupSelection: PopUpSelection,
  forum: ForumReducer,
  notification: NotificationReducer,
});
