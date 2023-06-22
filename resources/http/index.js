import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { serverKey, URL } from "../config";
import { MessagePopup } from "../components/common";
import * as RootNavigation from "../Router/RootNavigation";
import RNRootbeer from "react-native-rootbeer";
import { BackHandler, Platform } from "react-native";
import { encryption } from "../helpers/EncryptDecrypt";
import RNSSLPinning from "react-native-ssl-pinning";

const certString = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAk0sy9FwM1DkThxaw7Q++oVJe5Dul0eJXGXDlPpB5Ae1rxcL6
zyB3bYUkRr+/B8EMepgsH3T1jedJznNoZxVVy6N1PUav/s0xwZ0GMtveTYpeDIIk
JgB8Vc4/1iTaUwd8kVdpR/X9so8RlqF0ib7rHHXzAGkfuV2eBz0ev4N9HuqPrTAi
Z0WCVZiuSrRGXxzwI0FW/0hbcLk8zsJxmuyb/ji5j/iQmghC1AvY+PV1Q1ny3RFv
X+MZ6M5frDTD+qB1XI2CvHsCcLPTh+IEt3moK1hZk1TQyAZuUlao0pPuw2Pw71fp
bjP1plVrMhZC2RiQVZaMzlQIz/3gggJDqiByQQIDAQABAoIBAHHjFh3swpqhGyE7
gUd7AgmYN/i+ygLTwEbSjN5oNLgxzD/X97eJQe5zoM33WoxzTuPHn24fL/ItoFq5
z0LNM05GL9NWQaSBIfSzJeTTLjrEPt3rDmo3u+tYkvFQA2NpiX6TmLrkT+ntR0sx
wXr0HLQf2uk5XycjZJnyP0ETOP5abL119xHNoYmw5PQl80iItYcVXqfbq3r/yzEj
KbU8zDcw0uEfbrR4Fu264IwDkl5sDmaWxdgBboncdSd2aqdBe2eOUcz3BaDJjJWF
XrcsAqL/Um3ifeh06IHH7mZEOCnplucGOohTbf8DgXJQGem6JsATJ1db/Ebrr5/n
LEQE4AECgYEA5JDlVfpu4EFzovdQO9S3kH5udsD7LOuGBjepP/Zh3cARC2zDUhrf
eI5DINm5fuA/HPW3UmlrUgLbJgu8E8N3kVgla9Nh12faPkGuW7+SEqfPelodMbIQ
1aMeDdhyCZQEtkodVeW/ZuWeNgm1F/JffA7MeJFk6YMMSaDyWfxtVcECgYEApPkQ
6kNwVBGyhbHwf+/BGjr8Hy4Whb1d5tRgnBn9AcnAbVX2vygQW00gJx1wruV0UpGU
CYTL520hrFFYGOjjbrWnAVt2GgkaBP0eqvN5tDmRi0ndL8Z7cwiRjhajQS0euyuW
CjoaoWHggWNmOTbl25On8hV7OeZaWZXWwjivPIECgYEAou/D/SG07rrZ81+4W56N
aT0oBBIYPHJ9rWr6hXVfWNQ1kl5rctljWy6XHhD30kGL3Fox4Fb0QZd1oE6XOcOL
NhqPOqmKwyLuipkJ8a/EMvZbyo3459dXduR8ZURaLwfMwCJffT91zaV8vmr3JOYM
OYTXME/9jxVzqf1JJurzCkECgYEAj1Eolrs7jG1Lb8YjrqE0Wns/qD67pjfaqbt6
qmIRYEpK9zElCO/fNdIMyq5SxD3mDg0WVCaflU9DX5XTOOCpI/Z/PTidowShLBBR
YiXeZulUPXNPyj9d45NgD9YuwWJXPjchQ4UyuVx0UzNtDOtaSKU/05lB0g0CFK2N
QnFIGwECgYB3J3TQs9npH4E9Kb5qFOOaNr9tcjKLy8W+rQXUOm8rpLpNgd445k73
NxCypwO8cmN0LEzl10pte/yaxUMafbpH3gw0dWeW+Arf/5IoYSRcYUmwJObcwUK5
hVc4kK5Sm8ux0Dw2QtSVt6b6YxjDaGRuQrWXxdtKQZAjEpgb6eYP/A==
-----END RSA PRIVATE KEY-----`;

const encryptData = (params) => {
  const data = JSON.stringify(params);
  const keys =
    serverKey === "development"
      ? "!A%D*G-KaPdSgVkYp3s6v8y/B?E(H+Mb"
      : "Zq4t7w!z%C*F-JaNdRgUkXn2r5u8x/A?";
  const apiEncryptData = encryption(data, keys);
  return { apiEncryptData };
};

const api = axios.create({
  baseURL: URL.api,
});

api.interceptors.request.use(
  async (config) => {
    const newConfig = config;
    await RNSSLPinning?.pinCertificate(certString);
    const authToken = JSON.parse(
      await AsyncStorage.getItem("user")
    )?.auth_token;
    if (authToken) {
      newConfig.headers.Authorization = `Bearer ${authToken}`;
    }
    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    const checkIsDeviceRooted = async () => {
      const isRooted = await RNRootbeer.isRooted();
      const isRootedWithBusyBoxCheck =
        await RNRootbeer.isRootedWithBusyBoxCheck();

      if (isRooted || isRootedWithBusyBoxCheck) {
        return MessagePopup.show({
          title: "Security Issues!",
          message: `Facing security issues. Maybe your device has been rooted`,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                RootNavigation.replace("Login");
                BackHandler.exitApp();
              },
            },
          ],
        });
      }
    };
    if (Platform.OS == "android") {
      checkIsDeviceRooted();
    }
    return response;
  },
  (error) => {
    if (error?.message == "Network Error") {
      MessagePopup.show({
        title: error.message,
        message: "Please check your internet connection",
        actions: [
          {
            text: "OKAY",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
      return Promise.reject(error);
    } else {
      MessagePopup.show({
        title: "Attention!",
        message:
          error?.response?.status == 401
            ? "User Unauthorized"
            : error?.response?.data?.errors?.length > 0
            ? error?.response?.data?.errors[0]?.message
            : error?.response?.status == 403
            ? "Forbidden"
            : "Something went wrong. Please try again.",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              error?.response?.status == 401
                ? RootNavigation.replace("Login")
                : MessagePopup.hide();
            },
          },
        ],
      });
      return Promise.reject(error?.response?.data?.errors);
    }
  }
);
export default api;

//authentication
export const verifyEmailAPI = (params) =>
  api.post("/auth/login", encryptData(params));
export const loginAPI = (params) =>
  api.post("/auth/verify-email", encryptData(params));
export const socialLoginAPI = (params) => api.post("auth/social-login", params);
export const updateProfileAPI = (params) =>
  api.post("customer/update-profile", encryptData(params));
export const userVerification = () => api.get("checkout/is-verified");
export const getUserProfile = () => api.get("/customer/get-profile");

//food and merchant
export const getMerchantAPI = () => api.get("/food-home");
export const getBannerDashBoard = (params) => api.post("/banners", params);
export const getMerchants = (params) => api.post("main-page", params);
export const findMerchantDetails = (params) =>
  api.post("restaurants/details", params);
export const getMerchantInfo = (params) =>
  api.post("/restaurants/info", params);
export const getCategories = (params) =>
  api.post("/restaurants/get-categories", params);
export const getProductInfo = (params) => api.post("/foods/details", params);
export const getSearch = (params) => api.post("/search", params);
export const oneMoreStep = (params) =>
  api.post("checkout/verification", params);
export const getOneMoreStep = () => api.get("customer/get-one-more-step");
// export const seeAllData = (params) => api.get("/discover-list?page=1");

//CART API
export const getCartApi = () => api.get("/cart");
export const addToCart = (params) => api.post("/cart/add", params);
export const removeToCart = (params) => api.post("/cart/remove", params);
export const applyCoupon = (params) => api.post("coupon/apply", params);

//Place order
export const getCheckoutData = (params) =>
  api.post("/checkout/checkout-detail", params);
export const placeOrder = (params) => api.post("/orders/place", params);
export const riderReview = (params) =>
  api.post("/customer/rider/review", params);
export const paymentUrl = (params) => api.post("/payment-url", params);

// export const trackOrderDetails = (params) => api.post("/parcel/track", params);
export const orderCancel = (params) => api.post("/orders/cancel", params);

export const foodReviewForMercahnt = (params) =>
  api.post("/customer/restaurants/review", params);

//Address API
export const getRegionsAPI = () => api.get("/customer/address/get-regions");
export const getprovinceAPI = (params) =>
  api.post("/customer/address/get-province", params);
export const getcityAPI = (params) =>
  api.post("/customer/address/get-city", params);
export const getbarangayAPI = (params) =>
  api.post("/customer/address/get-barangay", params);
export const addAddressAPI = (params) =>
  api.post("/customer/address/add", encryptData(params));
export const getAddressListAPI = () => api.get("/customer/address/list");
export const defaultAddressApi = (params) =>
  api.post("/customer/address/set-default", params);
export const updateSingleAddressAPI = (id, params) =>
  api.put(`customer/address/update/${id}`, encryptData(params));
export const userLocationProvide = (params) =>
  api.post("/customer/update-let-long", params);

//parcel API
export const getParcelType = () => api.get("/parcel/get-parcel-type");
export const getDeliveryOption = (params) =>
  api.post("/parcel/get-delivery-option", params);
export const applyParcelPromoCode = (params) =>
  api.post("/parcel/coupon/apply", params);
export const placeParcel = (params) => api.post("/parcel/place-order", params);
export const getParcelStatus = (params) => api.post("/parcel/track", params);

//my activity
export const getActiveFieldData = (params) =>
  api.post("orders/ongoing", params);

export const cancelOrderFromPending = (params) =>
  api.post("orders/cancel", params);

export const logoutUser = (params) => api.post("/customer/logout", params);
export const deleteUser = (params) => api.post("/customer/delete", params);

//Messages

export const getAnnouncement = (params) =>
  api.get(`/customer/announcement-list?page=${params.page}`);

export const getMessageList = (params) =>
  api.get(`/customer/message-list?page=${params.page}`);

// update email & mobile number
export const updateEmailOrPhone = (params) =>
  api.post("/customer/change-email-or-phone", params);
export const verifyEmailOrPhone = (params) =>
  api.post("/customer/verify-email-or-phone", params);

// Cancel order resons
export const cancelOrderReason = () => api.get("/customer/reasons");
