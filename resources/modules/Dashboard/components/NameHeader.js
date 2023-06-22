import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, Text, TouchableOpacity, Alert } from "react-native";

import textStyles from "@styles/textStyles.styles";
import { MessagePopup } from "@components/common/";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const NameHeader = ({
  user,
  navigation,
  handleLogout,
  defaulData,
  deleteAccount,
}) => {
  const [profileImage, setProfileImage] = useState();
  const [isValid, setIsValid] = useState(true);
  const { userSocialName } = useSelector((state) => state.user);

  return (
    <View style={styles.nameHeader}>
      <Text style={[textStyles.weight.bold, textStyles.size.lg, { flex: 7 }]}>
        Hello{" "}
        {user?.full_name != "" &&
        user.full_name != undefined &&
        user.full_name != null
          ? user?.full_name
          : defaulData?.fname
          ? defaulData?.fname
          : userSocialName}
        !
      </Text>
      <View style={styles.profile}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            MessagePopup.show({
              title: "Account action",
              actions: [
                {
                  text: "View cart",
                  action: () => {
                    navigation.navigate("MyCart");
                    MessagePopup.hide();
                  },
                },
                {
                  text: "Edit Profile",
                  action: () => {
                    navigation.navigate("Account");
                    MessagePopup.hide();
                  },
                },
                {
                  text: "Manage Address",
                  action: () => {
                    navigation.navigate("ManageAddress");
                    MessagePopup.hide();
                  },
                },
                {
                  text: "Add Address",
                  action: () => {
                    navigation.navigate("EditAddress");
                    MessagePopup.hide();
                  },
                },
                {
                  text: "Delete Account",
                  action: () => {
                    MessagePopup.show({
                      title: "Action",
                      message: `Are you sure you want to delete your account?`,
                      actions: [
                        {
                          text: "Okay",
                          action: () => {
                            MessagePopup.hide();
                            deleteAccount();
                          },
                        },
                        {
                          text: "Cancel",
                          action: () => {
                            MessagePopup.hide();
                          },
                        },
                      ],
                      closeOnOverlayPress: false,
                    });
                  },
                },
                {
                  text: "Logout",
                  action: () => {
                    MessagePopup.show({
                      title: "Logout!",
                      message: `Are you sure want to logout!`,
                      actions: [
                        {
                          text: "Okay",
                          action: () => {
                            MessagePopup.hide();
                            handleLogout();
                          },
                        },
                        {
                          text: "Cancel",
                          action: () => {
                            MessagePopup.hide();
                            // handleLogout();
                          },
                        },
                      ],
                      closeOnOverlayPress: false,
                    });
                  },
                },
                {
                  text: "Close",
                  action: () => {
                    MessagePopup.hide();
                  },
                },
              ],
            })
          }
        >
          <Image
            resizeMode="cover"
            onError={() => {
              setIsValid(false);
            }}
            source={
              isValid
                ? { uri: defaulData.image, cache: "force-cache" }
                : require("../../../img/account.png")
              // user?.image
              //   ? { uri: user?.image ? user?.image : defaulData?.image }
              //   : require("@img/account.png")
            }
            style={[
              styles.profileImage,
              {
                borderWidth: 1,
                borderColor: "#D3D3D3",
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  nameHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignSelf: "flex-end",
  },
};

export { NameHeader };
