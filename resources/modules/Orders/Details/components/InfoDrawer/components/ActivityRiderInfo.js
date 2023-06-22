import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";

const ActivityRiderInfo = () => {
  return (
    <View style={[flex.direction.row, flex.align.center, styles.card]}>
      <View>
        <Image
          resizeMode="cover"
          source={require("/img/icon.png")}
          style={[styles.riderImage]}
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={[flex.direction.row, flex.align.center]}>
          <Text
            style={[
              textStyles.size.md,
              textStyles.weight.regular,
              { marginRight: 5 },
            ]}
          >
            John Karlo Bendict
          </Text>
          <Icon name="star" color={palette.yellow} size={12} />
          <Text
            style={[
              textStyles.size.xs,
              textStyles.weight.regular,
              textStyles.color.mediumGray,
            ]}
          >
            4.8
          </Text>
        </View>
        <Text
          style={[
            textStyles.size.md,
            textStyles.weight.bold,
            { color: "black" },
          ]}
        >
          jqua4499 Honda
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.iconBtn}>
        <FontAwesome name="envelope-o" size={15} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} style={styles.iconBtn}>
        <FontAwesome name="phone" size={15} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  card: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  riderImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  iconBtn: {
    width: 33,
    height: 33,
    borderWidth: 1,
    borderColor: "#C6C6C8",
    borderRadius: 100,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
};
export { ActivityRiderInfo };
