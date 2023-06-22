import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import * as ImagePicker from "react-native-image-picker";
import { textStyles as text, common } from "@styles";
import OmsFormContext from "../../../contexts/omsFormContext";
import palette from "../../../styles/palette.styles";
import { Image } from "react-native";

const OmsForm = ({ userData, removeIdCard, getSelfieId, getSelfieShowPic }) => {
  const { form, onChange, toggleIdOptions } = useContext(OmsFormContext);

  const [tempIdn, setTempIdn] = useState("");
  const [selfieSource, setSelfieSource] = useState(userData?.selfie_with_id);
  // getSelfieShowPic(selfieSource);

  useEffect(() => {
    idOptions.forEach((i) => {
      i.value == userData.identity_type ? setTempIdn(i.label) : "";
    });
    setSelfieSource(userData?.selfie_with_id);
  }, [userData]);

  useEffect(() => {
    getSelfieShowPic(userData?.selfie_with_id);
  }, [selfieSource]);

  // Open Camera function
  const onCameraPress = useCallback(async () => {
    let options = {
      maxWidth: 720,
      maxHeight: 1280,
      quality: 0.5,
      storageOptions: {
        path: "images",
        mediaType: "photo",
      },
      includeBase64: true,
    };
    try {
      if (Platform.OS == "ios") {
        ImagePicker.launchCamera(options, async (response) => {
          setSelfieSource(response?.assets[0]?.uri);
          getSelfieId(response?.assets[0]?.base64);
          return;
        });
        return;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(options, async (response) => {
          if (response.assets) {
            setSelfieSource(response?.assets[0]?.uri);
            getSelfieId(response?.assets[0]?.base64);
          } else {
            console.log("Camera permission denied");
          }
        });
      }
    } catch (err) {
      console.log("Image picker Error:", err);
    }
  }, []);

  return (
    <View style={{ flex: 1, marginVertical: 20 }}>
      {formMap.map((input) => (
        <View key={`forminput${input.name}`} style={{ marginTop: 10 }}>
          <Text
            style={[text.size.xs, text.weight.regular, text.color.darkGray]}
          >
            {input.label}
          </Text>
          <View style={{ marginTop: -5 }}>
            <Input
              // disabled={input.label == "EMAIL" ? true : false}
              disabled={true}
              {...common.checkoutCouponInput}
              value={
                input.name == "email"
                  ? userData.email
                  : input.name == "name"
                  ? userData.full_name
                  : input.name == "contact_number"
                  ? userData.phone
                  : ""
              }
              onChangeText={(value) => {
                onChange({ value, name: input.name });
              }}
              maxLength={input.label == "CONTACT NO." ? 13 : null}
              {...input.inputProps}
            />
          </View>
        </View>
      ))}

      {/* Selfi with id */}
      <View style={{ marginTop: 10 }}>
        <Text style={[text.size.xs, text.weight.regular, text.color.darkGray]}>
          SELFIE WITH ID
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={selfieSource ? true : false}
          onPress={() => onCameraPress()}
        >
          <View style={[common.select, { marginTop: 7 }]}>
            <Text style={[text.size.md, text.weight.regular]}>
              Click selfie with ID
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {selfieSource ? (
        <View
          style={{
            width: 70,
            height: 70,
            borderWidth: 1,
            borderColor: palette.yellow,
            borderRadius: 5,
            marginTop: 20,
            overflow: "hidden",
            marginBottom: Platform.OS == "ios" ? 0 : 20,
          }}
        >
          <Image
            style={{
              width: 70,
              height: 70,
              resizeMode: "cover",
              borderRadius: 5,
            }}
            source={{ uri: selfieSource, cache: "force-cache" }}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: palette.yellow,
              height: 20,
              width: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              position: "absolute",
              right: 3,
              top: 3,
            }}
            onPress={() => {
              // Remove Image
              setSelfieSource();
              getSelfieId();
            }}
          >
            <Icon color={"white"} size={14} name={"close"} />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}

      <View style={{ marginTop: 10 }}>
        <Text style={[text.size.xs, text.weight.regular, text.color.darkGray]}>
          GOVERNMENT ID
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={removeIdCard ? false : true}
          onPress={() => toggleIdOptions(true)}
        >
          <View style={[common.select, { marginTop: 7 }]}>
            <Text style={[text.size.md, text.weight.regular]}>
              {/* {form.id ? form.id.label : "Select"} */}
              {userData.identity_type && !removeIdCard && !form.id
                ? tempIdn
                : form.id
                ? form.id.label
                : "Select"}
            </Text>
            {removeIdCard ? <Icon name="chevron-right" size={15} /> : <></>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const idOptions = [
  { label: "Passport", value: "passport" },
  { label: "Driver’s license", value: "drivers-license" },
  { label: "SSS ID", value: "sss" },
  { label: "Voter’s ID", value: "voters" },
  { label: "National ID", value: "national" },
  { label: "Company ID", value: "company" },
];

const formMap = [{ label: "EMAIL", name: "email", inputProps: {} }];

export { OmsForm };
