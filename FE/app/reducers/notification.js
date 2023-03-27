import * as actionTypes from '@actions/actionTypes';
const initialState = {
  eventId: '',
  index: 0,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.CHANGE_NOTI_EVENTID:
      return {
        ...state,
        eventId: action.payload,
      };
    case actionTypes.CHANGE_NOTI_INDEX:
      return {
        ...state,
        index: action.payload,
      };
    default:
      return state;
  }
};
