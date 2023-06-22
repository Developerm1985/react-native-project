import React from 'react';
import {
    View,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import flex from '@styles/flex.styles';
import textStyles from '@styles/textStyles.styles';
import palette from '@styles/palette.styles';

const ActivityTrips = () => {
    const acitivityRandomness = (Math.floor(Math.random() * dummyActivities.length) + 1);

    return (
        <View>
            <Text style={[ textStyles.size.md, textStyles.weight.medium ]}>
                Trips
            </Text>
            <View style={{ marginTop: 15 }}>
                {
                    dummyActivities.map((activity, index) => {
                        const activated = acitivityRandomness > index;
                        return (
                            <View style={[flex.direction.row ]} key={`activitylog${ index }`}>
                                <View style={[ flex.align.center, { height: "100%" }]}>
                                    { 
                                        dummyActivities.length !== (index + 1) ? 
                                            <View
                                                style={[
                                                    styles.logLine,
                                                    activated ? { borderColor: palette.yellow, borderStyle: 'solid' } : {}
                                                ]}
                                            />
                                            : null 
                                    }
                                    <View
                                        style={[
                                            styles.activityDot,
                                            flex.align.center,
                                            flex.justify.center,
                                            activated ? { backgroundColor: palette.yellow } : {}
                                        ]}
                                    >
                                        { activated ? <Icon name="check" size={ 8 }/> : null }
                                    </View>
                                </View>
                                <View style={[ flex.direction.row, flex.align.center, flex.justify.between, { flex: 1, marginLeft: 10, paddingBottom: 25 }]}>
                                    <Text style={[ textStyles.size.sm, textStyles.weight.regular, { lineHeight: 13 } ]}>
                                        { activity.log }
                                    </Text>
                                    <Text style={[ textStyles.size.sm, textStyles.weight.regular, { color: "black" } ]}>
                                        { activity.time }
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    );
};

const styles = {
    container: {
        paddingVertical: 25,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 15,
    },
    activityDot: {
        height: 16,
        width: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: palette.yellow,
        backgroundColor: "#fff"
    },
    logLine: {
        position: "absolute",
        height: "100%",
        width: 0,
        borderWidth:1,
        borderStyle: 'dashed',
        borderColor: "#ccc",
        borderRadius: 1
    }
};

const dummyActivities = [
    {
        log: "Merchant confirms your order",
        time: "9:15 AM"
    },
    {
        log: "Rider arrives at restaurant",
        time: "9:36 AM"
    },
    {
        log: "Rider receives order",
        time: "9:40 AM"
    },
    {
        log: "Rider on the way to recepient",
        time: "in 30 mins"
    },
    {
        log: "Rider is nearby",
        time: "in 5 mins"
    },
    {
        log: "Order successful"
    }
]

export { ActivityTrips };