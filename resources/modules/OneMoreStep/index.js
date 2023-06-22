import React, { useState, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  PermissionsAndroid,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { palette, textStyles as text } from "@styles";

// oms = one more step
import {
  OmsHeader,
  OmsProfilePhoto,
  OmsForm,
  OmsIdOptions,
} from "./components";
import * as Layout from "@components/Layout";

import OmsFormContext from "../../contexts/omsFormContext";
import { ImagePickerModal } from "../Authentication/components/ImagePickerModal";
import * as ImagePicker from "react-native-image-picker";
import { getOneMoreStep, oneMoreStep } from "../../http";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/authSlice";
import MessagePopup from "../../components/common/MessagePopup";
import { SafeAreaView } from "react-native-safe-area-context";

const OneMoreStep = (props) => {
  const [form, setForm] = useState({});
  const [imageSource, setImageSource] = useState();
  const [idOptionsOpen, setIdOptionsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [imageData, setImageData] = useState();
  const [tempNav, setTempNav] = useState(props?.route?.params?.fromCart);

  const [userData, setUserData] = useState({});
  const [removeIdCard, setRemoveIdCard] = useState(false);
  const [selfieDocument, setSelfieDocument] = useState();
  const [picSelfie, setPicSelfie] = useState();

  useEffect(() => {
    async function onLoad() {
      try {
        LoadingOverlay.show("Loading...");
        const { data } = await getOneMoreStep();
        setUserData(data.userDetail);
        setRemoveIdCard(
          data?.userDetail?.identity_image == "" ||
            data?.userDetail?.identity_image === null
            ? true
            : false
        );

        data?.userDetail?.selfie_with_id &&
          toDataURL(data?.userDetail?.selfie_with_id, function (dataUrl) {
            let latest = dataUrl.split(",")[1];
            setSelfieDocument(latest);
          });

        LoadingOverlay.hide();
      } catch (error) {
        LoadingOverlay.hide();
        throw error;
      }
    }
    onLoad();
  }, []);

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  const selfiWithID = (value) => {
    setSelfieDocument(value);
  };

  const selfiePic = (value) => {
    setPicSelfie(value);
  };

  const onImageLibraryPress = useCallback(() => {
    const options = {
      maxHidth: 800,
      maxHeight: 600,
      quality: 0.5,
      selectionLimit: 1,
      storageOptions: {
        path: "images",
        mediaType: "photo",
      },
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        throw response.error;
      } else if (response.customButton) {
      } else {
        setImageSource(response?.assets[0]?.uri);
        setImageData(response?.assets[0]);
        setVisible(false);
      }
    });
  }, []);

  // Image Pick in camera
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
          setImageSource(response?.assets[0]?.uri);
          setImageData(response?.assets[0]);
          setVisible(false);
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
            setImageSource(response?.assets[0]?.uri);
            setImageData(response?.assets[0]);
            setVisible(false);
          } else {
            console.log("Camera permission denied");
          }
        });
      }
    } catch (err) {
      console.log("Image picker Error:", err);
    }
  }, []);

  // handle Form Data
  const handleOnChange = (input) => {
    setForm((prevForm) => {
      const newForm = { ...prevForm, imageSource };
      newForm[input.name] = input.value;
      return newForm;
    });

    input.name == "name"
      ? setUserData({
          ...userData,
          full_name: input.value,
        })
      : null;

    input.name == "contact_number"
      ? setUserData({ ...userData, phone: input.value })
      : null;
  };

  const submitOneMoreStep = async () => {
    if (selfieDocument == null || selfieDocument == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please capture your selfie with ID`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
    } else if (form?.id?.value == "" || form?.id?.value == undefined) {
      MessagePopup.show({
        title: "Required!",
        message: `Please select identity type`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
    } else if (
      props?.route?.params?.scannedData == "" ||
      props?.route?.params?.scannedData == undefined
    ) {
      MessagePopup.show({
        title: "Required!",
        message: `Please any one document scan`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
    } else {
      const params = {
        full_name: userData?.full_name,
        phone: userData?.phone,
        email: userData?.email,
        image: imageData?.base64,
        identity_type: form?.id?.value,
        identity_image: props?.route?.params?.scannedData,
        selfie_with_id: selfieDocument,
      };
      try {
        LoadingOverlay.show("Please wait...");
        const { data } = await oneMoreStep(params);
        if (data?.success) {
          dispatch(setUser(data?.data));
          LoadingOverlay.hide();
          if (tempNav) {
            navigation.goBack();
          } else {
            MessagePopup.show({
              title: "Success!",
              message: "Your request has been submitted successfully",
              actions: [
                {
                  text: "Okay",
                  action: () => {
                    MessagePopup.hide();
                    navigation.replace("DashboardRoute");
                  },
                },
              ],
            });
          }
        } else {
          LoadingOverlay.hide();
          MessagePopup.show({
            title: "Error!",
            message: "Something went wrong",
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
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout.Wrapper
        statusBarProps={{ backgroundColor: palette.yellow }}
        style={{ backgroundColor: "#fff" }}
      >
        <OmsFormContext.Provider
          value={{
            form,
            onChange: handleOnChange,
            idOptionsOpen,
            toggleIdOptions: (status) => setIdOptionsOpen(status),
          }}
        >
          <View style={{ flex: 1, padding: 20 }}>
            <OmsHeader />
            <Layout.Scroll>
              <OmsProfilePhoto
                imageSource={imageSource ? imageSource : userData?.image}
                onPress={() => {
                  setVisible(true);
                }}
              />
              <OmsForm
                userData={userData}
                removeIdCard={removeIdCard}
                getSelfieId={selfiWithID}
                getSelfieShowPic={selfiePic}
              />

              {props?.route?.params?.scanImages ? (
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderWidth: 1,
                    borderColor: palette.yellow,
                    borderRadius: 5,
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
                    source={{
                      uri: props?.route?.params?.scanImages,
                      cache: "force-cache",
                    }}
                  />
                </View>
              ) : (
                <></>
              )}

              {removeIdCard ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => submitOneMoreStep()}
                  >
                    <Text
                      style={[
                        text.size.mlg,
                        text.color.white,
                        text.weight.bold,
                        text.align.center,
                      ]}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderWidth: 1,
                    borderColor: palette.yellow,
                    borderRadius: 5,
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
                    source={{
                      uri: userData?.identity_image,
                      cache: "force-cache",
                      // props?.route?.params?.scanImages
                    }}
                  />

                  <TouchableOpacity
                    activeOpacity={0.8}
                    chableOpacity
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
                      setRemoveIdCard(true);
                    }}
                  >
                    <Icon color={"white"} size={14} name={"close"} />
                  </TouchableOpacity>
                </View>
              )}

              {/* {removeIdCard ? (
                <>
                  <TouchableOpacity activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => submitOneMoreStep()}
                  >
                    <Text
                      style={[
                        text.size.mlg,
                        text.color.white,
                        text.weight.bold,
                        text.align.center,
                      ]}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )} */}
            </Layout.Scroll>
          </View>
          <ImagePickerModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            onImageLibraryPress={onImageLibraryPress}
            onCameraPress={onCameraPress}
          />
          <OmsIdOptions formData={form} />
        </OmsFormContext.Provider>
      </Layout.Wrapper>
    </SafeAreaView>
  );
};

const styles = {
  button: {
    padding: 20,
    backgroundColor: palette.yellow,
    borderRadius: 10,
  },
};

export default OneMoreStep;
