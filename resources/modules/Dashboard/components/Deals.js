import React from "react";
import { View, Text, useWindowDimensions, TouchableOpacity } from "react-native";
import Carousel from "react-native-snap-carousel";
import { DealCard } from "@components/common";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import { useNavigation } from "@react-navigation/native";

const Deals = ({ banners }) => {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View>
      {banners?.length > 0 && (
        <View style={{ marginBottom: 27 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Food")}
          >
            <Text
              style={[
                textStyles.weight.medium,
                textStyles.size.xs,
                flex.alignSelf.end,
              ]}
            >
              See All Deals
            </Text>
          </TouchableOpacity>
          <Carousel
            data={banners}
            renderItem={({ item }) => <DealCard deal={item} />}
            sliderWidth={windowWidth - 40}
            itemWidth={windowWidth - 40}
          />
        </View>
      )}
    </View>
  );
};

export { Deals };
