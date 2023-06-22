import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import { common } from "@styles/";
import { flex, textStyles as text, palette } from "@styles/";
import { Price } from "@components/common";
import { useDispatch, useSelector } from "react-redux";
import { setCouponData, validCoupon } from "../../../slices/couponSlice";
import { finalPaymentPrice } from "../../../slices/cartSlice";
import { LoadingOverlay, MessagePopup } from "../../../components/common";

const CheckoutBilling = ({
  orderTotalPrice,
  fromCart,
  handleAppliedCode,
  checkOutData,
  onloadCoupon,
}) => {
  const dispatch = useDispatch();
  const selectedMerchant = useSelector(
    (state) => state.cart.selectedMerchantInfo
  );

  const couponData = useSelector((state) => state.coupon.couponData);
  const isCouponValid = useSelector((state) => state.coupon.isValid);
  const [code, setCode] = useState("");

  const [totalPayment, setTotalPayment] = useState(0);
  const [isValid] = useState(isCouponValid);

  useEffect(() => {
    setTotalPayment(
      orderTotalPrice +
        selectedMerchant?.delivery_fee +
        selectedMerchant?.convenience_fee -
        (couponData.discount
          ? couponData.discount_type == "percent"
            ? (orderTotalPrice / 100) * couponData.discount
            : couponData.discount
          : 0)
    );
    dispatch(finalPaymentPrice(totalPayment));
  }, [
    orderTotalPrice,
    selectedMerchant?.delivery_fee,
    couponData.discount,
    totalPayment,
    isValid,
  ]);

  function clearCoupon() {
    dispatch(validCoupon(false));
    dispatch(setCouponData({}));
  }
  useEffect(() => {
    clearCoupon();
  }, []);

  return (
    <View style={[styles.wrapper]}>
      <View style={[flex.direction.row, flex.justify.between]}>
        <Text style={[text.size.sm, text.weight.regular, text.color.black]}>
          Subtotal:
        </Text>
        <Text style={[text.size.sm, text.weight.regular, text.color.black]}>
          P
          {Number(
            fromCart
              ? selectedMerchant?.total_price
              : checkOutData?.sub_total
              ? checkOutData.sub_total
              : 0
          ).toFixed(2)}
        </Text>
      </View>
      <View
        style={[flex.direction.row, flex.justify.between, { marginTop: 10 }]}
      >
        <Text style={[text.size.sm, text.weight.regular, text.color.black]}>
          Total Delivery Fee:
        </Text>
        <Text style={[text.size.sm, text.weight.regular, text.color.black]}>
          P
          {Number(
            fromCart
              ? selectedMerchant?.delivery_fee
              : checkOutData?.delivery_fee
              ? checkOutData?.delivery_fee
              : 0
          ).toFixed(2)}
        </Text>
      </View>

      <View
        style={[flex.direction.row, flex.justify.between, { marginTop: 10 }]}
      >
        <Text style={[text.size.sm, text.weight.regular, text.color.black]}>
          Convenience Fee:
        </Text>
        <Text style={[text.size.sm, text.weight.regular, text.color.black]}>
          P
          {Number(
            fromCart
              ? selectedMerchant?.convenience_fee
              : checkOutData?.convenience_fee
              ? checkOutData?.convenience_fee
              : 0
          ).toFixed(2)}
        </Text>
      </View>

      {checkOutData?.is_applied ? (
        <View
          style={[flex.direction.row, flex.justify.between, { marginTop: 10 }]}
        >
          {fromCart ? (
            <></>
          ) : (
            <>
              <Text
                style={[
                  text.size.sm,
                  {
                    color: "green",
                    fontWeight: "bold",
                    alignSelf: "center",
                  },
                ]}
              >
                Voucher Applied
              </Text>
              <Text
                style={[
                  text.size.sm,
                  {
                    color: "green",
                    fontWeight: "bold",
                    alignSelf: "center",
                  },
                ]}
              >
                P -
                {Number.parseFloat(
                  checkOutData?.coupon_discount
                    ? checkOutData.coupon_discount
                    : 0
                ).toFixed(2)}
              </Text>
            </>
          )}
        </View>
      ) : (
        <View>
          {fromCart ? (
            <></>
          ) : (
            <>
              <Input
                placeholder="Enter voucher code"
                {...common?.checkoutCouponInput}
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  handleAppliedCode(text);
                }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  position: "absolute",
                  right: 15,
                  top: 12,
                  paddingVertical: 8,
                }}
                onPress={async () => {
                  code == ""
                    ? MessagePopup.show({
                        title: "Attention!",
                        message: "Please enter coupon code!",
                        actions: [
                          {
                            text: "Okay",
                            action: () => {
                              MessagePopup.hide();
                            },
                          },
                        ],
                      })
                    : onloadCoupon();
                  setCode("");
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <View
        style={[flex.direction.row, flex.justify.between, { marginTop: 30 }]}
      >
        <Text
          style={[
            text.size.md,
            text.weight.medium,
            flex.align.center,
            text.color.black,
          ]}
        >
          Total Payment
        </Text>
        <Price
          style={[text.size.mlg, text.weight.medium, text.color.black]}
          value={
            fromCart
              ? selectedMerchant?.grand_total_price
              : checkOutData?.grand_total
              ? checkOutData.grand_total
              : 0
          }
        />
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    padding: 20,
    backgroundColor: "#fff",
  },
};

export { CheckoutBilling };
