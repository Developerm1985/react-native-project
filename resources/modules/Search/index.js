import React from "react";
import * as Layout from "@components/Layout";

import { SearchHeader, SearchResult, SearchCategories } from "./components";
import { StatusBar } from "react-native";

const Search = () => {
  return (
    <Layout.Wrapper>
      <StatusBar translucent backgroundColor="transparent" />
      <SearchHeader />
      <Layout.Scroll style={{ backgroundColor: "#fff" }}>
        <SearchCategories />
        <SearchResult />
      </Layout.Scroll>
    </Layout.Wrapper>
  );
};

export default Search;
