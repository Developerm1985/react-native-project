import React from "react";
import { View, Text, StatusBar } from "react-native";

import { BackButton } from "@components/common";

import { flex, textStyles as text } from "@styles/";

const CheckoutHeader = ({ fromCart }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 15,
        marginTop: fromCart ? 0 : StatusBar.currentHeight,
      }}
    >
      <View style={flex.justify.center}>
        <Text style={[text.weight.regular, text.size.mlg, text.align.center]}>
          Checkout
        </Text>
        <BackButton
          containerStyle={{
            position: "absolute",
            backgroundColor: "#B8B8B814",
          }}
        />
      </View>
    </View>
  );
};

export { CheckoutHeader };
