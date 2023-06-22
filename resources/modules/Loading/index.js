import React, { useEffect, useState } from "react";
import { ScrollView, View, StatusBar, Text, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import palette from "../../styles/palette.styles";

import { LoadingContent } from "./components/LoadingContent";
import { LoadingImage } from "./components/LoadingImage";

import { getParcelStatus } from "../../http";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BackButton, MessagePopup } from "../../components/common";

const LoadingCheckout = ({ route }) => {
  const orderId = useSelector((state) => state.cart.orderId);
  const navigation = useNavigation();
  const [riderStatus, setRiderStatus] = useState(false);
  const [refreshIntervalId, setRefreshIntervalId] = useState(0);

  function handleBackButtonClick() {
    navigation.reset({
      index: 0,
      routes: [{ name: "DashboardRoute" }],
    });
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
  navigation.addListener("blur", () => {
    return clearInterval(refreshIntervalId);
  });

  useEffect(() => {
    route?.params?.from &&
      MessagePopup.show({
        title: "Information!",
        message:
          "Rider has been cancelled your order another rider finding.\nplease wait...",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
  }, []);

  async function getParcel() {
    try {
      const params = { order_id: route?.params?.orderId };
      const { data } = await getParcelStatus(params);
      console.log("5 SEC API CALLING...", data);
      if (data?.success) {
        data?.data
          ? setRiderStatus(
              data?.data?.order_status == "accepted" ? true : false
            )
          : "";
      } else {
        if (route?.params?.payment == "COD") {
          MessagePopup.show({
            title: "Issue!",
            message: data?.message,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  handleBackButtonClick();
                },
              },
            ],
          });
        } else {
          MessagePopup.show({
            title: "Issue!",
            message: data?.message + " & refund will be added to e-wallet",
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  handleBackButtonClick();
                },
              },
            ],
          });
        }
      }
    } catch (err) {
      MessagePopup.show({
        title: "Error!",
        message: data?.message,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              navigation.goBack();
            },
          },
        ],
      });
      throw err;
    }
  }

  useEffect(() => {
    clearInterval(refreshIntervalId);
    riderStatus
      ? navigation.replace(route.params.screenName, {
          orderId: route.params.orderId,
        })
      : setRefreshIntervalId(
          setInterval(() => {
            getParcel();
          }, 5000)
        );

    return () => clearInterval(refreshIntervalId);
  }, [riderStatus]);

  useEffect(() => {
    const timeOutSubscription = setTimeout(
      () =>
        navigation.replace("Orders", {
          orderId: route?.params?.orderId,
          status: route?.params?.status,
          fromCheckout: true,
        }),
      15000
    );
    navigation.addListener("blur", () => clearTimeout(timeOutSubscription));
  }, []);

  return (
    <View style={{ marginTop: 40, flex: 1 }}>
      <StatusBar translucent />
      <BackButton
        containerStyle={{
          marginTop: 10,
          marginLeft: 20,
        }}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "DashboardRoute" }],
          })
        }
      />
      {console.log("route.params.path ----->", route)}
      <LoadingImage flowName={route?.params?.path} />
      <LoadingContent flowName={route?.params?.path} />
    </View>
  );
};

export default LoadingCheckout;
