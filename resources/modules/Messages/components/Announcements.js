import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  RefreshControl,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAnnouncement } from "../../../http";
import { MessagePopup, LoadingOverlay } from "../../../components/common";
import { FlatList } from "react-native-gesture-handler";
import palette from "../../../styles/palette.styles";

const Announcements = () => {
  const navigation = useNavigation();

  const [list, setList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isAvailable, setIsAvailable] = useState(0);

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    const unsubscribeTab = navigation.addListener("tabPress", (e) => {
      LoadingOverlay.show("Fetching...");
      getDetails();
    });
    getDetails();
    return unsubscribeTab;
  }, []);

  const getDetails = async () => {
    setLoading(true);
    try {
      const { data } = await getAnnouncement({
        page: offset,
      });
      if (data.success) {
        setList(list.concat(data?.data?.announcement));
        setIsAvailable(data.data.hasMore);
        setOffset(offset + 1);
        setIsFetching(false);
        LoadingOverlay.hide();
        setLoading(false);
      } else {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Something wents to wrong!",
          message: data.message,
          actions: [
            {
              text: "OKAY",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      }
    } catch (err) {
      LoadingOverlay.hide();
    }
  };

  const refreshPage = () => {
    setIsFetching(true);
    getDetails();
  };

  const ItemDivider = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#DBDBDB",
        }}
      />
    );
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          height: StatusBar.currentHeight * (loading && isAvailable ? 4 : 2.5),
        }}
      >
        {loading ? (
          <ActivityIndicator
            size={"large"}
            color={palette.yellow}
            style={{
              justifyContent: "center",
            }}
          />
        ) : (
          <></>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.AnnounceWrapper]}>
      <FlatList
        data={list}
        alwaysBounceVertical={true}
        bounces={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.7}
        enableEmptySections={true}
        onEndReached={isAvailable && getDetails}
        extraData={list}
        keyExtractor={(item) => `${item.title}_${item.id}`}
        ItemSeparatorComponent={ItemDivider}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Text>There is no data to display</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => refreshPage()}
          />
        }
        renderItem={({ item }) => {
          return (
            <View style={[styles.AnnounceInnerWrapper]}>
              <View style={{ width: "13%" }}>
                <Image
                  resizeMode="stretch"
                  style={styles.messageIcon}
                  source={require("../../../img/announcements.png")}
                />
              </View>
              <View style={{ width: "87%" }}>
                <Text style={[styles.AnnounceTitle]}>{item.title}</Text>
                <Text style={[styles.AnnounceDec]}>{item.description}</Text>
                <Text style={[styles.AnnounceDate]}>{item.date}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = {
  AnnounceWrapper: {
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  AnnounceInnerWrapper: {
    flexDirection: "row",
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  AnnounceDec: {
    fontSize: 13,
    color: "#707070",
    marginBottom: 10,
  },
  AnnounceTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000000",
  },
  AnnounceDate: {
    fontSize: 13,
  },
  messageIcon: {
    height: 35,
    width: 35,
  },
};

export { Announcements };
