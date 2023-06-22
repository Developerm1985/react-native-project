import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import palette from "../../styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import DropOffLocation from "./components/DropOffLocation";

// import { ParcelSlider } from "./components/ExpressDelivery";

const DropOff = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: palette.white }}>
      <StatusBar backgroundColor={palette.yellow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: 50 }}
      >
        <DropOffLocation />

        <Image
          resizeMode="stretch"
          source={require("@img/pickup-map.png")}
          style={{ marginTop: -20 }}
        />
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.nextBtn, { marginHorizontal: 20 }]}
        onPress={() => navigation.navigate("DeliveryOption")}
      >
        <Text
          style={[
            textStyles.mdTextBold,
            { color: palette.white, fontWeight: "700" },
          ]}
        >
          Set Drop-off Location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  DeliveryBackButton: {
    marginTop: 5,
    // paddingBottom: 10,
  },
  nextBtn: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 15,
  },
};

export default DropOff;
