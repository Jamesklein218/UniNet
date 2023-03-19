import * as actionTypes from '@actions/actionTypes';

const initialState = {
  visible: false,
  data: {
    content: '',
    leftContent: '',
    rightContent: '',
    onPressLeft: () => {},
    onPressRight: () => {},
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SHOW_POPUP_SELECTION:
      return {
        ...state,
        visible: true,
        data: {
          ...state.data,
          content: action.content,
          leftContent: action.leftContent,
          rightContent: action.rightContent,
          onPressLeft: action.onPressLeft,
          onPressRight: action.onPressRight,
        },
      };
    case actionTypes.HIDE_POPUP_SELECTION:
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};
