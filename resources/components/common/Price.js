import React from 'react'
import { Text } from 'react-native'

const Price = ({ value, style }) => {

    return (
        <Text style={ style }>
            P { numberWithCommas(value) }
        </Text>
    )
}

function numberWithCommas(n, decimalPlaces = 2) {
	const parts=(parseFloat(n).toFixed(decimalPlaces)).toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

export { Price }