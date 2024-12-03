import toast from "react-hot-toast";
import * as actionTypes from "../../types";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../../axios/axiosInterceptor";
import { getErrorMessage } from "../../../utility/getErrorMessage";

//This action type to set a loading state
export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
    loading: true,
  };
};

export const authSuccess = (token, user) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    user: user,
    loading: false,
  };
};

export const authFailed = (error) => {
  console.log(error);
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
    loading: false,
  };
};

export const auth = (email, password, navigate) => {
  return async (dispatch) => {
    dispatch(authStart());

    try {
      const response = await axiosInstance.post("/public/authenticate", {
        email,
        password,
      });

      const token = response.data?.token;
      const userRole = response.data?.role;

      dispatch(authSuccess(token, userRole));
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("userRole", userRole);
      navigate("/");
      toast.success("Successfully Login!")
    } catch (error) {
      dispatch(authFailed(error));
      toast.error(getErrorMessage(error));
    }
  };
};
