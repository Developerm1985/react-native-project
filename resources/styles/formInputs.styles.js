

import palette from "./palette.styles";
const formInputs = {
	inputContainer: {
		backgroundColor: palette.searchBar,
		borderRadius: 6,
		marginHorizontal: 0,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'transparent'
	},
	inputContainerError: {
		borderColor: palette.red
	},
	input: {
		borderBottomWidth: 0, 
		paddingVertical: 15
	},
	label: {
		textTransform: 'uppercase',
		marginBottom: 8,
		color: palette.darkGray
	}
}

export default formInputs;
