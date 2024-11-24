import api from "../utils/api";
import { GET_PARK_LIST } from "./types";

export const getParkList = (data) => async (dispatch) => {
  try {
    let extraEndpoint = "";
    if (data.pageSize != 0) {
      extraEndpoint = `?pageNum=${data.pageNum}&pageSize=${data.pageSize}`;
    }
    const res = await api.get(`/park${extraEndpoint}`);
    dispatch({
      type: GET_PARK_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const createPark = (data) => async (dispatch) => {
  try {
    const res = await api.post("/park", data);
  } catch (err) {
    throw err;
  }
};

export const deletePark = (data) => async (dispatch) => {
  try {
    const res = await api.delete(
      `/park/${data.id}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    );
    dispatch({
      type: GET_PARK_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const updatePark = (data) => async (dispatch) => {
  try {
    const res = await api.put(
      `/park/${data.id}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
      data
    );
    dispatch({
      type: GET_PARK_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};
