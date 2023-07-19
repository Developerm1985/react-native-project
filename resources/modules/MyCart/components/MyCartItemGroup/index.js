import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet } from "react-native";
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
      style={[
        styles.mainContainer,
        {
          opacity: group.isAvailable ? 1 : 0.7,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require("@img/shape.png")}
          style={styles.imageBackground}
        >
          <Text style={styles.groupTypeText}>{group.type}</Text>
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

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 10,
    marginTop: 5,
  },
  imageContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
  },
  imageBackground: {
    height: 78,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  groupTypeText: {
    fontSize: 16,
    color: "#000",
    marginBottom: -20,
    paddingLeft: 15,
  },
});

export { MyCartItemGroup };
