import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { Image } from "@components/elements";

import { flex, textStyles } from "@styles/";
import { useSelector } from "react-redux";
import { SelectionSlider } from "../../Food/components";
import { useNavigation } from "@react-navigation/native";

const SearchResult = () => {
  const searchFilterData = useSelector((state) => state.banner.searchData);
  const navigation = useNavigation();

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 0,
        backgroundColor: "white",
      }}
    >
      {searchFilterData?.restaurants?.length > 0 ? (
        <View style={{ marginTop: 10 }}>
          <Text style={[textStyles.size.md, textStyles.weight.medium]}>
            Restaurants
          </Text>
          <View style={[flex.direction.row, flex.wrap, flex.justify.between]}>
            {searchFilterData?.restaurants?.length > 0 ? (
              searchFilterData?.restaurants?.map((v, i) => (
                <View key={`searchresult${i}`} style={styles.imageWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("About", { id: v.id })}
                  >
                    <Image
                      imgProps={{
                        source: {
                          uri: v.restaurant_logo
                            ? v.restaurant_logo
                            : Image.defaultImage,
                          cache: "force-cache",
                        },
                        style: styles.image,
                        resizeMode: "cover",
                      }}
                    />
                    <LinearGradient
                      colors={["#000000cc", "#00000000"]}
                      style={styles.textWrapper}
                    >
                      <Text
                        style={[
                          textStyles.size.md,
                          textStyles.weight.bold,
                          textStyles.color.white,
                        ]}
                      >
                        {v.name}
                      </Text>
                      <Text
                        style={[
                          textStyles.size.xs,
                          textStyles.weight.regular,
                          textStyles.color.white,
                        ]}
                      >
                        {v.schedule}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View
                style={{
                  width: "100%",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontSize: 14 }}>
                  No results found!
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}

      {searchFilterData?.foods?.length > 0 ? (
        <View style={{ marginTop: 10 }}>
          <Text style={[textStyles.size.md, textStyles.weight.medium]}>
            Cuisines
          </Text>
          <View style={[flex.direction.row, flex.wrap, flex.justify.between]}>
            {searchFilterData?.foods?.length > 0 ? (
              searchFilterData?.foods?.map((v, i) => (
                <View key={`searchresult${i}`} style={styles.imageWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("Product", {
                        id: v.id,
                        fromMerchant: true,
                      })
                    }
                  >
                    <Image
                      imgProps={{
                        source: {
                          uri: v.product_image
                            ? v.product_image
                            : Image.defaultImage,
                          cache: "force-cache",
                        },
                        style: styles.image,
                        resizeMode: "cover",
                      }}
                    />
                    <LinearGradient
                      colors={["#000000cc", "#00000000"]}
                      style={styles.textWrapper}
                    >
                      <Text
                        style={[
                          textStyles.size.md,
                          textStyles.weight.bold,
                          textStyles.color.white,
                        ]}
                      >
                        {v.name}
                      </Text>
                      <Text
                        style={[
                          textStyles.size.xs,
                          textStyles.weight.regular,
                          textStyles.color.white,
                        ]}
                      >
                        {v.schedule}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View
                style={{
                  width: "100%",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontSize: 14 }}>
                  No results found!
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}

      <View
        style={{
          width: "100%",
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#000", fontSize: 14 }}>
          {searchFilterData?.foods?.length == 0 &&
          searchFilterData?.restaurants?.length == 0
            ? `No results found!`
            : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  imageWrapper: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 15,
  },
  image: {
    height: 175,
    width: "100%",
  },
  textWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    padding: 13,
  },
};

export { SearchResult };
