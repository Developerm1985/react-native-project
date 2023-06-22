import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

import { ProductQuantityControl } from "@components/common";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const ProductQtyPrice = ({
  product,
  addedPriceVariations,
  addedPriceAddOns,
  handleCartProduct,
  handleProductTotalPrice,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const price = Number(product.price);

  useEffect(() => {
    setTotalProductPrice(
      (
        ((addedPriceVariations ? addedPriceVariations : price) +
          (addedPriceAddOns ? addedPriceAddOns : 0)) *
        quantity
      ).toFixed(2)
    );
    handleProductTotalPrice(quantity);
  });

  return (
    <View style={[flex.align.center, flex.direction.row, { marginTop: 15 }]}>
      <ProductQuantityControl
        quantity={quantity}
        onChange={(value) => setQuantity(value === 0 ? 1 : value)}
      />
      <View style={[flex.direction.row, flex.justify.end, { flex: 1 }]}>
        <Text style={[textStyles.size.lg, textStyles.weight.bold]}>
          P{totalProductPrice}
        </Text>
      </View>
    </View>
  );
};

export { ProductQtyPrice };
