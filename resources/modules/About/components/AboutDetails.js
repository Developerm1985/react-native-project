import React, { useEffect, useState } from "react";
import { Image, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Button } from "react-native-elements";
import { URL } from "../../../config";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import {
  NavigationContainerRefContext,
  useNavigation,
} from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Moment from "moment";

const AboutDetails = ({ merchant }) => {
  const navigation = useNavigation();
  const onlyLatlong = {
    latitude: parseFloat(merchant?.latitude),
    longitude: parseFloat(merchant?.longitude),
  };
  const initialRegions = {
    latitude: parseFloat(merchant?.latitude),
    longitude: parseFloat(merchant?.longitude),
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0121,
  };
  return (
    merchant && (
      <View style={{ marginBottom: 25 }}>
        <View
          style={[
            flex.direction.row,
            flex.align.center,
            { transform: [{ translateY: -15 }] },
            flex.justify.between,
          ]}
        >
          <View style={{ width: 70 }}>
            <Image
              resizeMode="cover"
              source={
                merchant?.logo
                  ? { uri: merchant?.logo, cache: "force-cache" }
                  : require("@img/account.png")
              }
              style={[styles.image]}
            />
          </View>
          <Text
            style={[
              textStyles.size.lg,
              textStyles.weight.bold,
              { width: "100%", paddingStart: 10 },
            ]}
          >
            {merchant?.restaurant_name}
          </Text>
        </View>
        <IconDetail icon="map-pin" text={merchant?.address} />
        {/* <IconDetail
          icon="clock"
          text={
            Moment(merchant.opening_time).format("H:mma") +
            " - " +
            Moment(merchant.closing_time).format("H:mma")
          }
          // text={merchant.opening_time + " to " + merchant.closeing_time}
        /> */}
        <Text
          style={[
            textStyles.size.sm,
            textStyles.color.darkGray,
            textStyles.weight.regular,
            { marginTop: 10 },
          ]}
        >
          {merchant?.restaurant_description}
        </Text>
        {merchant.latitude != null && merchant.longitude != null ? (
          <View
            style={{
              width: "100%",
              height: 250,
              marginTop: 10,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <View>
              <MapView
                style={{
                  width: "100%",
                  height: "100%",
                }}
                initialRegion={initialRegions}
                showsCompass={true}
                scrollEnabled={false}
              >
                <Marker coordinate={onlyLatlong} pinColor={palette.yellow}>
                  <Image
                    source={require("../../../img/marker.png")}
                    style={{ height: 30, width: 30 }}
                    resizeMode="contain"
                  />
                </Marker>
              </MapView>
            </View>
          </View>
        ) : (
          <Text
            style={{
              fontWeight: "500",
              textAlign: "center",
              textAlignVertical: "center",
            }}
          >
            location is not available
          </Text>
        )}
        <View
          style={[
            flex.direction.row,
            flex.align.center,
            flex.justify.between,
            { marginTop: 30 },
          ]}
        >
          <View style={[flex.direction.row, flex.align.center]}>
            <AntIcon name="star" color={palette.yellow} size={20} />
            <Text
              style={[
                textStyles.size.lg,
                textStyles.weight.bold,
                { marginLeft: 5 },
              ]}
            >
              {`${Number(merchant?.review_avg).toFixed(1)} (${
                merchant?.review_count
              })`}
            </Text>
          </View>
          {/* <Button
          onPress={() => {}}
          titleStyle={[textStyles.size.sm, { color: palette.black }]}
          title="Write a review"
          buttonStyle={{ backgroundColor: palette.yellow, borderRadius: 8 }}
        /> */}
        </View>
      </View>
    )
  );
};

const IconDetail = ({ text, icon }) => (
  <View style={[flex.direction.row, flex.align.center, { marginBottom: 10 }]}>
    <Icon name={icon} color={palette.darkGray} />
    <Text
      style={[
        textStyles.size.sm,
        textStyles.weight.regular,
        { marginLeft: 15 },
      ]}
    >
      {/* Open Tues to Sun, 9am - 7pm */}
      {text}
    </Text>
  </View>
);

const styles = {
  image: {
    width: 74,
    height: 74,
    borderRadius: 74,
    borderWidth: 3,
    borderColor: "#F8F8F8",
  },
  map: {
    height: 145,
    width: "100%",
    marginTop: 15,
  },
};

export { AboutDetails };
