import React, { useEffect, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as Layout from "@components/Layout";
import { CheckoutSubmitButton } from "@components/common";
import { MyCartHeader, MyCartItemGroup } from "./components";
import { getCartApi, removeToCart } from "../../http";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { getCart, selectedMerchantData } from "../../slices/cartSlice";
import { CheckoutBilling } from "../Checkout/components";
import { validCoupon, setCouponData } from "../../slices/couponSlice";
import { setCartTotal } from "../../slices/cartSlice";
import { MessagePopup } from "../../components/common";
import { SafeAreaView } from "react-native-safe-area-context";
import palette from "../../styles/palette.styles";

const MyCart = ({ route }) => {
  const navigation = useNavigation();
  const [myCart, setMyCart] = useState([]);
  const [selectedRadioButton, setSelectedRadioButton] = useState(undefined);
  const [selectedMerchant, setSelectedMerchant] = useState(undefined);
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [totalPayment, setTotalPayment] = useState(orderTotalPrice);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const dispatch = useDispatch();
  const { userdata } = useSelector((state) => state.user);

  useEffect(() => {
    clearCoupon();
    _getCart();
  }, []);

  const totalPriceCounter = () => {
    const totalPrice = selectedMerchant?.product?.reduce(
      (acc, item) =>
        acc +
        (item.food_price + item.variation_price + item.addOns_price) *
          item.quantity,
      0
    );
    setOrderTotalPrice(totalPrice);
    return totalPrice ? totalPrice : 0;
  };

  const _getCart = async () => {
    LoadingOverlay.show("Loading...");
    try {
      const { data } = await getCartApi();
      setSelectedMerchant(undefined);
      setOrderTotalPrice(0);
      setMyCart(data?.data);
      dispatch(getCart(data?.data));
      LoadingOverlay.hide();
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
      throw err;
    }
  };

  function clearCoupon() {
    dispatch(validCoupon(false));
    dispatch(setCouponData({}));
  }

  const reload = async () => {
    setSelectedMerchant(undefined);
    setOrderTotalPrice(0);
    _getCart();
  };

  async function removeItem(_id) {
    let updatedMerchant = selectedMerchant?.product?.filter((item) => {
      return item.id !== _id;
    });
    dispatch(
      selectedMerchantData({ ...selectedMerchant, product: updatedMerchant })
    );
    const params = { id: _id };
    try {
      const { data } = await removeToCart(params);
      if (data.success) {
        setSelectedMerchant(undefined);
        setOrderTotalPrice(0);
        LoadingOverlay.hide();
        reload();
      }
    } catch (err) {
      LoadingOverlay.hide();
    }
  }

  const verifyUser = async () => {
    LoadingOverlay.show("Loading...");
    if (userdata?.is_requested == false) {
      LoadingOverlay.hide();
      navigation.navigate("OneMoreStep", {
        fromCart: true,
      });
    } else {
      LoadingOverlay.hide();
      navigation.navigate("Checkout", {
        merchantGroup: selectedMerchant,
        totalPayment: totalPayment,
        orderTotalPrice: orderTotalPrice,
        deliveryFee: deliveryFee,
        fromCart: true,
        fromMerchant: route?.params?.fromMerchant,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar backgroundColor={palette.white} />
      <Layout.Wrapper>
        <MyCartHeader />
        <Layout.Scroll>
          <View style={{ marginBottom: 100 }}>
            {myCart?.length > 0 ? (
              myCart.map((group, index) => (
                <View key={`${index}_ind`}>
                  <MyCartItemGroup
                    group={group}
                    selectedItems={selectedRadioButton}
                    index={index}
                    handleSelectRadio={(value, restaurant) => {
                      setSelectedMerchant(restaurant);
                      totalPriceCounter();
                      dispatch(selectedMerchantData(restaurant));
                      setSelectedRadioButton(value);
                      dispatch(setCartTotal(orderTotalPrice));
                    }}
                    selectedRadioButton={selectedRadioButton}
                    removeItem={(item) => removeItem(item)}
                  />
                </View>
              ))
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  marginTop: 250,
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ color: "gray" }}>Your cart is empty</Text>
              </View>
            )}
            {selectedMerchant?.product?.length > 0 ? (
              <CheckoutBilling
                fromCart={true}
                orderTotalPrice={orderTotalPrice}
                selectedMerchant={selectedMerchant}
                handleDeliveryFee={(_deliveryFee) =>
                  setDeliveryFee(_deliveryFee)
                }
                handleTotalPayment={(_totalPayment) => {
                  setTotalPayment(_totalPayment);
                }}
              />
            ) : (
              <></>
            )}
          </View>
        </Layout.Scroll>
        <CheckoutSubmitButton
          onSubmit={() => {
            verifyUser();
          }}
          buttonText="Proceed to Checkout"
          totalPrice={
            selectedMerchant
              ? selectedMerchant?.total_price +
                selectedMerchant?.delivery_fee +
                selectedMerchant?.convenience_fee
              : 0
          }
          disabled={selectedMerchant?.product?.length > 0 ? false : true}
        />
      </Layout.Wrapper>
    </SafeAreaView>
  );
};

export default MyCart;
