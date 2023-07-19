import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Price } from "@components/common";
import { textStyles as text, flex } from "@styles";

const CartMerchant = ({ merchant, total, itemCount }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("MyCart", { merchant: merchant.id })}
    >
      <View
        style={[
          styles.wrapper,
          flex.direction.row,
          flex.justify.between,
          flex.align.center,
        ]}
      >
        <View>
          <Text style={[text.size.md]}>{merchant?.name || "Merchant"}</Text>
          <Text style={[text.size.sm]}>
            {itemCount} item{itemCount > 1 ? "s" : ""}
          </Text>
          <Price style={[text.weight.bold, { marginTop: 15 }]} value={total} />
        </View>
        <Text style={[text.color.yellow]}>Checkout</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 10,
  },
});
export { CartMerchant };
