import React, { useState } from "react";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import textStyles from "@styles/textStyles.styles";
import { BackButton } from "../../../components/common/BackButton";
import palette from "../../../styles/palette.styles";
import formInputs from "@styles/formInputs.styles";
import { Input } from "react-native-elements";
import { MessagePopup } from "../../../components/common";

const DropupLocation = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackButton
          containerStyle={{
            backgroundColor: palette.lightGray,
          }}
          iconStyle={{ color: "#000" }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: palette.black,
            marginLeft: 10,
          }}
        >
          Drop-off
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Input
          inputStyle={[formInputs.input]}
          leftIcon={{ type: "entypo", name: "location-pin", size: 17 }}
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              borderWidth: 1,
              borderColor: "#ccc",
              marginHorizontal: -10,
              backgroundColor: "#fff",
              marginBottom: -20,
              paddingBottom: 0,
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Type the address ..."
          // onChangeText={(text) => {
          //   searchLocation(text);
          // }}
          // value={searchKeyword}
        />
        <Input
          // inputStyle={[formInputs.input]}
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              borderWidth: 1,
              borderColor: "#ccc",
              marginHorizontal: -10,
              backgroundColor: "#fff",
              marginBottom: -20,
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Recipient Name"
          // onChangeText={(pcode) => setPostCode(pcode)}
          // value={postCode}
        />
        <Input
          // inputStyle={[formInputs.input]}
          inputContainerStyle={[
            formInputs.inputContainer,
            {
              borderWidth: 1,
              borderColor: "#ddd",
              marginHorizontal: -10,
              backgroundColor: "#fff",
              marginBottom: -20,
            },
          ]}
          labelStyle={[formInputs.label, textStyles.normalTextRegular]}
          placeholder="Recipient Name"
          // onChangeText={(pcode) => setPostCode(pcode)}
          // value={postCode}
        />
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
          placeholder="Notes (Optional)"
          // onChangeText={(pcode) => setPostCode(pcode)}
          // value={postCode}
        />
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            MessagePopup.show({
              message: "Modal has been closed.",
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
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Image
                  resizeMode="stretch"
                  source={require("@img/online-training.png")}
                />
              </View>
              <Text style={styles.modalTitle}>
                Delivery distance is too far!
              </Text>
              <Text style={styles.ModalDec}>
                The maximum delivery distance is only up to 100KM
              </Text>
              <Pressable
                style={styles.OkayButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Okay</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  OkayButton: {
    backgroundColor: palette.yellow,
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 8,
    width: "90%",
    paddingVertical: 15,
  },
  ModalDec: {
    fontSize: 15,
    color: "#2C2C2E",
    marginBottom: 15,
    fontWeight: "400",
    width: "70%",
    textAlign: "center",
  },
  ModalHeader: {
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 33,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000006b",
  },
  modalView: {
    width: "92%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 30,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
    width: 180,
    fontSize: 21,
  },
});

export default DropupLocation;
