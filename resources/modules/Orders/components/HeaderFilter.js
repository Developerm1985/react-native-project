import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import palette from "styles/palette.styles";
import textStyles from "styles/textStyles.styles";
import flex from "styles/flex.styles";

const HeaderFilter = ({ handleActiveStatus }) => {
  const [activeStatus, setActiveStatus] = useState(0);

  useEffect(() => {
    handleActiveStatus(activeStatus);
  }, [activeStatus]);

  return (
    <View style={[flex.direction.row]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveStatus(0)}
        style={{ flex: 1, padding: 10 }}
      >
        <Text
          style={[
            flex.alignSelf.center,
            textStyles.size.md,
            textStyles.weight.medium,
            { color: activeStatus === 0 ? palette.yellow : palette.darkGray },
          ]}
        >
          Ongoing
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveStatus(1)}
        style={{ flex: 1, padding: 10 }}
      >
        <Text
          style={[
            flex.alignSelf.center,
            textStyles.size.md,
            textStyles.weight.medium,
            { color: activeStatus === 1 ? palette.yellow : palette.darkGray },
          ]}
        >
          Past
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export { HeaderFilter };
