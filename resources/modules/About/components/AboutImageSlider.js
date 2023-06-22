import React, { useState } from "react";
import { Image, View, Text, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import { BackButton } from "@components/common";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import { useNavigation } from "@react-navigation/native";
import Merchant from "../../Merchant";
import { StatusBar } from "react-native";

const windowWidth = Dimensions.get("window").width;

const AboutImageSlider = ({ merchant }) => {
  const navigation = useNavigation();
  const [paginationInd, setPaginationInd] = useState(0);

  return (
    merchant && (
      <View
        style={[
          styles.container,
          {
            borderBottomEndRadius: 10,
            overflow: "hidden",
            borderBottomLeftRadius: 10,
          },
        ]}
      >
        <Carousel
          data={merchant?.cover_photo}
          onSnapToItem={(index) => setPaginationInd(index)}
          renderItem={({ item }) => (
            <Image
              resizeMode="cover"
              source={{ uri: item, cache: "force-cache" }}
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
            {
              top: StatusBar.currentHeight + 5,
            },
          ]}
        >
          <View style={{ flex: 1 }} />
        </View>
        <View style={[styles.pagination]}>
          <Pagination
            dotsLength={merchant?.cover_photo?.length}
            activeDotIndex={paginationInd}
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
    )
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
