/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { connect, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Input } from "react-native-elements";

import DashboardHeader from "@components/DashboardHeader";
import EditProfile from "./Authentication/EditProfile";

import { signup } from "@actions/auth.actions";
import { Auth } from "../constants";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import formInputs from "@styles/formInputs.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";

class Account extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
    };
  }

  async componentDidMount() {
    this.setState({ user: await AsyncStorage.getItem("user") });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.yellow} />
        {/* <DashboardHeader /> */}
        <EditProfile userData={this.state.user} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  landing: {
    flex: 1,
    backgroundColor: palette.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  signup: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
  },
  signupText: {
    fontSize: 18,
    color: palette.secondaryBlack,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, null)(Account);
