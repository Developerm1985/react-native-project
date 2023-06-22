import React from "react";
import { Text, View, TouchableOpacity, Share } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import HTML from "react-native-render-html";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "../../../styles/palette.styles";
import { useNavigation } from "@react-navigation/native";

const ProductInfo = ({ product }) => {
  const navigation = useNavigation();

  const productShare = async () => {
    await Share.share({
      url: product?.share_link,
      message: product?.share_link,
    });
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Merchant", { id: product?.restaurant_id })
        }
      >
        <Text
          style={{
            color: palette.yellow,
            fontSize: 16,
            marginBottom: 5,
            fontWeight: "bold",
          }}
          ellipsizeMode="tail"
        >
          {product?.restaurant_name}
        </Text>
      </TouchableOpacity>
      <View
        style={[
          flex.direction.row,
          flex.align.center,
          flex.justify.between,
          { flexDirection: "row" },
        ]}
      >
        <View style={{ flex: 0.8 }}>
          <Text
            style={[textStyles.size.lg, textStyles.weight.bold]}
            ellipsizeMode="tail"
          >
            {product?.name}
          </Text>
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button]}
            onPress={productShare}
          >
            <Icon name="share-google" size={22} />
          </TouchableOpacity>
        </View>
      </View>
      {product?.description ? (
        <Text
          style={[
            textStyles.size.sm,
            textStyles.weight.regular,
            textStyles.color.darkGray,
            { marginTop: 5 },
          ]}
        >
          {product?.description}
        </Text>
      ) : null}
    </View>
  );
};

const styles = {
  button: {
    backgroundColor: "#FDF0D6",
    padding: 5,
    borderRadius: 5,
  },
};

export { ProductInfo };
