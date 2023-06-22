import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import palette from "@styles/palette.styles";

const ProductVariantSelection = ({
  variant,
  handleValueAddedPrice,
  selectedVariation,
  handleSetIndex,
  radioButtonIndex,
}) => {
  const [selected, setSelected] = useState(0);
  return (
    <View style={[styles.container]}>
      <View
        style={[flex.direction.row, flex.align.center, flex.justify.between]}
      >
        <Text style={[textStyles.size.md, textStyles.weight.medium]}>
          {variant?.name}
        </Text>
        <Text
          style={[
            textStyles.size.sm,
            { color: variant?.isRequired ? palette.yellow : palette.darkGray },
          ]}
        >
          {variant?.isRequired ? "Required" : "Optional"}
        </Text>
      </View>
      {variant?.options?.map((option, index) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`variantoption_${index}`}
            style={{ marginTop: 20 }}
            onPress={() => {
              handleValueAddedPrice(option.addedPrice);
              handleSetIndex(index);
              setSelected(index);
              selectedVariation(option);
            }}
          >
            <View style={[flex.direction.row, flex.align.center]}>
              {radioButtonIndex === index ? (
                <Icon name="circle-slice-8" size={18} color={palette.yellow} />
              ) : (
                <Icon name="circle-outline" size={18} color={"#B8B8B8"} />
              )}
              <Text
                style={[
                  { flex: 1, paddingHorizontal: 15 },
                  textStyles.size.md,
                  textStyles.color.darkGray,
                  textStyles.weight.regular,
                ]}
              >
                {option.name}
              </Text>
              {option.addedPrice ? (
                <Text style={[textStyles.size.md, textStyles.weight.regular]}>
                  P{option.addedPrice}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = {
  container: {
    marginTop: 25,
  },
};

export { ProductVariantSelection };
