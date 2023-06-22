import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Button,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import Icon from "react-native-vector-icons/Entypo";
import { ActivityRatingForm } from "../../../Details/components/InfoDrawer/components";
import { riderReview, foodReviewForMercahnt } from "../../../../../http";
import LoaderLoading from "../../../../../components/common/LoaderLoading";
import { LoadingOverlay, MessagePopup } from "../../../../../components/common";

const ActivityRateCard = ({ data, index, past, handleRattingId }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [ratingList, setRatingList] = useState(data);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalSubmit = () => {
    setModalVisible(!isModalVisible);
  };

  const [ratingRider, setRatingRider] = useState(0);
  const [ratingFood, setRatingFood] = useState(0);
  const [commentRider, setCommentRider] = useState("");
  const [commentFood, setCommentFood] = useState("");
  const [valid, setValid] = useState(true);
  const [validRider, setValidRider] = useState(true);
  const [validFoodImage, setValidFoodImage] = useState(true);

  const onChangeText = (text, type) => {
    type == "food" ? setCommentFood(text) : setCommentRider(text);
  };

  const multipleAPI = async () => {
    {
      const riderParams = {
        delivery_man_id: data?.delivery_man_id,
        order_id: data?.id,
        comment: commentRider,
        rating: ratingRider,
      };

      const foodParams = {
        id: data?.restaurant_id,
        order_id: data?.id,
        comment: commentFood,
        rating: ratingFood,
      };
      toggleModalSubmit();
      LoadingOverlay.show("Loading...");
      if (data?.order_type === "parcel") {
        try {
          const d = await riderReview(riderParams);
          LoadingOverlay.hide();
          if (!d.data.success) {
            MessagePopup.show({
              title: "Something wents to wrong!",
              message: d.data?.message,
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
            handleRattingId(data?.id);
          }
        } catch (err) {
          toggleModalSubmit();
          LoadingOverlay.hide();
          throw err;
        }
      } else {
        try {
          const { data } = await riderReview(riderParams);
          LoadingOverlay.hide();
          if (!data.success) {
            MessagePopup.show({
              title: "Something wents to wrong!",
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
          } else {
            handleRattingId(data?.id);
          }
        } catch (err) {
          toggleModalSubmit();
          LoadingOverlay.hide();
          throw err;
        }
        try {
          const _data = await foodReviewForMercahnt(foodParams);
          LoadingOverlay.hide();
          if (!_data.data.success) {
            MessagePopup.show({
              title: "Something wents to wrong!",
              message: _data?.message,
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
            handleRattingId(data?.id);
          }
        } catch (err) {
          toggleModalSubmit();
          LoadingOverlay.hide();
          throw err;
        }
      }
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={[flex.direction.row, { alignItems: "flex-end" }]}>
        <View style={[flex.direction.row, flex.align.center, { flex: 1 }]}>
          {/* <Image
                    resizeMode="cover"
                    source={require("../../../../../img/icon.png")}
                    style={[ styles.merchImage ]}
                  /> */}
          <View style={{ marginLeft: 0 }}>
            <Text
              style={[
                textStyles.weight.regular,
                { fontSize: 12, fontWeight: "600", color: "gray" },
              ]}
            >
              {`Order No.`}
            </Text>
            <Text
              style={[
                textStyles.weight.regular,
                { fontSize: 12, fontWeight: "bold", color: "gray" },
              ]}
            >
              {`#${data.order_number}`}
            </Text>
            {past ? (
              <></>
            ) : (
              <Text
                style={[
                  textStyles.size.md,
                  textStyles.color.darkGray,
                  { fontWeight: "700", color: "#000", marginTop: 5 },
                ]}
              >
                Delivery Now
              </Text>
            )}
          </View>
        </View>
        <Text
          style={[
            textStyles.weight.regular,
            { color: "#000", fontSize: 14, fontWeight: "bold" },
          ]}
        >
          {data.order_type == "parcel" || data.order_type == "Parcel"
            ? "Parcel"
            : "Food Delivery"}
        </Text>
      </View>

      {past ? (
        <View style={{ marginTop: 25 }}>
          {data?.order_type != "parcel" ? (
            <View
              style={[
                styles.activityLog,
                flex.direction.row,
                { alignItems: "center", marginBottom: 15 },
              ]}
            >
              <Image
                resizeMode="cover"
                onError={() => setValid(false)}
                source={
                  valid
                    ? {
                        uri: data?.restaurant?.restaurant_logo,
                        cache: "force-cache",
                      }
                    : require("../../../../../img/account.png")
                }
                style={[styles.merchImage]}
              />
              <View style={{ marginLeft: 15, paddingBottom: 0 }}>
                <Text
                  style={[
                    textStyles.size.sm,
                    textStyles.size.sm,
                    textStyles.weight.regular,
                    {
                      lineHeight: 13,
                      marginBottom: 0,
                      color: "#000",
                      fontWeight: "700",
                    },
                  ]}
                >
                  {data?.restaurant?.name}
                </Text>
                <Text
                  style={[
                    textStyles.size.sm,
                    textStyles.size.sm,
                    textStyles.weight.regular,
                    {
                      lineHeight: 13,
                      marginBottom: 0,
                      color: "#000",
                      fontWeight: "700",
                      fontSize: 10,
                    },
                  ]}
                >
                  {data?.delivered}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.activityLog,
                  flex.direction.row,
                  { alignItems: "center", marginBottom: 15 },
                ]}
              >
                <View style={{ marginLeft: 15, paddingBottom: 0 }}>
                  <Text
                    style={[
                      textStyles.size.sm,
                      textStyles.size.sm,
                      textStyles.weight.regular,
                      {
                        lineHeight: 13,
                        marginBottom: 0,
                        fontWeight: "700",
                        color: palette.yellow,
                      },
                    ]}
                  >
                    {data?.parcel_type}
                  </Text>
                  <Text
                    style={[
                      textStyles.size.sm,
                      textStyles.size.sm,
                      textStyles.weight.regular,
                      {
                        lineHeight: 13,
                        marginBottom: 0,
                        fontWeight: "600",
                        fontSize: 13,
                        marginTop: 7,
                      },
                    ]}
                  >
                    {data?.delivered}
                  </Text>
                </View>
              </View>
            </>
          )}
          {data?.order_type != "parcel" && (
            <View
              style={[
                styles.activityLog,
                flex.direction.row,
                {
                  alignItems: "center",
                  marginBottom: 15,
                  flex: 1,
                  flexDirection: "column",
                },
              ]}
            >
              {data?.restaurant?.products_detail?.map((product, ind) => {
                return (
                  <View
                    key={ind + ind}
                    style={{
                      justifyContent: "space-around",
                      flexDirection: "row",
                      flex: 1,
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.2,
                      }}
                    >
                      {product?.quantity}
                    </Text>
                    <Text style={{ flex: 1 }}>{product?.food_details}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              {past ? (
                <></>
              ) : (
                <Text
                  style={{ fontSize: 10, color: "#000000", fontWeight: "500" }}
                >
                  {data?.payment_method}
                </Text>
              )}

              <Text
                style={{
                  fontSize: 15,
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                P {Number(data?.order_amount.toFixed(2))}
              </Text>
            </View>
            <View>
              {past ? (
                <View
                  style={{
                    paddingHorizontal: 20,
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={{
                      color: palette.yellow,
                      fontWeight: "bold",
                    }}
                  >
                    Order Delivered
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: palette.yellow,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 30,
                  }}
                  onPress={toggleModal}
                >
                  <Text style={{ color: "#fff", fontSize: 14 }}>
                    {data.order_type == "Food_delivery" ||
                    data.order_type == "food_delivery"
                      ? "Review Food"
                      : "Review Parcel"}
                  </Text>
                </TouchableOpacity>
              )}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                  // width: 1000,
                  // height: "auto",
                  backgroundColor: "red",
                }}
              ></View>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 25 }}>
          <View>
            {data?.order_type == "parcel" ? (
              <></>
            ) : (
              <View
                style={[
                  styles.activityLog,
                  flex.direction.row,
                  { alignItems: "center", marginBottom: 15 },
                ]}
              >
                <Image
                  resizeMode="cover"
                  onError={() => setValidFoodImage(false)}
                  source={
                    validFoodImage
                      ? {
                          uri: data?.restaurant?.restaurant_logo,
                          cache: "force-cache",
                        }
                      : require("../../../../../img/account.png")
                  }
                  style={[styles.merchImage]}
                />
                <View style={{ marginLeft: 15, paddingBottom: 0 }}>
                  <Text
                    style={[
                      textStyles.size.sm,
                      textStyles.size.sm,
                      textStyles.weight.regular,
                      {
                        lineHeight: 13,
                        marginBottom: 0,
                        color: "#000",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {data?.restaurant?.name}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View
            style={[
              styles.activityLog,
              flex.direction.row,
              { alignItems: "center", marginBottom: 15 },
            ]}
          >
            <Image
              resizeMode="cover"
              onError={() => setValidRider(false)}
              source={
                validRider
                  ? { uri: data?.rider_details?.image, cache: "force-cache" }
                  : require("../../../../../img/account.png")
              }
              style={[styles.merchImage]}
            />
            <View style={{ marginLeft: 15, paddingBottom: 0 }}>
              <Text
                style={[
                  textStyles.size.sm,
                  textStyles.size.sm,
                  textStyles.weight.regular,
                  {
                    lineHeight: 13,
                    marginBottom: 0,
                    color: "#000",
                    fontWeight: "700",
                  },
                ]}
              >
                {data?.rider_details?.name || "Guest user"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text
                style={{ fontSize: 10, color: "#000000", fontWeight: "500" }}
              >
                {data?.payment_method}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                P {Number(data.order_amount.toFixed(2))}
              </Text>
            </View>
            <View>
              {past ? (
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 30,
                  }}
                >
                  <Text style={{ color: palette.yellow, fontWeight: "bold" }}>
                    Order Delivered
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: palette.yellow,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 30,
                  }}
                  onPress={toggleModal}
                >
                  <Text style={{ color: "#fff", fontSize: 14 }}>
                    {data.order_type == "Food_delivery" ||
                    data.order_type == "food_delivery"
                      ? "Review Food"
                      : "Review Parcel"}
                  </Text>
                </TouchableOpacity>
              )}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                  // width: 1000,
                  // height: "auto",
                  backgroundColor: "red",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Modal
                    onBackdropPress={() => setModalVisible(false)}
                    isVisible={isModalVisible}
                  >
                    <View style={{ minHeight: 200, backgroundColor: "#fff" }}>
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <View>
                            <Text
                              style={{
                                marginTop: 15,
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: "bold",
                                color: "#000",
                              }}
                            >
                              How is your rider?
                            </Text>
                            <View
                              style={[
                                flex.direction.row,
                                flex.centerAll,
                                { marginTop: 12 },
                              ]}
                            >
                              <Image
                                resizeMode="cover"
                                source={
                                  data?.rider_details?.image
                                    ? {
                                        uri: data?.rider_details?.image,
                                        cache: "force-cache",
                                      }
                                    : require("../../../../../img/account.png")
                                }
                                style={[styles.riderImage]}
                              />
                              <Text
                                style={[
                                  textStyles.size.md,
                                  textStyles.weight.regular,
                                  { paddingHorizontal: 5 },
                                ]}
                              >
                                {data?.rider_details?.name || "Guest User"}
                              </Text>
                            </View>
                            <View
                              style={[
                                flex.direction.row,
                                flex.centerAll,
                                { marginTop: 15 },
                              ]}
                            >
                              {[...Array(5)].map((star, dex) => (
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  key={`starForm${dex}`}
                                  style={{ marginHorizontal: 7 }}
                                  onPress={() => setRatingRider(dex + 1)}
                                >
                                  <Icon
                                    name="star"
                                    color={
                                      ratingRider >= dex + 1
                                        ? palette.yellow
                                        : "#EAEAEA"
                                    }
                                    size={35}
                                  />
                                </TouchableOpacity>
                              ))}
                            </View>
                            <View style={{ marginTop: 25 }}>
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#EAEAEA",
                                  padding: 10,
                                  borderRadius: 5,
                                  color: "#000",
                                }}
                                multiline
                                placeholder="Leave a review"
                                numberOfLines={4}
                                onChangeText={(text) =>
                                  onChangeText(text, "rider")
                                }
                                value={commentRider}
                              />
                            </View>
                          </View>
                          {data?.order_type == "Food_delivery" ||
                          data?.order_type == "food_delivery" ? (
                            <View>
                              <Text
                                style={{
                                  marginTop: 15,
                                  textAlign: "center",
                                  fontSize: 15,
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                How is your food?
                              </Text>
                              <View
                                style={[
                                  flex.direction.row,
                                  flex.centerAll,
                                  { marginTop: 12 },
                                ]}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={
                                    data?.restaurant?.restaurant_logo
                                      ? {
                                          uri: data?.restaurant
                                            ?.restaurant_logo,
                                          cache: "force-cache",
                                        }
                                      : require("../../../../../img/account.png")
                                  }
                                  style={[styles.riderImage]}
                                />
                                <Text
                                  style={[
                                    textStyles.size.md,
                                    textStyles.weight.regular,
                                    { paddingHorizontal: 5 },
                                  ]}
                                >
                                  {data?.restaurant?.name}
                                </Text>
                              </View>
                              <View
                                style={[
                                  flex.direction.row,
                                  flex.centerAll,
                                  { marginTop: 15 },
                                ]}
                              >
                                {[...Array(5)].map((star, dex) => (
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={`starForm${dex}`}
                                    style={{ marginHorizontal: 7 }}
                                    onPress={() => setRatingFood(dex + 1)}
                                  >
                                    <Icon
                                      name="star"
                                      color={
                                        ratingFood >= dex + 1
                                          ? palette.yellow
                                          : "#EAEAEA"
                                      }
                                      size={35}
                                    />
                                  </TouchableOpacity>
                                ))}
                              </View>
                              <View style={{ marginTop: 25 }}>
                                <TextInput
                                  style={{
                                    borderWidth: 1,
                                    borderColor: "#EAEAEA",
                                    padding: 10,
                                    borderRadius: 5,
                                    color: "#000",
                                  }}
                                  multiline
                                  placeholder="Leave a review"
                                  numberOfLines={4}
                                  onChangeText={(text) =>
                                    onChangeText(text, "food")
                                  }
                                  value={commentFood}
                                />
                              </View>
                            </View>
                          ) : (
                            <></>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={toggleModalSubmit}
                              style={{
                                backgroundColor: palette.yellow,
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                alignSelf: "flex-end",
                                marginTop: 30,
                                borderRadius: 6,
                                marginRight: 20,
                              }}
                            >
                              <Text>cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => multipleAPI()}
                              disabled={
                                ratingRider == 0 && ratingFood == 0
                                  ? true
                                  : false
                              }
                              style={{
                                backgroundColor:
                                  ratingRider == 0 ? "#d3d3d3" : palette.yellow,
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                alignSelf: "flex-end",
                                marginTop: 30,
                                borderRadius: 6,
                              }}
                            >
                              <Text>Submit Review</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 15,
  },
  merchImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  riderImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
};

export { ActivityRateCard };
