import { createSlice } from "@reduxjs/toolkit";
import { LoadingOverlay } from "../components/common";
import MessagePopup from "../components/common/MessagePopup";
import { loginAPI, socialLoginAPI, verifyEmailAPI } from "../http";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const authSlice = createSlice({
  name: "user",
  initialState: {
    userdata: {},
    status: STATUSES.IDLE,
    verifyemail: {},
    useremail: {},
    userAddress: {},
    userVerified: false,
    userSocialName: "",
    userSocialImage: "",
    userCurrentLocation: {},
  },
  reducers: {
    reset(state, action) {
      state.userSocialName = action.payload;
      state.userSocialImage = action.payload;
    },
    setUser(state, action) {
      state.userdata = action.payload;
    },
    setSocialName(state, action) {
      state.userSocialName = action.payload;
    },
    setSocialImage(state, action) {
      state.userSocialImage = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setVerifyEmail(state, action) {
      state.verifyemail = action.payload;
    },
    setUserEmail(state, action) {
      state.useremail = action.payload;
    },
    setUserAddress(state, action) {
      // console.log("IN REDUX FOR DEFAULT ADDRESS -> ", action.payload);
      state.userAddress = action.payload;
    },
    setUserVerified(state, action) {
      state.userVerified = action.payload;
    },
    setUserCurrentLocation(state, action) {
      state.userCurrentLocation = action.payload;
    },
    setClearRedux(state, action) {
      (state.userdata = {}),
        (state.status = STATUSES.IDLE),
        (state.verifyemail = {}),
        (state.useremail = ""),
        (state.userAddress = {}),
        (state.userVerified = false),
        (state.userSocialName = ""),
        (state.userSocialImage = ""),
        (state.userCurrentLocation = {});
    },
  },
});

export const {
  reset,
  setUser,
  setSocialName,
  setSocialImage,
  setStatus,
  setVerifyEmail,
  setUserEmail,
  setUserAddress,
  setUserVerified,
  setUserCurrentLocation,
  setClearRedux,
} = authSlice.actions;
export default authSlice.reducer;

export function loginUser(params, navigation) {
  return async function (dispatch) {
    LoadingOverlay.show("Loading...");
    try {
      const { data } = await verifyEmailAPI(params);
      if (data.success == true) {
        dispatch(setUserEmail(params));
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "OTP sent!",
          message: `${data.message}`,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                navigation
                  ? navigation.navigate("OtpVerification", params)
                  : {};
              },
            },
          ],
          closeOnOverlayPress: false,
        });
      } else {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Warning!",
          message: `${data?.message}`,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
          closeOnOverlayPress: false,
        });
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      LoadingOverlay.hide();
      MessagePopup.show({
        title: "Warning!",
        message: error.message,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
    }
  };
}

export function otpVerificationUser(params, navigation) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    LoadingOverlay.show("Loading...");
    try {
      const { data } = await loginAPI(params);
      if (data.success) {
        LoadingOverlay.hide();
        const UserData = {
          userDetail: data.usersDetail,
          auth_token: data.token,
        };
        await AsyncStorage.setItem("user", JSON.stringify(UserData));
        dispatch(setUser(UserData));
        navigation.reset({
          index: 0,
          routes: [{ name: "DashboardRoute" }],
        });
        dispatch(setStatus(STATUSES.IDLE));
      } else {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Warning!",
          message: data?.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
          closeOnOverlayPress: false,
        });
        console.log("Error Here");
      }
    } catch (error) {
      LoadingOverlay.hide();
      dispatch(setStatus(STATUSES.ERROR));
      console.log("Error LOGIN Data", error);
    }
  };
}

export function GoogleAuthentication(params, navigation) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const { data } = await socialLoginAPI(params);
      if (data.success === true) {
        const UserData = {
          userDetail: data.usersDetail,
          auth_token: data.token,
        };
        await AsyncStorage.setItem("user", JSON.stringify(UserData));
        dispatch(setUser(UserData));
        LoadingOverlay.hide();
        navigation.reset({
          index: 0,
          routes: [{ name: "DashboardRoute" }],
        });
      } else if (data.success === false) {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Authentication Error",
          message: `${data.message}`,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
          closeOnOverlayPress: false,
        });
        console.log("Error Here");
      }
      return data;
    } catch (error) {
      LoadingOverlay.hide();
      return error;
    }
  };
}
export function FacebookAuthentication(params, navigation) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      LoadingOverlay.show("Loading...");
      const { data } = await socialLoginAPI(params);
      if (data.success === true) {
        const UserData = {
          userDetail: data.usersDetail,
          auth_token: data.token,
        };

        await AsyncStorage.setItem("user", JSON.stringify(UserData));
        dispatch(setSocialName(UserData?.userDetail?.full_name));
        dispatch(setSocialImage(UserData?.userDetail?.identity_image));
        dispatch(setUser(UserData));
        LoadingOverlay.hide();
        navigation.reset({
          index: 0,
          routes: [{ name: "DashboardRoute" }],
        });
      } else if (data.success === false) {
        LoadingOverlay.hide();
        if (data?.message == "Email is empty from facebook") {
          MessagePopup.show({
            title: "Email Can't Access",
            message: `Please allow all access in facebook for this email`,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                },
              },
            ],
            closeOnOverlayPress: false,
          });
        } else {
          MessagePopup.show({
            title: "Authentication Error",
            message: `${data.message}`,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                },
              },
            ],
            closeOnOverlayPress: false,
          });
        }
      }
      return data;
    } catch (error) {
      LoadingOverlay.hide();
      console.log("Error LOGIN Data", error);
      throw error;
    }
  };
}
export function AppleAuthentication(params, navigation) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const { data } = await socialLoginAPI(params);
      console.log("data: AFTER LOGIN", data);

      if (data.success === true) {
        const UserData = {
          userDetail: data.usersDetail,
          auth_token: data.token,
        };
        await AsyncStorage.setItem("user", JSON.stringify(UserData));
        LoadingOverlay.hide();
        dispatch(setUser(UserData));
        navigation.reset({
          index: 0,
          routes: [{ name: "DashboardRoute" }],
        });
      } else if (data.success === false) {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Authentication Error",
          message: `${data.message}`,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
          closeOnOverlayPress: false,
        });
        console.log("Error Here");
      }
      return data;
    } catch (error) {
      LoadingOverlay.hide();
      return error;
    }
  };
}
