import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { flex } from "@styles/";

const CheckBox = ({
  iconStyle = {},
  containerStyle = {},
  checkedBgColor = "#FFBB00",
  initialValue = false,
  offset = 10,
  onChange,
}) => {
  const [isChecked, setChecked] = useState(initialValue);
  const handlePress = () => {
    const newValue = !isChecked;
    setChecked(newValue);
    if (typeof onChange === "function") onChange(newValue);
  };

  useEffect(() => {
    if (initialValue !== isChecked) setChecked(initialValue);
  }, [initialValue]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={{ padding: offset }}
    >
      <View
        style={{
          ...styles.checkboxWrapper,
          ...containerStyle,
          ...flex.centerAll,
          ...{
            borderColor: isChecked ? checkedBgColor : "#B8B8B8",
            backgroundColor: isChecked ? checkedBgColor : "#fff",
          },
        }}
      >
        <Icon
          name="check"
          style={{ fontSize: 12, color: "#fff", ...iconStyle }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  checkboxWrapper: {
    borderWidth: 2,
    width: 18,
    height: 18,
    borderRadius: 4,
  },
};

export { CheckBox };
