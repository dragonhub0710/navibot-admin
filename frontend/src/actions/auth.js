import api from "../utils/api";
import { USER_LOADED, SIGN_IN, SIGN_OUT, SIGN_UP } from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth/");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

// Sign In
export const signin = (data) => async (dispatch) => {
  try {
    const res = await api.post("/auth/signin", data);
    dispatch({
      type: SIGN_IN,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

// Sign Out
export const signout = () => async (dispatch) => {
  localStorage.clear();
  dispatch({ type: SIGN_OUT });
};

// Sign Up
export const signup = (data) => async (dispatch) => {
  try {
    const res = await api.post("/auth/signup", data);
    dispatch({
      type: SIGN_UP,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};
