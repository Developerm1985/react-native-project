import React from 'react';
import {
    View,
    ScrollView,
    StatusBar
} from 'react-native';

export const Wrapper = ({ children, style, statusBarProps }) => {

    return (
        <View style={{ flex: 1, ...style }}>
            { statusBarProps ? <StatusBar {...statusBarProps} /> : null }
            { children }
        </View>
    );
};

export const Scroll = ({ children, style }) => {

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            style={ style }
        >
            { children }
        </ScrollView>
    );
};