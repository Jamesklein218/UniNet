import {axios} from '@utils/custom-axios';
import {API_URL} from '@config/setting';

export const EventAPI = {
  getOpenEvent: (urgent = null) => {
    return axios.get(`${API_URL}/event/open`);
  },

  getUpcomingEvent: (urgent = null) => {
    return axios.get(`${API_URL}/events?type=2`);
  },

  getOpenEventById: eventId => axios.get(`${API_URL}/event/open/${eventId}`),

  getMyEvent: () => axios.get(`${API_URL}/me/event`),

  getNotification: () => axios.get(`${API_URL}/me/notification`),

  getEventById: eventId => axios.get(`${API_URL}/event/open/${eventId}`),

  getParticipatedEvent: () => axios.get(`${API_URL}/event/participated`),

  getParticipatedEventById: eventId =>
    axios.get(`${API_URL}/event/participated/${eventId}`),

  getNthAttendanceList: (eventId, index) =>
    axios.get(
      `${API_URL}/event/${eventId}/attendance/nthcheck?index=${index}`,
      {
        params: {index: index},
      },
    ),

  getFirstCheckParticipant: eventId =>
    axios.get(`${API_URL}/event/${eventId}/attendance/firstCheck`),

  getSecondCheckParticipant: eventId =>
    axios.get(`${API_URL}/event/${eventId}/attendance/secondCheck`),

  startEvent: eventId =>
    axios.post(`https://recruitment.fessior.com/event/${eventId}/start`),

  endEvent: eventId => axios.post(`${API_URL}/event/${eventId}/end`),

  firstCheckStart: eventId =>
    axios.post(`${API_URL}/event/${eventId}/attendance/firstCheck/start`),

  secondCheckStart: eventId =>
    axios.post(`${API_URL}/event/${eventId}/attendance/secondCheck/start`),

  firstCheckEnd: eventId =>
    axios.post(`${API_URL}/event/${eventId}/attendance/firstCheck/end`),

  secondCheckEnd: eventId =>
    axios.post(`${API_URL}/event/${eventId}/attendance/secondCheck/end`),

  getEventParticipant: eventId =>
    axios.get(`${API_URL}/event/${eventId}/participant`),

  getEventConfirmParticipant: eventId =>
    axios.get(`${API_URL}/event/${eventId}/confirm/participant`),

  getEventReportInfo: eventId =>
    axios.get(`${API_URL}/event/${eventId}/confirm`),

  confirmEventLeaderReport: (eventId, data) =>
    axios.patch(`${API_URL}/event/${eventId}/confirm/leader`, {...data}),

  registerEvent: (eventId, roleId) =>
    axios.post(`${API_URL}/event/${eventId}/register`, {
      roleId,
    }),

  unRegisterEvent: eventId =>
    axios.patch(`${API_URL}/event/${eventId}/register`),

  getQRcode: eventId => axios.get(`${API_URL}/event/${eventId}/code`),

  checkAttendance: (eventId, code) =>
    axios.post(`${API_URL}/event/${eventId}/check-attendance`, {code: code}),

  verifyCode: (eventId, code) => {
    return axios.post(`${API_URL}/event/${eventId}/code/verify`, {code: code});
  },

  getCreatedEvent: () => axios.get(`${API_URL}/event/created`),

  getNews: () => axios.get(`${API_URL}/news`), //note

  getUserListFromId: userIdList =>
    axios.post(`${API_URL}/users`, {userIdList: userIdList}), //note

  getCreatedEventById: eventId =>
    axios.get(`${API_URL}/event/created/${eventId}`),

  createEvent: data => {
    console.log('Form: ', data);
    return axios.post(`${API_URL}/event`, {
      title: data.title,
      description: data.description,
      type: data.type,
      isUrgent: data.isUrgent,
      eventStart: data.eventStart,
      eventEnd: data.eventEnd,
      formStart: data.formStart,
      formEnd: data.formEnd,
    });
  },

  editEvent: (eventId, data) => {
    console.log('Form: ', data.type);
    return axios.patch(`${API_URL}/event/${eventId}`, {
      title: data.title,
      description: data.description,
      type: data.type,
      isUrgent: data.isUrgent,
      eventStart: data.eventStart,
      eventEnd: data.eventEnd,
      formStart: data.formStart,
      formEnd: data.formEnd,
    });
  },

  editRole: (data, eventId, roleId) => {
    const permission = data.eventPermission;
    console.log('a', permission);
    console.log({
      eventPermission: permission.split,
    });
    return axios.patch(`${API_URL}/event/${eventId}/role`, {
      updatedRole: {
        roleId: roleId,
        eventPermission: permission.split(),
        roleName: data.roleName,
        description: data.description,
        maxRegister: data.maxRegister,
        socialDay: data.socialDay,
        isPublic: data.isPublic,
      },
    });
  },

  editRoleAtt: (data, eventId, index) =>
    axios.patch(`${API_URL}/event/${eventId}/editAttendancePeriod`, {
      index,
      updatedPeriod: {
        title: data.title,
        checkStart: data.checkStart,
        checkEnd: data.checkEnd,
      },
    }),

  submitEvent: eventId => axios.post(`${API_URL}/event/${eventId}/submit`),

  addRole: (data, eventId) => {
    return axios.post(`${API_URL}/event/${eventId}/role`, {
      participantRole: {
        eventPermission: data.eventPermission,
        roleName: data.roleName,
        description: data.description,
        maxRegister: data.maxRegister,
        socialDay: data.socialDay,
        isPublic: data.isPublic,
      },
    });
  },

  addRoleAtt: (form, eventId) => {
    console.log(form);
    return axios.post(`${API_URL}/event/${eventId}/addattendanceperiod`, {
      title: form.title,
      checkStart: form.startAt,
      checkEnd: form.endAt,
    });
  },

  deleteRole: (eventId, roleId) => {
    return axios.post(`${API_URL}/event/${eventId}/deleterole`, {
      roleId: roleId,
    });
  },

  deleteRoleAtt: (eventId, index) => {
    return axios.post(`${API_URL}/event/${eventId}/removeattendanceperiod`, {
      index,
    });
  },

  addParticipant: (eventId, data) =>
    axios.post(`${API_URL}/event/${eventId}/register/by_creator`, {
      ...data,
    }),

  removeParticipant: (eventId, data) =>
    axios.patch(`${API_URL}/event/${eventId}/register/by_creator`, {
      ...data,
    }),
  confirmEvent: (eventId, type, note) =>
    axios.post(`${API_URL}/events/${eventId}/confirm?confirmType=${type}`, {
      note,
    }),

  confirmEventCreatorReport: (eventId, data) =>
    axios.patch(`${API_URL}/event/${eventId}/confirm/creator`, {...data}),

  editUserSocialDay: (eventId, userId, data) =>
    axios.patch(`${API_URL}/event/${eventId}/socialday/${userId}`, {...data}), //note

  getWaitingEvent: () => axios.get(`${API_URL}/event/waiting`),

  getWaitingEventById: eventId =>
    axios.get(`${API_URL}/event/waiting/${eventId}`),

  verifyEvent: (eventId, status, text) =>
    axios.post(`${API_URL}/event/${eventId}/verify`, {
      verifyStatus: status,
      verifiedMessage: text,
    }),

  getVerifiedEvent: () => axios.get(`${API_URL}/event/verified`),

  getVerifiedEventById: eventId =>
    axios.get(`${API_URL}/event/verified/${eventId}`),

  confirmEventCensorReport: eventId =>
    axios.patch(`${API_URL}/event/${eventId}/confirm/censor`),
};
