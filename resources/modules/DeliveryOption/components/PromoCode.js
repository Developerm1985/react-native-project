import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import formInputs from "@styles/formInputs.styles";

import { LoadingOverlay } from "../../../components/common";
import { MessagePopup } from "../../../components/common";
import { useDispatch, useSelector } from "react-redux";
import { setParcelCouponData } from "../../../slices/parcelSlice";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { getDeliveryOption } from "../../../http";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PromoCode = ({
  handleDeliveryOption,
  selectedIdOpt,
  handleTextPromo,
  getPromo,
}) => {
  const [promoText, setPromoText] = useState("");
  const [isValidcode, setIsValidCode] = useState(false);
  const { pickupData, dropoffData, selectedId } = useSelector(
    (state) => state.parcel
  );

  useEffect(() => {
    handleTextPromo(isValidcode);
    getPromo(promoText);
  });

  const setValues = (data) => {
    setIsValidCode(data);
  };

  const removePromo = () => {
    setPromoText("");
    setIsValidCode(false);
  };

  const applyPromo = async () => {
    if (promoText == null || promoText == undefined || promoText == "") {
      MessagePopup.show({
        title: "Required!",
        message: "Please enter promo code",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (selectedIdOpt == null) {
      MessagePopup.show({
        title: "Required!",
        message: "Please select at least one vehical",
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
      try {
        const params = {
          parcel_type_id: selectedId,
          pick_up_lat_long: {
            latitude:
              typeof pickupData.latlong == "string"
                ? JSON.parse(pickupData.latlong).lat
                : pickupData.latlong.lat,
            longitude:
              typeof pickupData.latlong == "string"
                ? JSON.parse(pickupData.latlong).lng
                : pickupData.latlong.lng,
          },
          drop_off_lat_long: {
            latitude:
              typeof dropoffData.latlong == "string"
                ? JSON.parse(dropoffData.latlong).lat
                : dropoffData.latlong.lat,
            longitude:
              typeof dropoffData.latlong == "string"
                ? JSON.parse(dropoffData.latlong).lng
                : dropoffData.latlong.lng,
          },
          coupon_code: promoText,
        };

        LoadingOverlay.show("Loading...");
        const { data } = await getDeliveryOption(params);
        handleDeliveryOption(data);
        data.success &&
          data.data.forEach((item) => {
            item.id == selectedIdOpt
              ? item.is_applied
                ? setValues(item.is_applied)
                : MessagePopup.show({
                    title: "Invalid coupon code!",
                    message: item.is_applied_error,
                    actions: [
                      {
                        text: "Okay",
                        action: () => {
                          MessagePopup.hide();
                        },
                      },
                    ],
                  })
              : "";
          });
        LoadingOverlay.hide();
      } catch (e) {
        LoadingOverlay.hide();
        MessagePopup.show({
          message: e.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
        throw e;
      }
    }
  };
  return (
    <KeyboardAvoidingView>
      <View style={{ padding: 10, flex: 1, flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "row",
            borderColor: "#D6D6D6",
            backgroundColor: "#f5f5f8",
            borderRadius: 5,
            padding: 5,
            alignItems: "center",
            flex: 1,
          }}
        >
          <TextInput
            placeholder={"Enter promo code"}
            inputStyle={formInputs.input}
            style={{
              ...styles.Input,
              color: isValidcode ? "gray" : "black",
              fontWeight: isValidcode ? "bold" : "normal",
            }}
            onChangeText={(text) => setPromoText(text)}
            value={promoText}
            placeholderTextColor={"#8d8a8a"}
            autoCorrect={false}
            spellCheck={false}
            autoCapitalize={"characters"}
            editable={!isValidcode ? true : false}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => applyPromo()}
            disabled={isValidcode ? true : false}
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              style={[
                {
                  color: isValidcode ? "green" : palette.black,
                  backgroundColor: "transparent",
                  fontSize: 14,
                  fontWeight: "bold",
                  flexDirection: "row",
                },
              ]}
            >
              {isValidcode ? "Applied" : "Apply"}
            </Text>
          </TouchableOpacity>
        </View>

        {isValidcode && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              left: 8,
            }}
            onPress={removePromo}
          >
            <Icon name="close-circle-outline" color="red" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  Input: {
    borderRadius: 4,
    paddingHorizontal: 15,
    padding: 5,
    width: "85%",
    justifyContent: "center",
  },
};

export { PromoCode };
