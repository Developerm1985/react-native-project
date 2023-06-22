import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { palette } from "../../styles";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { LoadingOverlay, MessagePopup } from "../../components/common";
import { cancelOrderReason, orderCancel, riderCancelOrder } from "../../http";
import { useNavigation } from "@react-navigation/native";

const CancelDelivery = ({ isModalVisible, handleModalTogle, order_id }) => {
  const [changeDescription, onChangeDescription] = React.useState(null);
  const [value, setValue] = useState(null);
  const [lable, setLable] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();
  const [data, setData] = useState();

  const getReason = async () => {
    try {
      const { data } = await cancelOrderReason();
      setData(data?.data);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getReason();
  }, []);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "#FFBB00" }]}>
          Reason for Cancellation *
        </Text>
      );
    }
    return null;
  };

  const cancelOrder = async () => {
    const params = {
      reason: lable == "Other" ? changeDescription : lable,
      order_id: order_id,
    };
    try {
      handleModalTogle(false);
      LoadingOverlay.show("Cancelling Order...");
      const { data } = await orderCancel(params);
      LoadingOverlay.hide();
      data?.success
        ? navigation.reset({
            index: 0,
            routes: [{ name: "DashboardRoute" }],
          })
        : MessagePopup.show({
            title: "Warning!",
            message: data?.message,
            actions: [
              {
                text: "OKAY",
                action: () => {
                  MessagePopup.hide();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "DashboardRoute" }],
                  });
                },
              },
            ],
          });
    } catch (err) {
      LoadingOverlay.hide();
      throw err;
    }
  };
  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={() => handleModalTogle(false)}
    >
      <View
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 35,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleModalTogle(false);
          }}
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            top: 5,
            right: 5,
          }}
        >
          <Image
            style={{
              width: 20,
              height: 20,
            }}
            source={require("@img/remove-button.png")}
          />
        </TouchableOpacity>
        <View style={{ marginBottom: 5, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 21,
              color: "#000000",
              fontWeight: "600",
              marginBottom: 5,
              textAlign: "center",
              lineHeight: 35,
              width: 300,
            }}
          >
            Are you sure you want cancel this delivery?
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#2C2C2E",
              marginBottom: 10,
              width: 300,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              lineHeight: 25,
            }}
          >
            If yes, please provide this information:
          </Text>
        </View>

        <View style={{ width: "100%", marginBottom: 20 }}>
          <View style={styles.container}>
            {renderLabel()}
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "#FFBB00" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={data}
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder={
                !isFocus ? "Reason for Cancellation *" : "Pick a reason"
              }
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setLable(item.label);
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          {lable == "Other" && (
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                onChangeDescription(text);
              }}
              value={changeDescription}
              placeholder="Reason"
            />
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            cancelOrder();
          }}
          style={{
            backgroundColor:
              lable == "Other" && changeDescription != ""
                ? "#F73F3F"
                : lable != ""
                ? "#F73F3F"
                : "grey",
            paddingHorizontal: 35,
            paddingVertical: 15,
            borderRadius: 30,
            width: "90%",
          }}
          disabled={
            lable == "Other" && changeDescription != ""
              ? false
              : lable != ""
              ? false
              : true
          }
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            Cancel Delivery
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CancelDelivery;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 45,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#000000",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  // inputSearchStyle: {
  //   height: 40,
  //   fontSize: 16,
  // },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 30,
    color: "#000",
  },
});
