import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import { textStyles as text, flex, common } from "@styles/";

const CheckoutDeliveryFee = ({ deliveryFee }) => {
  const [code, setCode] = useState("");
  const discountApplied = 1;

  return (
    <View style={{ marginTop: 30 }}>
      <View style={[flex.direction.row, flex.align.center]}>
        <Text
          style={[
            text.weight.regular,
            text.size.sm,
            { flex: 1, color: "#000" },
          ]}
        >
          Delivery Fee:
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              text.weight.regular,
              text.size.sm,
              text.color.darkGray,
              { textDecorationLine: "line-through", marginRight: 10 },
            ]}
          >
            P 150.00
          </Text>
          <Text style={[text.weight.regular, text.size.sm, text.color.black]}>
            P {deliveryFee}.00
          </Text>
        </View>
      </View>
      {discountApplied === 1 ? (
        <Input
          placeholder="Enter voucher code"
          {...common.checkoutCouponInput}
          value={code}
          onChangeText={(text) => setCode(text)}
        />
      ) : (
        <View
          style={[
            styles.appliedCouponWrapper,
            flex.direction.row,
            flex.align.center,
          ]}
        >
          <Icon name="ticket" style={[text.color.yellow, text.size.md]} />
          <Text
            style={[
              text.size.sm,
              text.weight.regular,
              { paddingHorizontal: 10, flex: 1 },
            ]}
          >
            Free Shipping Discount
          </Text>
          <Text
            style={[text.size.sm, text.weight.regular, text.color.darkGray]}
          >
            Code FIVEOFF
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  image: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  appliedCouponWrapper: {
    backgroundColor: "#FDF0D6",
    padding: 8,
    borderWidth: 1,
    borderColor: "#EFEFF4",
    marginTop: 10,
  },
};

export { CheckoutDeliveryFee };
