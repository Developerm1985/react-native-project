import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import flex from '@styles/flex.styles';
import textStyles from '@styles/textStyles.styles';
import palette from '@styles/palette.styles';

const ActivityStatus = () => {

    return (
        <View>
            <View style={[ flex.direction.row, flex.align.center, flex.justify.between ]}>
                <Text style={[ textStyles.size.md, textStyles.weight.medium ]}>
                    Your food is coming...
                </Text>
                <Text style={[ textStyles.size.md, textStyles.weight.medium ]}>
                    in 10 mins
                </Text>
            </View>
            <View style={[ flex.direction.row, flex.align.center, styles.card ]}>
                <View>
                    <Image
                        resizeMode="cover"
                        source={ require("/img/icon.png") }
                        style={[ styles.merchImage ]}
                    />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={[ textStyles.size.md, textStyles.weight.regular ]}>
                        Kape Natividad
                    </Text>
                    <Text style={[ textStyles.size.sm, textStyles.weight.regular, textStyles.color.darkGray ]}>
                        4 Items
                    </Text>
                </View>
                <View>
                    <Text style={[ textStyles.size.md, textStyles.weight.regular, { textAlign: "right" } ]}>
                        P823.00
                    </Text>
                    <Text style={[ textStyles.size.sm, textStyles.weight.regular, textStyles.color.darkGray, { textAlign: "right" } ]}>
                        Cash
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = {
    card: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: palette.lightYellow,
        borderRadius: 5,
        marginTop: 15
    },
    merchImage: {
        width: 30,
        height: 30,
        borderRadius: 100
    }
}
export { ActivityStatus };