import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Image,
  Platform,
} from "react-native";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/AntDesign";
import { updateProfileAPI } from "../../http/index";
import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import formInputs from "@styles/formInputs.styles";
import { LoadingOverlay } from "@components/common/";
import * as ImagePicker from "react-native-image-picker";
import { ImagePickerModal } from "./components/ImagePickerModal";
import { setUser } from "../../slices/authSlice";
import { getUserProfile } from "../../http/index";
import MessagePopup from "../../components/common/MessagePopup";

const EditProfile = () => {
  const { userdata } = useSelector((state) => state.user);
  const { userSocialName } = useSelector((state) => state.user);
  const { userSocialImage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null);

  const [userProfile, setUserProfile] = useState(userdata);
  const [validator, setValidator] = useState(null);
  const [imageData, setImageData] = useState();

  // refs
  const nameRef = useRef(null);
  const mobilenoRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    async function init() {
      try {
        LoadingOverlay.show("Fetching data...");
        const userProfileData = await getUserProfile();
        if (userProfileData.data.success) {
          setUserProfile(userProfileData.data.userDetail);
          dispatch(setUser(userProfileData.data.userDetail));
          LoadingOverlay.hide();
        } else {
          LoadingOverlay.hide();
          MessagePopup.show({
            title: "Network Error",
            message: "Geting Profile failed!",
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
        }
      } catch (err) {
        LoadingOverlay.hide();
        throw err;
      }
    }
    init();
  }, []);

  const onImageLibraryPress = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: "photo",
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        throw response.error;
      } else if (response.customButton) {
      } else {
        setImageSource(response.assets[0].uri);
        setImageData(response.assets[0]);
        setVisible(false);
      }
    });
  }, []);

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
          setImageSource(response.assets[0].uri);
          setImageData(response.assets[0]);
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
            setImageSource(response.assets[0].uri);
            setImageData(response.assets[0]);
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

  const submitForm = async () => {
    const { email, phone } = userProfile;
    const full_name = userProfile.full_name
      ? userProfile.full_name
      : userSocialName;
    const phone_regx = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    const email_regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (full_name == undefined || full_name == null || full_name == "") {
      MessagePopup.show({
        title: "Required!",
        message: "Please enter your name",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              nameRef.current.focus();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
    } else if (!full_name || full_name.length < 3) {
      MessagePopup.show({
        title: "Required!",
        message: "Please enter your full name",
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              nameRef.current.focus();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
    } else {
      const params = {
        email: email,
        full_name: full_name,
        image: imageData?.base64,
        phone: phone,
      };
      try {
        LoadingOverlay.show("Saving Profile");
        const response = await updateProfileAPI(params);
        if (response.data.success) {
          dispatch(setUser(response.data.userDetail));
          setUserProfile(response.data.userDetail);
          setImageSource(null);
          LoadingOverlay.hide();
          MessagePopup.show({
            title: "Success!",
            message: "Profile Updated Successfully",
            actions: [
              {
                text: "Okay",
                action: () => {
                  MessagePopup.hide();
                  navigation.replace("DashboardRoute");
                },
              },
            ],
            closeOnOverlayPress: false,
          });
        } else {
          MessagePopup.show({
            title: "Error",
            message: response?.data?.errors[0]?.message,
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
          LoadingOverlay.hide();
        }
      } catch (error) {
        LoadingOverlay.hide();
        MessagePopup.show({
          title: "Error",
          message: response?.data?.errors[0]?.message,
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
        // throw error;
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ backgroundColor: palette.white }}>
        <View backgroundColor={palette.yellow} style={styles.headerLogoWrapper}>
          <Image
            resizeMode="stretch"
            source={require("@img/logo.png")}
            style={styles.logoHeader}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.landing}>
          <View style={styles.headerTitle}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Create Account</Text>
              <Text style={{ fontSize: 12 }}>Basic Information</Text>
            </View>
            <Image
              resizeMode="stretch"
              source={require("@img/login-title-right-img.png")}
              style={styles.TitleRightImg}
            />
          </View>
          <View style={styles.ProfilePhotoSec}>
            <View style={styles.ProfilePhoto}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setVisible(true);
                }}
              >
                <Image
                  resizeMode="cover"
                  source={
                    imageSource
                      ? { uri: imageSource, cache: "force-cache" }
                      : userProfile?.image
                      ? { uri: userProfile?.image, cache: "force-cache" }
                      : require("@img/logo.png")
                  }
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 100,
                    borderColor: "black",
                    alignSelf: "center",
                  }}
                />
                <View
                  onPress={() => {
                    setVisible(true);
                  }}
                  style={{
                    paddingBottom: 20,
                  }}
                >
                  <Icon size={30} style={styles.AddIcon} name="pluscircle" />
                </View>
              </TouchableOpacity>
              <ImagePickerModal
                isVisible={visible}
                onClose={() => setVisible(false)}
                onImageLibraryPress={onImageLibraryPress}
                onCameraPress={onCameraPress}
              />
            </View>
            <View style={styles.ImgRightContent}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#000",
                  marginBottom: 5,
                }}
              >
                Upload Profile Picture
              </Text>
              <Text style={{ fontSize: 12, color: "#000", width: "40%" }}>
                For security, please make sure your face is clearly visible.
                Avoid blurry or too dark photos.
              </Text>
            </View>
          </View>
          <View style={{ marginHorizontal: -10, marginTop: 40 }}>
            <Input
              ref={nameRef}
              maxLength={80}
              placeholder="Full Name"
              inputStyle={formInputs.input}
              onSubmitEditing={() => mobilenoRef.current.focus()}
              inputContainerStyle={
                validator && validator.errors && validator.errors.fullname
                  ? {
                      ...formInputs.inputContainer,
                      ...formInputs.inputContainerError,
                    }
                  : formInputs.inputContainer
              }
              labelStyle={[formInputs.label, textStyles.normalTextRegular]}
              onChangeText={(name) =>
                setUserProfile({ ...userProfile, full_name: name })
              }
              value={
                userProfile?.full_name == undefined ||
                userProfile?.full_name == null
                  ? userSocialName
                  : userProfile?.full_name
              }
            />
            <Input
              ref={mobilenoRef}
              inputStyle={formInputs.input}
              inputContainerStyle={
                validator && validator.errors && validator.errors.phone_number
                  ? {
                      ...formInputs.inputContainer,
                      ...formInputs.inputContainerError,
                    }
                  : formInputs.inputContainer
              }
              labelStyle={[formInputs.label, textStyles.normalTextRegular]}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              maxLength={12}
              onChangeText={(mobile_number) =>
                setUserProfile({ ...userProfile, phone: mobile_number })
              }
              value={userProfile?.phone}
              disabled={true}
            />

            {/* Edit mobile number button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginHorizontal: 10,
                marginTop: -20,
                alignSelf: "flex-end",
              }}
              onPress={() =>
                navigation.navigate("EditEmailMobile", {
                  oldData: userProfile?.phone,
                  type: "phone",
                })
              }
            >
              <Text
                style={{
                  color: palette.yellow,
                  marginBottom: 20,
                  fontWeight: "500",
                }}
              >
                {userProfile?.phone == null ? "Add mobile" : "Edit Mobile"}
              </Text>
            </TouchableOpacity>

            <Input
              inputStyle={formInputs.input}
              inputContainerStyle={
                validator && validator.errors && validator.errors.email
                  ? {
                      ...formInputs.inputContainer,
                      ...formInputs.inputContainerError,
                    }
                  : formInputs.inputContainer
              }
              labelStyle={[formInputs.label, textStyles.normalTextRegular]}
              placeholder="Email Address"
              onChangeText={(emailid) =>
                setUserProfile({ ...userProfile, email: emailid })
              }
              type="email"
              value={userProfile?.email}
              disabled={true}
            />
            {/* Edit email button */}
            {console.log(userProfile?.login_medium)}
            {userProfile?.login_medium == "rest-api" ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  marginHorizontal: 10,
                  marginTop: -20,
                  alignSelf: "flex-end",
                }}
                onPress={() =>
                  navigation.navigate("EditEmailMobile", {
                    oldData: userProfile?.email,
                    type: "email",
                  })
                }
              >
                <Text
                  style={{
                    color: palette.yellow,
                    marginBottom: 20,
                    fontWeight: "500",
                  }}
                >
                  {userProfile?.email == null ? "Add" : "Edit"} Email
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Add address button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginHorizontal: 10,
                marginTop: -10,
                marginBottom: 20,
                marginTop: 5,
                width: "20%",
              }}
              onPress={() => navigation.navigate("ManageAddress")}
            >
              <Text
                style={{
                  fontWeight: "500",
                  color: palette.yellow,
                }}
              >
                Addresses
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{}}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.signup}
              onPress={submitForm}
            >
              <Text style={[textStyles.mdTextBold, { color: palette.white }]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerLogoWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginRight: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  logoHeader: {
    maxWidth: 170,
    height: 50,
  },
  ImgRightContent: {
    marginLeft: 30,
  },
  AddIcon: {
    position: "absolute",
    left: 60,
    bottom: 10,
    borderRadius: 10,
    color: palette.yellow,
  },
  ProfileIcon: {
    Width: 75,
    height: 75,
  },
  ProfilePhoto: {
    position: "relative",
  },
  ProfilePhotoSec: {
    flexDirection: "row",
  },
  headerText: {
    fontSize: 18,
    color: palette.secondaryBlack,
    fontWeight: "bold",
  },
  headerTextContainer: {
    paddingRight: 30,
    flex: 1,
  },
  TitleRightImg: {
    width: 100,
    height: 25,
    marginRight: -0,
  },
  headerTitle: {
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 0,
  },
  header: {
    paddingVertical: 10,
    marginBottom: 50,
  },

  landing: {
    flex: 1,
    backgroundColor: palette.white,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  signup: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 5,
  },
  signupText: {
    fontSize: 18,
    color: palette.secondaryBlack,
  },
});

export default EditProfile;
