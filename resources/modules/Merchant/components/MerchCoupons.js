import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Coupon } from "@components/common";
import merchant from "@styles/merchant.styles";
import palette from "@styles/palette.styles";
import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const MerchCoupons = ({ couponData }) => {
  return couponData ? (
    <View style={merchant.sectionWhite}>
      <Coupon couponData={couponData} />
      <View style={[flex.direction.row, flex.align.center, { marginTop: 15 }]}>
        {/* <Icon name="ticket-alt" size={13} color={palette.yellow} /> */}
        {/* <Text
          style={[
            textStyles.size.sm,
            textStyles.color.darkGray,
            { marginLeft: 5, flex: 1 },
          ]}
        >
          Check other promos
        </Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={[textStyles.size.sm, textStyles.weight.regular]}>
            See all
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  ) : (
    <></>
  );
};

export { MerchCoupons };
