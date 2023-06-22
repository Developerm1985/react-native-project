import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import palette from "../../styles/palette.styles";

export const MessagePopupRef = React.createRef();

export const processMessage = (props, ref, callback) => {
  if (ref.current) {
    ref.current.displayMessage(props);
    return callback ? callback() : true;
  }
  return false;
};

class MessagePopup extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      title: "",
      message: "",
      actions: [],
      closeOnOverlayPress: true,
      request: null,
      serviceProvider: null,
    };
  }

  static show = (props) => {
    if (!processMessage(props, MessagePopupRef)) {
      const waitingForMessagePopupRef = setInterval(() => {
        processMessage(props, MessagePopupRef, () => {
          clearInterval(waitingForMessagePopupRef);
        });
      }, 100);
    }
  };

  static hide = () => {
    const hideProps = {
      visible: false,
      title: "",
      message: "",
      actions: [],
      request: null,
      serviceProvider: null,
    };
    if (!processMessage(hideProps, MessagePopupRef)) {
      const waitingForMessagePopupRef = setInterval(() => {
        processMessage(hideProps, MessagePopupRef, () => {
          clearInterval(waitingForMessagePopupRef);
        });
      }, 100);
    }
  };

  displayMessage = (props) => {
    this.setState({
      ...{
        closeOnOverlayPress: Array.isArray(props.actions) ? false : true,
        visible: true,
        request: null,
        serviceProvider: null,
      },
      ...props,
    });
  };

  toggleVisible = () => {
    const visible = !this.state.visible;
    this.setState({ visible });
  };

  render() {
    const {
      visible,
      title,
      message,
      actions,
      closeOnOverlayPress,
      request,
      serviceProvider,
    } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <View style={styles.modalContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.modalOverlay}
          onPress={closeOnOverlayPress ? this.toggleVisible : null}
        />
        <View style={styles.messageContainer}>
          <Image
            resizeMode="stretch"
            style={styles.messageIcon}
            source={require("../../img/icon.png")}
          />
          {title !== "" && <Text style={styles.title}>{title}</Text>}
          {message !== "" && <Text style={styles.message}>{message}</Text>}
          {request && (
            <View style={styles.requestContainer}>
              <View style={styles.userInfoContainer}>
                <View style={styles.userImageContainer}>
                  <Image
                    resizeMode="stretch"
                    style={styles.userImage}
                    source={
                      request.job.customer.profile_image
                        ? {
                            uri: request.job.customer.profile_image,
                            cache: "force-cache",
                          }
                        : require("../../img/icon.png")
                    }
                  />
                </View>
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>
                    {request.job.customer.name}
                  </Text>
                  <Text style={styles.jobName}>{request.job.service.name}</Text>
                </View>
              </View>
              <View style={styles.dashedlineContainer}>
                <View style={styles.dashedline} />
              </View>
              {request.job.address.formatted_address && (
                <View style={styles.jobDetailRow}>
                  <Text style={styles.jobDetailTitle}>Location:</Text>
                  <View style={styles.jobDetailTextWithIcon}>
                    <Icon
                      name="map-marker-outline"
                      size={30}
                      color={palette.yellow}
                    />
                    <Text style={styles.jobDetailText}>
                      {request.job.address.formatted_address}
                    </Text>
                  </View>
                </View>
              )}
              {request.job.additional_instruction && (
                <View style={styles.jobDetailRow}>
                  <Text style={styles.jobDetailTitle}>Additional Details:</Text>
                  <Text style={styles.jobDetailTextPadded}>
                    {request.job.additional_instruction}
                  </Text>
                </View>
              )}
            </View>
          )}
          {serviceProvider && (
            <View style={styles.serviceProviderContainer}>
              <View style={styles.serviceProviderImageContainer}>
                <Image
                  resizeMode="stretch"
                  style={styles.serviceProviderImage}
                  source={
                    serviceProvider.profile_image
                      ? {
                          uri: serviceProvider.profile_image,
                          cache: "force-cache",
                        }
                      : require("../../img/icon.png")
                  }
                />
              </View>
              <Text style={styles.serviceProviderBusinessName}>
                {serviceProvider.business_name}
              </Text>
              <View style={styles.rateContainer}>
                <Icon
                  name="star"
                  size={20}
                  color={
                    serviceProvider.rating >= 1
                      ? palette.yellow
                      : palette.darkGray
                  }
                />
                <Icon
                  name="star"
                  size={20}
                  color={
                    serviceProvider.rating >= 2
                      ? palette.yellow
                      : palette.darkGray
                  }
                />
                <Icon
                  name="star"
                  size={20}
                  color={
                    serviceProvider.rating >= 3
                      ? palette.yellow
                      : palette.darkGray
                  }
                />
                <Icon
                  name="star"
                  size={20}
                  color={
                    serviceProvider.rating >= 4
                      ? palette.yellow
                      : palette.darkGray
                  }
                />
                <Icon
                  name="star"
                  size={20}
                  color={
                    serviceProvider.rating >= 5
                      ? palette.yellow
                      : palette.darkGray
                  }
                />
              </View>
            </View>
          )}
          {actions.map((item, key) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={key}
              style={
                item.buttonColor
                  ? {
                      ...styles.actionButton,
                      ...{ backgroundColor: item.buttonColor },
                    }
                  : styles.actionButton
              }
              onPress={item.action}
            >
              <Text
                style={{
                  ...styles.actionButtonText,
                  ...{ color: item.textColor || palette.white },
                }}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: palette.lightGray,
    opacity: 0.8,
  },
  messageContainer: {
    backgroundColor: palette.yellow,
    width: 320,
    minHeight: 250,
    alignSelf: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: "center",
  },
  messageIcon: {
    alignSelf: "center",
    height: 80,
    width: 80,
    position: "absolute",
    top: -40,
    borderRadius: 160,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    color: palette.secondaryBlack,
    fontWeight: "bold",
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    color: palette.secondaryBlack,
    marginTop: 12,
  },
  actionButton: {
    marginTop: 15,
    backgroundColor: palette.secondaryBlack,
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  requestContainer: {
    marginBottom: 12,
  },
  userInfoContainer: {
    minHeight: 90,
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  userImageContainer: {
    height: 70,
    width: 70,
    borderRadius: 140,
    marginRight: 10,
    overflow: "hidden",
  },
  userImage: {
    alignSelf: "center",
    height: 70,
    width: 70,
  },
  userTextContainer: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  userName: {
    color: palette.lightGray,
    fontSize: 18,
  },
  jobName: {
    color: palette.lightGray,
    fontWeight: "bold",
    fontSize: 18,
  },
  dashedlineContainer: {
    height: 2,
    position: "relative",
    marginHorizontal: -15,
    overflow: "hidden",
  },
  dashedline: {
    borderStyle: "dashed",
    borderRadius: 1,
    borderColor: palette.yellow,
    borderWidth: 2,
    borderTopWidth: 2,
    position: "absolute",
    width: "100%",
  },
  jobDetailRow: {
    position: "relative",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  jobDetailTitle: {
    color: palette.lightGray,
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  jobDetailTextWithIcon: {
    flexDirection: "row",
  },
  jobDetailText: {
    color: palette.lightGray,
    fontSize: 18,
  },
  jobDetailTextPadded: {
    color: palette.lightGray,
    fontSize: 18,
    paddingLeft: 10,
  },
  serviceProviderImageContainer: {
    alignSelf: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    borderRadius: 140,
    marginTop: 15,
    overflow: "hidden",
  },
  serviceProviderImage: {
    alignSelf: "center",
    height: 70,
    width: 70,
  },
  serviceProviderBusinessName: {
    color: palette.lightGray,
    fontWeight: "bold",
    fontSize: 18,
    paddingHorizontal: 10,
    textAlign: "center",
    marginTop: 5,
  },
  rateContainer: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default MessagePopup;
