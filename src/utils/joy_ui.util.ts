// THIS WAS COPIED FROM MUI
export type MuiFilterOperator =
	| 'contains'
	| 'equals'
	| 'startsWith'
	| 'endsWith'
	| 'isEmpty'
	| 'isNotEmpty'
	| 'isAnyOf'
	| 'is'
	| 'not'

export const getOperator = (muiOperator: MuiFilterOperator) => {
	switch (muiOperator) {
		case 'contains':
			return '$contains'
		case 'equals':
			return '$in'
		case 'isAnyOf':
			return '$in'
		default:
			return ''
	}
}
