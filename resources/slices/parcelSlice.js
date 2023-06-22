import { useNavigation } from "@react-navigation/native";
import { createSlice } from "@reduxjs/toolkit";
import { LoadingOverlay, MessagePopup } from "../components/common";

const parcelSlice = createSlice({
  name: "parcel",
  initialState: {
    recentAddress: [],
    pickupData: {},
    dropoffData: {},
    picked: 0,
    dropped: 0,
    pickTitle: "",
    dropTitle: "",
    selectedId: 0,
    flagName: "",
    parcelCouponData: {},
    deliveryOptionId: 0,
  },
  reducers: {
    setRecentAddress(state, action) {
      let tempArray = state.recentAddress;
      tempArray.splice(0, 0, action.payload);
      state.recentAddress = tempArray;
    },
    setPickupData(state, action) {
      // if (state.dropoffData.address === action.payload.address) {
      //   LoadingOverlay.hide();
      //   MessagePopup.show({
      //     title: "please choose different address",
      //     message: "Pick-up address cannot be same as Drop-off address",
      //     actions: [
      //       {
      //         text: "Okay",
      //         action: () => {
      //           MessagePopup.hide();
      //         },
      //       },
      //     ],
      //   });
      // } else {
      LoadingOverlay.hide();
      state.pickupData = action.payload;
      state.picked = 1;
      // }
    },
    setDropoffData(state, action) {
      if (state.pickupData.address === action.payload.address) {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "please choose different address",
          message: "Drop-off address cannot be same as Pick-up address",
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      } else {
        state.dropoffData = action.payload;
        state.dropped = 1;
        LoadingOverlay.hide();
      }
    },
    setReset(state, action) {
      state.picked = 0;
      state.dropped = 0;
      state.pickupData = {};
      state.dropoffData = {};
      state.selectedId = 0;
      state.deliveryOptionId = 0;
      state.pickTitle = "";
      state.dropTitle = "";
      state.selectedId = 0;
      state.flagName = "";
      state.parcelCouponData = {};
      state.deliveryOptionId = 0;
    },
    setPickTitle(state, action) {
      state.pickTitle = action.payload;
    },
    setDropTitle(state, action) {
      state.dropTitle = action.payload;
    },
    selectedParcelId(state, action) {
      state.selectedId = action.payload;
    },
    setFlagName(state, action) {
      state.flagName = action.payload;
    },
    setDeliveryOptionId(state, action) {
      state.deliveryOptionId = action.payload;
    },
  },
});

export const {
  setRecentAddress,
  setPickupData,
  setDropoffData,
  setReset,
  setPickTitle,
  setDropTitle,
  selectedParcelId,
  setFlagName,
  setParcelCouponData,
  setDeliveryOptionId,
} = parcelSlice.actions;
export default parcelSlice.reducer;
