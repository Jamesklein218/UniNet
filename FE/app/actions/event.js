import * as actionTypes from './actionTypes';
import {bindActionCreators} from 'redux';
import {EventAPI} from '@api';
import {call} from 'react-native-reanimated';

const onGetNewsfeed = data => {
  return {
    type: actionTypes.GET_EVENT_NEWSFEED,
    data: data,
  };
};

const onGetUpcoming = data => {
  return {
    type: actionTypes.GET_EVENT_UPCOMING,
    data: data,
  };
};

const onGetEventActivity = data => {
  return {
    type: actionTypes.GET_EVENT_ACTIVITY,
    data: data,
  };
};

const onGetCreatedHistory = data => {
  return {
    type: actionTypes.GET_EVENT_CREATED_HISTORY,
    data,
  };
};

const onGetParticipantHistory = data => {
  return {
    type: actionTypes.GET_EVENT_PARTICIPANT_HISTORY,
    data,
  };
};

const onGetVerifiedHistory = data => {
  return {
    type: actionTypes.GET_EVENT_VERIFIED_HISTORY,
    data,
  };
};

export const getEventNewsfeed = callback => async dispatch => {
  try {
    const res = await EventAPI.getOpenEvent();
    //const res2 = await EventAPI.getUpcomingEvent();
    dispatch(onGetNewsfeed(res.data.payload));
    //dispatch(onGetUpcoming(res2.data.payload));

    callback();
  } catch (err) {
    console.log({error: err, success: false});
  }
};

export const getEventById = async eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getEventById(eventId);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventActivity = option => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      let res;
      switch (option) {
        case 'PARTICIPATED':
          res = await EventAPI.getParticipatedEvent();
          await dispatch(onGetParticipantHistory(res.data.payload));

          break;
        case 'CREATED':
          console.log('CREATED EVENT');
          res = await EventAPI.getCreatedEvent();
          console.log('Loggg', res);
          await dispatch(onGetCreatedHistory(res.data.payload));

          break;
        case 'VERIFIED':
          res = await EventAPI.getVerifiedEvent();
          await dispatch(onGetVerifiedHistory(res.data.payload));
          break;
      }
      resolve({data: res.data, success: true});
    } catch (err) {
      console.log('Err', err);
      reject({error: err, success: false});
    }
  });
};

export const getHomeData = () => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const availableEvent = await EventAPI.getOpenEvent(0);
      const urgentEvent = await EventAPI.getOpenEvent(1);
      resolve({
        availableEvent: availableEvent,
        urgentEvent: urgentEvent,
        success: true,
      });
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getOpenEventDetail = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const event = await EventAPI.getOpenEventById(eventId);
      const relatedEvent = await EventAPI.getOpenEvent(1);
      resolve({
        data: event.data.payload,
        relatedEvent: relatedEvent.data.payload,
        success: true,
      });
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventParticipantActivity = async eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getParticipatedEventById(eventId);
      // await dispatch(onGetParticipantActivity(data.payload));
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

/*
 * Event Register Action
 */
