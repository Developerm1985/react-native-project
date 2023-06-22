import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import palette from "@styles/palette.styles";
import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";

const FoodItemCard = ({ title, item, isFirst, isLast, fullWidth }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1.5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        marginBottom: 10,
      }}
    >
      <View
        style={[
          fullWidth
            ? styles.restaurantFullWidth
            : {
                ...styles.restaurant,
                marginRight: isLast ? 20 : 0,
                marginLeft: isFirst ? 20 : 10,
                elevation: 5,
              },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            return item.route == "Merchant"
              ? navigation.navigate("Merchant", { id: item?.restaurant_id })
              : navigation.navigate("Product", { id: item?.id });
          }}
        >
          <ImageBackground
            resizeMode="cover"
            source={{
              uri: `${item.image[0]}`,
              cache: "force-cache",
            }}
            style={styles.restaurantImage}
          />
        </TouchableOpacity>
        <View style={styles.restaurantInfo}>
          <View
            style={{
              flex: 1,
              marginBottom: 3,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Merchant", { id: item?.restaurant_id })
              }
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: palette.yellow,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {item?.restaurant_name}
              </Text>
            </TouchableOpacity>
          </View>

          {title == "Discover" ? (
            <></>
          ) : (
            <View
              style={[
                flex.flexRow,
                flex.contentBetween,
                { marginBottom: 10, marginRight: 10 },
              ]}
            >
              <Text
                style={[textStyles.smTextBold, { width: "90%" }]}
                numberOfLines={1}
              >
                {title == "Discover" ? item.restaurant_name : item?.name}
              </Text>
              <View style={[flex.flexRow]}>
                <Icon name="star" solid size={12} color={palette.yellow} />
                <Text style={styles.rating}>{item?.avg_rating}</Text>
              </View>
            </View>
          )}
          {item?.route == "Merchant" ? (
            <View style={[styles.tags, flex.flexRow]}>
              <View style={styles.tag}>
                <Text style={textStyles.smText}>Cafe</Text>
              </View>
              <View style={styles.tag}>
                <Text style={textStyles.smText}>Coffee</Text>
              </View>
            </View>
          ) : (
            <></>
          )}
          <View style={flex.flexRow}>
            <View style={[textStyles.time, flex.flexRow]}>
              <Icon
                style={textStyles.iconLeft}
                name="calendar"
                size={12}
                color={palette.gray}
              />
              <Text
                style={[
                  textStyles.size.xs,
                  textStyles.color.darkGray,
                  textStyles.weight.regular,
                ]}
              >
                {item?.schedule.replace("_", " ")}
              </Text>
            </View>
            <View style={[textStyles.distance, flex.flexRow]}>
              <Icon
                style={textStyles.iconLeft}
                name="map-marker-alt"
                size={12}
                color={palette.gray}
              />
              <Text
                style={[
                  textStyles.size.xs,
                  textStyles.color.darkGray,
                  textStyles.weight.regular,
                ]}
              >
                {item?.distance}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  restaurant: {
    borderRadius: 6,
    width: 200,
    overflow: "hidden",
  },
  restaurantImage: {
    height: 120,
    backgroundColor: "#ccc",
  },
  promoTag: {
    backgroundColor: palette.yellow,
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomRightRadius: 6,
    color: palette.white,
    fontSize: 11,
  },
  restaurantInfo: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: palette.white,
  },
  restaurantFullWidth: {
    flex: 1,
    borderRadius: 6,
    marginHorizontal: 20,
    overflow: "hidden",
    marginBottom: 10,
    elevation: 5,
  },
  tags: {
    marginVertical: 9,
    flexDirection: "row",
  },
  rating: {
    fontSize: 10,
    color: "#545458A6",
    marginLeft: 2,
  },
  tag: {
    backgroundColor: palette.lightYellow,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
};

export { FoodItemCard };
