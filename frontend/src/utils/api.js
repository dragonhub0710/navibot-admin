import axios from "axios";
import store from "../store";
import { SIGN_OUT } from "../actions/types";

// Create an instance of axios
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASED_URL}/`,
  timeout: 200000,
  headers: {
    "Content-Type": "application/json",
  },
});
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch({ type: SIGN_OUT });
    }
    return Promise.reject(err);
  }
);

export default api;
