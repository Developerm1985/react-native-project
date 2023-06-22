import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet, BackHandler, SafeAreaView } from "react-native";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import palette from "../../styles/palette.styles";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/common/Header";

const GcashModule = (props) => {
  const navigation = useNavigation();

  function handleBackButtonClick() {
    MessagePopup.show({
      title: "confirm!",
      message: `Are you sure want to cancel payment`,
      actions: [
        {
          text: "Okay",
          action: () => {
            MessagePopup.hide();
            props?.route?.params?.from == "checkout"
              ? navigation.goBack("MyCart")
              : navigation.pop(2);
          },
        },
        {
          text: "Cancel",
          action: () => {
            MessagePopup.hide();
          },
        },
      ],
      closeOnOverlayPress: false,
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

  const checkUrl = (url) => {
    let statusUrl = url?.includes("status");
    if (statusUrl) {
      if (url?.includes("status=S")) {
        LoadingOverlay.show("Payment completing...");
        setTimeout(() => {
          LoadingOverlay.hide();
          if (props?.route?.params?.orderType == "Pre-Order") {
            MessagePopup.show({
              title: "Place order!",
              message: "Order placed successfully",
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
              closeOnOverlayPress: false,
            });
          } else {
            navigation.replace("Loading", {
              screenName: props?.route?.params?.screenName,
              orderId: props?.route?.params?.orderId,
              payment: props?.route?.params?.payment,
              cardData: props?.route?.params?.cardData,
              status: props?.route?.params?.status,
              path: props?.route?.params?.path,
            });
          }
        }, 2000);
      } else if (url?.includes("status=F")) {
        LoadingOverlay.show("wait...");
        setTimeout(() => {
          LoadingOverlay.hide();
          props?.route?.params?.from == "checkout"
            ? navigation.goBack("MyCart")
            : navigation.pop(2);
        }, 2000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.landing}>
      <Header
        headerName="Payment"
        headerNameStyles={styles.headerText}
        backAction={handleBackButtonClick}
        mainContainer={{
          boorderWidth: 1,
        }}
      />
      <View style={styles.WebViewContainer}>
        <WebView
          source={{
            uri: props?.route?.params?.paymentUrls,
            cache: "force-cache",
          }}
          style={{
            backgroundColor: "#fff",
            height: 350,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={true}
          mixedContentMode={"never"} // security
          onMessage={(event) => {
            console.log(event.nativeEvent.data);
          }}
          onNavigationStateChange={(state) => {
            checkUrl(state?.url);
          }}
          javaScriptEnabledAndroid={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  landing: {
    flex: 1,
    backgroundColor: palette.white,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    color: palette.secondaryBlack,
    fontWeight: "bold",
  },
  WebViewContainer: {
    flex: 1,
  },
});

export default GcashModule;
