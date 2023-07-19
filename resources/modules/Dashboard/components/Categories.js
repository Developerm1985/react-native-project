import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import palette from "@styles/palette.styles";

const services = [
  {
    name: "Delivery",
    image: require("@img/delivery.png"),
    route: "ParcelDelivery",
    active: true,
  },
  {
    name: "Food",
    image: require("@img/food.png"),
    active: true,
    route: "Food",
  },
];

const Categories = ({ handleComingSoon }) => {
  const navigation = useNavigation();

  return (
    <View style={[flex.direction.row, flex.justify.around]}>
      {services.map((category, index) => (
        <TouchableOpacity
          activeOpacity={0.8}
          key={`foodcategory${index}`}
          style={[
            styles.category,
            {
              backgroundColor: category.active ? palette.yellow : palette.white,
            },
          ]}
          onPress={() =>
            category.route && category.active
              ? navigation.navigate(category.route)
              : handleComingSoon(category.name)
          }
        >
          <View style={styles.categoryIcon}>
            <Image
              resizeMode="contain"
              source={category.image}
              style={styles.icon}
            />
          </View>
          <View style={{ maxWidth: 50 }}>
            <Text
              style={[
                textStyles.size.xs,
                textStyles.weight.medium,
              ]}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  category: {
    backgroundColor: palette.white,
    borderRadius: 37,
    paddingHorizontal: 10,
    paddingTop: 15,
    alignItems: "center",
    paddingBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 70,
  },
  categoryIcon: {
    backgroundColor: palette.white,
    borderRadius: 100,
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: palette.borderColor,
    marginBottom: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 15,
    fontFamily: "SFProText-Regular",
    lineHeight: 22,
  },
  icon: {
    maxHeight: 30,
  },
};

export { Categories };
