import React, { useState } from "react";
import { View, Image as Img } from "react-native";

const Image = ({ imgProps = {}, containerStyle = {} }) => {
  const [isLoading, setLoading] = useState(true);
  const [withError, setError] = useState(false);
  const defaultImage = !isLoading
    ? require("/img/icon.png")
    : require("/img/defaultImage.png");

  return (
    <View style={{ ...containerStyle }}>
      <Img
        {...imgProps}
        source={withError || !imgProps.source ? defaultImage : imgProps.source}
        defaultSource={require("/img/defaultImage.png")}
        blurRadius={isLoading ? 5 : 0}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
};

export { Image };
