import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";

const ActivityRatingForm = ({ title, placeholder, rateObject }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const onChangeText = (text) => setComment(text);

  return (
    <View>
      <Text
        style={[
          textStyles.size.md,
          textStyles.weight.bold,
          { marginTop: 15, textAlign: "center" },
        ]}
      >
        {title}
      </Text>
      <View style={[flex.direction.row, flex.centerAll, { marginTop: 12 }]}>
        <Image
          resizeMode="cover"
          source={require("../../../../../../img/account.png")}
          style={[styles.riderImage]}
        />
        <Text
          style={[
            textStyles.size.md,
            textStyles.weight.regular,
            { paddingHorizontal: 5 },
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
      <View style={[flex.direction.row, flex.centerAll, { marginTop: 15 }]}>
        {[...Array(5)].map((star, dex) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`starForm${dex}`}
            style={{ marginHorizontal: 7 }}
            onPress={() => setRating(dex + 1)}
          >
            <Icon
              name="star"
              color={rating >= dex + 1 ? palette.yellow : "#EAEAEA"}
              size={35}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: 25 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#EAEAEA",
            padding: 10,
            borderRadius: 5,
            color: "#000",
          }}
          multiline
          placeholder={placeholder}
          numberOfLines={4}
          onChangeText={onChangeText}
          value={comment}
        />
      </View>
    </View>
  );
};

const styles = {
  riderImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
};

export { ActivityRatingForm };
