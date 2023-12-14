/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, ReactNode, useReducer } from 'react'
import { FieldsMetadata, remult } from 'remult'
import RemultTextField from './components/Textfield'
import { Button } from '@mui/material'
import RemultCheckbox from './components/Checkbox'
import RemultDatepicker from './components/Datepicker'

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

	const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>, key: string) =>
		dispatch({
			[key]: e.target.checked,
		})

	const onChangeDate = (newDate: unknown, key: string) =>
		dispatch({
			[key]: new Date(newDate as any),
		})

	const onSubmit = async () => {
		if (isEdit) {
			return await onEdit()
		}
		return await onCreate()
	}

	const onEdit = async () => await remult.repo(entity).save(state)

	const onCreate = async () => await remult.repo(entity).insert(state)

	const renderForm = <T,>(fields: FieldsMetadata<T>) => {
		console.log('remult.repo(entity)', remult.repo(entity))
		console.log(
			'remult.repo(entity).relations',
			remult.repo(entity).relations(item!)
		)
		return fields.toArray().map((f) => {
			console.log('============')
			console.log('f', f.key)
			console.log('f', f)
			console.log('f.valueType()', f.valueType && f.valueType())
			console.log('f.inputType', f.inputType)
			console.log('============')

			if (!f.inputType || f.inputType === 'text' || f.inputType === 'number') {
				return (
					<RemultTextField
						key={`${f.key}`}
						val={state[f.key as keyof typeof state]}
						field={f}
						onChange={onChangeTextfield}
					/>
				)
			} else if (f.inputType === 'checkbox') {
				return (
					<RemultCheckbox
						key={`${f.key}`}
						val={!!state[f.key as keyof typeof state]}
						field={f}
						onChange={onChangeCheckbox}
					/>
				)
			} else if (f.inputType === 'date') {
				return (
					<RemultDatepicker
						key={`${f.key}`}
						field={f}
						onChange={onChangeDate}
					/>
				)
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
