import React, { useState } from "react";
import { View, StatusBar, Text, TouchableOpacity } from "react-native";
import palette from "../../styles/palette.styles";
import { Announcements, Notification } from "./components/";
import { SafeAreaView } from "react-native-safe-area-context";

const Messages = () => {
  const [activeTab, setactiveTab] = useState("announcements");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={palette.yellow} />
      <View style={styles.TopTabsWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.TopTabs}
          onPress={() => {
            setactiveTab("announcements");
          }}
        >
          <Text
            style={[
              styles.textLabel,
              {
                color:
                  activeTab == "announcements" ? palette.yellow : "#B8B8B8",
              },
            ]}
          >
            Announcements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.TopTabs}
          onPress={() => {
            setactiveTab("messages");
          }}
        >
          <Text
            style={[
              styles.textLabel,
              {
                color: activeTab == "messages" ? palette.yellow : "#B8B8B8",
              },
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>
      </View>
      <View
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {activeTab == "announcements" ? <Announcements /> : <Notification />}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  TopTabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  TopTabs: {
    marginVertical: 15,
    backgroundColor: "#fff",
    width: "50%",
  },
  textLabel: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
};

export default Messages;
