import React, { useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import Header from "../../../components/common/Header";

const AddressMap = (props) => {
  const [marketLatlong, setMarketLatlong] = useState();

  const handleRegionChange = (mapData) => {
    setMarketLatlong({
      markerData: {
        latitude: mapData.latitude,
        longitude: mapData.longitude,
      },
      mapData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerName="Select Location"
        mainContainer={{
          marginTop:
            Platform.OS === "ios"
              ? 0
              : props?.route?.params?.fromParcel
              ? "9%"
              : 0,
        }}
        headerNameStyles={styles.headerText}
        backAction={() => props?.navigation.goBack()}
      />

      <View style={{ flex: 1 }}>
        <MapView
          style={{
            width: "100%",
            height: "100%",
          }}
          initialRegion={props?.route?.params?.latlong}
          onRegionChangeComplete={handleRegionChange}
          // showsUserLocation={true}
        />
        <Image
          source={require("../../../img/pin.png")}
          style={{
            width: 120,
            height: 65,
            flexDirection: "row",
            position: "absolute",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            alignContent: "center",
            bottom: "50%",
          }}
          resizeMode="contain"
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "80%",
            margin: 25,
            alignSelf: "center",
            borderRadius: 30,
            height: 50,
            backgroundColor: "#dc593b",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              alignSelf: "center",
              width: "100%",
              alignItems: "center",
              padding: 15,
              borderRadius: 15,
            }}
            onPress={() => {
              props.navigation.navigate("EditAddress", {
                addressItem: props?.route?.params?.latlong,
                markData: marketLatlong,
                isEdit: props?.route?.params?.isEdit ? true : false,
                fromParcel: props?.route?.params?.fromParcel,
              });
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
  },
});

export default AddressMap;
