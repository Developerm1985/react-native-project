import React from "react";
import { View, Text } from "react-native";

import { BackButton } from "@components/common";

import { textStyles as text } from "@styles";

const OmsHeader = () => {
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ marginBottom: 15 }}>
        <Text
          style={[
            text.size.mlg,
            text.weight.regular,
            text.color.darkGray,
            text.align.center,
          ]}
        >
          Just One More Step
        </Text>
        <BackButton containerStyle={styles.button} />
      </View>
      <Text
        style={[
          text.size.xs,
          text.weight.regular,
          text.align.center,
          { marginTop: 5 },
        ]}
      >
        To protect our riders from fake bookings, please fill out this form.
      </Text>
    </View>
  );
};

const styles = {
  button: {
    position: "absolute",
    left: 0,
    top: 0,
    alignSelf: "center",
  },
};
export { OmsHeader };
