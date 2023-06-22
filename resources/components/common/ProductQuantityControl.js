import React, { Fragment } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button } from "react-native-elements";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const ProductQuantityControl = ({
  addToCart,
  productId,
  quantity,
  onChange,
}) => {
  const navigation = useNavigation();
  return addToCart ? (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("Product", { id: productId })}
      style={[
        flex.direction.row,
        flex.align.center,
        flex.justify.between,
        quantity ? { flex: 1 } : {},
      ]}
    >
      {/* <Button
        // onPress={() => navigation.navigate("Product", { id: productId })}
        style={[textStyles.mdTextBold, { color: palette.black }]}
        icon={<Icon name="plus" size={11} color="black" />}
        buttonStyle={{ backgroundColor: palette.yellow, borderRadius: 8 }}
      /> */}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        flex.direction.row,
        flex.align.center,
        flex.justify.between,
        quantity ? { flex: 1 } : {},
      ]}
    >
      {quantity > 0 ? (
        <>
          <Button
            onPress={() => onChange(quantity - 1)}
            style={[textStyles.mdTextBold, { color: palette.black }]}
            icon={<Icon name="minus" size={11} color="black" />}
            buttonStyle={{ backgroundColor: palette.yellow, borderRadius: 8 }}
          />
          <Text>{quantity}</Text>
        </>
      ) : null}
      <Button
        onPress={() => onChange(quantity + 1)}
        style={[textStyles.mdTextBold, { color: palette.black }]}
        icon={<Icon name="plus" size={11} color="black" />}
        buttonStyle={{ backgroundColor: palette.yellow, borderRadius: 8 }}
      />
    </View>
  );
};

export { ProductQuantityControl };
