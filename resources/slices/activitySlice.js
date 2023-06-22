import { createSlice } from "@reduxjs/toolkit";
// import { getCart } from "../http";

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activityStatus: {
      name: "Pending",
      nameOfBody: "pending",
      // icon: require("../../../img/thumbs-up.png"),
      notif: false,
    },
    activityData: undefined,
  },
  reducers: {
    setStatusCount(state, action) {
      state.activityStatus = action.payload;
    },
    setActivitiData(state, action) {
      state.activityData = action.payload;
    },
  },
});

export const { setStatusCount, setActivitiData } = activitySlice.actions;
export default activitySlice.reducer;
