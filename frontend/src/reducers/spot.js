import { GET_SPOT_LIST } from "../actions/types";

const initialState = {
  spotList: [],
  totalSpots: 0,
};

function spotReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SPOT_LIST:
      return {
        ...state,
        spotList: payload.data,
        totalSpots: payload.total,
      };

    default:
      return state;
  }
}

export default spotReducer;
