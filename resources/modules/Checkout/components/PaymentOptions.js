import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { textStyles as text, flex, palette } from "@styles";

import CheckoutContext from "contexts/checkout.context";
const windowHeight = Dimensions.get("window").height;

const PaymentOptions = () => {
  const { showPayment, togglePayment, onPaymentSelect, payment } =
    useContext(CheckoutContext);
  const fadeAnim = useRef(new Animated.Value(windowHeight)).current;
  const toggleAnimation = (toValue) => {
    Animated.timing(fadeAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  useEffect(
    () => toggleAnimation(showPayment ? 0 : windowHeight),
    [showPayment]
  );

  return (
    <>
      {" "}
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => togglePayment(false)}
      >
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>
      <View style={styles.optionBox}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => togglePayment(false)}
        >
          <View style={styles.button} />
        </TouchableOpacity>
        <View style={{ paddingVertical: 20 }}>
          <Text
            style={[text.size.md, text.weight.regular, { marginBottom: 12 }]}
          >
            Select payment option
          </Text>
          {dummyOptions.map((option, index) => {
            const isSelected = payment === option;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={`checkoutpaymentoption${index}`}
                onPress={() => onPaymentSelect(option)}
              >
                <View
                  style={[
                    flex.direction.row,
                    flex.align.center,
                    styles.paymentOption,
                    {
                      backgroundColor: !isSelected ? "#EFEFF4" : "#FFBF081A",
                      borderColor: !isSelected ? "#EFEFF4" : palette.yellow,
                    },
                  ]}
                >
                  <View style={styles.optionImageWrapper}>
                    <Image
                      resizeMode="contain"
                      source={require("/img/sample-payment.png")}
                      style={styles.optionImage}
                    />
                  </View>
                  <Text
                    style={[
                      text.size.md,
                      text.weight.regular,
                      { paddingHorizontal: 10, flex: 1 },
                    ]}
                  >
                    {option}
                  </Text>
                  {isSelected ? (
                    <Icon
                      name="check-circle"
                      size={18}
                      color={palette.yellow}
                      style={{ backgroundColor: "#fff", borderRadius: 100 }}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

const dummyOptions = [
  "E-wallet",
  "Credit / debit card",
  "Gcash",
  "Paymaya",
  "COD",
];

const styles = {
  wrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000077",
    bottom: 0,
    left: 0,
  },
  optionBox: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    maxWidth: 131,
    width: "40%",
    height: 7,
    backgroundColor: "#F4F4F8",
    borderRadius: 10,
    margin: 10,
    alignSelf: "center",
  },
  paymentOption: {
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  optionImageWrapper: {
    marginHorizontal: 10,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  optionImage: {
    width: 30,
    height: 30,
  },
};
export { PaymentOptions };
