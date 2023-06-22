import React from "react";
import { Image, View, Text, useWindowDimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import { BackButton } from "@components/common";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const AboutImageSlider = () => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={[styles.container]}>
      <Carousel
        data={[...Array(5)]}
        renderItem={({ item }) => (
          <Image
            resizeMode="cover"
            source={require("@img/restau-4.jpg")}
            style={[styles.image]}
          />
        )}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
      />
      <View
        style={[
          styles.sliderTextOverlay,
          flex.align.center,
          flex.direction.row,
        ]}
      >
        <View style={{ flex: 1 }}>
          <BackButton containerStyle={{ backgroundColor: "#ffffff99" }} />
        </View>
        <Text
          style={[
            textStyles.size.mlg,
            textStyles.weight.regular,
            textStyles.color.white,
          ]}
        >
          About Shop
        </Text>
        <View style={{ flex: 1 }} />
      </View>
      <View style={[styles.pagination]}>
        <Pagination
          dotsLength={5}
          activeDotIndex={0}
          containerStyle={{}}
          dotStyle={{
            width: 7,
            height: 7,
            borderRadius: 5,
            backgroundColor: "#fff",
            padding: 0,
            margin: 0,
          }}
          inactiveDotStyle={{
            width: 7,
            height: 7,
            borderRadius: 5,
            padding: 0,
            margin: 0,
            backgroundColor: "#F8F8F880",
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: "#333",
  },
  sliderTextOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    width: "100%",
    paddingHorizontal: 20,
  },
  image: {
    height: 370,
  },
  pagination: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
};

export { AboutImageSlider };
