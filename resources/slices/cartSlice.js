import { createSlice } from "@reduxjs/toolkit";
// import { getCart } from "../http";

const cartslice = createSlice({
  name: "cart",
  initialState: {
    cartData: [],
    cartCount: 0,
    selectedMerchantInfo: {},
    orderId: 0,
    cartTotal: 0,
    finalPayment: 0,
  },
  reducers: {
    getCart(state = initialState, action) {
      state.cartData = action.payload;
    },
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
    removeCart(state, action) {
      const removeItems = state?.cartData?.map((item) => {
        return item?.restaurant?.product.filter(
          (prod) => prod.food_id != action.payload.id
        );
      });
      state.cartData = removeItems;
    },
    selectedMerchantData(state, action) {
      state.selectedMerchantInfo = action.payload;
    },
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
    setCartTotal(state, action) {
      state.cartTotal = action.payload;
    },
    finalPaymentPrice(state, action) {
      state.finalPayment = action.payload;
    },
  },
});

export const {
  getCart,
  setCartCount,
  removeCart,
  selectedMerchantData,
  setOrderId,
  setCartTotal,
  finalPaymentPrice,
} = cartslice.actions;
export default cartslice.reducer;
