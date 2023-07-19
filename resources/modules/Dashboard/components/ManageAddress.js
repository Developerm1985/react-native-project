/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import palette from "../../../styles/palette.styles";
import { LoadingOverlay, MessagePopup } from "../../../components/common";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Plus from "react-native-vector-icons/AntDesign";
import { defaultAddressApi, getAddressListAPI } from "../../../http";
import { setUserAddress } from "../../../slices/authSlice";

const ManageAddress = (props) => {
  const navigation = useNavigation();
  const [addressData, setaddressData] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("All");
  const address = useSelector((state) => state.user.userAddress);
  const [defaultAddress, setDefaultAddress] = useState(address?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = navigation.addListener("focus", () => {
      getAddresses();
    });
    return () => subscribe;
  }, []);

  const getAddresses = async () => {
    LoadingOverlay.show("Loading...");
    try {
      const { data } = await getAddressListAPI();
      if (data.success) {
        setaddressData(data.data);
        setDefaultAddress(data?.default?.id);
        if (data?.default) {
          global.currentLocation = {
            latitude: data?.default?.latitude,
            longitude: data?.default?.longitude,
          };
        }
        dispatch(setUserAddress(data?.default));
        LoadingOverlay.hide();
      } else {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Warning!",
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
      LoadingOverlay.hide();
      throw err;
    }
  };

  const savedPlaceData = () => {
    LoadingOverlay.show("Loading...");
    var newArray = addressData.filter(function (item) {
      return item.address_type === selectedPlace ? item : null;
    });
    LoadingOverlay.hide();
    return selectedPlace === "All" ? addressData : newArray;
  };

  const editAddressPress = (addressItem) => {
    navigation.navigate("EditAddress", {
      isEdit: true,
      addressItem,
      markData: {
        markerData: {
          latitude: addressItem?.latitude,
          longitude: addressItem?.longitude,
        },
      },
      selected_place: selectedPlace,
    });
  };

  const getDefaultAddress = async (item) => {
    try {
      const { data } = await defaultAddressApi({
        id: item?.id,
      });

      if (!data.success) {
        MessagePopup.show({
          title: "Warning!",
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
      throw err;
    }
  };

  function backHandler() {
    if (props?.route?.params?.from === "MyCart") {
      navigation.pop(2);
      return true;
    }
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    };
  }, []);

  const renderItem = (item, i) => {
    return (
      <View
        key={i}
        style={[
          styles.ListCard,
          {
            flexDirection: "row",
            flex: 1,
            padding: 10,
            marginVertical: 2,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => editAddressPress(item)}
          >
            <View style={styles.IconTitle}>
              <EvilIcons
                style={{ marginRight: 5 }}
                name="location"
                color="black"
                solid
                size={25}
              />
              <Text
                style={{
                  color: "#000",
                  marginBottom: 3,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {item?.address?.split(",")[0]}
              </Text>
              <View
                style={{
                  flex: 1,
                  marginLeft: 5,
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <Text style={{ fontSize: 12 }}>({item?.address_type})</Text>
              </View>
            </View>
            <Text style={{ marginStart: 30, fontSize: 12 }}>
              {item?.address}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            right: 5,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.radioCircle}
            onPress={async () => {
              setDefaultAddress(item?.id);
              dispatch(setUserAddress(item));
              getDefaultAddress(item);
            }}
          >
            {defaultAddress === item?.id && <View style={styles.selectedRb} />}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      style={[
        styles.landing,
        {
          backgroundColor: "#00000010",
          marginTop: props?.route?.params?.fromMerchant
            ? StatusBar.currentHeight
            : 0,
        },
      ]}
    >
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: palette.white,
          paddingTop: 15,
        }}
      >
        <View
          style={{
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.BackBotton}
            onPress={() =>
              props?.route?.params?.from === "MyCart"
                ? navigation.pop(2)
                : navigation.goBack()
            }
          >
            <FontAwesome
              name="angle-left"
              color="#000"
              style={{ marginStart: -2 }}
              solid
              size={25}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: "black" }}>Saved Places</Text>
        </View>

        {/* <View style={{ borderColor: "#000", borderWidth: 1, borderRadius: 5 }}>
          <Input
            placeholder="Type the address..."
            leftIcon={{ type: "entypo", name: "location-pin", size: 17 }}
            inputStyle={{ fontSize: 13 }}
            onChangeText={(value) => handleSearchText(value)}
            errorStyle={{ margin: 0, height: 0 }}
          />
        </View> */}
      </View>
      <View style={{ paddingHorizontal: 0, paddingVertical: 20 }}>
        <View style={{ paddingHorizontal: 10 }}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.SavedPlaceBtn}
                onPress={() => setSelectedPlace("All")}
              >
                <Text
                  style={{
                    color: selectedPlace == "All" ? "red" : "#000",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.SavedPlaceBtn}
                onPress={() => setSelectedPlace("Home")}
              >
                <Text
                  style={{
                    color: selectedPlace == "Home" ? "red" : "#000",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.SavedPlaceBtn}
                onPress={() => setSelectedPlace("Work")}
              >
                <Text
                  style={{
                    color: selectedPlace == "Work" ? "red" : "#000",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Work
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.SavedPlaceBtn}
                onPress={() => setSelectedPlace("Office")}
              >
                <Text
                  style={{
                    color: selectedPlace == "Office" ? "red" : "#000",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Office
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.replace("EditAddress", {
                  from: props?.route?.params?.from,
                  isEdit: false,
                  selected_place: selectedPlace,
                  fromMerchant: props?.route?.params?.fromMerchant,
                });
              }}
            >
              <Plus name="plus" size={26} color={"#000"} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              fontWeight: "600",
              marginTop: 10,
            }}
          >
            Saved Places
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={{ marginTop: 20 }}>
            {savedPlaceData().length ? (
              savedPlaceData().map((place, index) => renderItem(place, index))
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  height: 100,
                  alignItems: "center",
                }}
              >
                <Text>No Data Found</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  IconTitle: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  ListCard: {
    // marginBottom: 2,
    backgroundColor: "#fff",
    padding: 8,
  },
  BackBotton: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 10,
  },

  landing: {
    flex: 1,
    backgroundColor: palette.white,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  SavedPlaceBtn: {
    backgroundColor: palette.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: palette.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: palette.yellow,
  },
});

export default ManageAddress;
