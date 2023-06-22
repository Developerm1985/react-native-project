import React from "react";
import { View, Image, ScrollView, useWindowDimensions } from "react-native";

const ProductImages = ({ product }) => {
  const { width, height } = useWindowDimensions();
  return (
    <View style={{ marginBottom: 15 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {product?.image?.map((image, index) => (
          <View key={`productimage${index}`}>
            <Image
              resizeMode="cover"
              source={{ uri: image, cache: "force-cache" }}
              style={{
                height: (height * 30) / 100,
                width: (width * 90) / 100,
                borderRadius: 10,
                marginLeft: index === 0 ? 0 : 20,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export { ProductImages };
