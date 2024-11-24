import { GET_PARK_LIST, SET_SELECTED_PARK } from "../actions/types";

const initialState = {
  parkList: [],
  totalParks: 0,
  selectedPark: null,
};

function parkReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PARK_LIST:
      return {
        ...state,
        parkList: payload.data,
        totalParks: payload.total,
      };
    case SET_SELECTED_PARK:
      return {
        ...state,
        selectedPark: payload.data,
      };
    default:
      return state;
  }
}

export default parkReducer;
