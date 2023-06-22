import React, { useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import textStyles from "@styles/textStyles.styles";
import { BackButton } from "../../../components/common/BackButton";
import palette from "../../../styles/palette.styles";
import formInputs from "@styles/formInputs.styles";
import { Input } from "react-native-elements";

const PickupLocation = ({ addressItemData, flagName, handleInput }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        padding: 15,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackButton
          containerStyle={{
            backgroundColor: palette.lightGray,
          }}
          iconStyle={{ color: "#000" }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: palette.black,
            marginLeft: 10,
          }}
        >
          {flagName == "pick" ? "Pick-up" : "Drop-off"}
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Input
          inputStyle={[formInputs.input]}
          disabled={true}
          leftIcon={{ type: "entypo", name: "location-pin", size: 17 }}
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              marginHorizontal: -10,
              marginBottom: -10,
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Type the address ..."
          onChangeText={(text) => handleInput("location", text)}
          value={addressItemData}
        />
        <Input
          maxLength={50}
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              // borderWidth: 1,
              borderColor: "#ccc",
              marginHorizontal: -10,
              backgroundColor: "#fff",
              marginBottom: -10,
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Recipient Name"
          onChangeText={(text) => handleInput("reciptName", text)}
        />
        <Input
          maxLength={13}
          keyboardType="numeric"
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              // borderWidth: 1,
              borderColor: "#ccc",
              marginHorizontal: -10,
              backgroundColor: "#fff",
              marginBottom: -10,
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Contact Number"
          onChangeText={(num) => handleInput("contact", num)}
        />
        <Input
          maxLength={255}
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              // borderWidth: 1,
              borderColor: "#ccc",
              marginHorizontal: -10,
              backgroundColor: "#fff",
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Notes (Optional)"
          onChangeText={(note) => handleInput("notes", note)}
        />
      </View>
    </View>
  );
};

export default PickupLocation;
