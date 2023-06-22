import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

import { Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import formInputs from "@styles/formInputs.styles";
import * as InputValidator from "../../helpers/InputValidator";
import { MessagePopup } from "../../components/common";
import GoogleAuth from "../../modules/Authentication/GoogleAuth";
import Logo from "./components/logo";
import { Settings } from "react-native-fbsdk-next";
import FacebookLogin from "./FacebookLogin";
import { loginUser, setClearRedux } from "../../slices/authSlice";
import AppleAuth from "./AppleAuth";
import { version } from "./../../../package.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "../../config";

// Settings.setAppID("");

const Login = ({ navigation, route }) => {
  const [email, setEmail] = useState(route?.params?.email?.email);
  const dispatch = useDispatch();

  const clearAllData = async () => {
    await AsyncStorage.removeItem("user", async () => {
      console.log("Remove User Data");
    });
  };

  useEffect(() => {
    clearAllData();
    dispatch(setClearRedux());
  }, []);

  const CompanyConditions = (linkKeyword) => {
    const urls =
      linkKeyword == "termscondition"
        ? URL.base + "customer-terms-and-conditions"
        : URL.base + "customer-privacy-policy";
    navigation.navigate("CompanyCondition", {
      url: urls,
      headerTitle: linkKeyword,
    });
  };

  const submitForm = () => {
    const Emailreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const Mobilereg =
      /(^0|[89]\d{2}-\d{3}\-?\d{4}$)|(^0|[89]\d{2}\d{3}\d{4}$)|(^63[89]\d{2}-\d{3}-\d{4}$)|(^63[89]\d{2}\d{3}\d{4}$)|(^[+]63[89]\d{2}\d{3}\d{4}$)|(^[+]63[89]\d{2}-\d{3}-\d{4}$)/;

    if (isNaN(email)) {
      if (email?.includes("@") === true) {
        if (email == undefined || email == "") {
          MessagePopup.show({
            title: "Required!",
            message: "Enter the email address",
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
        } else if (Emailreg?.test(email) == false) {
          MessagePopup.show({
            title: "Required!",
            message: "Enter the valid email address",
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
        } else {
          let params = {
            email: email?.split(/\s+/).join("").toLocaleLowerCase(),
            type: "email",
          };
          dispatch(loginUser(params, navigation));
        }
      } else {
        MessagePopup.show({
          title: "Required!",
          message: "Enter the email address or mobile",
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
    } else {
      if (email?.length == "" || email?.length == undefined) {
        MessagePopup.show({
          title: "Required!",
          message: "Enter the email or mobile number",
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
      } else if (Mobilereg?.test(email) == false) {
        MessagePopup.show({
          title: "Required!",
          message: "Enter the valid mobile number",
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
      } else {
        let params = {
          email: email,
          type: "phone",
        };
        dispatch(loginUser(params, navigation));
      }
    }
  };

  return (
    <View style={styles.landing}>
      <Logo navigation={navigation} isButtonBack={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Log in to your Account</Text>
            </View>
            <Image
              resizeMode="stretch"
              source={require("@img/login-title-right-img.png")}
              style={styles.TitleRightImg}
            />
          </View>
          <View style={{ marginHorizontal: -10 }}>
            <Input
              inputStyle={formInputs.input}
              inputContainerStyle={formInputs.inputContainer}
              labelStyle={[formInputs.label, textStyles.normalTextRegular]}
              label="email or mobile"
              placeholder="Enter email or mobile"
              value={email}
              onChangeText={(e) => setEmail(e)}
              keyboardType={"email-address"}
            />
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.login}
              onPress={submitForm}
            >
              <Text style={[textStyles.mdTextBold, { color: palette.white }]}>
                Log In
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 25,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D3D3D3" }}
              />
              <View>
                <Text style={{ width: 50, textAlign: "center", color: "gray" }}>
                  OR
                </Text>
              </View>
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D3D3D3" }}
              />
            </View>
            <GoogleAuth navigation={navigation} />
            <FacebookLogin navigation={navigation} />
            {Platform.OS == "ios" && <AppleAuth navigation={navigation} />}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            alignSelf: "center",
            marginStart: 25,
            flexWrap: "wrap",
          }}
        >
          <Text style={styles.termpolicy}>
            By logging in, you agree to the{" "}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => CompanyConditions("termscondition")}
          >
            <Text style={styles.linkText}>Terms{` & `}Conditions</Text>
          </TouchableOpacity>
          <Text style={styles.termpolicy}> and </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => CompanyConditions("privacypolicy")}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.termpolicy}> of CycleHouse Services</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: palette.darkGray }}>Version : {version}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // paddingVertical: 10,
    marginBottom: 50,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  TitleRightImg: {
    width: 100,
    height: 25,
    marginRight: -20,
  },
  logo: {
    maxWidth: 220,
    height: 70,
    alignSelf: "center",
  },
  landing: {
    flex: 1,
    backgroundColor: palette.white,
    justifyContent: "center",
  },
  login: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    marginBottom: 0,
    paddingVertical: 15,
    borderRadius: 5,
    height: 55,
  },
  headerText: {
    fontSize: 18,
    color: palette.secondaryBlack,
    fontWeight: "bold",
  },
  headerTextContainer: {
    paddingRight: 30,
    flex: 1,
  },
  backBtnContainerStyle: {
    flexBasis: "auto",
  },
  appleButton: {
    width: "95%",
    height: 50,
    margin: 10,
  },
  termpolicy: {
    fontSize: 14,
    color: palette.yellow,
  },
  linkText: {
    color: "#3b5998",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Login;
