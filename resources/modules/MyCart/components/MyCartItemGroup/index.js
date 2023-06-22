import React, { useState, useEffect } from "react";
import { ImageBackground, View, Text } from "react-native";
import { Image } from "react-native-elements";

import { MyCartItemMerch, MyCartItem } from "./components";

const MyCartItemGroup = ({
  group,
  index,
  handleSelectRadio,
  selectedRadioButton,
  removeItem,
}) => {
  const [checkResturent, setCheckResturent] = useState();
  return (
    <View
      style={{
        marginBottom: 10,
        marginTop: 5,
        opacity: group.isAvailable ? 1 : 0.7,
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          backgroundColor: "#fff",
        }}
      >
        <ImageBackground
          source={require("@img/shape.png")}
          style={{
            height: 78,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#000",
              marginBottom: -20,
              paddingLeft: 15,
            }}
          >
            {group.type}
          </Text>
        </ImageBackground>
        <MyCartItemMerch
          isAvailable={group.isAvailable}
          isAvailableMessage={group?.isAvailableMessage}
          restaurant={group?.restaurant}
          index={index}
          handleSelectRadio={(value, restaurant) => {
            handleSelectRadio(value, restaurant);
            setCheckResturent(restaurant);
          }}
          selectedRadioButton={selectedRadioButton}
        />
        {group?.restaurant?.product?.map((item, i) => (
          <MyCartItem
            key={`mycartitem_${i}`}
            item={item}
            selectedRadioButton={selectedRadioButton}
            selectedItems={checkResturent}
            removeItem={(item) => {
              removeItem(item);
            }}
          />
        ))}
      </View>
    </View>
  );
};

export { MyCartItemGroup };
