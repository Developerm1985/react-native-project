import React, { Component, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
} from "react-native";

import { HeaderFilter, StatusFilter, Activities } from "./components";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "../../components/common";

const Orders = ({ route }) => {
  const navigation = useNavigation();
  const [activePage, setActivePage] = useState(0);

  function handleBackButtonClick() {
    navigation.reset({
      index: 0,
      routes: [{ name: "DashboardRoute" }],
    });
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: palette.searchBar,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF",
          flexDirection: "row",
          alignItems: "center",
          marginTop: route?.params?.fromCheckout ? StatusBar.currentHeight : 0,
        }}
      >
        <View style={{ flex: 0.3, alignItems: "center" }}>
          {route?.params?.fromCheckout ? (
            <BackButton
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "DashboardRoute",
                      params: { fromCheckout: true },
                    },
                  ],
                })
              }
            />
          ) : (
            <></>
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              textStyles.size.mlg,
              textStyles.weight.regular,
              textStyles.color.darkGray,
              flex.alignSelf.center,
              {
                flex: 1,
                alignItems: "center",
                textAlign: "center",
                padding: 20,
              },
            ]}
          >
            My Activity
          </Text>
        </View>
        <View style={{ flex: 0.3 }}></View>
      </View>
      <View style={{ backgroundColor: palette.white }}>
        <HeaderFilter
          handleActiveStatus={(value) => {
            setActivePage(value);
          }}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {activePage == 0 ? (
          <View style={{ padding: 20 }}>
            <StatusFilter orderStatus={route?.params?.status} />
            <Activities />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 10 }}>
            <Activities past={true} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Orders;
