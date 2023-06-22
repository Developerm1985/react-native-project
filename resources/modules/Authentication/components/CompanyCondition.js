import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { BackButton, LoadingOverlay } from "../../../components/common";
import palette from "../../../styles/palette.styles";

const CompanyCondition = ({ route }) => {
  const [spinner, setSpinner] = useState(true);

  const hideSpinner = () => {
    setSpinner(false);
  };

  const onLoad = () => {
    spinner ? LoadingOverlay.show("Loading...") : LoadingOverlay.hide();
  };

  useEffect(() => {
    onLoad();
  }, [spinner]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <BackButton containerStyle={styles.backBtnContainerStyle} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>
            {route?.params?.headerTitle == "termscondition"
              ? "Terms and Conditions"
              : "Privacy Policy"}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: route?.params?.url }} onLoad={hideSpinner} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: palette.white,
  },
  backBtnContainerStyle: {
    flexBasis: "auto",
  },
  headerTextContainer: {
    alignItems: "center",
    paddingRight: 30,
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    color: palette.secondaryBlack,
    fontWeight: "bold",
  },
});

export default CompanyCondition;
