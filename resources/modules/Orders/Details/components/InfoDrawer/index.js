import React from "react";
import { View, TouchableOpacity } from "react-native";

import {
  ActivityStatus,
  ActivityRiderInfo,
  ActivityTrips,
  ActivityRatingForm,
} from "./components";

const InfoDrawer = () => {
  return (
    <View style={{ backgroundColor: "#F8F8F8" }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ padding: 10, backgroundColor: "#fff" }}
      >
        <View style={styles.buttonBar} />
      </TouchableOpacity>
      <View style={[styles.groupContainer]}>
        <ActivityStatus />
        <ActivityRiderInfo />
      </View>
      <View style={[styles.groupContainer, { marginTop: 5 }]}>
        <ActivityTrips />
      </View>
      <View style={[styles.groupContainer, { marginTop: 5 }]}>
        <ActivityRatingForm
          title="How is your rider?"
          placeholder="Addtional Comments?"
          rateObject={{
            image: require("/img/icon.png"),
            name: "John Karlo Benedict",
            avgRating: 4.8,
          }}
        />
      </View>
      <View style={[styles.groupContainer, { marginTop: 5 }]}>
        <ActivityRatingForm
          title="How is your food?"
          placeholder="Leave a review"
          rateObject={{
            image: require("/img/icon.png"),
            name: "Kape Natividad",
            avgRating: 4.8,
          }}
        />
      </View>
    </View>
  );
};

const styles = {
  buttonBar: {
    height: 7,
    width: "40%",
    minWidth: 141,
    backgroundColor: "#B8B8B8",
    alignSelf: "center",
    borderRadius: 10,
  },
  groupContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
};

export { InfoDrawer };
