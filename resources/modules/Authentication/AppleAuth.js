import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import { LoadingOverlay } from "../../components/common";
import { AppleAuthentication } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "@react-native-firebase/auth";

const AppleAuth = ({ navigation }) => {
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
  const [fcmToken, setFcmToken] = useState();
  const dispatch = useDispatch();

  let user = null;
  useEffect(() => {
    getFcmToken();
  }, []);

  // useEffect(() => {
  //   if (!appleAuth.isSupported) return;
  //   fetchAndUpdateCredentialState(updateCredentialStateForUser).catch((error) =>
  //     updateCredentialStateForUser(`Error: ${error.code}`)
  //   );
  // }, []);

  useEffect(() => {
    if (!appleAuth.isSupported) return;
    return appleAuth.onCredentialRevoked(async () => {
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(
        (error) => updateCredentialStateForUser(`Error: ${error.code}`)
      );
    });
  }, []);

  const getFcmToken = async () => {
    const fcmtokens = await AsyncStorage.getItem("_fcmtoken");
    setFcmToken(fcmtokens);
  };

  async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    if (user === null) {
      updateCredentialStateForUser("N/A");
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser("AUTHORIZED");
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  }

  async function onAppleButtonPress(updateCredentialStateForUser) {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { user, email, nonce, identityToken, realUserStatus, fullName } =
        appleAuthRequestResponse;
      console.log("appleAuthRequestResponse----->  ", appleAuthRequestResponse);
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(
        (error) => updateCredentialStateForUser(`Error: ${error.code}`)
      );
      if (identityToken) {
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce
        );
      }
      // if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
      LoadingOverlay.show("Loading...");
      let params = {
        token: identityToken,
        medium: "apple",
        fcm_token: fcmToken,
        full_name: `${fullName?.familyName} ${fullName?.givenName}`,
        email: email,
      };
      console.log("identityToken:--------->", identityToken);
      dispatch(AppleAuthentication(params, navigation));
      // }
      console.log(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log("User canceled Apple Sign in.");
      } else {
        console.error(error);
      }
    }
  }

  return (
    <View style={styles.buttonContainer}>
      <AppleButton
        style={styles.appleButton}
        cornerRadius={5}
        buttonStyle={AppleButton.Style.WHITE_OUTLINE}
        buttonType={AppleButton.Type.CONTINUE}
        onPress={() => onAppleButtonPress(updateCredentialStateForUser)}
      />
    </View>
  );
};

export default AppleAuth;

const styles = StyleSheet.create({
  appleButton: {
    width: "100%",
    height: 50,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
});
