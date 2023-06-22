import React from "react";
import { View, Text } from "react-native";
import { ProductCard } from "@components/common";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";

const SimilarProducts = ({ similarProducts }) => {
  return (
    <View
      style={{
        marginTop: 30,
        marginBottom: 60,
      }}
    >
      <Text
        style={[
          textStyles.size.md,
          textStyles.weight.medium,
          { marginBottom: 5 },
        ]}
      >
        Similar Products
      </Text>
      <View
        style={[
          flex.direction.row,
          flex.wrap,
          flex.justify.between,
          {
            flexDireciton: "row",
          },
        ]}
      >
        {similarProducts?.map((product, index) => (
          <ProductCard
            product={product}
            orientation="v"
            key={`productcell_${index}`}
          />
        ))}
      </View>
    </View>
  );
};

const styles = {
  gridCell: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
};
export { SimilarProducts };
