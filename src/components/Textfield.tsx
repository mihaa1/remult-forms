import { TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { FieldMetadata } from 'remult'

interface RemultTextFieldP<T> {
	val: string | number
	field: FieldMetadata<any, T> // eslint-disable-line @typescript-eslint/no-explicit-any
	onChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		key: string
	) => void
}

const RemultTextField = <T,>({ val, field, onChange }: RemultTextFieldP<T>) => {
	return (
		<TextField
			sx={{ m: 1 }}
			type={field.inputType || 'text'}
			label={field.caption || field.key}
			disabled={field.options.allowApiUpdate === false}
			// required={field.options} TODO:
			// value={internalItem[field.key as keyof typeof internalItem]}
			value={val || ''}
			onChange={(e) => onChange(e, field.key)}
			required={field.options.required}
		/>
	)
}
export default RemultTextField
