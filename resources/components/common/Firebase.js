import { Component } from "react";
import { Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
// import geolocation from '@react-native-community/geolocation'; //TODO CHANGE THIS
// import database from '@react-native-firebase/database'; //TODO CHANGE THIS
import messaging from "@react-native-firebase/messaging"; //TODO CHANGE THIS
import PushNotification from "react-native-push-notification";
// import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import MessagePopup from "./MessagePopup";
import LoadingOverlay from "./LoadingOverlay";
// import * as authActions from '@actions/auth.actions';
// import * as userdActions from '@actions/user.actions';
// import * as jobActions from '@actions/job.actions';

class Firebase extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      locationCheckerLoop: () => {},
    };
  }

  componentDidMount = () => {
    // this.requestUserPermission();
    this.initFirebaseUserLocation();
    // this.initPushNotification();
    // this.initDeviceToken();
  };

  componentDidUpdate = (prevProps) => {
    // if (this.props.user.id !== prevProps.user.id) {
    //   // Get the device token
    //   messaging()
    //     .getToken()
    //     .then(token => {
    //       return this.saveTokenToDatabase(token);
    //     });
    // }
    // if (this.props.dashboard.type !== prevProps.dashboard.type) {
    //   this.initFirebaseUserLocation();
    // }
  };

  initFirebaseUserLocation = () => {
    const { user } = this.props;

    /*     geolocation.watchPosition(
      position => {
        this.setState({loading: true});
        // this.setFirebaseServiceLocation(position);
        // console.log('position - watchPosition', position.coords);
        this.props.actions.updateCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.setState({loading: false});
      },
      error => {
        console.log('error - watchPosition', error.message);
      },
      {
        // enableHighAccuracy: true,
        timeout: 10000,
        // maximumAge: 0,
        // distanceFilter: 0,
      },
    );

    geolocation.getCurrentPosition(
      position => {
        console.log('position - getCurrentPosition', position.coords);
        this.props.actions.updateCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('error - getCurrentPosition first', error);
      },
      {
        // enableHighAccuracy: true,
        timeout: 10000,
        // maximumAge: 0,
      },
    ); */

    // const locationCheckerLoop = setInterval(() => {
    //   geolocation.getCurrentPosition(
    //     position => {
    //       // console.log('locationCheckerLoop - position', position.coords);
    //       this.props.actions.updateCurrentLocation({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       });
    //     },
    //     error => {
    //       console.log('error - getCurrentPosition', error);
    //       if (error.TIMEOUT === error.code && user && user.token) {
    //         MessagePopup.show({
    //           title: 'Warning!',
    //           message:
    //             'Unable to get your current location.',
    //           actions: [
    //             {
    //               text: 'OKAY',
    //               action: () => {
    //                 MessagePopup.hide();
    //               },
    //             },
    //           ],
    //         });
    //       }
    //     },
    //     {
    //       // enableHighAccuracy: true,
    //       timeout: 30000,
    //       // maximumAge: 0,
    //     },
    //   );
    // }, 30000);

    // this.setState({locationCheckerLoop});
  };

  setFirebaseServiceLocation = (position) => {
    const { user } = this.props;
    const items = user.partner_services;
    if (user.id) {
      for (const item of items) {
        // console.log(item.name, item.status);
        if (
          item.status === "active" &&
          item.service.status === "active" &&
          item.service.category.status === "active"
        ) {
          database()
            .ref(`/locations/services/${item.service.id}/providers/${user.id}`)
            .set({
              id: user.id,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              timestamp: this.formatDate(moment(), true),
            })
            .then(() => {
              // console.log('User location set.');
            });
        } else {
          database()
            .ref(`/locations/services/${item.service.id}/providers/${user.id}`)
            .set(null);
        }
      }
    }
  };

  requestUserPermission = async () => {
    // await messaging().requestPermission();
  };

  initPushNotification = () => {
    // messaging().onMessage(async remoteMessage => {
    //   this.pushNotificationTypeHandler(remoteMessage);
    //   this.pushNotificationHandler(remoteMessage);
    // });
  };

  pushNotificationTypeHandler = (remoteMessage) => {
    console.log("pushNotificationTypeHandler(type):", remoteMessage.data.type);
    const { dashboard } = this.props;

    switch (remoteMessage.data.type) {
      case "request": {
        if (dashboard.type === "partner") {
          this.props.actions.appendJobRequest(remoteMessage.data);
        }
        break;
      }

      case "requestPreAccepted": {
        if (dashboard.type === "customer") {
          const request = {
            ...remoteMessage.data,
            ...{ partner: JSON.parse(remoteMessage.data.partner) },
          };
          this.props.actions.appendJobRequest(request);
        }
        break;
      }

      case "requestAccepted": {
        const job = {
          ...remoteMessage.data,
          ...{ address: JSON.parse(remoteMessage.data.address) },
          ...{ customer: JSON.parse(remoteMessage.data.customer) },
          ...{ service: JSON.parse(remoteMessage.data.service) },
          ...{ partner: JSON.parse(remoteMessage.data.partner) },
        };
        this.props.actions.setJobOngoing(job);
        LoadingOverlay.hide();
        break;
      }

      case "bookingCompleted": {
        if (dashboard.type === "customer" && remoteMessage.data.job_id) {
          const param = {
            job_id: remoteMessage.data.job_id,
          };
          Actions.ReviewJob({ param });
        }
        const job = {};
        this.props.actions.setJobOngoing(job);
        break;
      }

      case "bookingCancelled": {
        const job = {};
        this.props.actions.setJobOngoing(job);
        break;
      }
    }
  };

  pushNotificationHandler = (remoteMessage) => {
    const channelId =
      remoteMessage.notification.android.channelId || "Notifications";
    const notification = {
      ...remoteMessage.notification,
      ...{ android: { channelId } },
      ...{ data: remoteMessage.data || null },
    };

    PushNotification.localNotification(notification);
  };

  initDeviceToken = () => {
    // Get the device token
    /* messaging()
      .getToken()
      .then(token => {
        return this.saveTokenToDatabase(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      this.saveTokenToDatabase(token);
    }); */
  };

  saveTokenToDatabase = (token) => {
    const { user } = this.props;
    if (user.id) {
      console.log("Device token", token);
      const input = {
        device_token: token,
        serial: "abcdef" /* DeviceInfo.getUniqueId() */,
        model: "abcdef" /* DeviceInfo.getModel() */,
        platform: Platform.OS,
      };
      this.props.actions.addDeviceToken(input);
    } else {
      const input = {
        serial: "abcdef" /* DeviceInfo.getUniqueId() */,
      };
      this.props.actions.removeDeviceToken(input);
    }
  };

  formatDate = (date, timestamp = false) => {
    return moment(date).format(timestamp ? "YYYY-MM-DD HH:mm:ss" : "h:mm A");
  };

  render() {
    return null;
  }
}

// function mapStateToProps(state) {
//   return {
//     user: state.user,
//     firebase: state.firebase,
//     dashboard: state.dashboard,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(
//       {...authActions, ...userdActions},
//       dispatch,
//     ),
//   };
// }

export default Firebase;
