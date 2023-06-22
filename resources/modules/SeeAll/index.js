import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FoodItemCard } from "../Food/components/SelectionSlider/components";
import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import food from "@styles/food.styles";
import { BackButton, LoadingOverlay } from "../../components/common";
import { URL } from "../../config";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import palette from "../../styles/palette.styles";

const SeeAll = ({ route }) => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoadingOverlay.show("Loading");
    getDetails();
  }, []);

  async function getDetails() {
    const params = {
      title:
        route?.params?.id == 1
          ? "discover-list"
          : route.params.id == 2
          ? "this-week-list"
          : route.params.id == 3
          ? "for-tomorrow-list"
          : route.params.id == 4
          ? "today-list"
          : "",
      pageNo: 1,
    };
    setLoading(true);
    await fetch(
      `http://cyclehouseservice.lrdevteam.com/api/v2/${params.title}?page=${offset}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setStores(stores.concat(data.data?.items));
        setOffset(offset + 1);
        setLoading(false);
        LoadingOverlay.hide();
      })
      .catch((err) => {
        LoadingOverlay.hide();
        throw err;
      });
  }
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading ? <ActivityIndicator color={palette.yellow} /> : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ paddingBottom: loading ? 200 : 120 }}>
      <View>
        <View style={[flex.flexRow, food.sectionHeading]}>
          <BackButton />
          <View style={{ marginLeft: 10 }}>
            <Text style={textStyles.mdTextBold}>{route.params.title}</Text>
          </View>
        </View>
        <View>
          <FlatList
            data={stores}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ flexGrow: 1 }}
            onEndReachedThreshold={0.7}
            onEndReached={getDetails}
            // enableEmptySections={true}
            renderItem={(data, index) => {
              return (
                <FoodItemCard
                  key={`fooditem${route.params.title
                    .toLowerCase()
                    .replace(/ /g, "")}${index}`}
                  title={route.params.title}
                  item={data.item}
                  isFirst={index === 0}
                  isLast={index + 1 === stores.length}
                  fullWidth
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
  },
  footer: {
    height: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});

export { SeeAll };
