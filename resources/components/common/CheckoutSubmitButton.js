import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { Price } from "@components/common/Price";
import { textStyles as text, flex, palette } from "@styles";
import { TOUCHABLE_STATE } from "react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable";
import { useSelector } from "react-redux";

const CheckoutSubmitButton = ({
  totalPrice,
  onSubmit,
  buttonText,
  disabled,
}) => {
  return (
    <View style={[styles.wrapper, flex.direction.row, flex.align.center]}>
      <View style={{ flex: 1 }}>
        <Text style={[text.size.sm, text.weight.regular]}>Total Payment</Text>
        <Price style={[text.size.mlg, text.weight.bold]} value={totalPrice} />
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.button, opacity: disabled ? 0.5 : 1 }}
          disabled={disabled}
          onPress={disabled ? () => {} : onSubmit}
        >
          <Text style={[text.size.sm, text.weight.regular, text.align.center]}>
            {buttonText ? buttonText : "Submit Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    padding: 20,
  },
  button: {
    backgroundColor: palette.yellow,
    padding: 17,
    borderRadius: 100,
  },
};
export { CheckoutSubmitButton };
