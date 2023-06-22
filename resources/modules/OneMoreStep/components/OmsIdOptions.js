import React, { useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

import { BackButton } from "@components/common";
import * as Layout from "@components/Layout";

import { flex, textStyles as text } from "@styles";

import OmsFormContext from "../../../contexts/omsFormContext";

const windowHeight = Dimensions.get("window").height;
const OmsIdOptions = (props) => {
  const { onChange, idOptionsOpen, toggleIdOptions } =
    useContext(OmsFormContext);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(windowHeight)).current;
  const toggleAnimation = (toValue) => {
    Animated.timing(fadeAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(
    () => toggleAnimation(idOptionsOpen ? 0 : windowHeight),
    [idOptionsOpen]
  );

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ translateY: fadeAnim }] }]}
    >
      <View>
        <Text
          style={[
            text.size.mlg,
            text.color.darkGray,
            text.align.center,
            text.weight.regular,
          ]}
        >
          Select Government ID
        </Text>
        <BackButton
          onPress={() => toggleIdOptions(false)}
          containerStyle={{
            position: "absolute",
            alignSelf: "center",
            left: 0,
          }}
        />
      </View>
      <Layout.Scroll style={{ marginTop: 30 }}>
        {idOptions.map((option) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`idoption${option.value}`}
            onPress={() => {
              onChange({ name: "id", value: option });
              toggleIdOptions(false);
              navigation.navigate("DocScanner", {
                FullData: props.formData,
                selectOption: option,
              });
            }}
          >
            <View
              style={[
                styles.option,
                flex.direction.row,
                flex.align.center,
                flex.justify.between,
              ]}
            >
              <Text style={[text.size.md, text.weight.regular]}>
                {option.label}
              </Text>
              <Icon name="chevron-right" size={15} />
            </View>
          </TouchableOpacity>
        ))}
      </Layout.Scroll>
    </Animated.View>
  );
};

const idOptions = [
  { label: "Passport", value: "passport" },
  { label: "Driver’s license", value: "drivers-license" },
  { label: "SSS ID", value: "sss" },
  { label: "Voter’s ID", value: "voters" },
  { label: "National ID", value: "national" },
];

const styles = {
  wrapper: {
    backgroundColor: "#fff",
    padding: 20,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  },
  option: {
    padding: 15,
    marginTop: 10,
  },
};
export { OmsIdOptions };
