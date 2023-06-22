import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { Input } from "react-native-elements";

import { BackButton, SearchInput } from "@components/common";

import { flex, textStyles } from "@styles/";
import { getSearch } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { storeSearchData } from "../../../slices/bannerSlice";
import useDebounce from "./useDebounce";

const SearchHeader = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  const debouncedSearch = useDebounce(keyword, 300);

  const onload = async () => {
    let searchKey = keyword.replace(/\s/g, "");
    const params = {
      keyword: searchKey,
    };
    try {
      const { data } = searchKey && (await getSearch(params));
      dispatch(storeSearchData(data?.data));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    debouncedSearch && onload();
  }, [debouncedSearch]);

  return (
    <View style={{ paddingTop: 50, padding: 20, backgroundColor: "white" }}>
      <View>
        <View style={{ position: "absolute", left: 0, top: 0 }}>
          <BackButton containerStyle={{ backgroundColor: "#F8F8F8" }} />
        </View>
        <Text
          style={[
            flex.alignSelf.center,
            textStyles.size.mlg,
            textStyles.weight.regular,
            { marginBottom: 20 },
          ]}
        >
          Pre-order
        </Text>
      </View>
      <View style={{ elevation: 10 }}>
        <SearchInput
          onChange={(e) => setKeyword(e)}
          value={keyword}
          onFocus={true}
        />
      </View>
    </View>
  );
};

export { SearchHeader };
