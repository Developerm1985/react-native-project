import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import palette from "../../../styles/palette.styles";
import Checkcircle from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getAddressListAPI } from "../../../http";
import { setDeliveryOptionId } from "../../../slices/parcelSlice";

const Item = ({
  item,
  onPress,
  backgroundColor,
  borderColor,
  iconName,
  selectedOptId,
  isValid,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ marginRight: 0 }}
    >
      <View
        style={[
          styles.item,
          backgroundColor,
          borderColor,
          {
            borderWidth: 1,
            height: 110,
            width: "100%",
            borderRadius: 10,
            flexDirection: "row",
            marginTop: 15,
          },
        ]}
      >
        <Image
          source={{ uri: item.image, cache: "force-cache" }}
          resizeMode="contain"
          style={{
            height: 80,
            width: "25%",
            marginHorizontal: 30,
            marginVertical: 15,
          }}
        />
        <View style={{ marginTop: 10, width: "50%" }}>
          <Text
            style={{
              color: palette.black,
              fontWeight: "500",
              fontSize: 16,
              marginRight: 3,
            }}
          >
            {item.name}
          </Text>
          <Text style={{ color: palette.black, marginTop: 5 }}>
            {item.eta_time}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              justifyContent: "flex-end",
              // right: -5,
            }}
          >
            {isValid ? (
              <>
                <Text
                  style={{
                    color: "gray",
                    marginTop: 5,
                    fontSize: 16,
                    alignSelf: "flex-end",
                    textDecorationLine: "line-through",
                    marginRight: 7,
                  }}
                >
                  {item.is_applied ? `P ${item.total_prize.toFixed(2)}` : ""}
                </Text>

                <Text
                  style={{
                    color: palette.black,
                    marginTop: 5,
                    fontSize: 16,
                    alignSelf: "flex-end",
                  }}
                >
                  P {item?.final_prize.toFixed(2)}
                </Text>
              </>
            ) : isValid ? (
              <>
                <Text
                  style={{
                    color: "black",
                    marginTop: 5,
                    fontSize: 16,
                    alignSelf: "flex-end",
                    marginRight: 7,
                  }}
                >
                  {item.is_applied ? `P ${item.total_prize.toFixed(2)}` : ""}
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: palette.black,
                    marginTop: 5,
                    fontSize: 16,
                    alignSelf: "flex-end",
                  }}
                >
                  P {item?.total_prize.toFixed(2)}
                </Text>
              </>
            )}
          </View>
        </View>
        {iconName != "" ? (
          <Checkcircle
            name={iconName}
            size={18}
            style={{
              color: palette.yellow,
              position: "absolute",
              right: 10,
              top: 15,
            }}
          />
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
};

const OptionList = ({ handleSelectOption, deliveryOptionList, isValid }) => {
  const [selectedOptId, setSelectedOptId] = useState(
    useSelector((state) => state?.parcel?.deliveryOptionId)
  );
  const navigation = useNavigation();
  useEffect(() => {
    setSelectedOptId(null);
  }, []);

  const dispatch = useDispatch();

  return (
    <View style={{ marginBottom: 25 }}>
      <Text
        style={{
          marginBottom: 5,
          marginTop: 15,
          fontSize: 18,
          color: palette.black,
        }}
      >
        Select Delivery option
      </Text>
      <SafeAreaView>
        {deliveryOptionList?.map((item, ind) => {
          const backgroundColor =
            item.id === selectedOptId ? "#FFEFD3" : "#f5f5f8";
          const borderColor = item.id === selectedOptId ? "#FFB531" : "#f5f5f8";
          const iconName = item.id === selectedOptId ? "checkcircle" : "";

          return (
            <Item
              key={`${ind}_type`}
              item={item}
              onPress={() => {
                setSelectedOptId(item.id);
                handleSelectOption(item.id);
                dispatch(setDeliveryOptionId(item.id));
              }}
              backgroundColor={{ backgroundColor }}
              borderColor={{ borderColor }}
              iconName={iconName}
              selectedOptId={selectedOptId}
              isValid={isValid}
            />
          );
        })}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export { OptionList };
