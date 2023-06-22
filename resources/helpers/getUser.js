import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const getUser = async () => {
  const user = await AsyncStorage.getItem("persist:root");
  return user;
};

export default getUser;
