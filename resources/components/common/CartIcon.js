import React, { useState, useEffect } from "react";
import { Platform, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { flex, textStyles, palette } from "@styles/";
import { useSelector } from "react-redux";

const CartIcon = ({ containerStyle = {}, iconStyle = {}, textStyle = {} }) => {
  const { cartData } = useSelector((state) => state.cart);

  return (
    <View
      style={[
        styles.cart,
        flex.direction.row,
        flex.align.center,
        containerStyle,
      ]}
    >
      <Icon name="shopping-basket" style={{ fontSize: 12, ...iconStyle }} />
      <View
        style={[
          {
            ...styles.cartCount,
            ...textStyle,
            overflow: "hidden",
            marginLeft: 2,
            marginBottom: 10,
            // margintop: -10,
          },
          textStyles.size.xs,
          textStyles.weight.medium,
        ]}
      >
        <Text>{cartData?.length}</Text>
      </View>
    </View>
  );
};

const styles = {
  cart: {
    backgroundColor: "#FDF0D6",
    padding: 5,
    borderRadius: 100,
  },
  cartCount: {
    backgroundColor: palette.yellow,
    paddingHorizontal: 3,
    marginLeft: 3,
    borderRadius: 100,
  },
};

export { CartIcon };
