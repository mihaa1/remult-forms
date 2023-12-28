import { TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { FieldMetadata, Validators } from 'remult'
import { isMetaActionBlocked } from '../util'
// import { UILibContext } from '../UILibContext'

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
	// const uiLib = useContext(UILibContext)

	const isRequired = (field: FieldMetadata<any, T>) => {
		return (
			field.options.validate &&
			(field.options.validate === Validators.required ||
				(field.options.validate?.length &&
					typeof field.options.validate === 'object' &&
					field.options.validate.find((v) => v === Validators.required)))
		)
	}

	return (
		<TextField
			sx={{ mb: 1 }}
			type={field.inputType || 'text'}
			label={field.caption || field.key}
			disabled={isMetaActionBlocked(field.options.allowApiUpdate)}
			// value={internalItem[field.key as keyof typeof internalItem]}
			value={val || ''}
			onChange={onChange}
			required={!!isRequired(field)}
			error={!!error}
			helperText={error}
		/>
	)
}
export default RemultTextField
