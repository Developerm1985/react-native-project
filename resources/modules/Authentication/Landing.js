/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import palette from "@styles/palette.styles";

const Landing = () => {
  const navigation = useNavigation();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    const token = JSON.parse(await AsyncStorage.getItem("user"))?.auth_token;
    token ? navigation.replace("DashboardRoute") : navigation.replace("Login");
  }

  return (
    <View
      style={{
        backgroundColor: palette.yellow,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={palette.yellow} />
      <Image
        resizeMode="stretch"
        source={require("@img/logo.png")}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  logo: {
    alignSelf: "center",
  },
  landing: {
    flex: 1,
    backgroundColor: palette.yellow,
    marginBottom: 50,
  },
  buttonContainer: {
    justifyContent: "flex-end",
  },
  login: {
    backgroundColor: palette.red,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: 5,
  },
  signup: {
    backgroundColor: palette.searchBar,
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
  },
  loginText: {
    fontSize: 18,
    color: palette.white,
  },
  signupText: {
    fontSize: 18,
    color: palette.secondaryBlack,
  },
});

export default Landing;
