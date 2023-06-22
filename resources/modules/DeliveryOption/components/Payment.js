import React, { useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import palette from "../../../styles/palette.styles";
import Checkcircle from "react-native-vector-icons/AntDesign";

const DATA = [
  {
    id: 1,
    title: "Gcash",
    name: "gcash",
    img: require("@img/Gcash.png"),
  },
  {
    id: 2,
    title: "COD",
    name: "cod",
    img: require("@img/COD.png"),
  },
];

const Item = ({ item, onPress, backgroundColor, borderColor, iconName }) => (
  <>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.item,
        backgroundColor,
        borderColor,
        {
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 6,
          marginBottom: 8,
        },
      ]}
    >
      {iconName != "" ? (
        <Checkcircle
          name={iconName}
          size={18}
          style={{
            color: palette.yellow,
            position: "absolute",
            right: 10,
            top: 16,
          }}
        />
      ) : (
        <></>
      )}

      <Image
        source={item.img}
        resizeMode="contain"
        style={{
          padding: 5,
          marginRight: 10,
        }}
      />
      <Text
        style={{
          color: palette.black,
          fontSize: 16,
          fontWeight: "400",
          marginStart: 12,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  </>
);

const Payment = ({ handlePaymentSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <View style={{ marginBottom: 25 }}>
      <Text
        style={{
          marginBottom: 20,
          marginTop: 15,
          fontSize: 18,
          color: palette.black,
        }}
      >
        Select payment option
      </Text>
      <SafeAreaView>
        {DATA.map((item, i) => {
          const backgroundColor =
            item.id === selectedId ? "#FFEFD3" : "#f5f5f8";
          const borderColor = item.id === selectedId ? "#FFB531" : "#f5f5f8";
          const iconName = item.id === selectedId ? "checkcircle" : "";

          return (
            <Item
              key={i}
              item={item}
              onPress={() => {
                handlePaymentSelect(item.name);
                setSelectedId(item.id);
              }}
              backgroundColor={{ backgroundColor }}
              borderColor={{ borderColor }}
              iconName={iconName}
            />
          );
        })}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export { Payment };
