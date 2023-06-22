import React from "react";
import { View, Text } from "react-native";

import { Price } from "@components/common";
import { textStyles as text, flex } from "@styles/";

const CheckoutItem = ({ checkOutData }) => {
  return (
    <>
      {checkOutData?.restaurant?.products?.map((item, index) => (
        <View
          style={[flex.direction.row, flex.align.center, { marginTop: 10 }]}
          key={`Food_${index}`}
        >
          <Text
            style={[
              text.weight.regular,
              text.size.sm,
              text.color.darkGray,
              styles.qty,
            ]}
          >
            {item.quantity}
          </Text>
          <Text
            style={[
              text.weight.regular,
              text.size.sm,
              text.color.darkGray,
              { paddingHorizontal: 15, flex: 1 },
            ]}
          >
            {item.food_name}
          </Text>
          <Price
            style={[text.weight.regular, text.size.sm, text.color.black]}
            value={Number(item.total_price)}
          />
        </View>
      ))}
    </>
  );
};

const styles = {
  image: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  qty: {
    width: 25,
  },
};
export { CheckoutItem };
