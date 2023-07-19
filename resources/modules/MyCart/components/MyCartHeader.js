import React from "react";
import { View, Text } from "react-native";
import { BackButton } from "@components/common";
import { flex, textStyles as text } from "@styles/";
import palette from "../../../styles/palette.styles";

const MyCartHeader = () => {
  return (
    <View style={styles.wrapper}>
      <View style={flex.justify.center}>
        <Text style={[text.weight.regular, text.size.mlg, text.align.center]}>
          My Cart
        </Text>
        <BackButton
          containerStyle={{
            position: "absolute",
            backgroundColor: "#B8B8B814",
          }}
          iconName="times"
        />
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    backgroundColor: palette.white,
    padding: 20,
  },
};

export { MyCartHeader };
