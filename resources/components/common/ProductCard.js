import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ProductQuantityControl } from "./ProductQuantityControl";

import palette from "@styles/palette.styles";
import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const ProductCard = ({ product, orientation = "h" }) => {
  // const [quantity, setQuantity] = useState(0);
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexBasis: "49%",
        backgroundColor: "white",
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.replace("Product", { id: product.id })}
      >
        <Image
          source={{ uri: product.image[0], cache: "force-cache" }}
          style={styles[`productImage_${orientation}`]}
        />
        {/* </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}onPress={() => navigation.navigate("Product", { id: product?.id })}> */}
        <View style={[styles[`productInfo_${orientation}`]]}>
          <Text style={textStyles.normalTextMedium}>{product.name}</Text>
          <Text
            style={[styles.productDescription, textStyles.darkGray]}
            numberOfLines={1}
          >
            {product.description}
          </Text>
          {/* </TouchableOpacity> */}
          <View style={[flex.flexRow, flex.contentBetween]}>
            <Text style={[textStyles.normalTextMedium, { flex: 1 }]}>
              P {product.price}
            </Text>
            {/* <ProductQuantityControl
              addToCart={true}
              productId={product.id}
              // quantity={quantity}
              // onChange={(value) => setQuantity(value)}
            /> */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  productInfo_h: {
    marginLeft: 20,
    flex: 1,
  },
  productInfo_v: {
    padding: 10,
  },
  productImage_h: {
    width: 80,
    height: 80,
    borderRadius: 6,
    width: "100%",
  },
  productImage_v: {
    // width: "100%",
    height: 120,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    width: "100%",
  },
  productDescription: {
    color: palette.darkGray,
    fontSize: 13,
    marginBottom: 15,
  },
};
export { ProductCard };