export const registerEvent = async (eventId, roleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.registerEvent(eventId, roleId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const unRegisterEvent = async eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.unRegisterEvent(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getQRcode = eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getQRcode(eventId);
      await getEventParticipantActivity(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

/*
 * Event Leader Action
 */
export const startEvent = eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.startEvent(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const endEvent = eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.endEvent(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const firstCheckStart = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.firstCheckStart(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const secondCheckStart = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.secondCheckStart(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const firstCheckEnd = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.firstCheckEnd(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const secondCheckEnd = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.secondCheckEnd(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventParticipant = (eventId, option) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      let res;
      switch (option) {
        case 'ALL':
          res = await EventAPI.getEventParticipant(eventId);
          break;
        case 'FIRSTCHECK':
          res = await EventAPI.getFirstCheckParticipant(eventId);
          break;
        case 'SECONDCHECK':
          res = await EventAPI.getSecondCheckParticipant(eventId);
          break;
      }
      resolve({data: res.data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventConfirmParticipant = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getEventConfirmParticipant(eventId);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventReportInfo = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getEventReportInfo(eventId);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const confirmEventLeaderReport = (eventId, form) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.confirmEventLeaderReport(eventId, form);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

/*
 * Event Scanner Action
 */
export const checkAttendance = async (eventId, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.checkAttendance(eventId, code);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const verifyCode = async (eventId, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.verifyCode(eventId, code);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getNthAttendanceList = async (eventId, index = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getNthAttendanceList(eventId, index);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const createEvent = async form => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.createEvent(form);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const editEvent = async (eventId, form) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.editEvent(eventId, form);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const submitEvent = async eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.submitEvent(eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const editRole = async (form, eventId, roleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.editRole(form, eventId, roleId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const editRoleAtt = async (dataRes, eventId, index) => {
  console.log(index);
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.editRoleAtt(dataRes, eventId, index);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const addRole = async (form, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.addRole(form, eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const addRoleAtt = async (form, eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.addRoleAtt(form, eventId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const deleteRole = async (eventId, roleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.deleteRole(eventId, roleId);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const deleteRoleAtt = async (eventId, index) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.deleteRoleAtt(eventId, index);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const addParticipant = async (eventId, form) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(form);
      const {data} = await EventAPI.addParticipant(eventId, form);
      // await dispatch(getEventCreatorActivity(eventId));
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const removeParticipant = async (eventId, form) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.removeParticipant(eventId, form);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getUserListFromId = async userIdList => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getUserListFromId(userIdList);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getCreatedEventById = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getCreatedEventById(eventId);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventCreatorActivity = async eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getCreatedEventById(eventId);
      // await dispatch(onGetCreatorActivity(data.payload));
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const confirmEvent = async (eventId, type, note) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.confirmEvent(eventId, type, note);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const editUserSocialDay = (eventId, userId, form) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.editUserSocialDay(eventId, userId, form);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const verifyEvent = async (eventId, status, text) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('TS', status, text, eventId, 'minh');
      const data = await EventAPI.verifyEvent(eventId, status, text);
      console.log('response', data);
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getWaitingEvent = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getWaitingEvent();
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getNotification = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getNotification();
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getNews = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getNews();
      resolve({data: data, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getWaitingEventDetail = eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const event = await EventAPI.getWaitingEventById(eventId);
      resolve({
        data: event.data.payload,
        success: true,
      });
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const getEventCensorActivity = async eventId => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.getVerifiedEventById(eventId);
      // await dispatch(onGetCensorActivity(data.payload));
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

export const confirmEventCensorReport = eventId => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await EventAPI.confirmEventCensorReport(eventId);
      resolve({data: data.payload, success: true});
    } catch (err) {
      reject({error: err, success: false});
    }
  });
};

// Export eventActions
export const eventActions = {
  /* General Controller */
  getEventNewsfeed,
  getEventActivity,
  getEventParticipantActivity,
  getHomeData,
  getOpenEventDetail,
  /* Event Register Controller */
  registerEvent,
  unRegisterEvent,
  getQRcode,
  /* Event Leader Controller */
  startEvent,
  endEvent,
  firstCheckStart,
  secondCheckStart,
  firstCheckEnd,
  secondCheckEnd,
  getEventParticipant,
  getEventConfirmParticipant,
  getEventReportInfo,
  confirmEventLeaderReport,
  /* Event Scanner Controller */
  checkAttendance,
  verifyCode,
  /* Event Creator Controller */
  createEvent,
  submitEvent,
  addRole,
  addParticipant,
  getCreatedEventById,
  getEventCreatorActivity,
  editEvent,
  editRole,
  removeParticipant,
  editUserSocialDay,
  /* Event Censor Controller */
  verifyEvent,
  getWaitingEvent,
  getWaitingEventDetail,
  getEventCensorActivity,
  confirmEventCensorReport,
};

export function bindEventActions(currentActions, dispatch) {
  return {
    ...currentActions,
    eventActions: bindActionCreators(eventActions, dispatch),
  };
}
