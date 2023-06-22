import React from "react";
import { Image, View, Text } from "react-native";

import {
  NavigationContainerRefContext,
  useNavigation,
} from "@react-navigation/native";

const LoadingImage = ({ flowName }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        marginBottom: 25,
        alignItems: "center",
        justifyContent: "center",
        flex: 3,
      }}
    >
      <Image
        source={
          flowName !== "food"
            ? require("@img/scooter.gif")
            : require("@img/Loading-image.png")
        }
      />
    </View>
  );
};

export { LoadingImage };
