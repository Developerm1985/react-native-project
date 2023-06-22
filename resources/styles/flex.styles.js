const flex = {
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    contentBetween: {
        justifyContent: 'space-between'
    },
    justifyEnd: {
        justifyContent: 'flex-end'
    },
    alignEnd: {
        alignSelf: 'flex-end'
    },
    viewGradient: {
		flex: 1,
		padding: 12,
		justifyContent: 'flex-end'
	},
    merchantGradient: {
		flex: 1,
		padding: 16,
		justifyContent: 'flex-end'
	},
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 20
    },
    direction: {
        column: { flexDirection: "column" },
        columnReverse: { flexDirection: "column-reverse" },
        row: { flexDirection: "row" },
        rowReverse: { flexDirection: "row-reverse" }
    },
    justify: {
        start: { justifyContent: "flex-start" },
        end: { justifyContent: "flex-end" },
        center: { justifyContent: "center" },
        between: { justifyContent: "space-between" },
        around: { justifyContent: "space-around" },
    },
    align: {
        start: { alignItems: "flex-start" },
        end: { alignItems: "flex-end" },
        center: { alignItems: "center" }
    },
    alignSelf: {
        start: { alignSelf: "flex-start" },
        end: { alignSelf: "flex-end" },
        center: { alignSelf: "center" }
    },
    centerAll: {
        justifyContent: "center",
        alignItems: "center"
    },
    wrap: {
        flexWrap: "wrap"
    }
};
  
export default flex;
  