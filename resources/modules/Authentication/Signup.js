/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { BackButton } from "@components/common";

// import { signup } from '@actions/auth.actions';
import { Auth } from "../../constants";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import formInputs from "@styles/formInputs.styles";
import * as InputValidator from "../../helpers/InputValidator";
import { LoadingOverlay, MessagePopup } from "@components/common/";

const Signup = () => {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone_number, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [validator, setValidator] = useState(null);
  const dispatch = useDispatch();

  const submitForm = () => {
    // const isInputValid = validatePost();
    // if (isInputValid) {
    //     LoadingOverlay.show('Loading.');
    //     const  params = {
    //         fullname,
    //         phone_number,
    //         email,
    //         password,
    //         type: 'regular'
    //     };
    //     dispatch({
    //         type: Auth.SIGNUP,
    //     })
    //     signup(params)
    //     .then(res => {
    //         LoadingOverlay.hide();
    //         if (res.payload.data) {
    //             dispatch({
    //                 type: Auth.SIGNUP_SUCCESS,
    //                 payload: res.payload.data
    //             });
    //             MessagePopup.show({
    //                 title: 'Registration Successful!',
    //                 // message: `${res.payload.message}`,
    //                 actions: [
    //                         {
    //                                 text: 'Okay',
    //                                 action: () => {
    //                                         MessagePopup.hide();
    //                                         navigation.navigate("Landing");
    //                                 },
    //                         },
    //                 ],
    //                 closeOnOverlayPress: false,
    //             });
    //         } else {
    //         }
    //     })
    //     .catch(error => {
    //         LoadingOverlay.hide();
    //         console.log(error);
    //         dispatch({
    //             type: Auth.SIGNUP_FAILED,
    //         });
    //         MessagePopup.show({
    //             title: 'Please check!',
    //             message: `${error.data.message}`,
    //             actions: [
    //                     {
    //                             text: 'Okay',
    //                             action: () => {
    //                                     MessagePopup.hide();
    //                             },
    //                     },
    //             ],
    //         });
    //     });
    // };
  };

  const validatePost = () => {
    const input = {
      fullname,
      email,
      phone_number,
      password,
    };

    const required = {
      fullname: "Name",
      email: { name: "E-mail", email: true },
      phone_number: { name: "Phone Number", min: 11, max: 11 },
      password: { name: "Password", min: 6 },
    };

    const validator = InputValidator.check(input, required);
    setValidator(validator);
    return validator.isInputValid;
  };

  return (
    <View style={styles.landing}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <BackButton containerStyle={styles.backBtnContainerStyle} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Sign up</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: -10 }}>
          <Input
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
            label="Full Name"
            placeholder="Full Name"
            onChangeText={(fullname) => setFullName(fullname)}
          />
          <Input
            inputStyle={formInputs.input}
            inputContainerStyle={
              validator && validator.errors && validator.errors.email
                ? {
                    ...formInputs.inputContainer,
                    ...formInputs.inputContainerError,
                  }
                : formInputs.inputContainer
            }
            labelStyle={[formInputs.label, textStyles.normalTextRegular]}
            label="Email Address"
            placeholder="email@address.com"
            onChangeText={(email) => setEmail(email)}
            keyboardType={"email-address"}
          />
          <Input
            inputStyle={formInputs.input}
            inputContainerStyle={
              validator && validator.errors && validator.errors.phone_number
                ? {
                    ...formInputs.inputContainer,
                    ...formInputs.inputContainerError,
                  }
                : formInputs.inputContainer
            }
            labelStyle={[formInputs.label, textStyles.normalTextRegular]}
            label="Contact No."
            onChangeText={(phone_number) => setPhoneNumber(phone_number)}
            keyboardType={"numeric"}
            placeholder="09 - - - - - - - - -"
          />
          <Input
            inputContainerStyle={
              validator && validator.errors && validator.errors.password
                ? {
                    ...formInputs.inputContainer,
                    ...formInputs.inputContainerError,
                  }
                : formInputs.inputContainer
            }
            inputStyle={formInputs.input}
            labelStyle={[formInputs.label, textStyles.normalTextRegular]}
            label="Password"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.signup}
            onPress={submitForm}
          >
            <Text style={[textStyles.mdTextBold, { color: palette.white }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    marginBottom: 50,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  logo: {
    maxWidth: 210,
    height: 200,
    marginTop: 50,
    alignSelf: "center",
  },
  landing: {
    flex: 1,
    backgroundColor: palette.white,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  signup: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 18,
    color: palette.secondaryBlack,
    fontWeight: "bold",
  },
  headerTextContainer: {
    alignItems: "center",
    paddingRight: 30,
    flex: 1,
  },
  backBtnContainerStyle: {
    flexBasis: "auto",
  },
});

export default Signup;
