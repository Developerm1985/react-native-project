import React, { useEffect, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Share,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import { Wrapper } from "@components/Layout";
import {
  MerchHeader,
  MerchCoupons,
  MerchProductCategories,
  MerchProducts,
  MerchCartButton,
} from "./components";
import textStyles from "@styles/textStyles.styles";
import merchantStyles from "@styles/merchant.styles";
import { findMerchantDetails } from "../../http/index";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import { BackButton } from "../../components/common";
import { TouchableOpacity } from "react-native-gesture-handler";

const Merchant = ({ route }) => {
  const [merchant, setMerchant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const { width } = Dimensions.get("window");

  const shareMerchant = async () => {
    await Share.share({
      url: merchant?.share_link,
      message: merchant?.share_link,
    });
  };

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    getMerchantDetail(route.params.id);
  }, []);

  const getMerchantDetail = async (id) => {
    try {
      const { data } = await findMerchantDetails({
        id: id,
      });
      LoadingOverlay.hide();
      setMerchant(data?.data);
    } catch (err) {
      LoadingOverlay.hide();
      MessagePopup.show({
        title: "Error!",
        message: err?.message,
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

  return merchant ? (
    <Wrapper style={{ backgroundColor: "#FFFFFF" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <BackButton containerStyle={[styles.BackButton, { top: width / 10 }]} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <MerchHeader merchant={merchant} merchantID={route?.params?.id} />
        <MerchCoupons couponData={merchant.merchant_default_voucher[0]} />
        <View style={[merchantStyles.sectionWhite, styles.optionContainer]}>
          <View style={{ flex: 0.8 }}>
            <Text
              style={[
                textStyles.size.sm,
                textStyles.weight.regular,
                textStyles.color.darkGray,
              ]}
            >
              Delivery Option
            </Text>
            <Text
              style={[
                textStyles.size.md,
                textStyles.weight.medium,
                { marginTop: 10 },
              ]}
            >
              Cash
            </Text>
          </View>
          <View style={{ flex: 0.2, justifyContent: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button]}
              onPress={shareMerchant}
            >
              <Icon
                name="share-google"
                size={22}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <>
          <MerchProductCategories
            merchantId={merchant.restaurant_id}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
            setAllCategories={setAllCategories}
          />
          <MerchProducts
            merchantId={merchant.restaurant_id}
            products={selectedCategory?.foods}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            allCategories={allCategories}
          />
        </>
      </ScrollView>
      <MerchCartButton
        merchant={merchant}
        totalPrice={route?.params?.productPrice}
      />
    </Wrapper>
  ) : null;
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FDF0D6",
    padding: 5,
    borderRadius: 5,
    width: "60%",
    alignSelf: "center",
  },
  BackButton: {
    backgroundColor: "#ffffff",
    zIndex: 999,
    position: "absolute",
    left: 20,
  },
  optionContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 0,
  },
});

export default Merchant;
