import { TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { FieldMetadata } from 'remult'
import { isMetaActionBlocked } from '../util'

interface RemultTextFieldP<T> {
	val: string | number
	field: FieldMetadata<any, T> // eslint-disable-line @typescript-eslint/no-explicit-any
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	error?: string
}

const RemultTextField = <T,>({
	val,
	field,
	onChange,
	error,
}: RemultTextFieldP<T>) => {
	return (
		<TextField
			sx={{ mb: 1 }}
			type={field.inputType || 'text'}
			label={field.caption || field.key}
			disabled={isMetaActionBlocked(field.options.allowApiUpdate)}
			// value={internalItem[field.key as keyof typeof internalItem]}
			value={val || ''}
			onChange={onChange}
			required={field.options.required}
			error={!!error}
			helperText={error}
		/>
	)
}
export default RemultTextField
