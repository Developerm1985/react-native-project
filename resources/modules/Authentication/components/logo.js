/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import palette from "@styles/palette.styles";
import Feather from "react-native-vector-icons/Feather";

const Logo = ({ navigation, isButtonBack }) => {
  return (
    <View
      style={{
        backgroundColor: palette.yellow,
        borderBottomRightRadius: 30,
        marginRight: 30,
        paddingBottom: 40,
      }}
    >
      <ScrollView>
        {isButtonBack ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.BackBotton}
            onPress={() => navigation.navigate("Landing")}
          >
            <Feather
              style={{ marginLeft: -4, color: palette.yellow }}
              name="chevron-left"
              solid
              size={24}
            />
          </TouchableOpacity>
        ) : null}

        <Image
          resizeMode="stretch"
          source={require("@img/logo.png")}
          style={styles.logo}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  BackBotton: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30,
  },
  logo: {
    maxWidth: 255,
    height: 80,
    marginTop: 50,
    alignSelf: "center",
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
  backBtnContainerStyle: {
    flexBasis: "auto",
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default Logo;
