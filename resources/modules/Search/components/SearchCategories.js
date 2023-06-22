import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useDispatch } from "react-redux";
import { getSearch } from "../../../http";
import { storeSearchData } from "../../../slices/bannerSlice";
import palette from "../../../styles/palette.styles";
import { LoadingOverlay } from "../../../components/common";

const SearchCategories = () => {
  const [categoiesValue, setCategoriesValue] = useState();
  const dispatch = useDispatch();

  const searchItemByCategories = async (categories) => {
    const params = {
      keyword: categories,
    };

    if (params.keyword.length >= 0) {
      LoadingOverlay.show("Loading...");
      const { data } = await getSearch(params);
      dispatch(storeSearchData(data?.data));
      LoadingOverlay.hide();
    }
  };

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "white",
      }}
    >
      <View style={styles.categoryTitleWrapper}>
        <Text style={{ fontSize: 15, color: "#000" }}>Category</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            searchItemByCategories("all");
            setCategoriesValue("all");
          }}
        >
          <Text style={{ fontSize: 13, color: "#B8B8B8" }}>See all</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingVertical: 10,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.categoryBtn,
            categoiesValue === "breakfast" && {
              backgroundColor: palette.yellow,
            },
          ]}
          onPress={() => {
            searchItemByCategories("breakfast");
            setCategoriesValue("breakfast");
          }}
        >
          {categoiesValue === "breakfast" ? (
            <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Breakfast</Text>
          ) : (
            <>
              <Image
                resizeMode="contain"
                source={require("@img/food.png")}
                style={styles.icon}
              />
              <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Breakfast</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.categoryBtn,
            categoiesValue === "lunch" && {
              backgroundColor: palette.yellow,
            },
          ]}
          onPress={() => {
            searchItemByCategories("lunch");
            setCategoriesValue("lunch");
          }}
        >
          {categoiesValue === "lunch" ? (
            <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Lunch</Text>
          ) : (
            <>
              <Image
                resizeMode="contain"
                source={require("@img/food.png")}
                style={styles.icon}
              />
              <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Lunch</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.categoryBtn,
            categoiesValue === "dinner" && {
              backgroundColor: palette.yellow,
            },
          ]}
          onPress={() => {
            searchItemByCategories("dinner");
            setCategoriesValue("dinner");
          }}
        >
          {categoiesValue === "dinner" ? (
            <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Dinner</Text>
          ) : (
            <>
              <Image
                resizeMode="contain"
                source={require("@img/food.png")}
                style={styles.icon}
              />
              <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Dinner</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.categoryBtn,
            categoiesValue === "snack" && {
              backgroundColor: palette.yellow,
            },
          ]}
          onPress={() => {
            searchItemByCategories("snack");
            setCategoriesValue("snack");
          }}
        >
          {categoiesValue === "snack" ? (
            <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Snacks</Text>
          ) : (
            <>
              <Image
                resizeMode="contain"
                source={require("@img/food.png")}
                style={styles.icon}
              />
              <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Snacks</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.categoryBtn,
            categoiesValue === "dessert" && {
              backgroundColor: palette.yellow,
            },
          ]}
          onPress={() => {
            searchItemByCategories("dessert");
            setCategoriesValue("dessert");
          }}
        >
          {categoiesValue === "dessert" ? (
            <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Dessert</Text>
          ) : (
            <>
              <Image
                resizeMode="contain"
                source={require("@img/food.png")}
                style={styles.icon}
              />
              <Text style={{ fontSize: 13, color: "#2C2C2E" }}>Dessert</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  categoryTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    maxHeight: 18,
    width: 18,
    marginRight: 5,
  },
  categoryWrapper: {},
  categoryBtn: {
    borderWidth: 1,
    borderColor: "#B8B8B8",
    borderRadius: 30,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 10,
    marginBottom: 10,
  },
};

export { SearchCategories };
