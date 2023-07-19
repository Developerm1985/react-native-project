import React from "react";
import { View } from "react-native";
import * as Layout from "@components/Layout";
import { MyCartHeader } from "../components";
import { CartMerchant } from "./components";

const MyCartMerchants = () => {
  return (
    <Layout.Wrapper>
      <MyCartHeader />
      <Layout.Scroll>
        <View>
          <CartMerchant merchant={10} itemCount={20} total={200} />
        </View>
      </Layout.Scroll>
    </Layout.Wrapper>
  );
};

export default MyCartMerchants;
