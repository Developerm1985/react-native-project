import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { LoadingOverlay, MessagePopup } from "@components/common/";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GoogleLogo from "../../img/google-logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  GoogleAuthentication,
  setSocialImage,
  setSocialName,
} from "../../slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
const GoogleAuth = ({ navigation }) => {
  const [googleuser, setGoogleUser] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [fcmToken, setFcmToken] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    const fcmtokens = await AsyncStorage.getItem("_fcmtoken");
    setFcmToken(fcmtokens);
  };

  const signInGoogle = async () => {
    await GoogleSignin.configure({
      androidClientId:
        "",
      iosClientId:
        "",
      offlineAccess: true,
      webClientId:
        "",
    });

    GoogleSignin.hasPlayServices()
      .then((hasPlayService) => {
        if (hasPlayService) {
          GoogleSignin.signIn().then(async (userInfo) => {
            LoadingOverlay.show("Loading...");
            let params = {
              token: userInfo?.idToken,
              medium: "google",
              fcm_token: fcmToken,
            };
            setGoogleUser(userInfo);
            dispatch(setSocialName(userInfo?.user?.name));
            dispatch(setSocialImage(userInfo?.user?.photo));
            dispatch(GoogleAuthentication(params, navigation));
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(
              userInfo.idToken
            );
            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
          });
        }
      })
      .catch((e) => {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Warning!",
          message: `Network Error`,
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
      });
  };

  const signOutGoogle = () => {
    try {
      GoogleSignin.signOut();
      setLoaded(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          height: 55,
          width: "98%",
          backgroundColor: "#fff",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 30,
          // marginTop: 30,
          elevation: 5,
          shadowColor: "black",
          shadowOpacity: 0.4,
          backgroundColor: "#fff",
          shadowRadius: 2,
          shadowOffset: { width: 1, height: 1 },
          borderWidth: 0,
          borderRadius: 0,
        }}
        onPress={signInGoogle}
      >
        <Image
          resizeMode="stretch"
          source={require("@img/google-logo.png")}
          style={{ height: 30, width: 30, marginRight: 10 }}
        />
        <Text
          style={{
            color: "black",
            textAlign: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          Log in with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleAuth;
