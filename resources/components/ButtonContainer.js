import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import palette from '../styles/palette.styles';

class RegistrationButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      buttonPressed: false,
    };
  }

  render() {
    const {buttonPressed} = this.state;

    return (
      <TouchableHighlight
        accessible={true}
        onShowUnderlay={() => this.setState({buttonPressed: true})}
        onHideUnderlay={() => this.setState({buttonPressed: false})}
        underlayColor={palette.darkPink}
        {...this.props}
        style={
          !buttonPressed
            ? {...styles.button, ...this.props.style}
            : {
                ...styles.button,
                ...this.props.style,
                ...styles.buttonPressed,
                ...this.props.pressedStyle,
              }
        }>
        <View style={styles.childContainer}>{this.props.children}</View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderColor: palette.white,
    borderWidth: 3,
    borderRadius: 30,
    paddingVertical: 11,
    marginHorizontal: '8%',
  },
  buttonPressed: {
    borderColor: palette.darkGray,
    opacity: 0.7,
    borderWidth: 0,
    paddingVertical: 14,
    paddingHorizontal: 3,
  },
  childContainer: {
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegistrationButton;
