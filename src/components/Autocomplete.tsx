import TextField from '@mui/material/TextField'
import AutocompleteMUI from '@mui/material/Autocomplete'
import { useMemo } from 'react'
import { RequireAtLeastOne } from '../types'

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

interface AutocompleteOptionRaw {
	id: string | number
	label?: string
	// if label is missing - values will be rendered from name prop
	name?: string
}

export type AutocompleteOption = RequireAtLeastOne<
	AutocompleteOptionRaw,
	'label' | 'name'
>

interface AutocompleteP {
	options: AutocompleteOption[]
	selectedId?: string
	onSelect: (arg: AutocompleteOption) => void
	// width?: string
	// size?: 'small' | 'medium'
	disabled?: boolean
	label?: string
}

const RemultAutocomplete = ({
	options,
	selectedId,
	onSelect,
	// width,
	// size = 'medium',
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
			onChange={(_e: any, newValue: AutocompleteOption | null) =>
				newValue && onSelect(newValue)
			}
			// size={size}
			sx={{ mb: 1 }}
			selectOnFocus={false}
			options={sanitizedOptions}
			value={selectedItem || null}
			// sx={{ width: width || 300 }}
			renderInput={(params) => <TextField {...params} label={label} />}
			disabled={disabled}
		/>
	)
}
export default RemultAutocomplete
