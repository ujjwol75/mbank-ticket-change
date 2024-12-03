import { FETCH_USER_FAILURE, FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from "../../types";


  
  export const fetchUserRequest = () => ({
    type: FETCH_USER_REQUEST,
  });
  
  export const fetchUserSuccess = (user) => ({
    type: FETCH_USER_SUCCESS,
    payload: user,
  });
  
  export const fetchUserFailure = (error) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
  });
  
  export const fetchUserById = (userId) => async (dispatch) => {
    dispatch(fetchUserRequest());
    try {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      dispatch(fetchUserSuccess(data));
    } catch (error) {
      dispatch(fetchUserFailure(error.message));
    }
  };
  