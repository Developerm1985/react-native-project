import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";

import { FoodItemCard } from "./components";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import food from "@styles/food.styles";

const SelectionSlider = ({
  title,
  seeAllLink,
  stores,
  containerStyles = {},
  vertical,
  _id,
}) => {
  const navigation = useNavigation();

  return stores && stores.length > 0 ? (
    <View style={containerStyles}>
      <View style={[flex.flexRow, flex.contentBetween, food.sectionHeading]}>
        <Text style={textStyles.mdTextBold}>{title}</Text>
        {seeAllLink ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("SeeAll", {
                id: _id,
                title: title,
              });
            }}
          >
            <Text style={textStyles.xsTextMedium}>See All</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      {vertical ? (
        <View>
          {stores.map((item, index) => (
            <FoodItemCard
              key={`fooditem${title.toLowerCase().replace(/ /g, "")}${index}`}
              title={title}
              item={item}
              isFirst={index === 0}
              isLast={index + 1 === stores.length}
              fullWidth
            />
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          style={{ marginBottom: 20 }}
        >
          {stores?.map((item, index) => (
            <FoodItemCard
              title={title}
              key={`fooditem${title.toLowerCase().replace(/ /g, "")}${index}`}
              item={item}
              isFirst={index === 0}
              isLast={index + 1 === stores.length}
            />
          ))}
        </ScrollView>
      )}
    </View>
  ) : null;
};

export { SelectionSlider };
