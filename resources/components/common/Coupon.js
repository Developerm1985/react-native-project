import React from "react";
import { View, Text } from "react-native";

import flex from "@styles/flex.styles";
import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";

const Coupon = ({ couponData }) => {
  return (
    <View style={[flex.direction.row, styles.couponContainer]}>
      <View
        style={[
          styles.couponEdge,
          flex.justify.center,
          { backgroundColor: palette.darkYellow },
        ]}
      >
        <View
          style={[
            styles.couponEdgeCircle,
            { transform: [{ translateX: -15 }] },
          ]}
        />
      </View>
      <View style={styles.couponCenter}>
        <Text style={[textStyles.weight.bold, textStyles.size.md]}>
          {`Get ${couponData?.discount_type == "percent" ? "" : "P"}${
            couponData.discount
          }${couponData?.discount_type == "percent" ? "%" : ""} off`}
        </Text>
        <Text
          style={[
            textStyles.size.xs,
            textStyles.weight.light,
            { marginTop: 3, color: "#3B3B3B" },
          ]}
        >
          Instant discount upto P{couponData.max_discount} on Minimum purchase
          value P{couponData.min_purchase}
        </Text>
      </View>
      <View style={[styles.couponEdge, flex.justify.center]}>
        <View
          style={[styles.couponEdgeCircle, { transform: [{ translateX: 15 }] }]}
        />
      </View>
    </View>
  );
};

const styles = {
  couponContainer: {
    backgroundColor: palette.yellow,
    maxWidth: 767,
    alignSelf: "center",
  },
  couponCenter: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  couponEdge: {
    width: 30,
  },
  couponEdgeCircle: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
};

export { Coupon };
