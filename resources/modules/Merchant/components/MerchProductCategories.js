import React, { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import { getCategories } from "../../../http/index";
import textStyles from "@styles/textStyles.styles";
import { MessagePopup } from "../../../components/common";
import { StyleSheet } from "react-native";

const MerchProductCategories = ({
  merchantId,
  selectedCategory,
  onCategorySelect,
  setAllCategories,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = async () => {
    try {
      const params = {
        restaurant_id: merchantId,
      };
      const { data } = await getCategories(params);
      setCategories(data?.data?.category);
      setAllCategories(data?.data?.category);
    } catch (err) {
      MessagePopup.show({
        title: "Error!",
        message: err.message,
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
  };

  return categories.length > 0 ? (
    <ScrollView
      style={styles.scrollContainer}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.categoryContainer}>
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

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 15,
    marginVertical: 5,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#F0F0F0",
  },
  categoryContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    marginEnd: 30,
  },
});

export { MerchProductCategories };
