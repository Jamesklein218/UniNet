import * as actionTypes from '@actions/actionTypes';
const initialState = {
  posts: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_ALL_POST:
      return {
        ...state,
        posts: action.payload,
      };
    default:
      return state;
  }
};
