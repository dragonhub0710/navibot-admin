import api from "../utils/api";
import { GET_SPOT_LIST } from "./types";

export const getSpotList = (data) => async (dispatch) => {
  try {
    let extraEndpoint = `?park=${data.parkId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`;
    const res = await api.get(`/spot${extraEndpoint}`);
    dispatch({
      type: GET_SPOT_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const createSpot = (data) => async (dispatch) => {
  try {
    const res = await api.post("/spot", data);
  } catch (err) {
    throw err;
  }
};

export const deleteSpot = (data) => async (dispatch) => {
  try {
    const res = await api.delete(
      `/spot/${data.id}?park=${data.parkId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    );
    dispatch({
      type: GET_SPOT_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const updateSpot = (data) => async (dispatch) => {
  try {
    const res = await api.post(
      `/spot/update/${data.id}?park=${data.parkId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
      data
    );
    dispatch({
      type: GET_SPOT_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const deleteImages = (data) => async (dispatch) => {
  try {
    const res = await api.delete("/media/image", { data });
    dispatch({
      type: GET_SPOT_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const uploadImages = (data) => async (dispatch) => {
  try {
    const res = await api.post("/media/image", { data });
    dispatch({
      type: GET_SPOT_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};
