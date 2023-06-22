/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Linking,
  BackHandler,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import flex from "@styles/flex.styles";
import { useNavigation } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import Geolocation from "react-native-geolocation-service";
import { Modalize } from "react-native-modalize";
import MapView, { Marker } from "react-native-maps";
import {
  trackOrderDetails,
  getParcelStatus,
  orderCancel,
} from "../../http/index";
import { CommonActions } from "@react-navigation/native";
import StarRating from "react-native-star-rating";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import { useDispatch, useSelector } from "react-redux";
import { BackButton } from "../../components/common";
import { apiKey } from "../../config";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import CanclePopup from "../../components/common/CanclePopup";
import CancelDelivery from "../../components/common/CancelDelivery";

const TrackParcel = ({ route }) => {
  const { orderId, inActivity } = route.params;
  const modalizeRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [isValid, setIsValid] = useState(true);

  const [trackOrderDetail, setTrackOrderDetail] = useState({});
  const [orderStatus, setOrderStatus] = useState();
  const [pickUpLatLong, setPickUpLatLong] = useState(null);
  const [dropLatLong, setDropLatLong] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextValue, setNextValue] = useState(false);

  const { userCurrentLocation } = useSelector((state) => state.user);
  const _finalPayment = useSelector((state) => state.cart.finalPayment);
  const { userdata } = useSelector((state) => state.user);

  const [initialRegion, setInitialRegion] = useState({
    latitude: userCurrentLocation?.coords?.latitude,
    longitude: userCurrentLocation?.coords?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const API_KEY = apiKey?.google;

  const [riderRegion, setRiderRegion] = useState({
    latitude: 23.0112,
    longitude: 72.5631,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const onLoad = async () => {
    const params = {
      order_id: orderId,
    };
    try {
      const { data } = await getParcelStatus(params);
      if (data.success) {
        if (data?.data?.order_status == "processing") {
          navigation.replace("Loading", {
            from: true,
            screenName: "TrackParcel",
            orderId: data?.data?.id,
            payment: data?.data?.payment_method,
            cardData: null,
            totalPrice: data?.data?.order_amount,
            path: "food",
          });
        } else {
          setTrackOrderDetail(data.data);
          setOrderStatus(data?.data?.order_status);
          setPickUpLatLong({
            latitude: Number(JSON.parse(data?.data?.pickup?.lat_long).latitude),
            longitude: Number(
              JSON.parse(data?.data?.pickup?.lat_long).longitude
            ),
          });
          setDropLatLong({
            latitude: Number(
              JSON.parse(data?.data?.to_customer?.lat_long).latitude
            ),
            longitude: Number(
              JSON.parse(data?.data?.to_customer?.lat_long).longitude
            ),
          });
          setRiderRegion({
            latitude: Number(data?.data?.delivery_man?.latitude),
            longitude: Number(data?.data?.delivery_man?.longitude),
          });
          LoadingOverlay.hide();
        }
      } else {
        MessagePopup.show({
          title: "Cancelled order",
          message: data?.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "DashboardRoute" }],
                });
              },
            },
          ],
        });
      }

      LoadingOverlay.hide();
    } catch (err) {
      LoadingOverlay.hide();
    }
  };

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    onLoad();
  }, []);

  useEffect(() => {
    let intervals;
    if (orderStatus == "delivered") {
      navigation.replace("DeliveryComplete", {
        riderId: trackOrderDetail?.delivery_man_id,
        orderId: trackOrderDetail?.id,
        riderData: trackOrderDetail?.delivery_man,
      });
    } else {
      intervals = setInterval(() => {
        onLoad();
      }, 10000);
    }

    return () => {
      clearInterval(intervals);
    };
  }, [orderStatus]);

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{ name: "DashboardRoute" }],
  });

  const goBackAction = CommonActions.goBack();

  function handleBackButtonClick() {
    navigation.dispatch(inActivity ? goBackAction : resetAction);
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  async function handleCancleOrder(isCancelable) {
    isCancelable && setIsModalVisible(true);
  }

  // Get User current location
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");

    if (status === "granted") {
      return true;
    }

    if (status === "denied") {
      MessagePopup.show({
        title: "Location permission denied",
        // message: data.message,
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

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow Cycle House to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ]
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show("Location permission denied", ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show("Location permission revoked", ToastAndroid.LONG);
    }
    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setInitialRegion({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        MessagePopup.show({
          title: "Error!",
          message: error.message,
          actions: [
            {
              text: "OKAY",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
        console.log(error);
      },
      {
        accuracy: {
          android: "high",
          ios: "best",
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    hasLocationPermission();
  }, []);

  return (
    <>
      <View style={{ flex: 1 }}>
        {!pickUpLatLong?.latitude &&
        !pickUpLatLong?.longitude &&
        !dropLatLong?.latitude &&
        !dropLatLong?.longitude ? (
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              flex: 1,
            }}
          >
            <Text style={{ alignSelf: "center" }}>Finding routes...</Text>
          </View>
        ) : (
          <>
            {initialRegion?.latitude &&
            initialRegion?.longitude &&
            pickUpLatLong?.latitude &&
            pickUpLatLong?.longitude &&
            dropLatLong?.latitude &&
            dropLatLong?.longitude &&
            riderRegion?.latitude &&
            riderRegion?.longitude ? (
              <MapView
                ref={mapRef}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                }}
                animateToViewingAngle
                initialRegion={initialRegion}
                mapType="standard"
              >
                <MapViewDirections
                  origin={
                    trackOrderDetail.order_status == "accepted"
                      ? pickUpLatLong
                      : riderRegion
                  }
                  destination={dropLatLong}
                  apikey={API_KEY} // insert your API Key here
                  strokeWidth={3}
                  strokeColor="#2664F5"
                />
                <Marker
                  coordinate={
                    trackOrderDetail.order_status == "accepted"
                      ? pickUpLatLong
                      : riderRegion
                  }
                >
                  <Image
                    style={{
                      height: 30,
                      width: 35,
                    }}
                    resizeMode="contain"
                    source={
                      trackOrderDetail.order_status == "accepted"
                        ? require("../../img/resturent-pin.png")
                        : require("../../img/rider-pin.png")
                    }
                  />
                </Marker>
                <Marker coordinate={dropLatLong}>
                  <Image
                    style={{
                      height: 30,
                      width: 35,
                    }}
                    resizeMode="contain"
                    source={require("../../img/drop-pin.png")}
                  />
                </Marker>
                {trackOrderDetail.order_status == "accepted" ? (
                  <Marker coordinate={riderRegion}>
                    <Image
                      style={{
                        height: 30,
                        width: 35,
                      }}
                      resizeMode="contain"
                      source={require("../../img/rider-pin.png")}
                    />
                  </Marker>
                ) : (
                  <></>
                )}
              </MapView>
            ) : (
              <></>
            )}
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: "absolute",
            top: 50,
            zIndex: 999,
            right: 20,
            padding: 10,
            backgroundColor: palette.yellow,
            borderRadius: 10,
          }}
          onPress={() => {
            mapRef.current.animateToRegion(initialRegion, 2.5 * 1000);
          }}
        >
          <FontAwesome5Icon
            name="location-arrow"
            style={{ color: palette.white }}
            size={15}
          />
        </TouchableOpacity>

        <Modalize
          modalStyle={{ backgroundColor: "#fff" }}
          handleStyle={{
            backgroundColor: "#fff",
            height: 30,
            width: "100%",
            zIndex: 999,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          ref={modalizeRef}
          modalTopOffset={100}
          alwaysOpen={220}
        >
          <View style={{ backgroundColor: palette.white, paddingTop: 7 }}>
            <StatusBar translucent backgroundColor={palette.yellow} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
            >
              <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    inActivity
                      ? navigation.goBack()
                      : navigation.reset({
                          index: 0,
                          routes: [{ name: "DashboardRoute" }],
                        })
                  }
                  style={{
                    marginTop: 12,
                    zIndex: 999,
                    position: "absolute",
                    left: 15,
                    padding: 10,
                  }}
                >
                  <BackButton />
                </TouchableOpacity>
                <View
                  style={[
                    flex.direction.column,
                    flex.centerAll,
                    { marginTop: 12 },
                  ]}
                >
                  <Image
                    resizeMode="cover"
                    source={
                      isValid
                        ? {
                            uri: trackOrderDetail?.delivery_man?.image,
                            cache: "force-cache",
                          }
                        : require("../../img/account.png")
                    }
                    onError={() => {
                      setIsValid(false);
                    }}
                    style={[
                      styles.riderImage,
                      { borderWidth: 1, borderColor: "#D3D3D3" },
                    ]}
                  />
                  <Text
                    style={[
                      textStyles.size.sm,
                      textStyles.weight.regular,
                      { paddingHorizontal: 5, marginTop: 10 },
                    ]}
                  >
                    {trackOrderDetail?.delivery_man?.f_name ||
                    trackOrderDetail?.delivery_man?.l_name
                      ? `${trackOrderDetail?.delivery_man?.f_name} ${trackOrderDetail?.delivery_man?.l_name}`
                      : trackOrderDetail?.delivery_man?.full_name
                      ? trackOrderDetail?.delivery_man?.full_name
                      : "Guest User"}
                  </Text>
                  {trackOrderDetail?.delivery_man?.vehicle_brand &&
                    trackOrderDetail?.delivery_man?.vehicle_category &&
                    trackOrderDetail?.delivery_man?.vehicle_model && (
                      <Text
                        style={[
                          textStyles.size.sm,
                          textStyles.weight.regular,
                          { paddingHorizontal: 5 },
                        ]}
                      >
                        {`${trackOrderDetail?.delivery_man?.vehicle_category} - ${trackOrderDetail?.delivery_man?.vehicle_brand} ${trackOrderDetail?.delivery_man?.vehicle_model}`}
                      </Text>
                    )}
                  <View
                    style={[
                      flex.direction.row,
                      flex.centerAll,
                      { marginTop: 1 },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        halfStarEnabled={true}
                        starSize={15}
                        emptyStarColor={palette.yellow}
                        fullStarColor={palette.yellow}
                        rating={
                          trackOrderDetail?.delivery_man?.rating_avg
                            ? Number(trackOrderDetail?.delivery_man?.rating_avg)
                            : 0
                        }
                      />
                      <Text
                        style={[
                          textStyles.size.xs,
                          textStyles.weight.regular,
                          textStyles.color.mediumGray,
                          { marginLeft: 8 },
                        ]}
                      >
                        {Number(
                          trackOrderDetail?.delivery_man?.rating_avg
                        ).toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      textStyles.color.darkGray,
                      { paddingHorizontal: 5, marginTop: 10 },
                    ]}
                  >
                    {trackOrderDetail?.delivery_man?.vehicale_name}
                  </Text>
                  <View style={[styles.ContactIconOuter]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        Linking.openURL(
                          `sms:${trackOrderDetail.delivery_man?.phone}`
                        )
                      }
                    >
                      <Image
                        source={require("@img/mail-ic.png")}
                        style={styles.CIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        Linking.openURL(
                          `tel:${trackOrderDetail.delivery_man?.phone}`
                        )
                      }
                    >
                      <Image
                        source={require("@img/call-i.png")}
                        style={styles.CIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={[
                    flex.direction.row,
                    flex.contentBetween,
                    {
                      borderBottomColor: "#d5d5d5",
                      borderBottomWidth: 1,
                      paddingVertical: 20,
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[textStyles.color.black]}
                  >
                    {trackOrderDetail?.order_status == "accepted"
                      ? "Arriving at Pick-up point..."
                      : trackOrderDetail?.order_status == "picked"
                      ? "Arriving at Drop-off point..."
                      : "Order is Delivered"}
                  </Text>
                  <Text
                    style={[
                      textStyles.smTextBold,
                      { color: "#FEA200", fontWeight: "700" },
                    ]}
                  >
                    {trackOrderDetail?.eta_time} min
                  </Text>
                </View>
                <View
                  style={{
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d5d5d5",
                    marginBottom: 20,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold" }}>Pick-up</Text>
                    <View style={{ ...styles.AddressOneContainer }}>
                      <View style={styles.LocationContent}>
                        <Image
                          style={{ width: 18, height: 18 }}
                          resizeMode={"contain"}
                          source={require("@img/location-ios.png")}
                        />
                        <Text style={styles.AddressTitle}>
                          {trackOrderDetail?.pickup?.title
                            ? trackOrderDetail?.pickup?.title
                            : trackOrderDetail?.pickup?.address.split(",")[0]}
                        </Text>
                      </View>
                      <View style={{ left: 5 }}>
                        <Text style={styles.Address}>
                          {trackOrderDetail?.pickup?.address}
                        </Text>
                        <Text style={{ ...styles.Address, marginTop: 10 }}>
                          {`${
                            trackOrderDetail?.order_type == "parcel"
                              ? `${trackOrderDetail?.order_detail?.pick_up_recipient_name}  `
                              : ""
                          }+${trackOrderDetail?.pickup?.contact_number}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "bold" }}>Drop-off</Text>
                    <View style={{ ...styles.AddressOneContainer }}>
                      <View style={styles.LocationContent}>
                        <Image
                          style={{ width: 18, height: 18 }}
                          resizeMode={"contain"}
                          source={require("@img/location-ios.png")}
                        />
                        <Text style={styles.AddressTitle}>
                          {" "}
                          {trackOrderDetail?.to_customer?.title
                            ? trackOrderDetail?.to_customer?.title
                            : trackOrderDetail?.to_customer?.delivery_address.split(
                                ","
                              )[0]}
                        </Text>
                      </View>
                      <View style={{ left: 5 }}>
                        <Text style={styles.Address}>
                          {trackOrderDetail?.to_customer?.delivery_address}
                        </Text>
                        <Text style={{ ...styles.Address, marginTop: 10 }}>
                          {`${
                            trackOrderDetail?.order_type == "parcel"
                              ? `${trackOrderDetail?.order_detail?.drop_off_recipient_name}  `
                              : ""
                          }${
                            trackOrderDetail?.to_customer?.contact_number ==
                            null
                              ? "-"
                              : `+${trackOrderDetail?.to_customer?.contact_number}`
                          }`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[textStyles.color.black, { marginTop: 8 }]}
                >
                  Payment Details
                </Text>
                <View
                  style={[
                    flex.direction.row,
                    flex.contentBetween,
                    { paddingVertical: 10 },
                  ]}
                >
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {trackOrderDetail?.payment_method}
                  </Text>
                  <Text style={[textStyles.smTextBold, { fontSize: 18 }]}>
                    P{parseFloat(trackOrderDetail?.order_amount).toFixed(2)}
                  </Text>
                </View>
                {trackOrderDetail?.order_details?.isDelivered ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.CancelBtn}
                    onPress={() => handleCancleOrder(false)}
                  >
                    <Text
                      style={[textStyles.mdTextBold, { color: palette.black }]}
                    >
                      Give a feedback
                    </Text>
                  </TouchableOpacity>
                ) : trackOrderDetail.order_status == "pending" ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.CancelBtn}
                    onPress={() => {
                      handleCancleOrder(true);
                    }}
                  >
                    <Text
                      style={[textStyles.mdTextBold, { color: palette.black }]}
                    >
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>
            </ScrollView>
          </View>
        </Modalize>

        {isModalVisible == true ? (
          <CanclePopup
            isModalVisible={true}
            handleModalTogle={(v) => setIsModalVisible(v)}
            callNext={(value) => setNextValue(value)}
          />
        ) : (
          <></>
        )}

        {nextValue ? (
          <CancelDelivery
            order_id={orderId}
            isModalVisible={true}
            handleModalTogle={(v) => setNextValue(v)}
          />
        ) : (
          <></>
        )}
      </View>
    </>
  );
};
const styles = {
  AddressOneContainer: {
    shadowColor: "#ccc",
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 10,
    backgroundColor: palette.white,
    borderRadius: 10,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 10,
  },
  LocationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  AddressTitle: {
    color: palette.yellow,
    fontWeight: "bold",
  },
  Address: {
    fontSize: 14,
    color: "#000",
    paddingLeft: 16,
  },
  riderImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginTop: 0,
  },
  ContactIconOuter: {
    position: "absolute",
    right: 0,
    top: 0,
    flexDirection: "row",
  },
  CIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
  },
  logLine: {
    position: "absolute",
    height: "100%",
    top: 40,
    left: 9,
    width: 0,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
  },
  CancelBtn: {
    backgroundColor: palette.lightGray,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 20,
  },
};

export { TrackParcel };
