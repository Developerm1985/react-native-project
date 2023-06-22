import React from "react";
import { Text, View, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { BackButton, CartIcon } from "@components/common";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const ProductHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={[flex.direction.row, flex.align.center, styles.header]}>
      <View style={{ flex: 1 }}>
        <BackButton containerStyle={{ backgroundColor: "#B8B8B8" }} />
      </View>
      <Text
        style={[
          textStyles.size.mlg,
          textStyles.weight.regular,
          textStyles.color.darkGray,
        ]}
      >
        Customize Order
      </Text>
      <View style={[flex.direction.row, flex.justify.end, { flex: 1 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("MyCart")}
        >
          <CartIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  header: {
    // borderWidth: 2,
    // marginTop: StatusBar.currentHeight,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
};

export { ProductHeader };
