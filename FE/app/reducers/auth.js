import * as actionTypes from '@actions/actionTypes';
const initialState = {
  login: {
    success: false,
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        login: action.data,
      };
    case actionTypes.GET_PROFILE:
      return {
        ...state,
        profile: action.data,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        login: {
          ...state.login,
          success: false,
        },
      };
    default:
      return state;
  }
};
