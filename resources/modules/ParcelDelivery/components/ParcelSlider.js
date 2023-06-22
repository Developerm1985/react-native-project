import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import Checkcircle from "react-native-vector-icons/AntDesign";
import palette from "../../../styles/palette.styles";
import { useNavigation } from "@react-navigation/native";
import { getParcelType } from "../../../http";
import { LoadingOverlay, MessagePopup } from "../../../components/common";
import { useDispatch, useSelector } from "react-redux";
import { selectedParcelId, setReset } from "../../../slices/parcelSlice";

const Item = ({
  item,
  onPress,
  backgroundColor,
  textColor,
  borderColor,
  iconName,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={{ marginRight: 15 }}
  >
    <View
      style={[
        styles.item,
        backgroundColor,
        borderColor,
        {
          borderWidth: 1,
          height: 120,
          width: 120,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {iconName != "" ? (
        <Checkcircle
          name={iconName}
          size={20}
          style={{
            color: palette.yellow,
            position: "absolute",
            right: 10,
            top: 10,
          }}
        />
      ) : (
        <></>
      )}

      <Image
        source={{ uri: item.logo, cache: "force-cache" }}
        resizeMode="contain"
        style={{ height: 60, width: 60 }}
      />
    </View>
    <View
      style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}
    >
      <Text
        style={[
          styles.title,
          textColor,
          { color: "#000", fontWeight: "700", marginRight: 3 },
        ]}
      >
        {item?.type}
      </Text>
      <Text style={[styles.title, textColor]}>{item?.tag}</Text>
    </View>
  </TouchableOpacity>
);

const ParcelSlider = ({ dropped, picked }) => {
  const _id = useSelector((state) => state.parcel.selectedId);
  const [selectedId, setSelectedId] = useState(_id);
  const [parcelType, setParcelType] = useState([]);
  const dispatch = useDispatch();

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#FFEFD3" : "#ddd";
    const borderColor = item.id === selectedId ? "#FFB531" : "#ddd";
    const iconName = item.id === selectedId ? "checkcircle" : "";
    return (
      <Item
        item={item}
        iconName={iconName}
        onPress={() => {
          setSelectedId(item.id);
          dispatch(selectedParcelId(item.id));
        }}
        backgroundColor={{ backgroundColor }}
        borderColor={{ borderColor }}
      />
    );
  };
  async function onLoad() {
    try {
      LoadingOverlay.show("Loading...");
      const { data } = await getParcelType();
      LoadingOverlay.hide();
      data.success
        ? setParcelType(data?.data)
        : MessagePopup.show({
            message: data.message,
            actions: [
              {
                text: "Okay",
                action: () => {
                  dispatch(setReset());
                  MessagePopup.hide();
                },
              },
            ],
          });
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  }
  useEffect(() => {
    dropped && picked ? onLoad() : "";
  }, [(picked = 1), (dropped = 1)]);

  return (
    <View style={{ marginBottom: 25 }}>
      <Text style={{ marginBottom: 20, fontSize: 18, color: palette.black }}>
        Select Type of Parcel
      </Text>
      <SafeAreaView>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={parcelType}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export { ParcelSlider };
