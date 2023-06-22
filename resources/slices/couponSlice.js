import { createSlice } from "@reduxjs/toolkit";
// import { getCart } from "../http";

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    couponData: {},
    isValid: false,
  },
  reducers: {
    validCoupon(state = initialState, action) {
      state.isValid = action.payload;
    },
    setCouponData(state, action) {
      console.log("IN REDUCER ", action.payload);
      state.couponData = action.payload;
    },
  },
});

export const { setCouponData, validCoupon } = couponSlice.actions;
export default couponSlice.reducer;
