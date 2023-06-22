/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import DashboardHeader from '../components/DashboardHeader';
import palette from '../styles/palette.styles';
import textStyles from '../styles/textStyles.styles';
import flex from '../styles/flex.styles';
import dashboard from '../styles/dashboard.styles';

class Wallet extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <DashboardHeader />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic">
                </ScrollView>
            </View>
        );
    }
}


export default Wallet;