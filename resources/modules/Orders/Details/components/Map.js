import React from "react";
import { View } from "react-native";
import { BackButton } from "@components/common";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import MapView from "react-native-maps";

const Map = ({ initialRegion, children, scrollMap }) => {
  // const navigation = useNavigation();
  // latitude: coordinates[0].latitude,
  //       longitude: coordinates[0].longitude,
  //       latitudeDelta: 0.0622,
  //       longitudeDelta: 0.0121,
  return (
    <MapView
      style={[styles.mapWrapper]}
      initialRegion={initialRegion}
      scrollEnabled={scrollMap}
    >
      {children && children}
    </MapView>
  );
};

const styles = {
  mapWrapper: {
    flex: 3,
  },
};

export default Map;
