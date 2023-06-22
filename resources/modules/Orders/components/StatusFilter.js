import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import { setStatusCount } from "../../../slices/activitySlice";
import { connect, useSelector, useDispatch } from "react-redux";
import { getActiveFieldData } from "../../../http";
import { setActivitiData } from "../../../../slices/activitySlice";

const StatusFilter = ({ orderStatus }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderStatus && orderStatus != "") {
      statuses.find((state) => {
        if (state.nameOfBody == orderStatus) {
          return dispatch(setStatusCount(state));
        }
      });
    }
  }, []);

  const statuscount = useSelector((state) => state?.activity?.activityStatus);
  const handleStateChanges = async (status) => {
    dispatch(setStatusCount(status));
  };

  return (
    <View style={[flex.direction.row, flex.justify.between, { marginTop: 10 }]}>
      {statuses.map((status, index) => (
        <TouchableOpacity
          activeOpacity={0.8}
          key={`status${index}`}
          onPress={() => handleStateChanges(status)}
        >
          <View
            style={[
              styles.imageContainer,
              flex.alignSelf.center,
              {
                backgroundColor:
                  statuscount.nameOfBody == status?.nameOfBody
                    ? palette.yellow
                    : "#fff",
              },
            ]}
          >
            <Image
              resizeMode="contain"
              source={status.icon}
              style={[styles.image, flex.alignSelf.center]}
            />
            {status.notif ? <View style={[styles.notification]} /> : null}
          </View>
          <Text
            style={[
              flex.alignSelf.center,
              textStyles.weight.medium,
              textStyles.color.darkGray,
              { fontSize: 10 },
            ]}
          >
            {status.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  imageContainer: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: "#fff",
    marginBottom: 7,
  },
  image: {
    width: 24,
    height: 24,
  },
  notification: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: palette.yellow,
    top: 0,
    right: 0,
    borderRadius: 12,
  },
};

const statuses = [
  {
    name: "Pending",
    nameOfBody: "pending",
    icon: require("../../../img/ic-111.png"),
    notif: false,
  },
  {
    name: "Scheduled",
    nameOfBody: "scheduled",
    icon: require("../../../img/delivery.png"),
    notif: false,
  },
  {
    name: "For Pick-up",
    nameOfBody: "accepted",
    icon: require("../../../img/pickup.png"),
    notif: false,
  },
  {
    name: "To Recipient",
    nameOfBody: "picked",
    icon: require("../../../img/recipient.png"),
    notif: false,
  },
  {
    name: "To Rate",
    nameOfBody: "delivered",
    icon: require("../../../img/thumbs-up.png"),
    notif: false,
  },
  {
    name: "Cancelled",
    nameOfBody: "cancelled",
    icon: require("../../../img/ic-113.png"),
    notif: false,
  },
];

export { StatusFilter };
