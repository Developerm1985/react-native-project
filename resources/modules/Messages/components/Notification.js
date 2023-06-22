import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import palette from "../../../styles/palette.styles";
import { getMessageList } from "../../../http";
import { LoadingOverlay, MessagePopup } from "../../../components/common";
import { FlatList } from "react-native-gesture-handler";
import { ScreenWidth } from "react-native-elements/dist/helpers";

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isAvailable, setIsAvailable] = useState(0);

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    onload();
  }, []);

  const onload = async () => {
    try {
      const { data } = await getMessageList({
        page: offset,
      });
      if (data?.success) {
        setMessages(messages.concat(data.data.message_list));
        setIsAvailable(data.data.hasMore);
        setOffset(offset + 1);
        setIsFetching(false);
        setLoading(false);
        LoadingOverlay.hide();
      } else {
        LoadingOverlay.hide();
        setIsFetching(false);
        MessagePopup.show({
          title: "Something wents to wrong!",
          message: data.message,
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
      }
    } catch (err) {
      setIsFetching(false);
      LoadingOverlay.hide();
    }
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

  const refreshPage = () => {
    setIsFetching(true);
    onload();
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
    <FlatList
      style={{ height: "100%" }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.7}
      onEndReached={isAvailable && onload}
      enableEmptySections={true}
      ListEmptyComponent={() => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            zIndex: 1,
            backgroundColor: "#fff",
            top: ScreenWidth - (ScreenWidth * 15) / 100,
          }}
        >
          <Text>There is no data to display</Text>
        </View>
      )}
      data={messages}
      extraData={messages}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => refreshPage()}
        />
      }
      renderItem={({ item }) => {
        return (
          <View style={[styles.AnnounceWrapper]}>
            <View style={[styles.AnnounceInnerWrapper]}>
              <View style={{ width: "18%" }}>
                <Image
                  onError={() => {
                    setValid(false);
                  }}
                  resizeMode="cover"
                  style={styles.messageIcon}
                  source={
                    valid
                      ? { uri: item?.sender_image, cache: "force-cache" }
                      : require("../../../img/account.png")
                  }
                />
              </View>
              <View style={{ width: "82%" }}>
                <Text style={[styles.AnnounceTitle]}>{item.sender_name}</Text>
                <Text style={[styles.AnnounceDec]}>{item.description}</Text>
              </View>
            </View>
          </View>
        );
      }}
      ItemSeparatorComponent={ItemDivider}
      keyExtractor={(item, index) => `${index}message`}
    />
  );
};

const styles = {
  MessageCount: {
    color: palette.black,
    fontSize: 15,
    fontWeight: "500",
  },
  AnnounceWrapper: {
    paddingHorizontal: 20,
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
    marginBottom: 0,
  },
  AnnounceTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
  },
  AnnounceDate: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },
  messageIcon: {
    height: 45,
    width: 45,
    borderRadius: 50,
  },
};

export { Notification };
