import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import {
  LoginButton,
  AccessToken,
  Settings,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AuthenticationToken,
} from "react-native-fbsdk-next";
// import { FBLogin } from "../../../actions/auth.actions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import { FacebookAuthentication } from "../../slices/authSlice";
import auth from "@react-native-firebase/auth";
// import MessagePopup from "../../../components/common/MessagePopup";

const FacebookLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fcmToken, setFcmToken] = useState();

  // useEffect(() => {
  //   Settings.setAppID("");
  // }, []);

  useEffect(() => {
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    const fcmtokens = await AsyncStorage.getItem("_fcmtoken");
    setFcmToken(fcmtokens);
  };

  async function getAccessToken() {
    LoadingOverlay.show("Loading...");
    if (Platform.OS == "android") {
      LoginManager.setLoginBehavior("web_only");
    }
    return LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      async (login) => {
        if (!login.isCancelled) {
          if (Platform.OS === "ios") {
            LoadingOverlay.hide();
            let token = await AuthenticationToken.getAuthenticationTokenIOS();
            getInfoFromToken(token?.accessToken);
          } else {
            LoadingOverlay.hide();
            let token = await AccessToken.getCurrentAccessToken();
            getInfoFromToken(token?.accessToken);
          }
        } else {
          LoadingOverlay.hide();
        }
      },
      (error) => {
        LoadingOverlay.hide();
        throw error;
      }
    );
  }
  const getInfoFromToken = async (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: "id,name,first_name,last_name,email",
      },
    };
    const profileRequest = await new GraphRequest(
      "/me",
      {
        accessToken: token,
        httpMethod: "GET",
        version: "v2.5",
        parameters: PROFILE_REQUEST_PARAMS,
      },
      (error, user) => {
        if (error) {
          MessagePopup.show({
            title: error.message,
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
          throw error;
        } else {
          let params = {
            token: token,
            medium: "facebook",
            unique_id: user.id,
            fcm_token: fcmToken,
          };
          async function datas() {
            const facebookCredential =
              await auth.FacebookAuthProvider.credential(token);
            await dispatch(FacebookAuthentication(params, navigation));
            return auth().signInWithCredential(facebookCredential);
          }
          datas();
        }
      }
    );
    await new GraphRequestManager().addRequest(profileRequest).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        height: 55,
        width: "98%",
        backgroundColor: "#4267B2",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
      }}
      onPress={() => getAccessToken()}
    >
      <FontAwesome
        style={{ marginRight: 15 }}
        name="facebook"
        color="white"
        solid
        size={25}
      />
      <Text
        style={{
          color: "white",
          textAlign: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: "600",
        }}
      >
        Log in with Facebook
      </Text>
    </TouchableOpacity>
  );
};

export default FacebookLogin;
