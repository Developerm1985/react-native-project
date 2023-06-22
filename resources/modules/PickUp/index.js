import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import palette from "../../styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import PickupLocation from "./components/PickupLocation";
import Map from "../../modules/Orders/Details/components/Map";
import MapView, { Marker, MarkerAnimated } from "react-native-maps";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import { useDispatch } from "react-redux";
import {
  setPickupData,
  setDropoffData,
  setPickTitle,
  setDropTitle,
} from "../../slices/parcelSlice";

// import { ParcelSlider } from "./components/ExpressDelivery";

const PickUp = ({ route }) => {
  let { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const [addressItem, setAddressItem] = useState(route.params.addressItem);
  const [tempFlag, setTempFlag] = useState(route.params.flagName);
  const [latLong, setLatLong] = useState(route?.params?.latlong);

  const [reciptName, setReciptName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const dispatch = useDispatch();

  const initialRegions = {
    latitude:
      typeof latLong == "string"
        ? JSON.parse(latLong).lat
        : parseFloat(latLong?.lat),
    longitude:
      typeof latLong == "string"
        ? JSON.parse(latLong).lng
        : parseFloat(latLong?.lng),
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0121,
  };

  const [latLongRegion, setLatLongRegion] = useState({
    lat: initialRegions.latitude,
    lng: initialRegions.longitude,
  });

  function checkValidation() {
    const phone_regx =
      /(^0|[89]\d{2}-\d{3}\-?\d{4}$)|(^0|[89]\d{2}\d{3}\d{4}$)|(^63[89]\d{2}-\d{3}-\d{4}$)|(^63[89]\d{2}\d{3}\d{4}$)|(^[+]63[89]\d{2}\d{3}\d{4}$)|(^[+]63[89]\d{2}-\d{3}-\d{4}$)/;

    return addressItem == "" ||
      addressItem == null ||
      addressItem.length < 3 ||
      addressItem.length > 150
      ? MessagePopup.show({
          title: "Required!",
          message: "Please enter address",
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        })
      : reciptName == "" || reciptName == null
      ? MessagePopup.show({
          title: "Required!",
          message: "Please enter the recipient name",
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        })
      : contact == "" || contact == null
      ? MessagePopup.show({
          title: "Required!",
          message: "Please enter contact number",
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        })
      : phone_regx.test(contact) === false
      ? MessagePopup.show({
          title: "Required!",
          message: "Please enter a valid contact number",
          actions: [
            {
              text: "Okay",
              action: () => {
                MessagePopup.hide();
              },
            },
          ],
        })
      : true;
  }

  const HandleButton = () => {
    if (checkValidation()) {
      LoadingOverlay.show("Loading...");
      dispatch(
        tempFlag == "pick"
          ? setPickTitle(addressItem?.split(",")[0])
          : setDropTitle(addressItem?.split(",")[0])
      );
      dispatch(
        tempFlag == "pick"
          ? setPickupData({
              address: addressItem,
              reciptName: reciptName,
              contact: contact,
              notes: notes,
              latlong: latLongRegion,
            })
          : setDropoffData({
              address: addressItem,
              reciptName: reciptName,
              contact: contact,
              notes: notes,
              latlong: latLongRegion,
            })
      )
        ? navigation.pop(2)
        : null;
    }
  };

  return (
    <SafeAreaView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
        backgroundColor: palette.white,
        marginTop: StatusBar.currentHeight,
      }}
    >
      <PickupLocation
        addressItemData={addressItem}
        flagName={tempFlag}
        handleInput={(name, value) =>
          name === "location"
            ? setAddressItem(value)
            : name === "reciptName"
            ? setReciptName(value)
            : name === "contact"
            ? setContact(value)
            : name === "notes"
            ? setNotes(value)
            : ""
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1, position: "relative", bottom: 0, padding: 15 }}
      >
        {/* <MapView
          style={{
            width: "100%",
            height: 365,
            top: 0,
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          zoomEnabled={true}
          minZoomLevel={16}
          initialRegion={initialRegions}
          scrollMap={true}
          onRegionChange={(e) => {
            setLatLongRegion({
              lat: e.latitude,
              lng: e.longitude,
            });
          }}
        /> */}
        <MapView
          style={{
            width: "100%",
            height: 365,
            top: 0,
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          // minZoomLevel={16}
          initialRegion={initialRegions}
          showsUserLocation={true}
          userLocationPriority="high"
          onRegionChange={(e) => {
            setLatLongRegion({
              lat: e.latitude,
              lng: e.longitude,
            });
          }}
        />
        <Image
          source={require("../../img/location-ios.png")}
          style={{
            width: 25,
            height: 35,
            flexDirection: "row",
            position: "absolute",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            top: 164,
          }}
        />
      </KeyboardAvoidingView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.nextBtn,
          { marginBottom: Platform.OS == "ios" ? 25 : 0 },
        ]}
        onPress={HandleButton}
      >
        <Text
          style={[
            textStyles.mdTextBold,
            { color: palette.white, fontWeight: "700", fontSize: 17 },
          ]}
        >
          {`Set ${tempFlag == "pick" ? "Pick-up" : "Drop-off"} Location`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  DeliveryBackButton: {
    marginTop: 5,
    // paddingBottom: 10,
  },
  nextBtn: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
    backfaceVisibility: "visible",
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    paddingHorizontal: 70,
    marginHorizontal: 20,
  },
};

export default PickUp;
