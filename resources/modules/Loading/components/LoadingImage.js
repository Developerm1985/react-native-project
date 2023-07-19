import React from "react";
import { Image, View } from "react-native";

const LoadingImage = ({ flowName }) => {
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
