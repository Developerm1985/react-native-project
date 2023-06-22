import React from "react";
import { View, Text, Image } from "react-native";

import { textStyles as text, flex } from "@styles/";

const CheckoutGroupMerch = ({ checkOutData }) => {
  return (
    <View style={[flex.direction.row, flex.align.center]}>
      <Image
        resizeMode="cover"
        source={
          checkOutData.restaurant.merchant_logo
            ? {
                uri: checkOutData.restaurant.merchant_logo,
                cache: "force-cache",
              }
            : require("/img/icon.png")
        }
        style={styles.image}
      />
      <Text
        style={[
          text.weight.regular,
          text.size.sm,
          { paddingHorizontal: 10, flex: 1 },
        ]}
      >
        {checkOutData.restaurant.name}
      </Text>
      <Text style={[text.weight.regular, text.size.sm, text.color.yellow]}>
        {checkOutData.type == "Pre-Order" ? `Schedule Delivery` : `Deliver Now`}
      </Text>
    </View>
  );
};

const styles = {
  image: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
};
export { CheckoutGroupMerch };
