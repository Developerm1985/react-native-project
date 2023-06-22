import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { MerchProductCard } from "./components";

import merchant from "@styles/merchant.styles";
import textStyles from "@styles/textStyles.styles";

const MerchProducts = ({
  products,
  merchantId,
  selectedCategory,
  onCategorySelect,
  allCategories,
}) => {
  return selectedCategory ? (
    <View
      style={{
        ...merchant.sectionWhite,
        marginBottom: 0,
      }}
    >
      <Text
        style={[
          textStyles.size.mlg,
          textStyles.weight.bold,
          { marginBottom: 20 },
        ]}
      >
        {selectedCategory ? selectedCategory.name : "Products"}
      </Text>

      {products && products.length > 0 ? (
        products?.map((product, index) => (
          <MerchProductCard key={`merchproduct${index}`} product={product} />
        ))
      ) : (
        // products?.map(( product, index ) => <MerchProductCard key={`merchproduct${ index }`} product={ product }/> )
        <Text
          style={[
            textStyles.align.center,
            textStyles.weight.bold,
            { paddingVertical: 50 },
          ]}
        >
          No products found
        </Text>
      )}
    </View>
  ) : (
    <View
      style={{
        ...merchant.sectionWhite,
        marginBottom: 0,
        paddingBottom: 60,
      }}
    >
      {allCategories?.map((item, index) => {
        return (
          <View key={index}>
            {item?.foods.length > 0 && (
              <Text
                style={[
                  textStyles.size.mlg,
                  textStyles.weight.bold,
                  { marginBottom: 20 },
                ]}
              >
                {item.name}
              </Text>
            )}

            {item?.foods.length > 0 ? (
              item?.foods?.map((product, ind) => (
                <MerchProductCard
                  key={`merchproduct${ind}`}
                  product={product}
                />
              ))
            ) : (
              <></>
            )}
          </View>
        );
      })}
    </View>
  );
};

export { MerchProducts };
