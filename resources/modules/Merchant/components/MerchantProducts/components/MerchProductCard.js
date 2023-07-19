import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ProductQuantityControl, Price } from "@components/common";
import merchantStyles from "@styles/merchant.styles";
import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const MerchProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("Product", { id: product.id, fromMerchant: true })
      }
      style={[merchantStyles.item, flex.flexRow]}
    >
      <Image
        resizeMode="cover"
        source={{ uri: product.image[0], cache: "force-cache" }}
        style={merchantStyles.productImage}
      />
      <View style={[merchantStyles.productInfo]}>
        <Text style={textStyles.normalTextMedium}>{product.name}</Text>
        <View style={[flex.flexRow, flex.contentBetween]}>
          <Price
            style={[textStyles.normalTextMedium, { flex: 1 }]}
            value={product.price}
          />
          <ProductQuantityControl
            productId={product.id}
            addToCart={true}
            quantity={quantity}
            onChange={(value) => setQuantity(value)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { MerchProductCard };
