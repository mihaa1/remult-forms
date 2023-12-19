import TextField from '@mui/material/TextField'
import AutocompleteMUI from '@mui/material/Autocomplete'
import { useMemo } from 'react'
import { MultiSelectOption } from '../types'

// Generic component example
// interface OptionWithId {
// 	id: string | number
// }
// interface AutocompleteP<T extends OptionWithId> {
// 	options: T[]
// }
// const Autocomplete = <T extends OptionWithId>({
// 	options,
// }: AutocompleteP<T>) => {
// END Generic component example

interface AutocompleteP {
	options: MultiSelectOption[]
	selectedId?: string
	onSelect: (arg: MultiSelectOption) => void
	disabled?: boolean
	label?: string
}

const RemultAutocomplete = ({
	options,
	selectedId,
	onSelect,
	disabled,
	label,
}: AutocompleteP) => {
	const sanitizedOptions = options.map((o) => ({
		...o,
		id: o.id,
		label: o.label || o.name || String(o.id),
	}))

	const selectedItem = useMemo(
		() => sanitizedOptions.find((o) => o.id === selectedId),
		[sanitizedOptions, selectedId]
	)

	return (
		<AutocompleteMUI
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onChange={(_e: any, newValue: MultiSelectOption | null) =>
				newValue && onSelect(newValue)
			}
			sx={{ mb: 1 }}
			selectOnFocus={false}
			options={sanitizedOptions}
			value={selectedItem || null}
			renderInput={(params) => <TextField {...params} label={label} />}
			disabled={disabled}
		/>
	)
}
export default RemultAutocomplete
