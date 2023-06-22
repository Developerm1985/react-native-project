import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BackButton, LoadingOverlay } from "../../components/common";
import { OptionList, Payment, PromoCode } from "./components";

import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDeliveryOption, paymentUrl, placeParcel } from "../../http";
import { MessagePopup } from "../../components/common";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { Modalize } from "react-native-modalize";
import MapViewDirections from "react-native-maps-directions";
import { setReset } from "../../slices/parcelSlice";
import { apiKey } from "../../config";

const DeliveryOption = ({ route }) => {
  const navigation = useNavigation();
  const { pickupData, dropoffData, picked, dropped, pickTitle, dropTitle } =
    useSelector((state) => state.parcel);
  const { userdata } = useSelector((state) => state.user);
  console.log("USER DATA INTO DELIVERY OPTION => ", userdata);
  const dispatch = useDispatch();
  const API_KEY = apiKey?.google;

  const modalizeRef = useRef(null);
  const [shouldShow, setShouldShow] = useState(true);
  const [optionSelect, setOptionSelect] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState([]);
  const [promoValid, setPromoValid] = useState("");
  const [couponState, setCouponState] = useState();
  const [paymentSelecteOpt, setPaymentSelecteOpt] = useState("");
  const [promoTitle, setPromoTitle] = useState("");
  const [keyboardLayout, setKeyboardLayout] = useState(null);
  const { parcelTypeId, pickeUpData, dropOffData } = route.params;

  const pickUpLatlong = {
    latitude: parseFloat(pickeUpData.latlong.lat),
    longitude: parseFloat(pickeUpData.latlong.lng),
  };

  const dropOffLatlong = {
    latitude: parseFloat(dropOffData.latlong.lat),
    longitude: parseFloat(dropOffData.latlong.lng),
  };

  const initialRegion = {
    latitude: parseFloat(pickeUpData.latlong.lat),
    longitude: parseFloat(pickeUpData.latlong.lng),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    onload();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardLayout(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", (e) => {
      setKeyboardLayout(10);
    });

    return () => {
      showSubscription.remove(), hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setCouponState(true);
  }, [optionSelect]);

  const onload = async () => {
    const params = {
      parcel_type_id: parcelTypeId,
      pick_up_lat_long: {
        latitude:
          typeof pickeUpData.latlong == "string"
            ? JSON.parse(pickeUpData?.latlong).lat
            : pickeUpData.latlong.lat,
        longitude:
          typeof pickeUpData.latlong == "string"
            ? JSON.parse(pickeUpData?.latlong).lng
            : pickeUpData.latlong.lng,
      },
      drop_off_lat_long: {
        latitude:
          typeof dropOffData.latlong == "string"
            ? JSON.parse(dropOffData.latlong).lat
            : dropOffData.latlong.lat,
        longitude:
          typeof dropOffData.latlong == "string"
            ? JSON.parse(dropOffData.latlong).lng
            : dropOffData.latlong.lng,
      },
    };
    try {
      LoadingOverlay.show("Loading...");
      const { data } = await getDeliveryOption(params);
      data.success
        ? setDeliveryOption(data)
        : MessagePopup.show({
            title: "Attention!",
            message: data.message,
            actions: [
              {
                text: "Try again!",
                action: () => {
                  onload();
                  MessagePopup.hide();
                },
              },
              {
                text: "Cancel",
                action: () => {
                  navigation.goBack();
                  MessagePopup.hide();
                },
              },
            ],
          });
      LoadingOverlay.hide();
    } catch (err) {
      LoadingOverlay.hide();
      MessagePopup.show({
        title: "Delivery distance is too far!",
        message: "The maximum delivery distance is only up to 100KM",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              dispatch(setReset());
              navigation.goBack();
            },
          },
        ],
      });
      throw err;
    }
  };

  const verifyUser = async () => {
    if (
      optionSelect == null ||
      optionSelect == undefined ||
      optionSelect == ""
    ) {
      MessagePopup.show({
        title: "Required!",
        message: "Please select at least one vehicle",
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
      LoadingOverlay.show("Loading...");
      if (userdata?.is_requested == false) {
        LoadingOverlay.hide();
        navigation.navigate("OneMoreStep", {
          fromCart: true,
        });
      } else {
        LoadingOverlay.hide();
        setShouldShow(!shouldShow);
      }
    }
  };

  const callPlaceOrder = async () => {
    const _params = {
      parcel_type_id: parcelTypeId,
      delivery_option_id: optionSelect,
      pick_up_address: pickeUpData.address,
      drop_off_address: dropOffData.address,
      pick_up_lat_long: {
        latitude:
          typeof pickeUpData.latlong == "string"
            ? JSON.parse(pickeUpData.latlong).lat
            : pickeUpData.latlong.lat,
        longitude:
          typeof pickeUpData.latlong == "string"
            ? JSON.parse(pickeUpData.latlong).lng
            : pickeUpData.latlong.lng,
      },
      drop_off_lat_long: {
        latitude:
          typeof dropOffData.latlong == "string"
            ? JSON.parse(dropOffData.latlong).lat
            : dropOffData.latlong.lat,
        longitude:
          typeof dropOffData.latlong == "string"
            ? JSON.parse(dropOffData.latlong).lng
            : dropOffData.latlong.lng,
      },
      pick_up_recipient_name: pickeUpData.reciptName,
      pick_up_contact_number: pickeUpData.contact,
      pick_up_note: pickeUpData.notes,
      drop_off_recipient_name: dropOffData.reciptName,
      drop_off_contact_number: dropOffData.contact,
      drop_off_note: dropOffData.notes,
      payment_method: paymentSelecteOpt,
      coupon_code: promoTitle,
      pick_up_address_title: pickTitle,
      drop_off_address_title: dropTitle,
    };

    if (paymentSelecteOpt == "") {
      LoadingOverlay.hide();
      MessagePopup.show({
        title: "Required!",
        message: "Please select payment option",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (paymentSelecteOpt === "cod") {
      try {
        const { data } = await placeParcel(_params);
        LoadingOverlay.hide();
        data?.success
          ? navigation.navigate("Loading", {
              orderId: data.data.id,
              screenName: "TrackParcel",
              path: "parcel",
              payment: "COD",
              status: "pending",
            })
          : MessagePopup.show({
              title: "Uncategorized Error",
              message: data.errors[0].message,
              actions: [
                {
                  text: "Okay",
                  action: () => {
                    MessagePopup.hide();
                  },
                },
              ],
            });
        data?.success ? dispatch(setReset()) : "";
      } catch (err) {
        LoadingOverlay.hide();
        MessagePopup.show({
          message: err.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
        throw err;
      }
    } else {
      try {
        const { data } = await placeParcel(_params);
        if (data?.data?.id) {
          const newParam = {
            order_id: data?.data?.id,
            type: "Ready-Made",
          };
          console.log("newParam --------->", newParam);
          try {
            const { data } = await paymentUrl(newParam);
            LoadingOverlay.hide();
            data?.success &&
              navigation.navigate("GcashModule", {
                paymentUrls: data?.data?.url,
                screenName: "TrackParcel",
                orderId: newParam?.order_id,
                payment: paymentSelecteOpt,
                status: "pending",
                path: "parcel",
              });
          } catch (err) {
            LoadingOverlay.hide();
          }
        }
      } catch (err) {
        LoadingOverlay.hide();
        throw err;
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <MapView
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          animateToViewingAngle
          initialRegion={initialRegion}
          onRegionChangeComplete={(region) => {
            region;
          }}
        >
          <MapViewDirections
            origin={pickUpLatlong}
            destination={dropOffLatlong}
            apikey={API_KEY} // insert your API Key here
            strokeWidth={3}
            strokeColor="#2664F5"
            optimizeWaypoints={true}
          />

          <Marker coordinate={pickUpLatlong}>
            <Image
              style={{
                height: 30,
                width: 35,
              }}
              resizeMode="contain"
              source={require("../../img/drop-pin.png")}
            />
          </Marker>

          <Marker coordinate={dropOffLatlong}>
            <Image
              style={{
                height: 30,
                width: 35,
              }}
              resizeMode="contain"
              source={require("../../img/parcel-pin.png")}
            />
          </Marker>
        </MapView>
        <View style={{ position: "absolute", top: 0 }}>
          <BackButton containerStyle={{ marginTop: 15, marginStart: 15 }} />
        </View>
      </View>
      <View
        style={{
          flex: 2,
          backgroundColor: "#fff",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <ScrollView>
          {deliveryOption?.data?.length > 0 ? (
            <KeyboardAvoidingView>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  paddingTop: 5,
                  borderRadius: 15,
                  flex: 1,
                }}
              >
                {shouldShow ? (
                  <View style={{ bottom: keyboardLayout }}>
                    <OptionList
                      deliveryOptionList={deliveryOption.data}
                      handleSelectOption={(_id) => {
                        setOptionSelect(_id);
                      }}
                      isValid={promoValid}
                    />
                    {couponState ? (
                      <PromoCode
                        // handleCoupon={(_id) => {
                        //   onload(_id);
                        // }}
                        handleDeliveryOption={(data) => setDeliveryOption(data)}
                        selectedIdOpt={optionSelect}
                        // _setCouponState={couponState}
                        handleTextPromo={(v) => setPromoValid(v)}
                        getPromo={(promo) => setPromoTitle(promo)}
                      />
                    ) : (
                      <></>
                    )}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.nextBtn}
                      onPress={() => {
                        verifyUser();
                      }}
                    >
                      <Text
                        style={[
                          textStyles.mdTextBold,
                          { color: palette.white, fontWeight: "700" },
                        ]}
                      >
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Payment
                      handlePaymentSelect={(value) =>
                        setPaymentSelecteOpt(value)
                      }
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.nextBtn, { marginTop: 130 }]}
                      onPress={() => {
                        // setShouldShow(!shouldShow);
                        LoadingOverlay.show("Loading...");
                        callPlaceOrder();
                      }}
                    >
                      <Text
                        style={[
                          textStyles.mdTextBold,
                          { color: palette.white, fontWeight: "700" },
                        ]}
                      >
                        Deliver Now
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </KeyboardAvoidingView>
          ) : (
            <></>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  nextBtn: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 15,
  },
};

export default DeliveryOption;
