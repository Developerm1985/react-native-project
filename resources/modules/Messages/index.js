import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import palette from "../../styles/palette.styles";
import { Announcements, Notification } from "./components/";
import { SafeAreaView } from "react-native-safe-area-context";

const Messages = () => {
  const [activeTab, setactiveTab] = useState("announcements");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
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
            style={{
              fontSize: 15,
              color: activeTab == "announcements" ? palette.yellow : "#B8B8B8",
              fontWeight: "500",
              textAlign: "center",
            }}
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
            style={{
              fontSize: 15,
              color: activeTab == "messages" ? palette.yellow : "#B8B8B8",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Messages
          </Text>
        </TouchableOpacity>
      </View>
      <View
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{}}
      >
        {/* <NameHeader
          user={user}
          handleLogout={() => this.handleLogout()}
          navigation={navigation}
        /> */}
        {activeTab == "announcements" ? <Announcements /> : <Notification />}
      </View>
    </SafeAreaView>
  );
};

const styles = {
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
};

export default Messages;
