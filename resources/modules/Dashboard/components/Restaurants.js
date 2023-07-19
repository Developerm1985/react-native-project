import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "react-native-geolocation-service";
import { getMerchants } from "../../../http/index";

import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import { LoadingOverlay, MessagePopup } from "../../../components/common";
import { useDispatch } from "react-redux";
import { setUserCurrentLocation } from "../../../slices/authSlice";
import { Deals } from "../components/Deals";

const Restaurants = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const dispatch = useDispatch();
  const [loadingForMerchants, setLoadingForMerchants] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    let prev = null;
    const subscribe = navigation.addListener("focus", () => {
      if (
        prev?.latitude !== global?.currentLocation?.latitude &&
        prev?.longitude !== global?.currentLocation?.longitude
      ) {
        getMerchantData({ coords: global?.currentLocation });
        prev = global.currentLocation;
      }
    });
    getLocation();
    return () => subscribe;
  }, []);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const requestPermission = await Geolocation.requestAuthorization(
      "whenInUse"
    );

    if (requestPermission === "granted") {
      return true;
    } else if (requestPermission === "denied") {
      MessagePopup.show({
        title: "Failed!",
        message: "Location permission denied",
        actions: [
          {
            text: "OKAY",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
      });
    } else if (requestPermission === "disabled") {
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
    } else if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (hasPermission) {
      return true;
    }

    const requestPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (requestPermission === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (requestPermission === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show("Location permission denied", ToastAndroid.LONG);
    } else if (
      requestPermission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      ToastAndroid.show("Location permission revoked", ToastAndroid.LONG);
    }
    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      setLoadingForMerchants(false);
      return;
    }
    Geolocation.getCurrentPosition(
      async (position) => {
        global.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        getMerchantData(position);
        dispatch(setUserCurrentLocation(position));
        setLoadingForMerchants(false);
      },
      (error) => {
        setLoadingForMerchants(false);
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

  async function getMerchantData(position) {
    LoadingOverlay.show("Finding nearest restaurant...");
    try {
      const params = {
        latitude: position?.coords?.latitude,
        longitude: position?.coords?.longitude,
      };
      const { data } = await getMerchants(params);
      setDashboardData(data.data);
      LoadingOverlay.hide();
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  }
  return !loadingForMerchants ? (
    <>
      {dashboardData?.campaigns?.length > 0 && (
        <Deals banners={dashboardData?.campaigns} />
      )}
      {dashboardData.home_cooked?.length ? (
        <View>
          <Text
            style={{
              fontSize: 16,
              color: palette.yellow,
              fontWeight: "700",
            }}
          >
            Merchants
          </Text>
          <ScrollView
            style={{ paddingVertical: 5 }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            {dashboardData?.home_cooked?.map((merchant, index) => (
              <RestaurantCard
                key={`foodrestaurant${index}`}
                merchant={merchant}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{ width: 250, height: 250 }}
            source={require("../../../img/unavailable-img.png")}
          />
        </View>
      )}
    </>
  ) : (
    <ActivityIndicator size="small" color={palette.yellow} />
  );
};

const RestaurantCard = ({ merchant }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.restaurant}
      onPress={() => navigation.navigate("Merchant", { id: merchant.id })}
    >
      <View style={{ overflow: "hidden" }}>
        <Image
          resizeMode="cover"
          source={{ uri: `${merchant.cover_photo[0]}`, cache: "force-cache" }}
          style={[styles.restaurantImage, { borderRadius: 7 }]}
        />
        <View style={styles.restaurantInfo}>
          <Text style={textStyles.normalTextBold}>{merchant.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  restaurant: {
    borderRadius: 7,
    margin: 5,
    marginVertical: 10,
    width: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    elevation: 4,
    backgroundColor: palette.white,
    flex: 1,
  },
  restaurantImage: {
    height: 120,
    width: "100%",
  },
  restaurantInfo: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
};
export { Restaurants };
