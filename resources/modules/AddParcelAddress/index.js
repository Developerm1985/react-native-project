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
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "react-native-elements";
import palette from "../../styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import formInputs from "@styles/formInputs.styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Plus from "react-native-vector-icons/AntDesign";
import { getAddressListAPI } from "../../http";
import axios from "axios";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import { setRecentAddress } from "../../slices/parcelSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiKey } from "../../config";

const AddParcelAddress = () => {
  const navigation = useNavigation();
  const [selectedPlace, setSelectedPlace] = useState("All");
  const [addressData, setaddressData] = useState([]);
  const [placeId, setPlaceId] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [streetAddErr, setStreetAddErr] = useState(false);
  const [searchKeyword, setsearchKeyword] = useState("");
  const [showingResult, setshowingResult] = useState(false);
  const [allAddressData, setAllAddressData] = useState();

  const dispatch = useDispatch();
  const { recentAddress } = useSelector((state) => state.parcel);
  const API_KEY = apiKey?.google;
  const { flagName } = useSelector((state) => state.parcel);

  useEffect(() => {
    LoadingOverlay.show("Loading...");
    getAddresses();
  }, []);

  const getAddresses = async () => {
    try {
      const { data } = await getAddressListAPI();
      if (data.success) {
        setaddressData(data.data);
        setAllAddressData(data.data);
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
      throw err;
    }
  };

  const handlePlaceSelected = (value) => {
    var newArray = allAddressData.filter(function (item) {
      return item.address_type === value ? item : null;
    });
    setaddressData(newArray);
    setSelectedPlace(value);
  };

  const handlePlaceAllSelected = () => {
    setSelectedPlace("All");
    setaddressData(allAddressData);
  };

  const handleOnAddress = async (addressItem, _placeId, latLong) => {
    if (_placeId != null) {
      LoadingOverlay.show("Loading...");
      await axios
        .get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${_placeId}&key=${API_KEY}`
        )
        .then(async (data) => {
          LoadingOverlay.hide();
          navigation.navigate("Pickup", {
            addressItem: addressItem,
            flagName: flagName,
            latlong: JSON.stringify(data?.data?.result?.geometry?.location),
          });
        })
        .catch((err) => {
          LoadingOverlay.hide();
          throw err;
        });
    } else {
      navigation.navigate("Pickup", {
        addressItem: addressItem,
        flagName: flagName,
        latlong: latLong,
      });
    }
  };

  const searchLocation = async (addinputval) => {
    setsearchKeyword(addinputval);
    if (addinputval === "") {
      setshowingResult(false);
    } else {
      await axios
        .request({
          method: "post",
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${searchKeyword}`,
        })
        .then((response) => {
          setshowingResult(true);
          setSearchData(response.data.predictions);
        })
        .catch((e) => {
          throw e;
        });
    }
  };

  const renderItem = ({ item, i }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={i}
        onPress={() => {
          handleOnAddress(item.address, null, {
            lat: item.latitude,
            lng: item.longitude,
          });
        }}
        style={[
          styles.ListCard,
          {
            flexDirection: "row",
            flex: 1,
            padding: 10,
          },
        ]}
      >
        <View style={{ flex: 4 }}>
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
              {item.address.split(",")[0]}
            </Text>
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Text style={{ fontSize: 12 }}>({item.address_type})</Text>
            </View>
          </View>
          <Text numberOfLines={1} style={{ marginStart: 30, fontSize: 12 }}>
            {item.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const recentRenderItem = ({ item, i }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={i}
        onPress={() => {
          handleOnAddress(item?.description, item?.place_id);
        }}
        style={[
          styles.ListCard,
          {
            flexDirection: "row",
            flex: 1,
            padding: 10,
          },
        ]}
      >
        <View>
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
              {item?.description?.split(",")[0]}
            </Text>
          </View>
          <Text numberOfLines={1} style={{ marginStart: 30, fontSize: 12 }}>
            {item?.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.landing, { backgroundColor: "#00000010" }]}
    >
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: palette.white,
          paddingTop: 10,
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
            onPress={() => navigation?.goBack()}
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

        <Input
          inputStyle={formInputs.input}
          leftIcon={{ type: "entypo", name: "location-pin", size: 17 }}
          inputContainerStyle={
            streetAddErr
              ? [
                  formInputs.inputContainer,
                  {
                    borderWidth: 1,
                    borderColor: "red",
                    marginHorizontal: -10,
                    backgroundColor: "#fff",
                  },
                ]
              : [
                  formInputs.inputContainer,
                  {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    marginHorizontal: -10,
                    backgroundColor: "#fff",
                  },
                ]
          }
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Type the address ..."
          onChangeText={(text) => {
            searchLocation(text);
          }}
          onBlur={() => {
            setStreetAddErr(false);
          }}
          value={searchKeyword}
        />
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            position: "absolute",
            top: 100,
            zIndex: 9999999,
            alignSelf: "center",
          }}
        >
          {showingResult &&
            searchKeyword !== "" &&
            (searchData ? (
              <View
                style={{
                  zIndex: 9999,
                  backgroundColor: "white",
                  width: "100%",
                  marginTop: 20,
                  padding: 10,
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: -2, height: 4 },
                }}
              >
                <FlatList
                  data={searchData}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        keyExtractor={index}
                        style={(styles.resultItem, { margin: 3, padding: 3 })}
                        onPress={() => {
                          setPlaceId(item.place_id);
                          setsearchKeyword(item.description);
                          dispatch(setRecentAddress(item));
                          setshowingResult(false);
                          handleOnAddress(item.description, item.place_id);
                        }}
                      >
                        <Text>{item.description}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  style={styles.searchResultsContainer}
                />
              </View>
            ) : (
              <Text>Loading</Text>
            ))}
        </View>
      </View>
      <ScrollView
        style={{
          paddingVertical: 20,
          zIndex: -1,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", zIndex: -1 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.SavedPlaceBtn}
                onPress={() => handlePlaceAllSelected()}
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
                onPress={() => handlePlaceSelected("Home")}
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
                onPress={() => handlePlaceSelected("Work")}
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
                onPress={() => handlePlaceSelected("Office")}
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
                  selected_place: selectedPlace,
                  fromParcel: true,
                  fromMerchant: true,
                });
              }}
            >
              <Plus name="plus" size={26} color={"#000"} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{
            flex: 1,
            marginVertical: 10,
            top: 10,
          }}
          data={addressData}
          ListHeaderComponent={() => (
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "600",
                margin: 10,
              }}
            >
              Saved Places
            </Text>
          )}
          renderItem={renderItem}
          ListEmptyComponent={() => (
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
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        />

        {recentAddress.length > 0 && (
          <FlatList
            style={{ marginBottom: 20 }}
            ListHeaderComponent={() => (
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 20,
                  }}
                >
                  Recent
                </Text>
              </View>
            )}
            data={recentAddress}
            renderItem={recentRenderItem}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  IconTitle: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  ListCard: {
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
  resultItem: {
    width: "100%",
    justifyContent: "center",
    height: 40,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
});

export default AddParcelAddress;
