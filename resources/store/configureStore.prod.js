import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ReduxPromise from "redux-promise-middleware";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "../reducers";
import initialState from "../reducers/initialState";

const persistConfig = {
  key: "root",
  whitelist: [
    "user",
    "cart",
    "dashboard",
    "fbData",
    "categories",
    "countries",
    "location",
    "jobRequest",
    "jobOngoing",
  ],
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  initialState,
  applyMiddleware(thunk, ReduxPromise)
);

const persistor = persistStore(store);

export { store, persistor };
// import { configureStore } from "@reduxjs/toolkit";
// import { authReducer } from "../slices/authSlice";
// const store = configureStore({
//   reducer: {
//     user: authReducer,
//   },
// });

// export default store;
