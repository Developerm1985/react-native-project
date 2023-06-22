import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./resources/store/configureStore.dev";
import { StatusBar } from "react-native";
import palette from "./resources/styles/palette.styles";
import Router from "./resources/Router/index";
import SplashScreen from "react-native-splash-screen";
import MessagePopup, {
  MessagePopupRef,
} from "./resources/components/common/MessagePopup";
import LoadingOverlay, {
  LoadingOverlayRef,
} from "./resources/components/common/LoadingOverlay";
import {
  requestUserPermission,
  handleNotification,
  getIosPushNotification,
} from "./resources/components/common/PushNotificationFirebase";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { getFcmToken } from "./resources/components/common/PushNotificationFirebase";

LogBox.ignoreLogs([
  "Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state",
  "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.",
  "componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.",
]);
console.reportErrorsAsExceptions = false;

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
    handleNotification();
    getFcmToken();
    Platform.OS === "ios" && getIosPushNotification();
  }, []);

  useEffect(() => {
    const type = "notification";
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  });

  const onRemoteNotification = (notification) => {
    const isClicked = notification?.getData()?.userInteraction === 1;
    if (isClicked) {
    } else {
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.white} />
        <Router />
        <MessagePopup ref={MessagePopupRef} />
        <LoadingOverlay ref={LoadingOverlayRef} />
      </PersistGate>
    </Provider>
  );
};

export default App;
