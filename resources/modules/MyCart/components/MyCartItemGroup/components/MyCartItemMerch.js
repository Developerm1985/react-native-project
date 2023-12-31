import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { flex, textStyles as text } from "@styles/";
import palette from "../../../../../styles/palette.styles";
import { MessagePopup } from "../../../../../components/common";

const MyCartItemMerch = ({
  restaurant,
  index,
  selectedRadioButton,
  handleSelectRadio,
  isAvailable,
  isAvailableMessage,
}) => {
  const setPopup = () => {
    return MessagePopup.show({
      title: "Message",
      message: isAvailableMessage,
      actions: [
        {
          text: "Okay",
          action: () => {
            MessagePopup.hide();
          },
        },
      ],
      closeOnOverlayPress: false,
    });
  };

  return (
    <View
      style={[
        styles.wrapper,
        flex.direction.row,
        flex.align.center,
        { marginTop: 5 },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          isAvailable ? handleSelectRadio(index, restaurant) : setPopup()
        }
        style={styles.touchBox}
      >
        {selectedRadioButton == index ? (
          <View style={styles.container}></View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[text.size.md, text.weight.regular]}>
          {restaurant?.name}
        </Text>
        <Text style={[text.size.sm, text.weight.regular, text.color.darkGray]}>
          {restaurant?.delivery_date}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#fff",
    marginBottom: 0,
  },
  touchBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 2,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: palette.yellow,
    margin: 10,
  },
};
export { MyCartItemMerch };
