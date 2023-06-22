import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import palette from "../../styles/palette.styles";
import { BackButton } from "@components/common";
import textStyles from "@styles/textStyles.styles";
import { MessagePopup } from "../../components/common";

import { ExpressDelivery, ParcelSlider } from "./components/";
import { useDispatch, useSelector } from "react-redux";
import { setReset } from "../../slices/parcelSlice";

const ParcelDelivery = ({ route }) => {
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const { picked, dropped, selectedId, pickupData, dropoffData } = useSelector(
    (state) => state.parcel
  );

  function handleNavigation() {
    if (selectedId == null || selectedId == undefined || selectedId == 0) {
      MessagePopup.show({
        title: "Invalid parcel type",
        message: "Please select parcel type",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else {
      navigation.navigate("DeliveryOption", {
        parcelTypeId: selectedId,
        pickeUpData: pickupData,
        dropOffData: dropoffData,
      });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.white }}>
      <StatusBar translucent backgroundColor={palette.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: 40, paddingHorizontal: 15 }}
      >
        <BackButton
          onPress={() => {
            dispatch(setReset());
            navigation.goBack();
          }}
        />
        <View style={styles.DeliveryBackButton}></View>
        <ExpressDelivery />
        {picked && dropped ? (
          <ParcelSlider picked={picked} dropped={dropped} />
        ) : (
          <></>
        )}
      </ScrollView>
      {selectedId == null || selectedId == undefined || selectedId == 0 ? (
        <></>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.nextBtn, { marginHorizontal: 15 }]}
          onPress={() => {
            handleNavigation();
          }}
        >
          <Text
            style={[
              textStyles.mdTextBold,
              { color: palette.white, fontWeight: "700" },
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
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

export default ParcelDelivery;
