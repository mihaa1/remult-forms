import TextField from '@mui/material/TextField'
import AutocompleteMUI from '@mui/material/Autocomplete'
import { MultiSelectOption } from '../types'

interface AutocompleteMultipleP {
	options: MultiSelectOption[]
	selected?: MultiSelectOption[]
	onSelect: (arg: Pick<MultiSelectOption, 'id'>[]) => void
	// width?: string
	// size?: 'small' | 'medium'
	disabled?: boolean
	label?: string
	isMultiple?: boolean
}

const RemultAutocompleteMultiple = ({
	options,
	selected,
	onSelect,
	disabled,
	label,
}: AutocompleteMultipleP) => {
	const sanitizedOptions = options.map((o) => ({
		...o,
		id: o.id,
		label: o.label || o.name || String(o.id),
	}))

	return (
		<AutocompleteMUI
			multiple
			sx={{ mb: 1 }}
			onChange={(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				_e: any,
				newValue: MultiSelectOption[]
			) => newValue && onSelect(newValue)}
			selectOnFocus={false}
			options={sanitizedOptions}
			value={selected || []}
			getOptionLabel={(option) =>
				option.label || option.name || String(option.id)
			}
			renderInput={(params) => <TextField {...params} label={label} />}
			disabled={disabled}
			isOptionEqualToValue={(option, value) => option.id === value.id}
		/>
	)
}
export default RemultAutocompleteMultiple
