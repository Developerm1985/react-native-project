import React from "react";
import { View, Text, Image } from "react-native";

import { textStyles as text } from "@styles/";

const CheckoutGroupTag = ({ checkOutData }) => {
  return (
    <View>
      <Image
        resizeMode="cover"
        source={require("/img/pointed.png")}
        style={{ height: 10, width: "100%" }}
      />
      <Text style={[styles.text, text.weight.medium, text.size.md]}>
        {checkOutData?.type}
      </Text>
    </View>
  );
};

const styles = {
  text: {
    backgroundColor: "#fcd97d",
    padding: 15,
  },
};
export { CheckoutGroupTag };
