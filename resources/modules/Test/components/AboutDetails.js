import React from "react";
import { Image, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Button } from "react-native-elements";

import { URL } from "../../../config";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";

const AboutDetails = ({ merchant }) => {
  return (
    <View style={{ marginBottom: 25 }}>
      <View
        style={[
          flex.direction.row,
          flex.align.center,
          { transform: [{ translateY: -15 }] },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Image
            resizeMode="cover"
            source={
              merchant.image
                ? {
                    uri: URL.base + merchant.asset.small_thumbnail,
                    cache: "force-cache",
                  }
                : require("@img/icon.png")
            }
            style={[styles.image]}
          />
        </View>
        <Text style={[textStyles.size.lg, textStyles.weight.bold]}>
          {merchant.name}
        </Text>
        <View style={{ flex: 1 }} />
      </View>
      <IconDetail
        icon="map-pin"
        text="21 St. Natividad, Diliman VIllage, Diliman, Quezon City"
      />
      <IconDetail icon="clock" text="Open Tues to Sun, 9am - 7pm" />
      {merchant.description ? (
        <Text
          style={[
            textStyles.size.sm,
            textStyles.color.darkGray,
            textStyles.weight.regular,
            { marginTop: 10 },
          ]}
        >
          {merchant.description}
        </Text>
      ) : null}
      <Image
        resizeMode="cover"
        source={require("@img/map.png")}
        style={[styles.map]}
      />
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
            4.6
          </Text>
        </View>
        <Button
          onPress={() => {}}
          titleStyle={[textStyles.size.sm, { color: palette.black }]}
          title="Write a review"
          buttonStyle={{ backgroundColor: palette.yellow, borderRadius: 8 }}
        />
      </View>
    </View>
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
