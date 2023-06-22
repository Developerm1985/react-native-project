import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import * as helperActions from "@actions/helper.actions";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; // TODO CHANGE THIS
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import palette from "@styles/palette.styles";
import { LoadingOverlay, MessagePopup } from "./";

class MapPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      selectedLocation: {},
      seletecdLocationAddress: "",
    };
  }

  // componentDidMount = () => {
  //   const { current } = this?.props?.location;

  //   this.setState({
  //     region: {
  //       ...this.state?.region,
  //       ...current,
  //     },
  //   });
  // };

  onRegionChange = (locationData) => {
    const { latitude, longitude } = locationData;
    this.setState({
      selectedLocation: {
        latitude,
        longitude,
      },
    });
  };

  pickLocation = () => {
    let { selectedLocation } = this.state;
    if (this.props?.appRegistration) {
      selectedLocation = {
        ...selectedLocation,
        ...{ appRegistration: this.props?.appRegistration },
      };
    }

    this.setState({ loading: true });
    LoadingOverlay.show("Fetching location data.");

    this.props.actions
      .getGeocode({ ...selectedLocation, ...{ appRegistration: true } })
      .then((res) => {
        this.setState({ loading: false });
        LoadingOverlay.hide();
        if (res.payload.success) {
          const json = res.payload.data;
          const input = {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            formatted_address: json.results[0].formatted_address,
            addressComponent: json.results[0].address_components,
          };
          MessagePopup.show({
            title: "Confirm location address",
            message: json.results[0].formatted_address,
            actions: [
              {
                text: "CONFIRM",
                action: () => {
                  MessagePopup.hide();
                  this.setState({
                    seletecdLocationAddress: json.results[0].formatted_address,
                  });
                  this.props?.actions.confirmGeocode(res.payload);
                  this.props?.onMapPick(input);
                },
              },
              {
                text: "CANCEL",
                action: () => {
                  MessagePopup.hide();
                },
              },
            ],
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        LoadingOverlay.hide();
      });
  };

  render() {
    let { active } = this.props;

    return active ? (
      <View style={styles.MapPickerContainer}>
        <View style={styles.mapContainer}>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.MapView}
              provider={PROVIDER_GOOGLE}
              initialRegion={this.state.region}
              showsUserLocation={true}
              userLocationPriority="high"
              onRegionChangeComplete={this.onRegionChange}
            />
            <View style={styles.mapMarkerContainer}>
              <Icon
                style={styles.mapMarker}
                name="map-marker"
                size={40}
                color={palette.yellow}
              />
            </View>
          </View>
          <View style={styles.pickBoxContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.pickButton}
              onPress={() => this.pickLocation()}
            >
              <Text style={styles.actionButtonText}>PICK THIS LOCATION</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  MapPickerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.yellow,
    zIndex: 1,
  },
  mapContainer: {
    height: "100%",
    justifyContent: "flex-end",
    position: "relative",
  },
  mapWrapper: {
    height: "100%",
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  mapMarkerContainer: {
    position: "relative",
  },
  mapMarker: {
    color: palette.yellow,
    marginTop: -35,
  },
  MapView: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  pickBoxContainer: {
    marginBottom: 20,
    paddingHorizontal: "12%",
  },
  pickButton: {
    backgroundColor: palette.secondaryBlack,
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: palette.white,
  },
});

// function mapStateToProps(state) {
//   return {
//     location: state.location,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(helperActions, dispatch),
//   };
// }

export default MapPicker;
