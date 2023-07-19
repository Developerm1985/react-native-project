import React from "react";
import { ScrollView, View } from "react-native";
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { apiKey } from "../../config/";

const Location = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: apiKey.google,
          language: 'en',
          components: 'country:ph',
        }}
        requestUrl={{
          useOnPlatform: 'all', // or "all"
          url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api', // or any proxy server that hits https://maps.googleapis.com/maps/api
        }}
      /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingHorizontal: 20 }}
      ></ScrollView>
    </View>
  );
};

export default Location;
