import React, { Component, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import routes from "./routes";
import { navigationRef } from "./RootNavigation";

const Stack = createStackNavigator();

class Router extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoggedIn: false,
    };
  }
  render() {
    const { token } = this.props;
    return (
      <NavigationContainer ref={navigationRef} style={styles.tabContainer}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Landing"}
        >
          {routes.map((route) => (
            <Stack.Screen
              {...route}
              options={{
                gestureEnabled: false,
              }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingVertical: 15,
    backgroundColor: "#000",
    height: 60,
    opacity: 1,
  },
  tabIcon: {
    marginTop: 15,
    height: 30,
    maxWidth: 30,
  },
  tabIcon2: {
    marginTop: 20,
    height: 40,
    maxWidth: 40,
  },
});

export default Router;
