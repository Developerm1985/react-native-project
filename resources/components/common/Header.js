import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import palette from "../../styles/palette.styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import { BackButton } from "./BackButton";

const Header = ({
  headerName,
  backAction,
  iconStyle,
  headerNameStyles,
  mainContainer,
}) => {
  return (
    <SafeAreaView style={[styles.container, mainContainer]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backView}
        onPress={backAction}
      >
        {backAction && (
          <View style={styles.button}>
            <Icon name="chevron-left" style={{ ...iconStyle }} />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.headerTitleView}>
        <Text style={[styles.headerName, headerNameStyles]}>{headerName}</Text>
      </View>
      <View style={styles.sideView}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    marginTop: StatusBar.currentHeight,
    alignItems: "center",
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: palette.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backView: {
    flex: 0.1,
    alignItems: "center",
    marginStart: 20,
  },
  headerTitleView: {
    flex: 1,
    marginHorizontal: 20,
  },
  headerName: {
    alignSelf: "center",
  },
  sideView: {
    flex: 0.1,
    alignItems: "center",
    marginEnd: 10,
  },
});

export default Header;
