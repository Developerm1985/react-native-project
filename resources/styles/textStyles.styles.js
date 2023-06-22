import palette from "./palette.styles";

const sfProRegular = "SFProText-Regular";
const sfProLight = "SFProText-Light";
const sfProMedium = "SFProText-Medium";
const sfProSemibold = "SFProText-Semibold";
const sfProBold = "SFProText-Bold";

const textStyles = {
    xlText: {
        fontSize: 26,
        fontFamily: sfProRegular 
    },
    xlTextBold: {
        fontSize: 26,
        fontFamily: sfProBold
    },
    xlTextMedium: {
        fontSize: 26,
        fontFamily: sfProMedium
    },
    lgText: {
        fontSize: 20,
        fontFamily: sfProRegular 
    },
    lgTextBold: {
        fontSize: 20,
        fontFamily: sfProBold
    },
    lgTextMedium: {
        fontSize: 20,
        fontFamily: sfProMedium
    },
    mdText: {
        fontSize: 18,
        fontFamily: sfProRegular 
    },
    mdTextBold: {
        fontSize: 18,
        fontFamily: sfProBold
    },
    mdTextMedium: {
        fontSize: 18,
        fontFamily: sfProMedium
    },
    normalText: {
        fontSize: 15,
        fontFamily: sfProRegular 
    },
    normalTextBold: {
        fontSize: 15,
        fontFamily: sfProBold
    },
    normalTextMedium: {
        fontSize: 15,
        fontFamily: sfProMedium
    },
    smText: {
        fontSize: 13,
        fontFamily: sfProRegular 
    },
    smTextBold: {
        fontSize: 13,
        fontFamily: sfProBold
    },
    smTextMedium: {
        fontSize: 13,
        fontFamily: sfProMedium
    },
    xsText: {
        fontSize: 12,
        fontFamily: sfProRegular 
    },
    xsTextBold: {
        fontSize: 12,
        fontFamily: sfProBold
    },
    xsTextMedium: {
        fontSize: 12,
        fontFamily: sfProMedium
    },
    xxsText: {
        fontSize: 10,
        fontFamily: sfProRegular 
    },
    xxsTextBold: {
        fontSize: 10,
        fontFamily: sfProBold
    },
    xxsTextMedium: {
        fontSize: 10,
        fontFamily: sfProMedium
    },
    bold: {
        fontFamily: sfProBold
    },
    promoText: {
        fontFamily: sfProRegular, 
        color: palette.white,
        fontSize: 21,
    },
    promoDescription: {
        fontFamily: sfProRegular, 
        color: palette.white
    },
    iconLeft: {
        marginRight: 4
    },
    time: {
        marginRight: 15,
        color: palette.darkGray
    },
    distance: {
        color: palette.darkGray
    },
    size: {
        xl: { fontSize: 26 },
        lg: { fontSize: 20 },
        mlg: { fontSize: 18 },
        md: { fontSize: 15 },
        sm: { fontSize: 13 },
        xs: { fontSize: 12 }
    },
    weight: {
        regular: { fontFamily: sfProRegular },
        medium: { fontFamily: sfProMedium },
        bold: { fontFamily: sfProBold },
        light: { fontFamily: sfProLight }
    },
    color: {
        white: { color: '#ffffff' },
        black: { color: '#000000' },
        blue: { color: '#2d18d9' },
        red: { color: '#ff0000' },
        secondaryBlack: { color: '#2C2C2E' },
        yellow: { color: '#FFBB00' },
        lightYellow: { color: '#FDF0D6' },
        lightGray: { color: '#FAFAFA' },
        mediumGray: { color: '#545458A6' },
        darkGray: { color: '#707070' }
    },
    align: {
        center: { textAlign: "center" },
        right: { textAlign: "right" },
        left: { textAlign: "left" }
    }
};
  
export default textStyles;
  