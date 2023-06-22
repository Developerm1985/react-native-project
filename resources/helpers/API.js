import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Actions } from "react-native-router-flux";
import { URL } from "../config";
import MessagePopup from "../components/common/MessagePopup";

global.XMLHttpRequest = global.originalXMLHttpRequest
  ? global.originalXMLHttpRequest
  : global.XMLHttpRequest;
global.FormData = global.originalFormData
  ? global.originalFormData
  : global.FormData;

export function connect() {
  const instance = axios.create({
    baseURL: URL.api,
  });
  instance.interceptors.request.use(
    async (config) => {
      const newConfig = config;

      const user = await AsyncStorage.getItem("user");
      const authToken = user.auth_token;

      if (authToken) {
        newConfig.headers.Authorization = `Bearer ${authToken}`;
      }
      return newConfig;
    },
    (error) => Promise.reject(error)
  );
  instance.interceptors.response.use(
    (response) => {
      if (response && response?.data && response?.data?.message && showLog) {
        MessagePopup.show({
          title:
            (response.data && response.data.success) ||
            response.data.success === undefined
              ? "Success!"
              : "Warning!",
          message: this.responseMessageChecker(response?.data?.message),
          actions: [
            {
              text: "OKAY",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      }
      if (response && response.data) {
        return response.data;
      }
      return response;
    },
    (error) => {
      const response = error.response;
      const message = response.data.message;
      const proccessedMessage = this.responseMessageChecker(message);
      response.proccessedMessage = proccessedMessage;

      if (response && response.data && response.data.message && showLog) {
        MessagePopup.show({
          title: "Attention!",
          message: proccessedMessage,
        });
      }

      if (proccessedMessage === "Token has expired") {
        Actions.Landing();
        MessagePopup.show({
          title: "Attention!",
          message: "Session expired.",
          actions: [
            {
              text: "OKAY",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      }
      return Promise.reject(response);
    }
  );
  return instance;
}

export function responseMessageChecker(message) {
  if (Array.isArray(message) && message.length > 0) {
    let newMessage = "";
    message.forEach((item, key) => (newMessage = `${newMessage}\n${item}`));
    message = newMessage;
  }
  return message ? message.trim() : "Unexpected Error.";
}
