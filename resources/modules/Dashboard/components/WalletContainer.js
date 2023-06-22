import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import { white } from "@styles/palette.styles";
import { MessagePopup } from "../../../components/common";

const WalletContainer = ({ credits, wallet }) => {
  const showPopup = () => {
    MessagePopup.show({
      title: "Attention!",
      message: "This feature is coming soon!",
      actions: [
        {
          text: "Okay",
          action: () => {
            MessagePopup.hide();
          },
        },
      ],
    });
  };
  return (
    <View
      style={{
        ...styles.walletContainer,
        ...flex.justify.between,
        ...flex.align.center,
        ...flex.direction.row,

        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => showPopup()}
        style={styles.boxContainer}
      >
        <Image
          resizeMode="contain"
          source={require("@img/wallet.png")}
          style={styles.walletIcon}
        />
        <Text style={[textStyles.size.md]}>PHP {wallet}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => showPopup()}
        style={styles.boxContainer}
      >
        <Image
          resizeMode="contain"
          source={require("@img/points.png")}
          style={styles.walletIcon}
        />
        <Text style={[textStyles.size.md]}>{credits} points</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  boxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    // borderWidth: 1,
  },
  divider: {
    width: 1,
    height: 29,
    backgroundColor: "#C6C6C8",
  },
  walletContainer: {
    paddingVertical: 30,
  },
  wallet: {
    marginRight: 11,
    width: 45,
    height: 45,
    paddingVertical: 12,
    backgroundColor: white,
    borderRadius: 45,
  },
  walletIcon: {
    maxHeight: 20,
  },
};

export { WalletContainer };
