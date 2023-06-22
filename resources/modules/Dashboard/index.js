import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import DashboardHeader from "@components/DashboardHeader";
import {
  NameHeader,
  WalletContainer,
  Categories,
  Restaurants,
} from "./components";
import palette from "@styles/palette.styles";
import dashboard from "@styles/dashboard.styles";
import { LoadingOverlay } from "@components/common/";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser, getAddressListAPI, logoutUser } from "../../http";
import { getUserProfile } from "../../http/index";
import { setUser, setUserAddress } from "../../slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { MessagePopup } from "../../components/common";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import { LoginManager } from "react-native-fbsdk-next";

const Dashboard = (props) => {
  const navigation = useNavigation();
  const { userdata: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userdata);
  const [defaulData, setDefaultData] = useState({});

  useEffect(() => {
    global.currentLocation = null;
    getUserDetails();
    getAddresses();
  }, []);

  async function getUserDetails() {
    try {
      const { data } = await getUserProfile();
      setDefaultData({
        fname: data?.userDetail?.full_name,
        image: data?.userDetail?.image,
      });
      return dispatch(setUser(data?.userDetail));
    } catch (e) {
      console.log(e);
    }
  }
  // When AppState is in Background that's time working Dynamic Links
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          navigateWithLink(link);
        }
      });

    // When AppState is in Foreground that's time working Dynamic Links
    let unsubscribe = null;
    if (global?.dynamic) {
      unsubscribe = dynamicLinks().onLink((links) => navigateWithLink(links));
    }
    return () => (unsubscribe != null ? unsubscribe() : unsubscribe);
  }, []);

  const navigateWithLink = (link) => {
    const url = new URL(link?.url);
    const urlParams = new URLSearchParams(url.search);
    const screenName = urlParams.get("screen");
    const id = urlParams.get("id");
    return navigation.navigate(screenName, { id: id });
  };

  const getAddresses = async () => {
    try {
      const { data } = await getAddressListAPI();
      if (data.success) {
        if (data?.default) {
          global.currentLocation = {
            latitude: data?.default?.latitude,
            longitude: data?.default?.longitude,
          };
        }
        return dispatch(setUserAddress(data?.default));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleComingSoon = (name) => {
    MessagePopup.show({
      title: "Coming soon!",
      message: `${name} will be available soon.`,
      actions: [
        {
          text: "Okay",
          action: () => {
            MessagePopup.hide();
          },
        },
      ],
    });
  };

  const handleLogout = async () => {
    LoadingOverlay.show("Logging Out...");
    try {
      const { data } = await logoutUser();
      if (data?.success) {
        if (user.login_medium == "google") GoogleSignin.signOut();
        if (user.login_medium == "facebook") LoginManager.logOut();
        await AsyncStorage.removeItem("user", async () => {
          LoadingOverlay.hide();
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        });
      }
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  };

  const userDelete = async () => {
    LoadingOverlay.show("Account Deleting...");
    try {
      const { data } = await deleteUser();
      LoadingOverlay.hide();
      if (data?.success) {
        await AsyncStorage.removeItem("user", async () => {
          LoadingOverlay.hide();
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        });
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor={palette.yellow} />
        <DashboardHeader />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View backgroundColor={palette.white} style={dashboard.scrollView}>
            <View style={dashboard.dashboardHeader}>
              {user && (
                <>
                  <NameHeader
                    user={userData}
                    handleLogout={() => handleLogout()}
                    deleteAccount={() => userDelete()}
                    navigation={props.navigation}
                    defaulData={defaulData}
                  />
                  <WalletContainer
                    credits={user && user.customer ? user.customer.credits : 0}
                    wallet={0}
                  />
                  <Categories handleComingSoon={handleComingSoon} />
                </>
              )}
            </View>
            <View style={dashboard.featured}>
              <Restaurants />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Dashboard;
