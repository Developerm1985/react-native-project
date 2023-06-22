import React from "react";
import { Input } from "react-native-elements";

import food from "@styles/food.styles";

const SearchInput = ({ value = "", onChange, onFocus }) => {
  return (
    <Input
      placeholder="Search for restaurants, cuisines…"
      leftIcon={{ type: "font-awesome", name: "search", size: 17 }}
      containerStyle={food.searchBarContainer}
      inputStyle={{ fontSize: 13 }}
      errorStyle={{ margin: 0, height: 0 }}
      inputContainerStyle={food.searchBar}
      value={value}
      autoFocus={onFocus ? false : true}
      onChangeText={(text) =>
        typeof onChange === "function" ? onChange(text) : {}
      }
      onFocus={() => (typeof onFocus === "function" ? onFocus() : {})}
    />
  );
};

export { SearchInput };
