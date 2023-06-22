import React, { useEffect } from "react";
import { ScrollView, View, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AboutImageSlider, AboutDetails, AboutRatings } from "./components";

const Dashboard = () => {
  const navigation = useNavigation();

  // useEffect(() => {
  //     if (!route.params || !route.params.merchant) navigation.navigate('/')
  // }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <AboutImageSlider />
        <View style={{ padding: 20, paddingTop: 0 }}>
          {/* <AboutDetails  /> */}
          {/* <AboutRatings /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
