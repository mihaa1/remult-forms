import { TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { FieldMetadata } from 'remult'
import { isRequired } from '../util'
// import { UILibContext } from '../UILibContext'

interface RemultTextFieldP<T> {
	val: string | number
	field: FieldMetadata<any, T> // eslint-disable-line @typescript-eslint/no-explicit-any
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	error?: string
	disabled?: boolean
}

const RemultTextField = <T,>({
	val,
	field,
	onChange,
	error,
	disabled,
}: RemultTextFieldP<T>) => {
	// const uiLib = useContext(UILibContext)

	return (
		<TextField
			sx={{ mb: 1 }}
			type={field.inputType || 'text'}
			label={field.caption || field.key}
			disabled={disabled}
			value={val || ''}
			onChange={onChange}
			required={!!isRequired(field)}
			error={!!error}
			helperText={error}
		/>
	)
}
export default RemultTextField
