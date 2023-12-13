/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, ReactNode, useEffect, useReducer, useState } from 'react'
import { FieldMetadata, FieldsMetadata, remult } from 'remult'
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

type ClassType<T> = {
	new (...args: any[]): T // eslint-disable-line @typescript-eslint/no-explicit-any
}

const reducer = <T,>(state: T, action) => {
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

	const onSubmit = async () => {
		if (isEdit) {
			return await onEdit()
		}
		return await onCreate()
	}

	const onEdit = async () => {
		await remult.repo(entity).save(state)
	}

	const onCreate = async () => {
		await remult.repo(entity).insert(state)
	}

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
				value={state[field.key as keyof typeof state]}
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
						// onChange={(e) => saveUserAttr(e.target.checked, attr.id)}
					/>
				}
				label={field.caption || field.key}
			/>
		)
	}

	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const renderDatePicker = <T,>(field: FieldMetadata<any, T>) => {
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs} key={`${field.key}`}>
				<DemoContainer components={['DatePicker']}>
					<DatePicker label='Basic date picker' />
				</DemoContainer>
			</LocalizationProvider>
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderForm = <T,>(fields: FieldsMetadata<T>) => {
		return fields.toArray().map((f) => {
			if (!f.inputType || f.inputType === 'number') {
				return renderTextField(f)
			} else if (f.inputType === 'checkbox') {
				return renderCheckbox(f)
			} else if (f.inputType === 'date') {
				return renderDatePicker(f)
			}
		})
	}

	console.log('state', state)
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{renderForm(repo.fields)}
			<Button sx={{ m: 1 }} variant='contained' onClick={onSubmit}>
				Create
			</Button>
		</div>
	)
}
