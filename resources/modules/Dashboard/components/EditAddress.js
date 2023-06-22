import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  PermissionsAndroid,
  ToastAndroid,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Input } from "react-native-elements";
import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import formInputs from "@styles/formInputs.styles";
import { LoadingOverlay } from "@components/common/";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Geolocation from "react-native-geolocation-service";
import {
  addAddressAPI,
  getbarangayAPI,
  getcityAPI,
  getprovinceAPI,
  getRegionsAPI,
  updateSingleAddressAPI,
} from "../../../http";
import MessagePopup from "../../../components/common/MessagePopup";
import MapView, { Marker } from "react-native-maps";
import { Dropdown } from "react-native-element-dropdown";
import { apiKey } from "../../../config";
import axios from "axios";
import { BackButton } from "../../../components/common";
import Header from "../../../components/common/Header";

const EditAddress = ({ route }) => {
  var singleAddressData;
  var selectedPlaceValue;
  var isEdits = false;
  const { userdata } = useSelector((state) => state.user);
  const map = useRef();

  if (route.params != undefined) {
    singleAddressData = route.params?.addressItem;
    isEdits = route?.params?.isEdit;
    selectedPlaceValue =
      route.params?.selected_place == "All"
        ? "Home"
        : route.params?.selected_place;
  }

  const navigation = useNavigation();
  const [regionData, setRegiondata] = useState();
  const [regionItem, setregionItem] = useState();
  const [provinceData, setProvincedata] = useState();
  const [provinceItem, setprovinceItem] = useState(
    singleAddressData?.province_id
  );

  const [cityData, setCitydata] = useState();
  const [cityItem, setCityItem] = useState(singleAddressData?.city_id);

  const [barangayData, setBarangaydata] = useState();
  const [barangayItem, setbarangayItem] = useState(
    singleAddressData?.barangay_id
  );

  const [postCode, setPostCode] = useState(
    singleAddressData?.postal_code?.toString()
  );
  const [searchKeyword, setsearchKeyword] = useState(
    singleAddressData?.address
  );

  const [selectedPlace, setSelectedPlace] = useState(
    route?.params?.addressItem?.address_type
      ? route?.params?.addressItem?.address_type
      : "Home"
  );
  const [addressID, setAddressID] = useState(route.params?.addressItem?.id);
  const API_KEY = apiKey?.google;
  const [showingResult, setshowingResult] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [keyboardLayout, setKeyboardLayout] = useState(null);
  const [location, setLocation] = useState({
    mapData: {
      latitude: Number(route?.params?.markData?.markerData?.latitude),
      longitude: Number(route?.params?.markData?.markerData?.longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
  });

  const addressArrayType = [
    {
      title: "Home",
      name: "home",
    },
    {
      title: "Office",
      name: "office",
    },
    {
      title: "Work",
      name: "work",
    },
  ];

  useEffect(() => {
    fetchRegions();
    const subscribe = navigation.addListener("focus", () => {
      getLocation();
    });

    return subscribe;
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardLayout(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", (e) => {
      setKeyboardLayout(10);
    });

    return () => {
      showSubscription.remove(), hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setLocation({
      mapData: {
        latitude: Number(route?.params?.markData?.markerData?.latitude),
        longitude: Number(route?.params?.markData?.markerData?.longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
    });

    map?.current?.animateToRegion({
      latitude: Number(route?.params?.markData?.markerData?.latitude),
      longitude: Number(route?.params?.markData?.markerData?.longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [route]);

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        console.log(
          "POSITION ---->",
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        MessagePopup.show({
          title: "Error!",
          message: error.message,
          actions: [
            {
              text: "OKAY",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        });
        // setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: "high",
          ios: "best",
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true,
      }
    );
  };

  // Get User current location
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");

    if (status === "granted") {
      return true;
    }

    if (status === "denied") {
      MessagePopup.show({
        title: "Location permission denied",
        // message: data.message,
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

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow Cycle House to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ]
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      fetchRegions();
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show("Location permission denied", ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show("Location permission revoked", ToastAndroid.LONG);
    }
    return false;
  };

  const fetchRegions = async () => {
    try {
      const { data } = await getRegionsAPI();
      if (data.success) {
        let updatedData = data?.data?.map((item) => ({
          label: item?.name,
          value: item,
        }));
        let updatedValue = data?.data?.find(
          (item) =>
            item?.id == singleAddressData?.region_id && {
              label: item?.name,
              value: item,
            }
        );
        setregionItem(updatedValue);
        setRegiondata(updatedData);
        getAllAddressProvince();
      }
    } catch (error) {
      throw error;
    }
  };

  const getAllAddressProvince = async () => {
    if (singleAddressData) {
      try {
        const { data } = await getprovinceAPI({
          region_id: singleAddressData?.region_id,
        });
        if (data.success) {
          let updatedData = data?.data?.map((item) => ({
            label: item?.name,
            value: item,
          }));
          let updatedValue = data?.data?.find(
            (item) =>
              item?.id == singleAddressData?.province_id && {
                label: item?.name,
                value: item,
              }
          );
          setprovinceItem(updatedValue);
          setProvincedata(updatedData);
          getAllAddressCity();
        }
      } catch (error) {}
    }
  };

  const getAllAddressCity = async () => {
    if (singleAddressData) {
      try {
        const { data } = await getcityAPI({
          province_id: singleAddressData?.province_id,
        });
        if (data.success) {
          let updatedData = data?.data?.map((item) => ({
            label: item?.name,
            value: item,
          }));
          let updatedValue = data?.data?.find(
            (item) =>
              item?.id == singleAddressData?.city_id && {
                label: item?.name,
                value: item,
              }
          );
          setCityItem(updatedValue);
          setCitydata(updatedData);
          getAllBarangay();
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const getAllBarangay = async () => {
    if (singleAddressData) {
      try {
        const { data } = await getbarangayAPI({
          city_id: singleAddressData?.city_id,
        });
        if (data.data) {
          let updatedData = data?.data?.map((item) => ({
            label: item?.name,
            value: item,
          }));
          let updatedValue = data?.data?.find(
            (item) =>
              item?.id == singleAddressData?.barangay_id && {
                label: item?.name,
                value: item,
              }
          );
          setbarangayItem(updatedValue);
          setBarangaydata(updatedData);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handlePlaceSelected = (value) => {
    setSelectedPlace(value);
  };

  const submitForm = async () => {
    if (regionItem == null || regionItem == "" || regionItem == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select region`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (
      provinceItem == null ||
      provinceItem == "" ||
      provinceItem == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select province`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (cityItem == null || cityItem == "" || cityItem == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select city`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (
      barangayItem == null ||
      barangayItem == "" ||
      barangayItem == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select barangay`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (postCode == null || postCode == "" || postCode == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select postal code`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (
      searchKeyword == undefined ||
      searchKeyword == null ||
      (searchKeyword == "" &&
        route?.params?.markData?.markerData?.latitude == undefined) ||
      route?.params?.markData?.markerData?.longitude == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please enter your ${selectedPlace} address`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else {
      LoadingOverlay.show("Please wait...");
      let params = {
        contact_person_name: userdata?.full_name && userdata?.full_name,
        address: searchKeyword,
        address_type: selectedPlace,
        latitude: location?.mapData?.latitude,
        longitude: location?.mapData?.longitude,
        region_id: regionItem?.id,
        province_id: provinceItem?.id,
        city_id: cityItem?.id,
        barangay_id: barangayItem?.id,
        postal_code: postCode,
      };
      try {
        const { data } = await addAddressAPI(params);
        LoadingOverlay.hide();

        if (data.success) {
          MessagePopup.show({
            title: "Successful",
            message: data?.message,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  route?.params?.fromParcel
                    ? navigation.replace("AddParcelAddress")
                    : navigation.replace("ManageAddress");
                },
              },
            ],
          });
        } else {
          MessagePopup.show({
            title: "Failed!",
            message: "Can't add addresses",
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
      } catch (error) {
        MessagePopup.show({
          title: "Error",
          message: error,
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
    }
  };

  const updateAddressFrom = async () => {
    // Validation here...
    if (regionItem == null || regionItem == "" || regionItem == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select region`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (
      provinceItem == null ||
      provinceItem == "" ||
      provinceItem == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select province`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (cityItem == null || cityItem == "" || cityItem == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select city`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (
      barangayItem == null ||
      barangayItem == "" ||
      barangayItem == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select barangay`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (postCode == null || postCode == "" || postCode == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select postal code`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (
      searchKeyword == undefined ||
      searchKeyword == null ||
      (searchKeyword == "" &&
        route?.params?.markData?.markerData?.latitude == undefined) ||
      route?.params?.markData?.markerData?.longitude == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please enter your ${selectedPlace} address`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else {
      LoadingOverlay.show("Please wait...");
      let params = {
        contact_person_name: userdata?.full_name,
        address: searchKeyword,
        address_type: selectedPlace,
        latitude: location?.mapData?.latitude,
        longitude: location?.mapData?.longitude,
        region_id: regionItem?.id,
        province_id: provinceItem?.id,
        city_id: cityItem?.id,
        barangay_id: barangayItem?.id,
        postal_code: postCode,
      };
      try {
        const { data } = await updateSingleAddressAPI(addressID, params);
        if (data?.success) {
          LoadingOverlay.hide();
          MessagePopup.show({
            title: "Successful",
            message: `Address Updated Successfully`,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  navigation.goBack();
                },
              },
            ],
          });
        } else {
          MessagePopup.show({
            title: "Failed!",
            message: `can't update address`,
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  navigation.replace("ManageAddress");
                },
              },
            ],
          });
        }
      } catch (error) {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Error",
          message: error,
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
    }
  };

  const handleChangeRegion = async (item) => {
    if (item !== "none") {
      setregionItem(item);
      let params = {
        region_id: item?.id,
      };

      try {
        const { data } = await getprovinceAPI(params);
        let updatedData = data?.data?.map((item) => ({
          label: item?.name,
          value: item,
        }));
        setProvincedata(updatedData);
      } catch (error) {
        console.log("Error");
      }
    }
  };

  const handleChangeProvince = async (item) => {
    if (item !== "none") {
      setprovinceItem(item);
      let params = {
        province_id: item?.id,
      };
      try {
        const { data } = await getcityAPI(params);
        let updatedData = data?.data?.map((item) => ({
          label: item?.name,
          value: item,
        }));

        setCitydata(updatedData);
      } catch (error) {
        console.log("Error");
      }
    }
  };

  const handleChangeCity = async (item) => {
    if (item !== "none") {
      setCityItem(item);
      let params = {
        city_id: item?.id,
      };

      try {
        const { data } = await getbarangayAPI(params);
        let updatedData = data?.data?.map((item) => ({
          label: item?.name,
          value: item,
        }));
        setBarangaydata(updatedData);
      } catch (error) {
        console.log("Error");
      }
    }
  };

  const handleChangeBarangay = (itemvalue) => {
    if (itemvalue !== "none") {
      setbarangayItem(itemvalue);
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

  const handleOnAddress = async (addressItem, _placeId) => {
    if (_placeId != null) {
      await axios
        .get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${_placeId}&key=${API_KEY}`
        )
        .then(async (data) => {
          navigation.navigate("AddressMap", {
            addressItem: addressItem,
            isEdit: route.params?.isEdit,
            fromParcel: route?.params?.fromParcel,
            latlong: {
              latitude: data?.data?.result?.geometry?.location.lat,
              longitude: data?.data?.result?.geometry?.location.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
          });
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" />
      <Header
        headerName="Add Saved Place"
        mainContainer={{
          marginTop:
            Platform.OS === "ios" ? 0 : route?.params?.fromParcel ? "9%" : 0,
        }}
        headerNameStyles={styles.headerText}
        backAction={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.landing}
      >
        <KeyboardAvoidingView>
          <View style={{ bottom: keyboardLayout }}>
            <View style={{ marginTop: 15 }}>
              <Text>Place Type</Text>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  marginLeft: 0,
                }}
              >
                {addressArrayType.map((item, index) => {
                  return (
                    <View key={`place${index}`}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        key={`place${index}`}
                        onPress={() => handlePlaceSelected(item.title)}
                        style={
                          (styles.addressType,
                          {
                            borderRadius: 10,
                            padding: 8,
                            marginRight: 13,
                            backgroundColor: "#f2f2f2",
                          })
                        }
                      >
                        <Text
                          style={
                            (styles.addressTypeText,
                            {
                              color:
                                selectedPlace === item.title
                                  ? "black"
                                  : "#A9A9A9",
                              fontWeight: "bold",
                            })
                          }
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
            <Text style={{ marginTop: 15 }}>Region</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={regionData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Region"
              value={regionItem}
              onChange={(item) => {
                handleChangeRegion(item.value);
              }}
            />
            <Text style={{ marginTop: 20 }}>Province</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={provinceData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Province"
              value={provinceItem}
              onChange={(item) => {
                handleChangeProvince(item.value);
              }}
            />
            <Text style={{ marginTop: 20 }}>City</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={cityData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select City"
              value={cityItem}
              onChange={(item) => {
                handleChangeCity(item.value);
              }}
            />
            <Text style={{ marginTop: 20 }}>Barangay</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={barangayData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Barangay"
              value={barangayItem}
              onChange={(item) => {
                handleChangeBarangay(item.value);
              }}
            />

            <Text style={{ marginTop: 20, marginBottom: 10 }}>Postal Code</Text>
            <View>
              <Input
                // inputStyle={[formInputs.input]}
                inputContainerStyle={[
                  formInputs.inputContainer,
                  {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    marginHorizontal: -10,
                    backgroundColor: "#fff",
                  },
                ]}
                labelStyle={[formInputs.label, textStyles.normalTextRegular]}
                placeholder="Enter postal code"
                onChangeText={(pcode) => setPostCode(pcode)}
                maxLength={4}
                value={postCode}
                keyboardType={"number-pad"}
              />
            </View>

            <View>
              <Text style={{ marginBottom: 10 }}>Street Address</Text>
              <Input
                leftIcon={{ type: "entypo", name: "location-pin", size: 17 }}
                inputContainerStyle={[
                  formInputs.inputContainer,
                  {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    marginHorizontal: -10,
                    backgroundColor: "#fff",
                  },
                ]}
                labelStyle={[formInputs.label, textStyles.normalTextRegular]}
                placeholder="Street Name, Building, House No."
                onChangeText={(text) => {
                  searchLocation(text);
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
                        backgroundColor: "white",
                        width: "100%",
                        marginTop: -25,
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
                              style={
                                (styles.resultItem,
                                { margin: 3, padding: 3, zIndex: 999 })
                              }
                              onPress={() => {
                                handleOnAddress(
                                  item.description,
                                  item.place_id
                                );
                                setsearchKeyword(item.description);
                                setshowingResult(false);
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
                    <Text>Loading...</Text>
                  ))}
              </View>
            </View>

            {/* MapView set here */}
            {route?.params?.markData?.markerData?.latitude == undefined ||
            route?.params?.markData?.markerData?.longitude == undefined ? (
              <></>
            ) : (
              <View
                style={{
                  marginBottom: 20,
                  height: 300,
                  borderRadius: 15,
                  overflow: "hidden",
                  zIndex: -9999,
                }}
              >
                <View>
                  <MapView
                    ref={map}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    initialRegion={
                      Platform.OS == "ios" ? null : location?.mapData
                    }
                    showsCompass={true}
                    scrollEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: Number(
                          route?.params?.markData?.markerData?.latitude
                        ),
                        longitude: Number(
                          route?.params?.markData?.markerData?.longitude
                        ),
                      }}
                      pinColor={palette.yellow}
                    >
                      <Image
                        source={require("../../../img/marker.png")}
                        style={{ height: 30, width: 30 }}
                        resizeMode="contain"
                      />
                    </Marker>
                  </MapView>
                </View>
              </View>
            )}
            <View
              style={{
                marginBottom: 20,
                zIndex: -99,
                marginTop: route?.params?.markData?.markerData?.latitude
                  ? 0
                  : 100,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={
                  searchKeyword === "" ||
                  searchKeyword === undefined ||
                  searchKeyword === null ||
                  route?.params?.markData?.markerData?.latitude === undefined
                    ? true
                    : false
                }
                style={[
                  styles.signup,
                  {
                    backgroundColor:
                      searchKeyword === "" ||
                      searchKeyword === undefined ||
                      searchKeyword === null ||
                      route?.params?.markData?.markerData?.latitude ===
                        undefined ||
                      route?.params?.markData?.markerData?.longitude ===
                        undefined
                        ? "gray"
                        : palette.yellow,
                  },
                ]}
                onPress={isEdits ? updateAddressFrom : submitForm}
              >
                <Text style={[textStyles.mdTextBold, { color: palette.white }]}>
                  {isEdits ? "Update Address" : "Save "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  BackBotton: {
    position: "absolute",
    left: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signup: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
  },
  searchResultsContainer: {
    width: 340,
    height: 200,
    flex: 1,
    backgroundColor: "#fff",
  },
  resultItem: {
    width: "100%",
    justifyContent: "center",
    height: 40,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    color: "black",
  },
});

export default EditAddress;
