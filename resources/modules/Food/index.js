import React, { useState, useEffect } from "react";
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { SelectionSlider } from "./components";
import Deals from "./components/Deals";
import { BackButton, SearchInput } from "@components/common";

import food from "../../styles/food.styles";
import { flex, textStyles, palette } from "@styles";
import { LoadingOverlay } from "@components/common/";
import { getMerchantAPI } from "../../http";
import { useDispatch } from "react-redux";
import { storeMerchant } from "../../slices/bannerSlice";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartIcon } from "@components/common";
import { apiKey } from "../../config";
import { setUserAddress } from "../../slices/authSlice";

const Food = () => {
  const navigator = useNavigation();
  const [items, setItems] = useState({});
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userCurrentLocation } = useSelector((state) => state.user);
  const addressRedux = useSelector((state) => state.user.userAddress);

  useEffect(() => {
    let defalutAddress = null;
    const subscription = navigation.addListener("focus", () => {
      if (defalutAddress != addressRedux) {
        onload();
        defalutAddress = addressRedux;
      }
    });
    if (addressRedux == null) {
      try {
        fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            userCurrentLocation.coords.latitude +
            "," +
            userCurrentLocation.coords.longitude +
            "&key=" +
            apiKey.google
        )
          .then((res) => res.json())
          .then((data) => {
            return dispatch(
              setUserAddress({ address: data.results[0].formatted_address })
            );
          });
      } catch (e) {
        console.log(e?.message);
      }
    }
    onload();
    return () => subscription;
  }, [addressRedux]);

  async function onload() {
    LoadingOverlay.show("Loading...");
    try {
      const { data } = await getMerchantAPI();
      setItems(data?.data);
      dispatch(storeMerchant(data?.data?.discover));
      LoadingOverlay.hide();
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.white} />
      <View style={food.header}>
        <View style={[flex.direction.row, flex.align.center, { padding: 5 }]}>
          <BackButton />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: "80%" }}
            onPress={() => navigation.navigate("ManageAddress")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Icon name="map-marker-alt" style={{ marginHorizontal: 10 }} />
              <Text
                style={[
                  textStyles.weight.regular,
                  textStyles.size.mlg,
                  { width: "80%" },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {addressRedux?.address}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={[
              flex.direction.row,
              flex.justify.end,
              { flex: 1, height: 50, width: 50 },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("MyCart")}
            >
              <CartIcon />
            </TouchableOpacity>
          </View>
        </View>
        <SearchInput onFocus={() => navigator.navigate("Search")} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {items?.campaigns?.length > 0 && <Deals banners={items?.campaigns} />}
        {items?.discover?.length == 0 &&
        items?.for_tommorrow?.length == 0 &&
        items?.this_week?.length == 0 &&
        items?.today?.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: Dimensions.get("window").width / 3,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                width: 300,
                height: 300,
              }}
              source={require("../../img/unavailable-img.png")}
            />
          </View>
        ) : (
          <>
            {items?.discover?.length > 0 && (
              <SelectionSlider
                title="Discover"
                _id={1}
                seeAllLink={items?.discover?.length > 5 ? true : false}
                stores={items?.discover}
              />
            )}

            {items?.for_tommorrow?.length > 0 && (
              <SelectionSlider
                title="This Week"
                _id={2}
                seeAllLink={items?.this_week?.length > 5 ? true : false}
                stores={items?.this_week}
              />
            )}

            {items?.this_week?.length > 0 && (
              <SelectionSlider
                title="For Tomorrow"
                _id={3}
                seeAllLink={items?.for_tommorrow?.length > 5 ? true : false}
                stores={items?.for_tommorrow}
              />
            )}

            {items?.today?.length > 0 && (
              <SelectionSlider
                title="Today"
                _id={4}
                seeAllLink={items?.today?.length > 5 ? true : false}
                stores={items?.today}
                vertical
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Food;
