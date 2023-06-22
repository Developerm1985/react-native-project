import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import * as Layout from "@components/Layout";
import { MyCartHeader } from "../components";
import { CartMerchant } from "./components";

import Cart from "../../../factories/cart.factory";

const MyCartMerchants = () => {
  //   const cart = useSelector((state) => new Cart(state.cart));

  return (
    <Layout.Wrapper>
      <MyCartHeader />
      <Layout.Scroll>
        <View>
          {/* {Object.keys(cart.merchants).map((key) => (
            // <CartMerchant
            //     key={`cartmerchant${ key }`}
            //     merchant={ cart.merchants[key] }
            //     itemCount={ cart.getItemCount(key) }
            //     total={ cart.getMerchantTotal(key) }
            // />
          ))} */}
          <CartMerchant
            //   key={`cartmerchant${key}`}
            merchant={10}
            itemCount={20}
            total={200}
          />
        </View>
      </Layout.Scroll>
    </Layout.Wrapper>
  );
};

export default MyCartMerchants;
