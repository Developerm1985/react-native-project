import React from 'react';
import {StyleSheet, Text} from 'react-native';
import palette from '../styles/palette.styles';
import ButtonContainer from './ButtonContainer';

const ButtonSolid = props => (
  <ButtonContainer
    underlayColor={palette.darkBlue}
    {...props}
    style={{...styles.button, ...props.style}}
    pressedStyle={{
      ...styles.button,
      ...props.style,
      ...styles.buttonPressed,
      ...props.pressedStyle,
    }}>
    <Text style={{...styles.buttonText, ...props.textStyle}}>{props.text}</Text>
  </ButtonContainer>
);

const styles = StyleSheet.create({
  button: {
    marginHorizontal: '12%',
    backgroundColor: palette.blue,
    borderWidth: 0,
  },
  buttonText: {
    color: palette.white,
    fontSize: 20,
  },
  buttonPressed: {
    backgroundColor: palette.darkGray,
    borderWidth: 0,
    paddingVertical: 11,
    paddingHorizontal: 0,
  },
});

export default ButtonSolid;
