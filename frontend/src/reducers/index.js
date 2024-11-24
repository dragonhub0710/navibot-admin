import { combineReducers } from "redux";
import auth from "./auth";
import park from "./park";
import spot from "./spot";

export default combineReducers({
  auth,
  park,
  spot,
});
