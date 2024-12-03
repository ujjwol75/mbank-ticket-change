import {
  FETCH_DROPDOWN_FAILED,
  FETCH_DROPDOWN_START,
  FETCH_DROPDOWN_SUCCESS,
} from "../../types";

const initialValues = {
  dropDownList: [],
  loading: false,
};

const dropDownReducer = (state = initialValues, action) => {
  switch (action.type) {
    case FETCH_DROPDOWN_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DROPDOWN_SUCCESS:
      return getDropDown(initialValues, action.payload);
    case FETCH_DROPDOWN_FAILED:
      return {
        ...state,
        dropDownList: [],
        loading: false,
      };
    default:
      return state;
  }
};

const getDropDown = (state, payload) => {
  var stateClone = { ...state };
  const dropDown = payload;
  stateClone.dropDownList = dropDown;
  stateClone.loading = false;
  return stateClone;
};

export default dropDownReducer;
