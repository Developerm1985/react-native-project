import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../../components/common/LoadingOverlay";

import { AboutImageSlider, AboutDetails, AboutRatings } from "./components";
import { getMerchantInfo } from "../../http";
import { MessagePopup } from "../../components/common";
import { BackButton } from "../../components/common";

const About = ({ route }) => {
  const navigation = useNavigation();
  const [merchant, setMerchant] = useState({});
  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    onload();
  }, []);

  async function onload() {
    try {
      const { data } = await getMerchantInfo({
        id: route.params.id ? route.params.id : route.params.merchantId,
      });
      LoadingOverlay.hide();
      data.success
        ? setMerchant(data?.data)
        : MessagePopup.show({
            title: "Error!",
            message: data.message,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  navigation.goBack();
                },
              },
            ],
          });
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  }

  return merchant ? (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <BackButton
        containerStyle={{
          backgroundColor: "#ffffffaa",
          zIndex: 999,
          position: "absolute",
          left: 20,
          top: width / 10,
        }}
      />
      {merchant.restaurant_id ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <AboutImageSlider merchant={merchant} />
          <View style={{ padding: 20, paddingTop: 0 }}>
            <AboutDetails merchant={merchant} />
            <AboutRatings merchant={merchant} />
          </View>
        </ScrollView>
      ) : (
        <></>
      )}
    </SafeAreaView>
  ) : (
    <></>
  );
};

export default About;
