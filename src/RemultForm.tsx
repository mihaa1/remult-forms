/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
console.log('hello forms xxxxxxxxxx')
import { ChangeEvent, ReactNode, useReducer } from 'react'
import { FieldMetadata, FieldsMetadata, remult } from 'remult'
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
console.log('aaa')
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

type ClassType<T> = {
	new (...args: any[]): T // eslint-disable-line @typescript-eslint/no-explicit-any
}

const reducer = <T,>(state: T, action: any) => {
	return {
		...state,
		...action,
	}
}

export const RemultForm = <T,>({
	entity,
	item,
}: {
	entity: ClassType<T>
	item?: T
}): ReactNode => {
	const isEdit = !!item
	// const [internalItem, setInternalItem] = useState<T>(
	// 	item ? { ...item } : remult.repo(entity).create()
	// )
	const [state, dispatch] = useReducer(
		reducer,
		item ? { ...item } : remult.repo(entity).create()
	)
	const repo = remult.repo(entity)

	const onChangeTextfield = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		key: string
	) => {
		// setInternalItem({ ...internalItem, [key]: e.target.value })
		// item.email = e.target.value
		// setItem(item)
		dispatch({
			[key]: e.target.value,
		})
	}

	const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>, key: string) => {
		dispatch({
			[key]: e.target.checked,
		})
	}

	const onChangeDate = (newDate: any, key: string) => {
		dispatch({
			[key]: new Date(newDate),
		})
	}

	const onSubmit = async () => {
		if (isEdit) {
			return await onEdit()
		}
		return await onCreate()
	}

	const onEdit = async () => await remult.repo(entity).save(state)

	const onCreate = async () => await remult.repo(entity).insert(state)

	const renderTextField = <T,>(field: FieldMetadata<any, T>) => {
		return (
			<TextField
				sx={{ m: 1 }}
				key={`${field.key}`}
				type={field.inputType || 'text'}
				label={field.caption || field.key}
				disabled={field.options.allowApiUpdate === false}
				// required={field.options} TODO:
				// value={internalItem[field.key as keyof typeof internalItem]}
				value={state[field.key as keyof typeof state] || ''}
				onChange={(e) => onChangeTextfield(e, field.key)}
			/>
		)
	}

	const renderCheckbox = <T,>(field: FieldMetadata<any, T>) => {
		return (
			<FormControlLabel
				key={`${field.key}`}
				control={
					<Checkbox
						// checked={
						// 	field.options.defaultValue && field.options.defaultValue(entity)
						// }
						// checked={!!internalItem[field.key as keyof typeof internalItem]}
						checked={!!state[field.key as keyof typeof state]}
						onChange={(e) => onChangeCheckbox(e, field.key)}
					/>
				}
				label={field.caption || field.key}
			/>
		)
	}

	const renderDatePicker = <T,>(field: FieldMetadata<any, T>) => {
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs} key={`${field.key}`}>
				<DemoContainer components={['DatePicker']}>
					<DatePicker
						label='Basic date picker'
						onChange={(e) => onChangeDate(e, field.key)}
					/>
				</DemoContainer>
			</LocalizationProvider>
		)
	}

	const renderForm = <T,>(fields: FieldsMetadata<T>) => {
		return fields.toArray().map((f) => {
			console.log('f', f)
			if (!f.inputType || f.inputType === 'text' || f.inputType === 'number') {
				return renderTextField(f)
			} else if (f.inputType === 'checkbox') {
				return renderCheckbox(f)
			} else if (f.inputType === 'date') {
				return renderDatePicker(f)
			}
		})
	}

	// console.log('state', state)
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{renderForm(repo.fields)}
			<Button sx={{ m: 1 }} variant='contained' onClick={onSubmit}>
				Create
			</Button>
		</div>
	)
}
