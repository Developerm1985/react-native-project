import React, { useEffect } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import Location from "react-native-vector-icons/Entypo";
import palette from "../../../styles/palette.styles";

import {
  NavigationContainerRefContext,
  useNavigation,
} from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setReset, setFlagName } from "../../../slices/parcelSlice";

const ExpressDelivery = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { pickupData, dropoffData, picked, dropped, pickTitle, dropTitle } =
    useSelector((state) => state.parcel);

  return (
    <View style={{ marginBottom: 25 }}>
      <View style={styles.TitleContainer}>
        <Text style={styles.ExpressTitle}>Express</Text>
        <Text style={styles.DeliveryTitle}>Delivery</Text>
      </View>

      <View style={styles.PickupContainer}>
        <Text style={styles.PickupTitle}>Pick-up</Text>
        {!picked ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.TabTitleContainer}
            onPress={() => {
              dispatch(setFlagName("pick"));
              navigation.navigate("AddParcelAddress");
            }}
          >
            <Text style={styles.TabTitle}>Tab to enter details</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.AddressOneContainer}
            onPress={() => {
              dispatch(setFlagName("pick"));
              navigation.navigate("AddParcelAddress");
            }}
          >
            <View style={styles.LocationContent}>
              <Location
                name="location-pin"
                size={16}
                style={{ color: palette.yellow }}
              />
              <Text style={styles.AddressTitle}>{pickTitle}</Text>
            </View>
            <Text style={styles.Address}>{pickupData.address}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.PickupContainer}>
        <Text style={styles.PickupTitle}>Drop-off</Text>
        {!dropped ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.TabTitleContainer}
            onPress={() => {
              dispatch(setFlagName("drop"));
              navigation.navigate("AddParcelAddress");
            }}
          >
            <Text style={styles.TabTitle}>Tab to enter details</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.AddressOneContainer}
            onPress={() => {
              dispatch(setFlagName("drop"));
              navigation.navigate("AddParcelAddress");
            }}
          >
            <View style={styles.LocationContent}>
              <Location
                name="location-pin"
                size={16}
                style={{ color: palette.yellow }}
              />
              <Text style={styles.AddressTitle}>{dropTitle}</Text>
            </View>
            <Text style={styles.Address}>{dropoffData.address}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = {
  TitleContainer: {
    marginTop: 40,
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  ExpressTitle: {
    fontSize: 20,
    color: "#000",
    marginEnd: 3,
    fontWeight: "bold",
  },
  DeliveryTitle: {
    fontSize: 20,
    color: "#000",
  },
  PickupContainer: {
    marginBottom: 40,
  },
  PickupTitle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  TabTitle: {
    fontSize: 14,
    color: "#000",
  },
  TabTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#c1c1c1",
    borderRadius: 5,
  },
  AddressOneContainer: {
    shadowColor: "#ccc",
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 10,
    backgroundColor: palette.white,
    borderRadius: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  LocationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  AddressTitle: {
    color: palette.yellow,
    fontWeight: "bold",
  },
  Address: {
    fontSize: 14,
    color: "#000",
    paddingLeft: 16,
  },
};

export { ExpressDelivery };
