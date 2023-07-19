import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome5";
import palette from "@styles/palette.styles";
import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const MerchHeader = ({ merchant, merchantID }) => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={
        merchant.cover_photo
          ? { uri: merchant.cover_photo, cache: "force-cache" }
          : require("@img/foods.jpg")
      }
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["#00000000", "#000000E0"]}
        style={[flex.merchantGradient, flex.justify.between]}
      >
        <View>
          <View
            style={[
              flex.direction.row,
              flex.justify.between,
              flex.align.center,
            ]}
          >
            <Text style={styles.name}>{merchant.restaurant_name}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.infoIcon}
              onPress={() =>
                navigation.navigate("About", {
                  merchantId: merchantID,
                })
              }
            >
              <Icon name="info-circle" color="#fff" size={15} />
            </TouchableOpacity>
          </View>
          <View style={flex.flexRow}>
            <View style={[textStyles.time, flex.flexRow]}>
              <Icon
                style={textStyles.iconLeft}
                name="star"
                solid
                size={12}
                color={palette.yellow}
              />
              <Text style={styles.info}>{`${
                merchant.review_avg
                  ? Number.parseFloat(merchant?.review_avg).toFixed(1)
                  : 0
              } (${
                merchant.review_count ? merchant.review_count : "0"
              })`}</Text>
            </View>
            <View style={[textStyles.time, flex.flexRow]}>
              <Icon
                style={textStyles.iconLeft}
                name="clock"
                size={12}
                color={palette.icon}
              />
              <Text style={styles.info}>{merchant.delivery_time}</Text>
            </View>
            <View style={[textStyles.distance, flex.flexRow]}>
              <Icon
                style={textStyles.iconLeft}
                name="map-marker-alt"
                size={12}
                color={palette.icon}
              />
              <Text style={styles.info}>{merchant.distance}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = {
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    height: 300,
    borderRadius: 4,
    overflow: "hidden",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: palette.white,
    marginBottom: 15,
  },
  info: {
    color: palette.icon,
    fontSize: 12,
  },
  infoIcon: {
    backgroundColor: "#F8F8F866",
    padding: 5,
    borderRadius: 3,
    marginTop: 10,
    marginRight: 10,
  },
  sliderTextOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    width: "100%",
    // paddingHorizontal: 20,
  },
};

export { MerchHeader };
