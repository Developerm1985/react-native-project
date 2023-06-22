import React, { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import { addToCart, getCartApi, getProductInfo } from "../../http/index";
import { MessagePopup } from "../../components/common";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  ProductHeader,
  ProductImages,
  ProductInfo,
  ProductQtyPrice,
  ProductVariantSelection,
  SimilarProducts,
} from "./components";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { useDispatch, useSelector } from "react-redux";
import { setCartCount } from "../../slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";

const Product = ({ route }) => {
  const navigation = useNavigation();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const letest = tomorrow.setDate(tomorrow.getDate());

  const [product, setProduct] = useState(undefined);
  const [addedPriceVariations, setAddedPriceVariation] = useState(undefined);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [addedAddOns, setAddedAddOns] = useState(undefined);
  const [addedVariation, setAddedVariation] = useState(undefined);
  const [addedPriceAddOns, setAddedPriceAddOns] = useState(undefined);
  const [radioButtonIndex, setRadioButtonIndex] = useState(0);
  const [radioButtonIndexAddOn, setRadioButtonIndexAddOn] = useState(undefined);
  const [quantity, setQuantity] = useState();
  const [date, setDate] = useState(tomorrow);
  const [datePreview, setDatePreview] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const address = useSelector((state) => state.user.userAddress);
  const dispatch = useDispatch();

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    onload(route?.params?.id);
    getCartItem();
  }, []);

  const onload = async (id) => {
    try {
      const { data } = await getProductInfo({
        id: id,
      });
      if (data.success) {
        setProduct(data.data.details);
        setAddedVariation(data?.data.details.variations.options[0]);
        setSimilarProducts(data?.data.similar_products);
        LoadingOverlay.hide();
      } else {
        LoadingOverlay.hide();
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
    } catch (e) {
      LoadingOverlay.hide();
      throw e;
    }
  };

  const getCartItem = async () => {
    try {
      const { data } = await getCartApi();
      if (data.success) {
        dispatch(setCartCount(data?.data?.length));
        LoadingOverlay.hide();
      } else {
        LoadingOverlay.hide();
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
      LoadingOverlay.hide();
      throw err;
    }
  };

  const handleAddToCart = async () => {
    if (address?.length == 0) {
      MessagePopup.show({
        title: "Address Required!",
        message: "Please add default address for proceed to cart",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              navigation.push("ManageAddress", {
                from: "Product",
                fromMerchant: route?.params?.fromMerchant,
              });
            },
          },
        ],
      });
    } else {
      const formData = {
        food_id: product.id,
        quantity: quantity,
        variation: JSON.stringify(addedVariation),
        add_ons: JSON.stringify(addedAddOns),
        schedule_at: product.food_avilability != "today" ? date : "",
      };

      try {
        LoadingOverlay.show("Adding...");
        const { data } = await addToCart(formData);
        LoadingOverlay.hide();
        if (data.success) {
          navigation.replace("MyCart", {
            isAddToCart: true,
            fromMerchant: route?.params?.fromMerchant,
          });
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
        LoadingOverlay.hide();
        throw err;
      }
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (d) => {
    setDatePreview(true);
    setDate(d);
    setDatePickerVisibility(false);
  };

  const addingFood = async () => {
    if (product?.food_avilability != "today") {
      if (datePreview === false) {
        MessagePopup.show({
          title: "Attention!",
          message: `Please select food delivery date`,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      } else {
        MessagePopup.show({
          title: "Confirm!",
          message: `Are you sure! you want add to cart ?`,
          actions: [
            {
              text: "Yes",
              action: () => {
                MessagePopup.hide();
                handleAddToCart();
              },
            },

            {
              text: "No",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      }
    } else {
      handleAddToCart();
    }
  };

  return product ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: palette.lightGray,
        marginTop: 0,
      }}
    >
      <ProductHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingHorizontal: 20 }}
      >
        <ProductImages product={product} />
        <ProductInfo product={product} />
        {product.food_avilability != "today" && (
          <View>
            <Text
              style={{
                marginTop: 10,
                color: palette.yellow,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Pre Order*
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={showDatePicker}
              style={{
                backgroundColor: "#DFDFDF",
                borderWidth: 0.5,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.8,
                elevation: 1,
                shadowColor: "#DFDFDF",
                borderColor: "#DFDFDF",
                padding: 7,
                borderRadius: 5,
                // width: "45%",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "black",
                  margin: 2,
                  fontWeight: "bold",
                  textAlign: "center",
                  width: date.length,
                }}
              >
                {datePreview
                  ? date.toString().slice(0, 10) +
                    ", " +
                    JSON.stringify(date).split("T")[1].split(".")[0].slice(0, 5)
                  : "Select Delivery Date"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <DateTimePickerModal
          timeZoneOffsetInMinutes={0}
          style={{ height: 200 }}
          isVisible={isDatePickerVisible}
          mode="datetime"
          minimumDate={tomorrow}
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
        {product != null ? (
          <ProductQtyPrice
            addedPriceVariations={
              addedPriceVariations
                ? addedPriceVariations
                : addedVariation?.addedPrice
            }
            addedPriceAddOns={addedPriceAddOns}
            product={product}
            handleProductTotalPrice={(quantity) => {
              setQuantity(quantity);
            }}
          />
        ) : null}
        {
          <>
            {addedVariation && (
              <ProductVariantSelection
                handleValueAddedPrice={(value) => {
                  setAddedPriceVariation(value);
                }}
                selectedVariation={(value) => {
                  setAddedVariation(value);
                }}
                handleSetIndex={(value) => {
                  setRadioButtonIndex(value);
                }}
                radioButtonIndex={radioButtonIndex}
                addedVariation={addedVariation}
                variant={product?.variations}
              />
            )}
            {product?.add_ons?.options && (
              <ProductVariantSelection
                handleValueAddedPrice={(value) => {
                  setAddedPriceAddOns(value == addedPriceAddOns ? 0 : value);
                }}
                handleSetIndex={(value) => {
                  setRadioButtonIndexAddOn(
                    value == radioButtonIndexAddOn ? undefined : value
                  );
                }}
                radioButtonIndex={radioButtonIndexAddOn}
                addedPriceAddOns={addedPriceAddOns}
                selectedVariation={(value) => {
                  setAddedAddOns(value == addedAddOns ? {} : value);
                }}
                variant={product?.add_ons}
              />
            )}
          </>
        }
        {similarProducts?.length > 0 ? (
          <SimilarProducts similarProducts={similarProducts} />
        ) : (
          <></>
        )}
      </ScrollView>
      <View style={[styles.stickyButton]}>
        <Button
          onPress={addingFood}
          titleStyle={[
            textStyles.size.sm,
            textStyles.weight.regular,
            { color: palette.black },
          ]}
          title="Add to Cart"
          buttonStyle={{
            backgroundColor: palette.yellow,
            borderRadius: 100,
            width: "100%",
            padding: 17,
          }}
        />
      </View>
    </SafeAreaView>
  ) : (
    <></>
  );
};

const styles = {
  stickyButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
  },
};

export default Product;
