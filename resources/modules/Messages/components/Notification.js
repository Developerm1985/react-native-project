import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Text,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import palette from "../../../styles/palette.styles";
import { getMessageList } from "../../../http";
import { LoadingOverlay, MessagePopup } from "../../../components/common";
import { FlatList } from "react-native-gesture-handler";
import { ScreenWidth } from "react-native-elements/dist/helpers";

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [isAvailable, setIsAvailable] = useState(0);

  useEffect(() => {
    const unsubscribeTab = navigation.addListener("focus", (e) => {
      LoadingOverlay.show("Loading...");
      getMessageData();
    });
    return () => unsubscribeTab;
  }, []);

  const getMessageData = async () => {
    setLoading(true);
    try {
      const { data } = await getMessageList({
        page: offset,
      });
      setMessages(messages.concat(data.data.message_list));
      setIsAvailable(data.data.hasMore);
      setOffset(offset + 1);
      setLoading(false);
      LoadingOverlay.hide();
    } catch (err) {
      setLoading(false);
      LoadingOverlay.hide();
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
  };

  const ItemDivider = () => {
    return <View style={styles.ItemDivider} />;
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
      onEndReached={isAvailable && getMessageData()}
      enableEmptySections={true}
      ListEmptyComponent={() => (
        <View
          style={[
            styles.emptyComponent,
            { top: ScreenWidth - (ScreenWidth * 15) / 100 },
          ]}
        >
          <Text>There is no data to display</Text>
        </View>
      )}
      data={messages}
      extraData={messages}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => getMessageData()}
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
  ItemDivider: {
    height: 2,
    width: "100%",
    backgroundColor: "#DBDBDB",
  },
  emptyComponent: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    zIndex: 1,
    backgroundColor: "#fff",
  },
};

export { Notification };
