import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { Price } from "@components/common";
import { textStyles as text, flex } from "@styles/";
import palette from "../../../../styles/palette.styles";

import { CheckoutItem } from "./components/CheckoutItem";
import { CheckoutGroupMerch, CheckoutGroupTag } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { setCartTotal } from "../../../../slices/cartSlice";

const CheckoutItemGroup = ({ checkOutData }) => {
  return (
    <>
      <View style={[styles.wrapper]}>
        <CheckoutGroupTag checkOutData={checkOutData} />
        <View
          style={{ backgroundColor: palette.white, padding: 20, elevation: 5 }}
        >
          <CheckoutGroupMerch checkOutData={checkOutData} />
          <CheckoutItem checkOutData={checkOutData} />
          <View
            style={[
              flex.direction.row,
              flex.justify.between,
              {
                marginTop: 20,
                borderTopWidth: 1,
                borderTopColor: "#ddd",
                paddingTop: 10,
              },
            ]}
          >
            {checkOutData?.voucher_price > 0 ? (
              <>
                <Text
                  style={[
                    text.size.sm,
                    text.weight.regular,
                    { color: "green" },
                  ]}
                >
                  Voucher Applied
                </Text>
                <Price
                  style={[text.size.sm, text.weight.bold, { color: "green" }]}
                  value={
                    -Number(
                      checkOutData?.voucher_price
                        ? checkOutData?.voucher_price
                        : 0
                    )
                  }
                />
              </>
            ) : (
              <></>
            )}
          </View>
          <View
            style={[
              flex.direction.row,
              flex.justify.between,
              { marginTop: 10 },
            ]}
          >
            <Text
              style={[text.size.sm, text.weight.regular, { color: "#000" }]}
            >
              Subtotal:
            </Text>
            <Price
              style={[text.size.sm, text.weight.bold, { color: "#000" }]}
              value={Number(
                checkOutData?.sub_total ? checkOutData?.sub_total : 0
              )}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = {
  wrapper: {
    marginTop: 10,
    shadowColor: "#000000aa",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  details: {
    backgroundColor: "#fff",
    padding: 15,
  },
};

export { CheckoutItemGroup };
