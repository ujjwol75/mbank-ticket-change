import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";


const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true, 
    }),
});

export default store;
