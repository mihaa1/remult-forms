/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'
import { FieldMetadata, FieldsMetadata, remult } from 'remult'
import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

type ClassType<T> = {
	new (...args: any[]): T // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const RemultForm = <T,>({
	entity,
}: {
	entity: ClassType<T>
}): ReactNode => {
	// export const RemultForm = <T,>(repo: Repository<T>) => {
	// console.log('entity', entity)
	const repo = remult.repo(entity)
	// console.log('repo', repo)
	// console.log('repo.fields', repo.fields)
	// console.log('repo.metadata', repo.metadata)
	// console.log('repo.fields.toArray()', repo.fields.toArray())
	// repo.metadata.columnsInfo.forEach((c) => {
	// 	console.log('xxx c', c)
	// 	console.log('xxx c.valueType()', c.valueType())
	// })
	console.log('remult.repo(entity)', remult.repo(entity))

	const renderTextField = <T,>(field: FieldMetadata<any, T>) => {
		return (
			<TextField
				sx={{ m: 1 }}
				key={`${field.key}`}
				type={field.inputType || 'text'}
				label={field.caption || field.key}
				disabled={field.options.allowApiUpdate === false}
				defaultValue={
					field.options.defaultValue && field.options.defaultValue(entity)
				}
				// value={}
			/>
		)
	}

	const renderCheckbox = <T,>(field: FieldMetadata<any, T>) => {
		return (
			<FormControlLabel
				key={`${field.key}`}
				control={
					<Checkbox
						checked={
							field.options.defaultValue && field.options.defaultValue(entity)
						}
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
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DemoContainer components={['DatePicker']}>
					<DatePicker label='Basic date picker' />
				</DemoContainer>
			</LocalizationProvider>
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderForm = <T,>(fields: FieldsMetadata<T>) => {
		console.log('=========================')
		return fields.toArray().map((f) => {
			console.log('f.key', f.key)
			console.log('f', f)
			console.log('f.valueType()', f.valueType())
			console.log('f.inputType', f.inputType)
			console.log('f.valueConverter.inputType', f.valueConverter.inputType)
			if (!f.inputType || f.inputType === 'number') {
				return renderTextField(f)
			} else if (f.inputType === 'checkbox') {
				return renderCheckbox(f)
			} else if (f.inputType === 'date') {
				return renderDatePicker(f)
			}
		})
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{renderForm(repo.fields)}
		</div>
	)
}
