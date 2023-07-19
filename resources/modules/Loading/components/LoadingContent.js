import React from "react";
import { View, Text } from "react-native";

const LoadingContent = ({ flowName }) => {
  return (
    <View style={{ marginBottom: 25, alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 20, color: "#000000", marginBottom: 10 }}>
        {flowName == "parcel" ? "Looking for riders" : "Hang tight"}
      </Text>
      <Text
        style={{
          fontSize: flowName !== "food" ? 13 : 16,
          color: "#2C2C2E",
          marginBottom: 10,
        }}
      >
        {flowName !== "food"
          ? "Hang tight. we are looking for nearby riders in your area"
          : "We are processing your orders"}
      </Text>
    </View>
  );
};

export { LoadingContent };
