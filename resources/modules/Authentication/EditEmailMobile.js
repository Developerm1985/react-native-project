import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import {
  BackButton,
  LoadingOverlay,
  MessagePopup,
} from "../../components/common";
import palette from "../../styles/palette.styles";
import { Input } from "react-native-elements";
import formInputs from "../../styles/formInputs.styles";
import textStyles from "../../styles/textStyles.styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { updateEmailOrPhone } from "../../http";
import { SafeAreaView } from "react-native-safe-area-context";

const EditEmailMobile = (props) => {
  const navigation = useNavigation();
  const inputRef = useRef();
  const [validator, setValidator] = useState(null);
  const [inputData, setInputData] = useState();
  let typeEnd =
    props?.route?.params?.type == "phone" ? "phone number" : "email address";

  const onNext = async () => {
    const email_regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phone_regx =
      /(^0|[89]\d{2}-\d{3}\-?\d{4}$)|(^0|[89]\d{2}\d{3}\d{4}$)|(^63[89]\d{2}-\d{3}-\d{4}$)|(^63[89]\d{2}\d{3}\d{4}$)|(^[+]63[89]\d{2}\d{3}\d{4}$)|(^[+]63[89]\d{2}-\d{3}-\d{4}$)/;

    let inputValidation =
      inputData == null || inputData == undefined || inputData == "";
    let oldDataValidation = inputData == props?.route?.params?.oldData;
    let regxValidation =
      props?.route?.params?.type == "phone"
        ? phone_regx.test(inputData) == false
        : email_regx.test(inputData) == false;

    if (inputValidation || oldDataValidation || regxValidation) {
      MessagePopup.show({
        title: "warning!",
        message: inputValidation
          ? `Please enter ${typeEnd}`
          : oldDataValidation
          ? `already exist ${typeEnd}`
          : `Please enter valid ${typeEnd}`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              inputRef?.current?.focus();
            },
          },
        ],
      });
    } else {
      LoadingOverlay.show("Loading...");
      const params = {
        email_or_phone: inputData,
        type: props?.route?.params?.type,
      };
      try {
        const { data } = await updateEmailOrPhone(params);
        LoadingOverlay.hide();
        MessagePopup.show({
          title: data?.success ? "Success!" : "Warning!",
          message: data?.success ? data?.message : data?.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                if (data?.success) {
                  navigation.navigate("EditEmailMobileOtpVerification", {
                    newData: inputData,
                    type: props?.route?.params?.type,
                    oldData: props?.route?.params?.oldData,
                  });
                }
              },
            },
          ],
        });
      } catch (err) {
        LoadingOverlay.hide();
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View
        style={{ flexDirection: "row", marginTop: 10, paddingHorizontal: 20 }}
      >
        <View style={{ flex: 1 }}>
          <BackButton containerStyle={styles.backContainer} />
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>
            {props?.route?.params?.type == "phone" &&
            props?.route?.params?.oldData == null
              ? "Add Mobile Number"
              : props?.route?.params?.type == "phone" &&
                props?.route?.params?.oldData != null
              ? "Change Number"
              : props?.route?.params?.type == "email" &&
                props?.route?.params?.oldData == null
              ? "Add Email Address"
              : "Change Email"}
          </Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>

      <View style={styles.oldContainer}>
        <Text style={styles.mobileText}>
          {props?.route?.params?.oldData == null
            ? `Enter your ${typeEnd}\n you will receive a 4 digit code to verify next.`
            : `Your old ${typeEnd}`}
        </Text>
        <Text style={styles.mobileNumber}>{props?.route?.params?.oldData}</Text>
      </View>

      <View style={{ marginHorizontal: 12 }}>
        <Input
          ref={inputRef}
          maxLength={props?.route?.params?.type == "phone" ? 12 : 50}
          keyboardType={
            props?.route?.params?.type == "phone"
              ? "number-pad"
              : "email-address"
          }
          placeholder={
            props?.route?.params?.type == "phone" &&
            props?.route?.params?.oldData == null
              ? "Add Number"
              : props?.route?.params?.type == "phone" &&
                props?.route?.params?.oldData
              ? "Enter new number"
              : props?.route?.params?.type == "email" &&
                props?.route?.params?.oldData == null
              ? "Add Email"
              : "Enter new email"
          }
          inputStyle={formInputs.input}
          inputContainerStyle={
            validator && validator.errors && validator.errors.fullname
              ? {
                  ...formInputs.inputContainer,
                  ...formInputs.inputContainerError,
                }
              : formInputs.inputContainer
          }
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          onChangeText={(name) => setInputData(name)}
          value={inputData}
        />
      </View>
      <View
        style={{
          marginHorizontal: 20,
          flex: 0.45,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.signup}
          onPress={() => onNext()}
        >
          <Text style={[textStyles.mdTextBold, { color: palette.white }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: palette.white,
  },
  backContainer: {
    marginVertical: 10,
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
  oldContainer: {
    marginVertical: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  mobileText: {
    fontSize: 16,
    fontWeight: "500",
    color: palette.secondaryBlack,
    textAlign: "center",
  },
  mobileNumber: {
    fontSize: 18,
    color: palette.yellow,
    marginTop: 5,
  },
  signup: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
  },
});

export default EditEmailMobile;
