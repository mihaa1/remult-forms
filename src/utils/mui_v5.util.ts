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
		case 'isAnyOf':
		case 'is':
			return '$in'
		case 'not':
			return '$nin'

		// case 'startsWith':
		// 	return '$starts'
		// case 'endsWith':
		// 	return '$ends'
		// case 'isEmpty':
		// 	return '$empty'
		// case 'isNotEmpty':
		// 	return '$notEmpty'
		default:
			return ''
	}
}
