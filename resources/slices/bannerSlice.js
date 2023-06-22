import { createSlice } from "@reduxjs/toolkit";

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    bannerData: [],
    items: [],
    discoverMerchants: [],
    searchData: [],
  },
  reducers: {
    setBanner(state, action) {
      state.bannerData = action.payload;
    },
    storeItems(state, action) {
      state.items = action.payload;
    },
    storeMerchant(state, action) {
      state.discoverMerchants = action.payload;
    },
    storeSearchData(state, action) {
      state.searchData = action.payload;
    },
  },
});

export const { setBanner, storeItems, storeMerchant, storeSearchData } =
  bannerSlice.actions;
export default bannerSlice.reducer;
