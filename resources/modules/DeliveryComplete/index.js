import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  BackHandler,
} from "react-native";
import textStyles from "@styles/textStyles.styles";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import palette from "@styles/palette.styles";
import flex from "@styles/flex.styles";
import { riderReview } from "../../http";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import StarRating from "react-native-star-rating";
import { BackButton, MessagePopup } from "../../components/common";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

const CompleteDelivery = ({ route }) => {
  const [deliveryManDetail, setDeliveryManDetail] = useState(
    useSelector((state) => state.cart.orderId)
  );

  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function handleBackButtonClick() {
    navigation.reset({
      index: 0,
      routes: [{ name: "DashboardRoute" }],
    });
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  const onChangeText = (text) => setComment(text);

  const submitReview = async () => {
    LoadingOverlay.show("Loading...");
    const params = {
      delivery_man_id: route?.params?.riderId,
      order_id: route?.params?.orderId,
      comment: comment,
      rating: rating,
    };

    try {
      const { data } = await riderReview(params);
      if (data?.success === true) {
        LoadingOverlay.hide();
        console.log("reviewed ", params);
        MessagePopup.show({
          title: "Success!",
          message: data?.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "DashboardRoute" }],
                });
              },
            },
          ],
        });
      } else {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Something wents to wrong!",
          message: data?.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "DashboardRoute" }],
                });
              },
            },
          ],
        });
      }
    } catch (err) {
      LoadingOverlay.hide();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={palette.yellow} />
      <View>
        <BackButton
          containerStyle={{
            marginTop: StatusBar.currentHeight - 20,
            position: "absolute",
            marginHorizontal: 20,
          }}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "DashboardRoute" }],
            })
          }
        />
        <View
          style={{
            width: "100%",
            marginTop: StatusBar.currentHeight - 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#000",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {" "}
            Delivery Complete
          </Text>
        </View>
        <View
          style={[flex.direction.column, flex.centerAll, { marginTop: 50 }]}
        >
          <Image
            resizeMode="cover"
            source={{
              uri: route?.params?.riderData?.image,
              cache: "force-cache",
            }}
            style={[styles.riderImage]}
          />
          <Text
            style={[
              textStyles.size.sm,
              textStyles.weight.regular,
              {
                paddingHorizontal: 5,
                marginTop: 10,
                marginBottom: 5,
              },
            ]}
          >
            {route?.params?.riderData?.full_name}
          </Text>
          <View style={[flex.direction.row, flex.centerAll]}>
            <StarRating
              disabled={true}
              maxStars={5}
              halfStarEnabled={true}
              starSize={15}
              emptyStarColor={palette.yellow}
              fullStarColor={palette.yellow}
              rating={Number(route?.params?.riderData?.rating_avg)}
            />
            <Text
              style={[
                textStyles.size.xs,
                textStyles.weight.regular,
                textStyles.color.mediumGray,
                { marginLeft: 8 },
              ]}
            >
              {route?.params?.riderData?.rating_avg}
            </Text>
          </View>
          <Text
            style={[
              textStyles.normalTextBold,
              textStyles.weight.bold,
              textStyles.color.black,
              { paddingHorizontal: 5, marginTop: 10 },
            ]}
          >
            {route?.params?.riderData?.vehicle_model}
          </Text>
        </View>

        <View style={[flex.direction.row, flex.centerAll, { marginTop: 15 }]}>
          {[...Array(5)].map((star, dex) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={`starForm${dex}`}
              style={{ marginHorizontal: 7 }}
              onPress={() => setRating(dex + 1)}
            >
              <Icon
                name="star"
                color={rating >= dex + 1 ? palette.yellow : "#EAEAEA"}
                size={50}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginTop: 25 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#EAEAEA",
              paddingLeft: 10,
              borderRadius: 5,
              color: "#000",
              marginHorizontal: 20,
            }}
            multiline
            placeholder={"Addtional Comments?"}
            placeholderTextColor="#D3D3D3"
            numberOfLines={4}
            onChangeText={onChangeText}
            value={comment}
          />
        </View>
      </View>
      <View style={[styles.SubmitButton]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.nextBtn,
            { backgroundColor: rating ? palette.yellow : "#D3D3D3" },
          ]}
          disabled={rating == 0}
          onPress={() => {
            submitReview();
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  nextBtn: {
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontalL: 15,
  },
  riderImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  SubmitButton: {
    position: "absolute",
    right: 15,
    left: 15,
    bottom: 0,
  },
};

export default CompleteDelivery;
