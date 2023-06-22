import React from "react";
import { View, useWindowDimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import { DealCard } from "@components/common";
import food from "@styles/food.styles";

const Deals = ({ banners }) => {
  const { width: contentWidth } = useWindowDimensions();

  return (
    <View style={food.sectionContainer}>
      <Carousel
        data={banners}
        renderItem={({ item }) => (
          <DealCard deal={item} containerStyles={{ height: 215 }} />
        )}
        sliderWidth={contentWidth - 40}
        itemWidth={contentWidth - 40}
      />
    </View>
  );
};

export default React.memo(Deals);
