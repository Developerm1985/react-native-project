import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Layout from "@components/Layout";
import { CheckoutSubmitButton } from "@components/common";
import {
  CheckoutHeader,
  CheckoutDeliveryInfo,
  CheckoutBilling,
  CheckoutPaymentMethod,
} from "@modules/Checkout/components";
import { CheckoutItemGroup } from "./components/CheckoutItemGroup";
import { paymentUrl, placeOrder } from "../../http";
import { useSelector, useDispatch } from "react-redux";
import { LoadingOverlay } from "../../components/common";
import { setOrderId } from "../../slices/cartSlice";
import { MessagePopup } from "../../components/common";
import { getCheckoutData } from "../../http";

const Checkout = ({ route }) => {
  const [showPayment, setShowPayment] = useState(false);
  const navigation = useNavigation();
  const [payment, setPayment] = useState("");
  const [pickLocation, setPickLocation] = useState(false);
  const [merchant, setMerchant] = useState(route.params.merchantGroup);
  const [totalPrice, setTotalPrice] = useState(route.params.totalPayment);
  const [merchantProductsIds, setMerchantProductIds] = useState([]);
  const [orderTotalPrice, setOrderTotalPrice] = useState(
    route.params.orderTotalPrice
  );
  const _cartTotal = useSelector((state) => state.cart.cartTotal);
  const [cardData, setCardData] = useState("");
  const couponData = useSelector((state) => state.coupon.couponData);
  const { userdata } = useSelector((state) => state.user);
  const userAddress = useSelector((state) => state.user.userAddress);
  const { finalPayment } = useSelector((state) => state.cart);
  const [checkOutData, setCheckOutData] = useState();
  const [appliedCode, setAppliedCode] = useState("");
  const [addressWatch, setAddressWatch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    onload();
    setOrderTotalPrice(route?.params?.orderTotalPrice);
  }, []);

  const onload = async () => {
    LoadingOverlay.show("Loading...");
    const params = {
      restaurant_id: route?.params?.merchantGroup?.id,
      coupon_code: appliedCode,
      type: route?.params?.merchantGroup?.type,
    };

    try {
      const { data } = await getCheckoutData(params);
      if (data.success) {
        setCheckOutData(data?.data);
        LoadingOverlay.hide();
        if (!checkOutData?.is_applied && data?.data?.message?.length > 0) {
          MessagePopup.show({
            title: "Attention!",
            message: data?.data?.message,
            actions: [
              {
                text: "Okay",
                action: () => {
                  setAppliedCode("");
                  MessagePopup.hide();
                },
              },
            ],
          });
        }
      } else {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Attention!",
          message: data?.message,
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
      console.log(err);
      throw err;
    }
  };

  const handlePaymentSelection = (selectedPayment) => {
    if (selectedPayment == null) {
      MessagePopup.show({
        title: "Payment method required!",
        message: `Please select any one payment methord`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
      setShowPayment(false);
    } else {
      console.log(selectedPayment);
      setPayment(selectedPayment);
      setShowPayment(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      onload();
    });

    return () => unsubscribe;
  }, [addressWatch]);

  async function collectProductsIds() {
    await merchant?.product?.map((prod) => {
      setMerchantProductIds((prevSelected) => [
        ...prevSelected,
        { food_id: prod.food_id },
      ]);
    });
  }

  useEffect(() => {
    collectProductsIds();
  }, []);

  useEffect(() => {
    setShowPayment(false);
  }, [payment]);

  const handleEditLocation = () => {
    if (userdata?.full_name === null || userdata?.email === null) {
      setAddressWatch(true);
      navigation.push("EditProfile");
    } else {
      setAddressWatch(true);
      navigation.push("ManageAddress", {
        from: "Checkout",
      });
    }
  };

  return checkOutData != undefined ? (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: route?.params?.fromMerchant ? StatusBar.currentHeight : 0,
      }}
    >
      <Layout.Wrapper style={{ backgroundColor: "#F8F8F8" }}>
        {/* <MapPicker active={pickLocation} onMapPick={handleOnMapPick} /> */}
        <CheckoutHeader fromCart={route?.params.fromCart} />
        <Layout.Scroll>
          <CheckoutDeliveryInfo handleEditLocation={handleEditLocation} />
          <View style={{ padding: 15 }}>
            <CheckoutItemGroup checkOutData={checkOutData} />
            <View style={styles.dashedBorder} />
          </View>
          <CheckoutBilling
            appliedCode={appliedCode}
            checkOutData={checkOutData}
            onloadCoupon={() => onload()}
            handleAppliedCode={(value) => setAppliedCode(value)}
          />
          <CheckoutPaymentMethod
            handlePaymentSelect={(_method) => handlePaymentSelection(_method)}
            payment={payment}
            toggle={(status) => setShowPayment(status)}
            handleCardData={(_data) => setCardData(_data)}
          />
        </Layout.Scroll>
        <CheckoutSubmitButton
          totalPrice={checkOutData?.grand_total ? checkOutData.grand_total : 0}
          onSubmit={async () => {
            const params = {
              restaurant_id: merchant?.id,
              payment_method: payment,
              delivery_address_id: userAddress?.id,
              type: checkOutData?.type,
              coupon_code: checkOutData?.coupon_code,
            };

            if (
              userdata?.full_name === null ||
              (userAddress?.address === null &&
                (userdata?.email === null ||
                  userAddress?.contact_person_name === null))
            ) {
              LoadingOverlay.hide();
              MessagePopup.show({
                title: "Message",
                message: "Please add your name and address to proceed.",
                actions: [
                  {
                    text: "Okay",
                    action: () => {
                      MessagePopup.hide();
                    },
                  },
                ],
              });
            } else if (payment == "COD") {
              try {
                LoadingOverlay.show("Preparing Order...");
                const { data } = await placeOrder(params);
                dispatch(setOrderId(data?.data?.order_id));
                LoadingOverlay.hide();
                if (data?.success) {
                  if (data?.data?.type == "Pre-Order") {
                    MessagePopup.show({
                      title: "Place order!",
                      message: data?.message,
                      actions: [
                        {
                          text: "Okay",
                          action: () => {
                            MessagePopup.hide();
                            navigation.reset({
                              index: 0,
                              routes: [
                                {
                                  name: "Orders",
                                  params: { fromCheckout: true },
                                },
                              ],
                            });
                          },
                        },
                      ],
                      closeOnOverlayPress: false,
                    });
                  } else {
                    navigation.navigate("Loading", {
                      screenName: "TrackParcel",
                      orderId: data?.data?.order_id,
                      payment: payment,
                      cardData: cardData ? cardData : null,
                      totalPrice: totalPrice,
                      path: "food",
                      status:
                        checkOutData?.type == "Ready-Made"
                          ? "pending"
                          : "scheduled",
                    });
                  }
                } else {
                  MessagePopup.show({
                    title: "Attention!",
                    message: data?.message,
                    actions: [
                      {
                        text: "Okay",
                        action: () => {
                          MessagePopup.hide();
                          navigation.goBack();
                        },
                      },
                    ],
                  });
                }
              } catch (err) {
                console.log("check out err ", err);
                LoadingOverlay.hide();
                throw err;
              }
            } else if (payment == "Gcash") {
              LoadingOverlay.show("Preparing Order...");
              try {
                const { data } = await placeOrder(params);
                if (data?.success) {
                  dispatch(setOrderId(data?.data?.order_id));
                  if (data?.data?.order_id) {
                    try {
                      const datas = await paymentUrl({
                        order_id: data?.data?.order_id,
                        type: data?.data?.type,
                      });
                      LoadingOverlay.hide();
                      datas?.data?.success &&
                        navigation.navigate("GcashModule", {
                          paymentUrls: datas?.data?.data?.url,
                          screenName: "TrackParcel",
                          from: "checkout",
                          orderId: data?.data?.order_id,
                          payment: payment,
                          cardData: cardData ? cardData : null,
                          totalPrice: totalPrice,
                          orderType: data?.data?.type,
                          path: "food",
                          status:
                            checkOutData?.type == "Ready-Made"
                              ? "pending"
                              : "scheduled",
                        });
                    } catch (err) {
                      LoadingOverlay.hide();
                    }
                  }
                } else {
                  LoadingOverlay.hide();
                  MessagePopup.show({
                    title: "Attention",
                    message: data?.message,
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
            } else {
              MessagePopup.show({
                title: "Payment Method required!",
                message: `Please Select any Payment Method.`,
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
          }}
        />
      </Layout.Wrapper>
    </SafeAreaView>
  ) : (
    <></>
  );
};

const styles = {
  dashedBorder: {
    height: 0,
    width: "100%",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#888",
    opacity: 0.5,
    borderRadius: 2,
    marginTop: 25,
    paddingTop: 1,
  },
};

export default Checkout;
