import React, { useState } from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Dashboard from "../../modules/Dashboard/";
import Orders from "../../modules/Orders";
import Messages from "../../modules/Messages/index";
import Account from "../../modules/Account";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

const routes = [
  {
    key: "dashboard",
    name: "Dashboard",
    component: Dashboard,
    icon: require("../../img/home.png"),
  },
  {
    key: "orders",
    name: "Orders",
    component: Orders,
    icon: require("../../img/orders.png"),
  },
  {
    key: "messages",
    name: "Messages",
    component: Messages,
    icon: require("../../img/message.png"),
  },
  {
    key: "account",
    name: "Account",
    component: Account,
    icon: require("../../img/user_account_icon.png"),
  },
];

const DashboardRoute = () => {
  const userProfile = useSelector((state) => state.user.userdata);
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      barStyle={{ backgroundColor: "white" }}
    >
      {routes.map((route) => (
        <Tab.Screen
          key={route.key}
          name={route.name}
          component={route.component}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                resizeMode="cover"
                source={route.icon}
                style={{
                  width: 23,
                  borderRadius: route.key == "account" ? 50 : 0,
                  height: 23,
                  opacity: focused ? 1 : 0.3,
                  borderColor:
                    focused && route.key == "account" ? "#000" : "#D3D3D3",
                }}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default DashboardRoute;
