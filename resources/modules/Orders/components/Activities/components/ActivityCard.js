import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import { MessagePopup } from "../../../../../components/common";

const ActivityCard = (props) => {
  const { data, index, handleDeleteData, statuscount } = props;
  const acitivityRandomness = [...Array(Math.floor(Math.random() * 4) + 1)];
  const navigation = useNavigation();

  const handleBottomStage = () => {
    if (
      data.order_status == "pending" ||
      data.order_status == "confirmed" ||
      data.order_status == "scheduled"
    ) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: palette.yellow,
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 30,
          }}
          onPress={() => {
            handleDeleteData(data?.id);
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>Cancel Order</Text>
        </TouchableOpacity>
      );
    } else if (data.order_status == "accepted") {
      return (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 30,
          }}
        >
          <Text style={{ color: palette.yellow, fontSize: 14 }}>
            {data.order_type == "parcel" ? "" : "Order Preparing"}
          </Text>
        </View>
      );
    } else if (data.order_status == "picked") {
      return <></>;
    } else if (data.order_status == "delivered") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: palette.yellow,
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 30,
          }}
          onPress={() => {}}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>Review Parcle</Text>
        </TouchableOpacity>
      );
    } else {
      return <></>;
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={
        data.order_status == "scheduled" ||
        data.order_status == "cancelled" ||
        data.order_status == "pending" ||
        data.order_status == "processing" ||
        data.order_status == "confirmed"
          ? true
          : false
      }
      style={[styles.container, { flex: 1 }]}
      onPress={() => {
        navigation.navigate("TrackParcel", {
          orderId: data.id,
          inActivity: true,
        });
      }}
    >
      <View style={[flex.direction.row, { alignItems: "flex-end" }]}>
        <View style={[flex.direction.row, flex.align.center, { flex: 1 }]}>
          <View style={{ marginLeft: 0 }}>
            <Text style={[textStyles.weight.regular, { fontSize: 12 }]}>
              Order No : #{data?.order_number}
            </Text>

            <Text
              style={[
                textStyles.color.darkGray,
                statuscount == "cancelled"
                  ? { fontWeight: "700", color: "red" }
                  : { color: "#000", fontWeight: "700" },
              ]}
            >
              {statuscount == "scheduled"
                ? "Pre-Order"
                : statuscount == "cancelled"
                ? "Order Cancelled"
                : statuscount == "picked"
                ? "On The Way"
                : data?.is_schedule == 1
                ? "Schedule Delivery"
                : "Deliver now"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={[
              textStyles.size.md,
              textStyles.weight.regular,
              {
                color: "#000",
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "center",
              },
            ]}
          >
            {data?.order_type == "food_delivery" ||
            data?.order_type == "Food_delivery"
              ? "Food Delivery"
              : data?.order_type}
          </Text>
          {data.order_status == "pending" ? (
            <Text
              style={{
                color: "#33bbff",
                fontSize: 12,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              {data.schedule_at == "Today" ? "" : data.schedule_at}
            </Text>
          ) : (
            <></>
          )}
          {data.order_status == "scheduled" ? (
            <Text
              style={{
                color: "#33bbff",
                fontSize: 12,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              {data.schedule_at}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </View>
      <View style={{ marginTop: 25 }}>
        <View style={[styles.activityLog]}>
          <View style={{ marginLeft: 15, paddingBottom: 10 }}>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: palette.yellow,
                backgroundColor: palette.yellow,
                position: "absolute",
                left: -20,
              }}
            ></View>
            <View
              style={{
                position: "absolute",
                height: "110%",
                width: 0,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "#ccc",
                borderRadius: 1,
                left: -17,
                top: 8,
              }}
            ></View>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: palette.yellow,
                backgroundColor: "#fff",
                position: "absolute",
                left: -20,
                bottom: -10,
              }}
            ></View>
            <Text
              style={[
                textStyles.size.sm,
                textStyles.size.sm,
                textStyles.weight.regular,
                {
                  lineHeight: 13,
                  marginBottom: 7,
                  color: "#000",
                  fontWeight: "700",
                },
              ]}
            >
              {data?.pickup?.title != "" || data?.pickup?.title != null
                ? data?.pickup?.title
                : data.pickup.address.split(",")[0]}
            </Text>
            <Text
              style={[
                textStyles.size.sm,
                textStyles.size.sm,
                textStyles.weight.regular,
                textStyles.color.darkGray,
              ]}
            >
              {data?.pickup?.address}
            </Text>
          </View>
          <View style={{ marginLeft: 15, paddingBottom: 10 }}>
            <Text
              style={[
                textStyles.size.sm,
                textStyles.size.sm,
                textStyles.weight.regular,
                {
                  lineHeight: 13,
                  marginBottom: 7,
                  color: "#000",
                  fontWeight: "700",
                },
              ]}
            >
              {data?.to_customer?.title
                ? data?.to_customer?.title
                : data?.to_customer?.delivery_address.split(",")[0]}
            </Text>
            <Text
              style={[
                textStyles.size.sm,
                textStyles.size.sm,
                textStyles.weight.regular,
                textStyles.color.darkGray,
              ]}
            >
              {data?.to_customer?.delivery_address}
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
            <Text style={{ fontSize: 10, color: "#000000", fontWeight: "500" }}>
              {data?.payment_method}
            </Text>
            <Text
              style={{
                // marginLeft: 5,
                fontSize: 15,
                color: "#000000",
                fontWeight: "700",
              }}
            >
              {`P${data?.order_amount.toFixed(2)}`}
            </Text>
          </View>
          <View>{data?.order_status ? handleBottomStage() : {}}</View>
        </View>
      </View>
    </TouchableOpacity>
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
  activityDot: {
    height: 8,
    width: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.yellow,
    backgroundColor: "#fff",
  },
  logLine: {
    position: "absolute",
    height: "100%",
    width: 0,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 1,
  },
};

export { ActivityCard };
