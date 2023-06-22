import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    await getFcmToken();
  }
  await getFcmToken();
}
export async function getFcmToken() {
  let fcmToken = await AsyncStorage.getItem("_fcmtoken");
  // console.log("get token ", fcmToken);
  if (!fcmToken) {
    try {
      let _fcmToken = await messaging().getToken();
      if (_fcmToken) {
        console.log("NEW FCM TOKEN", _fcmToken);
        await AsyncStorage.setItem("_fcmtoken", _fcmToken);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export async function handleNotification() {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage?.data
    );
    return remoteMessage?.data;
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage
        );
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    LocalNotification(
      remoteMessage?.notification?.title,
      remoteMessage?.notification?.body,
      remoteMessage?.notification?.body
    );
  });
}

export const getIosPushNotification = () => {
  messaging()
    .getIsHeadless()
    .then((isHeadless) => {
      console.log("// do sth with isHeadless", isHeadless);
    });

  messaging()
    .subscribeToTopic("weather")
    .then(() => console.log("Subscribed to topic!"));

  messaging()
    .unsubscribeFromTopic("weather")
    .then(() => console.log("Unsubscribed fom the topic!"));

  messaging().registerDeviceForRemoteMessages();

  messaging().setAutoInitEnabled(true);
};

// configure LocalPushNotification

PushNotification.configure({
  onNotification: function (notification) {
    console.log("This is Local notification ---->", notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export const LocalNotification = (titles, shortMessage, messages) => {
  // Create Channel
  PushNotification.createChannel(
    {
      channelId: "cyclehouse_service",
      channelName: "Cycle House Service",
      channelDescription: "A channel to categorise your notifications",
      playSound: true,
      soundName: "default",
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );

  PushNotification.localNotification({
    autoCancel: true,
    title: titles, // Main Title of notification
    // subText: subTitle, // SubTitle of notification
    message: shortMessage, // Without expand notification when this is show
    bigText: messages, // Description of notification
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: "default",
    channelId: "cyclehouse_service",
  });
};
