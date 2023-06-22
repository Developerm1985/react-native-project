import React, { createRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Scanner, { RectangleOverlay } from "react-native-rectangle-scanner";
import palette from "./../../../styles/palette.styles";
import { useNavigation } from "@react-navigation/native";

const DocScanner = (props) => {
  // refs
  const cameraRef = createRef();
  const navigation = useNavigation();

  // Action here
  const onPictureTaken = (data) => {
    async function toDataURL(url, callback) {
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

    setTimeout(() => {
      toDataURL(data?.croppedImage, function (dataUrl) {
        let latest = dataUrl.split(",")[1];
        navigation.navigate("OneMoreStep", {
          collectionData: props.route.params,
          scannedData: latest,
          scanImages: data?.croppedImage,
        });
      });
    }, 1000);
  };

  const captureImage = () => {
    cameraRef?.current?.capture();
  };

  return (
    <>
      <View
        style={{
          flex: 1,
        }}
      >
        <Scanner
          capturedQuality={0.6}
          onPictureTaken={onPictureTaken}
          ref={cameraRef}
          style={styles.cameraContainer}
          onRectangleDetected={({ detectedRectangle }) => {
            console.log("This is Detect ", detectedRectangle);
          }}
        />

        {/* Border here */}
        <View style={styles.borderView}></View>
        <View style={styles.innerBorder}></View>

        <View style={styles.textView}>
          <Text style={styles.headingText}>
            Take a picture within the frame
          </Text>
          <Text style={styles.childText}>
            Make sure that there are no shadows and the document is readable
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionStyle]}
            onPress={() => captureImage()}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Take a picture
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  borderView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    borderBottomColor: "#ffffffc9",
    borderBottomWidth: 180,
    borderTopColor: "#ffffffc9",
    borderTopWidth: 100,
    borderLeftColor: "#ffffffa1",
    borderLeftWidth: 15,
    borderRightColor: "#ffffffa1",
    borderRightWidth: 15,
  },
  innerBorder: {
    position: "absolute",
    bottom: 180,
    left: 15,
    top: 100,
    right: 15,
    // backgroundColor: "red",
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#fff",
  },
  textView: {
    position: "absolute",
    backgroundColor: "transparent",
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: "center",
  },
  headingText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },
  childText: {
    fontSize: 14,
    width: "80%",
    textAlign: "center",
    justifyContent: "center",
    color: "#000",
  },
  actionStyle: {
    backgroundColor: palette.yellow,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: "90%",
  },
});

export default DocScanner;
