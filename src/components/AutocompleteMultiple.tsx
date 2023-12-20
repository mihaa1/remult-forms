import TextField from '@mui/material/TextField'
import AutocompleteMUI from '@mui/material/Autocomplete'
import { MultipleSelectP } from '../types'

const RemultAutocompleteMultiple = ({
	options,
	selected,
	onSelect,
	disabled,
	label,
}: MultipleSelectP) => {
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
				newValue
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
