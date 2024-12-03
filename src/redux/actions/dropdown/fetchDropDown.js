import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utility/getErrorMessage";
import {
  FETCH_DROPDOWN_FAILED,
  FETCH_DROPDOWN_START,
  FETCH_DROPDOWN_SUCCESS,
} from "../../types";
import { axiosInstance } from "../../../axios/axiosInterceptor";

export const fetchDropDownStart = () => ({
  type: FETCH_DROPDOWN_START,
});

export const fetchDropDownSucess = (data) => ({
  type: FETCH_DROPDOWN_SUCCESS,
  payload: data,
});

export const fetchDropDownFailed = () => ({
  type: FETCH_DROPDOWN_FAILED,
});

export const clearDropDown = () => ({
  type: FETCH_DROPDOWN_FAILED,
});

export const fetchDropDown = (path) => {
  return async (dispatch) => {
    dispatch(fetchDropDownStart());
    try {
      const response = await axiosInstance.get(path);
      dispatch(fetchDropDownSucess(response.data));
    } catch (err) {
      dispatch(fetchDropDownFailed(err));
      toast.error(getErrorMessage(err));
    }
  };
};
