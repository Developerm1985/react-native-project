import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Button,
} from "react-native";
import Modal from "react-native-modal";
import { palette } from "../../styles";

const CanclePopup = ({ isModalVisible, handleModalTogle, callNext }) => {
  return (
    <TouchableWithoutFeedback>
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
            paddingHorizontal: 20,
            paddingVertical: 20,
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
          <Image
            style={{
              alignSelf: "flex-start",
              marginBottom: 35,
              marginTop: -20,
              marginLeft: -20,
            }}
            source={require("@img/conflicting-time.png")}
          />
          <View style={{ marginBottom: 25, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 21,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 15,
              }}
            >
              Cancellations Order
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#2C2C2E",
                marginBottom: 10,
                width: 250,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                lineHeight: 25,
              }}
            >
              please given to reason why you cancel this order
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              handleModalTogle(false);
              callNext(true);
            }}
            style={{
              backgroundColor: "#F73F3F",
              paddingHorizontal: 35,
              paddingVertical: 15,
              borderRadius: 30,
              width: "90%",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Understood
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default CanclePopup;
