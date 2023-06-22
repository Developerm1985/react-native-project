import React from "react";
import { SafeAreaView, Text, Image, Pressable, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/AntDesign";
import File from "react-native-vector-icons/Octicons";

// import { images } from "../../assets";
import palette from "@styles/palette.styles";
export function ImagePickerModal({
  isVisible,
  onClose,
  onImageLibraryPress,
  onCameraPress,
}) {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <SafeAreaView style={styles.buttons}>
        <Pressable style={styles.button} onPress={onImageLibraryPress}>
          {/* <Image style={styles.buttonIcon} source={images.image} /> */}
          <File name="file-directory" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Library</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onCameraPress}>
          {/* <Image style={styles.buttonIcon} source={images.camera} /> */}
          <Icon name="camera" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  buttonIcon: {
    fontSize: 30,
    color: palette.yellow,
    margin: 10,
  },
  buttons: {
    backgroundColor: "white",
    flexDirection: "row",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
