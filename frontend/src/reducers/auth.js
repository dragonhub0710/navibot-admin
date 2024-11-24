import { USER_LOADED, SIGN_IN, SIGN_OUT, SIGN_UP } from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
    case SIGN_IN:
    case SIGN_UP:
      return {
        ...state,
        token: payload.token,
        user: payload.data,
        isAuthenticated: true,
      };
    case SIGN_OUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
}

export default authReducer;
