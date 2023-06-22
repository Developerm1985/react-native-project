import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { textStyles as text, flex, palette } from "@styles";
import { ImagePickerModal } from "./CheckoutPaymentPopup";

const CheckoutPaymentMethod = ({
  payment,
  toggle,
  handlePaymentSelect,
  handleCardData,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 100 }}>
      <View style={[styles.wrapper]}>
        <Text style={[text.size.md, text.weight.medium, { color: "#000" }]}>
          Payment Method
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.selectBtn]}
          onPress={() => setVisible(true)}
        >
          <View style={[flex.direction.row, flex.justify.between]}>
            <Text style={[text.size.sm, text.weight.regular]}>
              {payment ? payment : "Select Payment Method"}
            </Text>
            <Icon name="chevron-right" size={12} />
          </View>
        </TouchableOpacity>
        <ImagePickerModal
          isVisible={visible}
          onClose={() => setVisible(false)}
          _handleVisibleModal={(mode) => {
            setVisible(mode);
          }}
          _setPaymentMethod={(method) => {
            handlePaymentSelect(
              method?.title == undefined ? null : method?.title
            );
            setVisible(false);
          }}
          _handleCardData={(_cardData) => {
            handleCardData(_cardData);
          }}
        />
      </View>
      <Text
        style={[
          text.size.sm,
          text.color.darkGray,
          text.weight.regular,
          { padding: 20 },
        ]}
      >
        By completing this order, I agree to all Terms & Conditions.
      </Text>
    </View>
  );
};

const styles = {
  wrapper: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  selectBtn: {
    padding: 10,
    marginTop: 7,
    backgroundColor: palette.searchBar,
  },
};

export { CheckoutPaymentMethod };
