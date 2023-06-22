import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View, Text, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { CartIcon, Price } from "@components/common";
import { flex, textStyles, palette } from "@styles/";

import Cart from "../../../factories/cart.factory";

const MerchCartButton = ({ merchant, totalPrice }) => {
  const navigation = useNavigation();
  const { cartData } = useSelector((state) => state.cart);
  // const cart = useSelector((state) => new Cart(state.cart));
  // const count = cart.getItemCount(merchant.id);
  const showAnimation = useRef(new Animated.Value(300)).current;
  const toggleAnimation = (toValue) => {
    Animated.timing(showAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // useEffect(() => toggleAnimation(count > 0 ? 0 : 300), [count]);

  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const [updatedPrice, setUpdatedPrice] = useState();

  const getCartItemTotal = () => {
    let total = 0;
    cartData.map((item) => {
      item?.restaurant?.product.map((product) => {
        return (total += Number(product.food_total));
      });
    });
    setUpdatedPrice(total);
  };

  useEffect(() => {
    getCartItemTotal();
  }, [cartData]);

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cartButton}
        onPress={() =>
          navigation.navigate("MyCart", {
            fromMerchant: true,
          })
        }
      >
        <View
          style={[flex.direction.row, flex.align.center, flex.justify.between]}
        >
          <CartIcon
            containerStyle={{ backgroundColor: "transparent" }}
            textStyle={{ backgroundColor: "white" }}
            count={20}
          />
          <Price
            style={[textStyles.size.md, textStyles.weight.bold]}
            value={updatedPrice > 0 ? updatedPrice : 0}
          />
          <Text style={[textStyles.size.sm, textStyles.weight.regular]}>
            View Cart
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  cartButtonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 20,
  },
  cartButton: {
    backgroundColor: palette.yellow,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginHorizontal: 20,
    marginBottom: 10,
  },
};

export { MerchCartButton };
