import React from "react";
import { View, Image, StyleSheet } from "react-native";
import palette from "../styles/palette.styles";

const DashboardHeader = () => {
  return (
    <View backgroundColor={palette.yellow} style={styles.header}>
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
    maxWidth: 127,
    height: 40,
  },
});

export default DashboardHeader;
