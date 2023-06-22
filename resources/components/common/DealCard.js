import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";

const DealCard = ({ deal, containerStyles = {} }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={
        () =>
          // deal.route
          //   ?
          navigation.navigate(
            // deal.route,
            // deal.route == "merchant" ? deal.merchant_id : deal.food_id
            "About",
            { id: deal?.restaurant_id }
          )
        // : {}
      }
    >
      <ImageBackground
        source={{ uri: deal.image, cache: "force-cache" }}
        style={{ ...styles.image, ...containerStyles }}
      >
        <LinearGradient
          colors={["#00000000", "#000000E0"]}
          style={flex.viewGradient}
        >
          {deal.title ? (
            <Text
              style={[
                textStyles.size.md,
                textStyles.weight.bold,
                textStyles.color.white,
              ]}
            >
              {deal.title}
            </Text>
          ) : null}
          {deal.description ? (
            <Text
              style={[
                textStyles.size.xs,
                textStyles.weight.regular,
                textStyles.color.white,
              ]}
            >
              {deal.description}
            </Text>
          ) : null}
          {deal.merchant ? (
            <Text
              style={[
                textStyles.size.xs,
                textStyles.weight.regular,
                textStyles.color.white,
              ]}
            >
              {deal.merchant}
            </Text>
          ) : null}
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = {
  image: {
    flex: 1,
    justifyContent: "flex-end",
    height: 150,
    marginTop: 15,
    borderRadius: 4,
    overflow: "hidden",
  },
};

export { DealCard };
