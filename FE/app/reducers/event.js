import * as actionTypes from '@actions/actionTypes';
const initialState = {
  eventsNewfeed: [],
  eventsUpcoming: [],
  eventCreatedHistory: [],
  eventParticipantHistory: [],
  eventVerifiedHistory: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_EVENT_NEWSFEED:
      return {
        ...state,
        eventsNewfeed: action.data,
      };
    case actionTypes.GET_EVENT_UPCOMING:
      return {
        ...state,
        eventsUpcoming: action.data,
      };
    case actionTypes.GET_EVENT_CREATED_HISTORY:
      return {
        ...state,
        eventCreatedHistory: action.data,
      };
    case actionTypes.GET_EVENT_PARTICIPANT_HISTORY:
      return {
        ...state,
        eventParticipantHistory: action.data,
      };
    case actionTypes.GET_EVENT_VERIFIED_HISTORY:
      return {
        ...state,
        eventVerifiedHistory: action.data,
      };
    default:
      return state;
  }
};
