import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import formInputs from "@styles/formInputs.styles";
import textStyles from "@styles/textStyles.styles";
import * as InputValidator from "../../../helpers/InputValidator";
import palette from "../../../styles/palette.styles";
import Checkcircle from "react-native-vector-icons/AntDesign";
import { Input } from "react-native-elements";
import { MessagePopup } from "../../../components/common";

const DATA = [
  {
    id: 1,
    title: "Gcash",
    img: require("@img/Gcash.png"),
  },
  {
    id: 2,
    title: "COD",
    img: require("@img/COD.png"),
  },
  {
    id: 3,
    title: "Credit/Debit card",
    img: require("@img/debit-card.png"),
  },
];

const Item = ({ item, onPress, backgroundColor, borderColor, iconName }) => (
  <>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.item,
        backgroundColor,
        borderColor,
        {
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 6,
          marginBottom: 8,
        },
      ]}
    >
      {iconName != "" ? (
        <Checkcircle
          name={iconName}
          size={18}
          style={{
            color: palette.yellow,
            position: "absolute",
            right: 10,
            top: 16,
          }}
        />
      ) : (
        <></>
      )}

      <Image
        source={item.img}
        resizeMode="contain"
        style={{
          padding: 5,
          marginRight: 10,
        }}
      />
      <Text
        style={{
          color: palette.black,
          fontSize: 16,
          fontWeight: "400",
          marginStart: 12,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  </>
);

export function ImagePickerModal({
  isVisible,
  onClose,
  onImageLibraryPress,
  onCameraPress,
  _setPaymentMethod,
  _handleVisibleModal,
  _handleCardData,
}) {
  const [scrollOffset, setScrollOffset] = useState(null);
  const scrollViewRef = React.createRef();
  const [validator, setValidator] = useState(null);

  const cardHolderRef = useRef();
  const [cardHolderError, setCardHolderError] = useState();
  const cartNumRef = useRef();
  const [cardNumberError, setCardNumberError] = useState();
  const expiryRef = useRef();
  const [expiryError, setExpiryError] = useState();
  const cvvRef = useRef();
  const [cvvError, setCvvError] = useState();

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const [selectedId, setSelectedId] = useState(null);
  const [editData, setEditData] = useState();

  const submitPaymentMethord = () => {
    // _handleCardData(selectedId == 3 ? editData : null);

    // if (selectedId == 3) {
    //   if (
    //     editData?.fullname == null ||
    //     editData?.fullname == "" ||
    //     editData?.fullname == undefined
    //   ) {
    //     setCardHolderError(true);
    //   } else if (
    //     editData?.cardNumber == null ||
    //     editData?.cardNumber == "" ||
    //     editData?.cardNumber == undefined
    //   ) {
    //     setCardNumberError(true);
    //   } else if (
    //     editData?.expiryDate == null ||
    //     editData?.expiryDate == "" ||
    //     editData?.expiryDate == undefined
    //   ) {
    //     setExpiryError(true);
    //   } else if (
    //     editData?.cvv == null ||
    //     editData?.cvv == "" ||
    //     editData?.cvv == undefined
    //   ) {
    //     setCvvError(true);
    //   } else {
    //     _handleVisibleModal(false);
    //     _setPaymentMethod(
    //       DATA.find((d) => {
    //         if (d.id == selectedId) {
    //           return d;
    //         }
    //       })
    //     );
    //   }
    // } else {
    _handleVisibleModal(false);
    _setPaymentMethod(
      DATA.find((d) => {
        if (d.id == selectedId) {
          console.log("PYMENT selction -> ", d.id, selectedId);
          return d;
        }
      })
    );
    // }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection={["down"]}
      onSwipeComplete={onClose}
      scrollTo={(e) => handleScrollTo(e)}
      scrollOffset={scrollOffset}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      hasBackdrop={true}
      scrollOffsetMax={400 - 300} // content height - ScrollView height
      propagateSwipe={true}
    >
      <SafeAreaView style={styles.buttons}>
        <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
          <View
            style={{
              height: 7,
              width: 170,
              backgroundColor: "#ddd",
              borderRadius: 4,
              marginTop: 10,
              alignSelf: "center",
            }}
          ></View>
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 20,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={(e) => handleOnScroll(e)}
          >
            <View>
              <Text
                style={{
                  marginBottom: 20,
                  marginTop: 15,
                  fontSize: 18,
                  color: palette.black,
                }}
              >
                Select payment option
              </Text>
              <SafeAreaView>
                {DATA.map((item) => {
                  const backgroundColor =
                    item.id === selectedId ? "#FFEFD3" : "#f5f5f8";
                  const borderColor =
                    item.id === selectedId ? "#FFB531" : "#f5f5f8";
                  const iconName = item.id === selectedId ? "checkcircle" : "";

                  return (
                    <Item
                      item={item}
                      key={`${item.id}_item`}
                      onPress={() => {
                        setSelectedId(item.id);
                      }}
                      backgroundColor={{ backgroundColor }}
                      borderColor={{ borderColor }}
                      iconName={iconName}
                    />
                  );
                })}
              </SafeAreaView>
              {/* {selectedId === 3 ? (
                <View style={{ marginHorizontal: -10, marginTop: 20 }}>
                  <Input
                    ref={cardHolderRef}
                    label={"Card Holder Name"}
                    placeholder="Card Holder Name"
                    inputStyle={
                      cardHolderError
                        ? {
                            ...formInputs.input,
                            borderBottomColor: "red",
                            borderBottomWidth: 1,
                          }
                        : formInputs.input
                    }
                    inputContainerStyle={
                      validator && validator.errors && validator.errors.fullname
                        ? {
                            ...formInputs.inputContainer,
                            ...formInputs.inputContainerError,
                          }
                        : formInputs.inputContainer
                    }
                    labelStyle={[
                      formInputs.label,
                      textStyles.normalTextRegular,
                    ]}
                    onBlur={() => {
                      setCardHolderError(false);
                    }}
                    onChangeText={(name) => {
                      setEditData({ ...editData, fullname: name });
                    }}
                  />
                  <Input
                    ref={cartNumRef}
                    label={"Card Number"}
                    placeholder="Card Number"
                    inputStyle={
                      cardNumberError
                        ? {
                            ...formInputs.input,
                            borderBottomColor: "red",
                            borderBottomWidth: 1,
                          }
                        : formInputs.input
                    }
                    inputContainerStyle={
                      validator && validator.errors && validator.errors.fullname
                        ? {
                            ...formInputs.inputContainer,
                            ...formInputs.inputContainerError,
                          }
                        : formInputs.inputContainer
                    }
                    labelStyle={[
                      formInputs.label,
                      textStyles.normalTextRegular,
                    ]}
                    onBlur={() => {
                      setCardNumberError(false);
                    }}
                    onChangeText={(_data) => {
                      setEditData({ ...editData, cardNumber: _data });
                    }}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                      <Input
                        ref={expiryRef}
                        label={"Expiry Date"}
                        placeholder="Expiry Date"
                        inputStyle={
                          expiryError
                            ? {
                                ...formInputs.input,
                                borderBottomColor: "red",
                                borderBottomWidth: 1,
                              }
                            : formInputs.input
                        }
                        inputContainerStyle={
                          validator &&
                          validator.errors &&
                          validator.errors.fullname
                            ? {
                                ...formInputs.inputContainer,
                                ...formInputs.inputContainerError,
                              }
                            : formInputs.inputContainer
                        }
                        labelStyle={[
                          formInputs.label,
                          textStyles.normalTextRegular,
                        ]}
                        onBlur={() => {
                          setExpiryError(false);
                        }}
                        onChangeText={(_data) => {
                          setEditData({ ...editData, expiryDate: _data });
                        }}
                      />
                    </View>
                    <View style={{ width: "50%" }}>
                      <Input
                        ref={cvvRef}
                        label={"CCV"}
                        placeholder="CCV"
                        inputStyle={
                          cvvError
                            ? {
                                ...formInputs.input,
                                borderBottomColor: "red",
                                borderBottomWidth: 1,
                              }
                            : formInputs.input
                        }
                        inputContainerStyle={
                          validator &&
                          validator.errors &&
                          validator.errors.fullname
                            ? {
                                ...formInputs.inputContainer,
                                ...formInputs.inputContainerError,
                              }
                            : formInputs.inputContainer
                        }
                        labelStyle={[
                          formInputs.label,
                          textStyles.normalTextRegular,
                        ]}
                        onBlur={() => {
                          setCvvError(false);
                        }}
                        onChangeText={(_data) => {
                          setEditData({ ...editData, cvv: _data });
                        }}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <></>
              )} */}

              <View
                style={{
                  marginTop: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: palette.yellow,
                    paddingHorizontal: 30,
                    paddingVertical: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30,
                  }}
                  onPress={() => {
                    submitPaymentMethord();
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },

  buttons: {
    backgroundColor: "white",
    // flexDirection: "row",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});
