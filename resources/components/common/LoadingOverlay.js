import React, {Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import palette from '../../styles/palette.styles';

export const LoadingOverlayRef = React.createRef();

export const processLoading = (
  visible,
  timeout,
  ref,
  message = '',
  callback,
) => {
  if (ref.current) {
    ref.current.updateLoadingVisibility(visible, timeout, message);
    return callback ? callback() : true;
  }
  return false;
};

class LoadingOverlay extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      message: null,
    };
  }

  static show = (message = '', timeout = null) => {
    if (!processLoading(true, timeout, LoadingOverlayRef, message)) {
      const waitingForLoadingOverlayRef = setInterval(() => {
        processLoading(true, timeout, LoadingOverlayRef, message, () => {
          clearInterval(waitingForLoadingOverlayRef);
        });
      }, 100);
    }
  };

  static hide = (timeout = null) => {
    if (!processLoading(false, timeout, LoadingOverlayRef)) {
      const waitingForLoadingOverlayRef = setInterval(() => {
        processLoading(false, timeout, LoadingOverlayRef, null, () => {
          clearInterval(waitingForLoadingOverlayRef);
        });
      }, 100);
    }
  };

  updateLoadingVisibility = (visible, timeout, message) => {
    this.setState({visible, message});
    if (timeout) {
      setTimeout(() => {
        this.setState({visible: !visible, message: ''});
      }, timeout);
    }
  };

  toggleVisible = () => {
    const visible = !this.state.visible;
    this.setState({visible});
  };

  render() {
    const {visible, message} = this.state;

    if (!visible) {
      return null;
    }

    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalOverlay} />
        <View style={styles.animationContainer}>
          <ActivityIndicator size="large" color={palette.yellow} />
          {message && <Text style={styles.loadingText}>{message}</Text>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: palette.lightGray,
    opacity: 0.8,
  },
  animationContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: palette.yellow,
    marginTop: 10,
    maxWidth: '80%',
  },
});

export default LoadingOverlay;
