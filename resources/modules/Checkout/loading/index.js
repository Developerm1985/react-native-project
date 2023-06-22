import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Layout from "@components/Layout";

import { flex, textStyles as text, palette } from "@styles";

const screenHeight = Dimensions.get("window").height;

const CheckoutLoading = () => {
  const yValue = useRef(new Animated.Value(0)).current;
  const animation = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    animation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(yValue, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(yValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(() => {
      navigation.replace("DashboardRoute", { screen: "Orders" });
    }, 3500);

    return () => {
      if (animation.current) animation.current.stop();
    };
  }, []);

  return (
    <Layout.Wrapper style={{ backgroundColor: "#fff" }}>
      <Layout.Scroll>
        <View style={[flex.justify.center, { minHeight: screenHeight }]}>
          <View style={[flex.align.center]}>
            <View
              style={[styles.imgWrapper, flex.justify.end, flex.align.center]}
            >
              <Animated.Image
                resizeMode="contain"
                resizeMethod="resize"
                source={require("../../../img/meal.png")}
                style={{
                  width: 185,
                  height: 136,
                  marginBottom: 25,
                  transform: [
                    {
                      translateY: yValue,
                    },
                  ],
                }}
              />
            </View>
            <View style={[flex.align.center, styles.text]}>
              <Text style={[text.size.lg, text.weight.bold]}>Hang tight</Text>
              <Text
                style={[text.size.md, text.weight.regular, { marginTop: 15 }]}
              >
                We are processing your orders
              </Text>
            </View>
          </View>
        </View>
      </Layout.Scroll>
    </Layout.Wrapper>
  );
};

const styles = {
  imgWrapper: {
    width: 300,
    height: 247,
    backgroundColor: palette.yellow,
    borderRadius: 300,
  },
  text: {
    marginTop: 10,
    paddingTop: "30%",
    borderTopWidth: 2,
  },
};

export default CheckoutLoading;
