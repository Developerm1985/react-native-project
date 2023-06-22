import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { textStyles as text, flex } from "@styles";

const OmsProfilePhoto = ({ imageSource, onPress }) => {
  return (
    <View style={[flex.align.center, { paddingVertical: 15 }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={flex.align.center}>
          {imageSource ? (
            <Image
              style={[styles.image]}
              source={{ uri: imageSource, cache: "force-cache" }}
            />
          ) : (
            <Image
              resizeMode="cover"
              style={[styles.image]}
              source={require("/img/account.png")}
            />
          )}
          <Text style={[text.size.xs, text.weight.regular, text.color.yellow]}>
            Upload Profile Pic
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  image: {
    width: 75,
    height: 75,
    borderRadius: 100,
    marginBottom: 10,
  },
};

export { OmsProfilePhoto };
