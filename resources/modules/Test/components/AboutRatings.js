import React from 'react';
import {
    Image,
    View,
    Text
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';

import flex from '@styles/flex.styles';
import textStyles from '@styles/textStyles.styles';
import palette from '@styles/palette.styles';

const AboutRatings = () => {

    return (
        <View style={{ marginTop: 10 }}>
            {
                [...Array(10)].map((rating, index) => (
                    <View style={[ styles.ratingCard ]} key={`ratingcard${ index }`}>
                        <View style={[ flex.direction.row, flex.align.end, flex.justify.between ]}>
                            <Text style={[ textStyles.size.sm, textStyles.weight.regular ]}>
                                John Doe
                            </Text>
                            <View style={flex.direction.row}>
                                {
                                    [...Array(5)].map( (start, stardex) => (
                                        <AntIcon
                                            name="star"
                                            size={ 12 } 
                                            color={palette.yellow}
                                            key={`rating${ index }stardex${ stardex }`}
                                        /> 
                                    ))
                                }
                            </View>
                        </View>
                        <Text style={[ textStyles.size.sm, textStyles.color.darkGray , { marginTop: 10 } ]}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                        </Text>
                    </View>
                ))
            }
        </View>
    );
};

const styles = {
    ratingCard: {
        paddingVertical: 15,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    }
}

export { AboutRatings };