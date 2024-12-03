import authReducer from "./auth/auth";
import dropDownReducer from "./dropdown/fetchDropDown";
import userReducer from "./user/userReducer";

const reducer = {
  user: userReducer,
  auth: authReducer,
  dropDown: dropDownReducer,
};

export default reducer;
