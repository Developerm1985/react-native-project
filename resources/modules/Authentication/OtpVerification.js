import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import { MessagePopup } from "../../components/common";
import {
  otpVerificationUser,
  STATUSES,
  loginUser,
} from "../../slices/authSlice";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { BackButton } from "../../components/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpVerification = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { useremail, status } = useSelector((state) => state.user);
  const [otp, setOtp] = useState("");
  const [fcmToken, setFcmToken] = useState();
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    const fcmToken = await AsyncStorage.getItem("_fcmtoken");
    setFcmToken(fcmToken);
  };

  const submitForm = () => {
    if (otp.length === 4) {
      let params = {
        email: useremail.email,
        otp: otp,
        fcm_token: fcmToken,
        type: useremail.type,
      };
      dispatch(otpVerificationUser(params, navigation));
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

  const resendOtp = () => {
    setOtp("");
    setCounter(60);
    const params = {
      email: useremail?.email,
      type: useremail?.type,
    };
    dispatch(loginUser(params, (navigation = false)));
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
        <View style={{ backgroundColor: palette.lightGray }}>
          <View
            backgroundColor={palette.yellow}
            style={styles.headerLogoWrapper}
          >
            <Image
              resizeMode="stretch"
              source={require("@img/logo.png")}
              style={styles.logoHeader}
            />
          </View>
        </View>
        <View style={styles.headerTitle}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Account Verification</Text>
          </View>
          <Image
            resizeMode="stretch"
            source={require("@img/login-title-right-img.png")}
            style={styles.TitleRightImg}
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.header}>
            <BackButton
              onPress={() =>
                navigation.replace("Login", {
                  email: useremail,
                })
              }
              containerStyle={styles.backBtnContainerStyle}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>OTP Verification</Text>
            </View>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                marginTop: 20,
                marginBottom: 5,
                fontSize: 13,
                color: palette.secondaryBlack,
              }}
            >
              Enter the 4-Digit PIN we sent to {route?.params?.type}.
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

export default OtpVerification;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    color: palette.secondaryBlack,
    fontWeight: "bold",
    textAlign: "left",
  },
  headerTextContainer: {
    // paddingRight: 30,
    textAlign: "left",
    marginLeft: 30,
  },
  TitleRightImg: {
    width: 100,
    height: 25,
    marginRight: -0,
  },
  headerTitle: {
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 0,
  },

  headerLogoWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginRight: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  logoHeader: {
    maxWidth: 170,
    height: 50,
  },

  borderStyleHighLighted: {
    borderColor: "red",
    backgroundColor: "red",
  },

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
  // headerText: {
  //   fontSize: 18,
  //   color: palette.secondaryBlack,
  //   fontWeight: "bold",
  // },
  // headerTextContainer: {
  //   alignItems: "",
  //   paddingRight: 30,
  //   flex: 1,
  // },
  backBtnContainerStyle: {
    flexBasis: "auto",
  },
});
