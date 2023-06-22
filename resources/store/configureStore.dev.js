import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "../slices/authSlice";
import bannerReducer from "../slices/bannerSlice";
import cartReducer from "../slices/cartSlice";
import activitySlice from "../slices/activitySlice";
import couponReducer from "../slices/couponSlice";
import parcelReducer from "../slices/parcelSlice";

const persistConfig = {
  key: "root",
  whitelist: ["user", "banner", "cart", "activity", "coupon", "parcel"],
  storage: AsyncStorage,
};

const reducer = combineReducers({
  user: authReducer,
  banner: bannerReducer,
  cart: cartReducer,
  coupon: couponReducer,
  activity: activitySlice,
  parcel: parcelReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);
export { store, persistor };
