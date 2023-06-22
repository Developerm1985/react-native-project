import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useNavigation } from "@react-navigation/native";
import { verifyEmailAPI, verifyEmailOrPhone } from "../../http";

const EditEmailMobileOtpVerification = (props) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = React.useState(60);

  const submitForm = async () => {
    if (otp == null || otp == "" || otp == undefined) {
      MessagePopup.show({
        title: "Warning!",
        message: "Please Enter OTP",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (otp.length === 4) {
      LoadingOverlay.show("Loading...");
      const params = {
        email_or_phone: props?.route?.params?.newData,
        type: props?.route?.params?.type,
        otp: otp,
      };
      try {
        const { data } = await verifyEmailOrPhone(params);
        LoadingOverlay.hide();
        if (data?.success) {
          LoadingOverlay.hide();
          MessagePopup.show({
            title: "Success!",
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
          });
        }
      } catch (err) {
        LoadingOverlay.hide();
      }
    } else {
      MessagePopup.show({
        title: "OTP required!!",
        message: `Please enter 4 digit OTP`,
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

  const resendOtp = async () => {
    setOtp("");
    setCounter(60);
    LoadingOverlay.show("Send again...");
    const params = {
      email: props?.route?.params?.newData,
      type: props?.route?.params?.type,
      platform:
        props?.route?.params?.oldData == null &&
        props?.route?.params?.type == "email"
          ? "cust-resd-add-eml"
          : props?.route?.params?.oldData &&
            props?.route?.params?.type == "email"
          ? "cust-resd-upd-eml"
          : props?.route?.params?.oldData == null &&
            props?.route?.params?.type == "phone"
          ? "cust-resd-add-ph"
          : "cust-resd-upd-ph",
    };
    try {
      const { data } = await verifyEmailAPI(params);
      LoadingOverlay.hide();
      if (data?.success) {
        LoadingOverlay.hide();

        MessagePopup.show({
          title: "Success!",
          message: data?.message,
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
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Warning!",
          message: data?.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                navigation?.goBack();
              },
            },
          ],
        });
      }
    } catch (err) {
      LoadingOverlay.hide();
      console.log("Resend OTP ---->", err);
    }
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <View style={styles.landing}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ flex: 0.5 }}></View>
            <View style={styles.headingContainer}>
              <Text style={styles.headingText}>
                {props?.route?.params?.type == "phone"
                  ? "Verifying your number"
                  : "Verifying your email"}
              </Text>
            </View>
            <View style={{ flex: 0.5 }}></View>
          </View>
          <View style={{ marginTop: 50, alignSelf: "center" }}>
            <Text style={{ textAlign: "center" }}>
              You've tried to register{" "}
              <Text style={{ fontWeight: "bold" }}>
                {props?.route?.params?.newData}
              </Text>{" "}
              recently. wait before requesting an SMS with your code.{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  color: palette.yellow,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {props?.route?.params?.type == "phone"
                  ? "Wrong Number?"
                  : "Wrong Email?"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: 10, marginTop: 50 }}>
            <Text
              style={{
                marginTop: 20,
                marginBottom: 5,
                fontSize: 13,
                color: palette.secondaryBlack,
              }}
            >
              Enter the 4-Digit PIN we sent to{" "}
              {props?.route?.params?.type == "phone" ? "mobile" : "mail"}.
            </Text>
            <OTPInputView
              keyboardType={"numeric"}
              style={{ width: "100%", height: 100, marginBottom: 0 }}
              pinCount={4}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeChanged={(code) => {
                setOtp(code);
              }}
              code={otp}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {counter != 0 ? (
                <>
                  <Text style={{ fontSize: 13, color: palette.secondaryBlack }}>
                    Resend OTP in
                  </Text>
                  <Text style={{ fontSize: 13, color: palette.yellow }}>
                    {` ${counter} seconds.`}
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    resendOtp();
                  }}
                >
                  <Text style={{ fontSize: 13, color: palette.yellow }}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ justifyContent: "flex-end", marginTop: 50 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.login}
              onPress={() => submitForm()}
            >
              <Text style={[textStyles.mdTextBold, { color: palette.white }]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 70,
    height: 70,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    fontSize: 25,
    color: palette.yellow,
  },
  underlineStyleHighLighted: {
    borderColor: palette.yellow,
  },
  header: {
    paddingVertical: 10,
    marginBottom: 50,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  logo: {
    maxWidth: 220,
    height: 70,
    alignSelf: "center",
  },
  landing: {
    flex: 1,
    backgroundColor: palette.lightGray,
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  login: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: 5,
  },
  headingContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontSize: 18,
    color: palette.yellow,
    fontWeight: "bold",
  },
});

export default EditEmailMobileOtpVerification;
