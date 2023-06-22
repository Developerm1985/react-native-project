import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";

import { flex, textStyles as text, palette } from "@styles/";
import { MessagePopup } from "../../../components/common";

const CheckoutDeliveryInfo = ({ handleEditLocation }) => {
  const user = useSelector((state) => state.user.userdata.userDetail);
  const { userdata } = useSelector((state) => state.user);
  const userAddress = useSelector((state) => state.user.userAddress);

  return (
    <View style={styles.wrapper}>
      <View
        style={[flex.align.center, flex.direction.row, flex.justify.between]}
      >
        <Text
          style={[text.size.md, text.weight.medium, { paddingHorizontal: 20 }]}
        >
          Delivery Information
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleEditLocation}
          style={{ padding: 20 }}
        >
          <Icon name="pencil" style={[text.size.mlg, { color: "#B8B8B8" }]} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          flex.direction.row,
          styles.paddedHorizontal,
          { marginBottom: 10 },
        ]}
      >
        <Feather name="user" size={15} color={palette.darkGray} />
        <Text
          style={[
            text.size.md,
            text.weight.regular,
            text.color.darkGray,
            { paddingLeft: 20 },
          ]}
        >
          {userdata && userdata?.full_name}
        </Text>
      </View>
      <View
        style={[
          flex.direction.row,
          styles.paddedHorizontal,
          { marginBottom: 10 },
        ]}
      >
        <Feather name="map-pin" size={15} color={palette.darkGray} />
        <Text
          style={[
            text.size.md,
            text.weight.regular,
            text.color.darkGray,
            { paddingLeft: 20 },
          ]}
        >
          {userAddress?.address}
        </Text>
      </View>
      <View
        style={[
          flex.direction.row,
          styles.paddedHorizontal,
          { marginBottom: 20 },
        ]}
      >
        <Feather name="phone" size={15} color={palette.darkGray} />
        <Text
          style={[
            text.size.md,
            text.weight.regular,
            text.color.darkGray,
            { paddingLeft: 20 },
          ]}
        >
          {userdata?.phone || userdata?.email}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#fff",
    marginTop: 5,
  },
  paddedHorizontal: { paddingHorizontal: 20 },
};

export { CheckoutDeliveryInfo };
