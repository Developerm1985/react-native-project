import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  View,
} from "react-native";

import { getCategories } from "../../../http/index";

import merchant from "@styles/merchant.styles";
import textStyles from "@styles/textStyles.styles";
import { MessagePopup } from "../../../components/common";

const MerchProductCategories = ({
  merchantId,
  selectedCategory,
  onCategorySelect,
  setAllCategories,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    onload();
  }, []);

  const onload = async () => {
    const params = {
      restaurant_id: merchantId,
    };
    try {
      const { data } = await getCategories(params);
      if (data.success) {
        setCategories(data?.data?.category);
        setAllCategories(data?.data?.category);
      } else {
        MessagePopup.show({
          title: "Warning!",
          message: data.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      }
    } catch (err) {
      throw err;
    }
  };

  return categories.length > 0 ? (
    <ScrollView
      style={{
        padding: 15,
        marginVertical: 5,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderColor: "#F0F0F0",
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          flexDirection: "row",
          marginEnd: 30,
        }}
      >
        {categories?.map((category, index) => {
          let isActive =
            selectedCategory && selectedCategory.id === category.id;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onCategorySelect(category)}
              key={`merchproductcategory${index}`}
              style={{
                marginRight: index + 1 != categories.length ? 15 : 0,
              }}
            >
              <Text
                style={[
                  textStyles.size.sm,
                  textStyles.weight.medium,
                  { color: isActive ? "#000" : "#B8B8B8" },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  ) : (
    <></>
  );
};

export { MerchProductCategories };
