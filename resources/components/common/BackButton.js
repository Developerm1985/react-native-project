import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

import palette from "@styles/palette.styles";
import flex from "@styles/flex.styles";

/**
 *
 * @param {object} containerStyle = button style overwrite
 * @param {object} iconStyle = icon style overwrite
 * @param {function} onPress = onPress handle
 * @returns
 */
const BackButton = ({
  containerStyle = {},
  iconStyle = {},
  iconName = "chevron-left",
  onPress,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...styles.button,
        ...flex.align.center,
        ...flex.justify.center,
        ...containerStyle,
      }}
      onPress={onPress ? onPress : navigation.goBack}
    >
      <Icon name={iconName} style={{ ...styles.icon, ...iconStyle }} />
    </TouchableOpacity>
  );
};

const styles = {
  button: {
    width: 30,
    height: 30,
    backgroundColor: palette.searchBar,
    borderRadius: 10,
  },
  icon: {},
};

export { BackButton };
