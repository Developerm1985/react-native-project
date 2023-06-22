import palette from "./palette.styles";
const food = {
    header: {
        paddingVertical: 0,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    searchBarContainer: {
        backgroundColor: palette.searchBar,
        borderRadius: 12,
        marginTop: 15,
        marginBottom: 10,
        borderBottomWidth: 0,
        alignItems: 'center'
    },
    searchBar: {
        borderBottomColor: 'transparent'
    },
    sectionHeading: {
        paddingHorizontal: 20,
        marginVertical: 13
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 0
    },
    image: {
		flex: 1,
		justifyContent: "flex-end",
		height: 215,
		marginTop: 15,
		borderRadius: 4,
		overflow: 'hidden',
	},
    restaurant: {
		borderRadius: 6,
		margin: 5,
		width: 200,
		overflow: 'hidden',
	},
	restaurantImage: {
		height: 120,
	},
    promoTag: {
        backgroundColor: palette.yellow,
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderBottomRightRadius: 6,
        color: palette.white,
        fontSize: 11
    },
	restaurantInfo: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: palette.white
	},
    restaurantFullWidth: {
        flex: 1,
        borderRadius: 6,
		margin: 5,
		overflow: 'hidden',
    },
    tags: {
        marginVertical: 9,
        flexDirection: 'row'
    },
    rating: {
        fontSize: 10,
        color: '#545458A6',
        marginLeft: 2
    },
    tag: {
        backgroundColor: palette.lightYellow,
        borderRadius: 3,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 8
    },
    
}

export default food;