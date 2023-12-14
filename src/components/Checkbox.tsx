import { Checkbox, FormControlLabel } from '@mui/material'
import { ChangeEvent } from 'react'
import { FieldMetadata } from 'remult'

interface RemultCheckboxP<T> {
	val: boolean
	field: FieldMetadata<any, T> // eslint-disable-line @typescript-eslint/no-explicit-any
	onChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void
}
const RemultCheckbox = <T,>({ val, field, onChange }: RemultCheckboxP<T>) => {
	return (
		<FormControlLabel
			control={
				<Checkbox
					// checked={
					// 	field.options.defaultValue && field.options.defaultValue(entity)
					// }
					// checked={!!internalItem[field.key as keyof typeof internalItem]}
					// checked={!!state[field.key as keyof typeof state]}
					checked={val}
					onChange={(e) => onChange(e, field.key)}
				/>
			}
			label={field.caption || field.key}
		/>
	)
}

export default RemultCheckbox
