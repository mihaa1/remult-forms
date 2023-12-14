/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, ReactNode, useReducer } from 'react'
import { FieldsMetadata, remult } from 'remult'
import RemultTextField from './components/Textfield'
import { Button, Typography } from '@mui/material'
import RemultCheckbox from './components/Checkbox'
import RemultDatepicker from './components/Datepicker'
import type { ClassType } from './types'

const reducer = <T,>(state: T, action: any) => {
	return {
		...state,
		...action,
	}
}

interface RemultFormP<T> {
	/** Model to generate form for */
	entity: ClassType<T>
	/** Existing model instance if edit case. Empty for create */
	item?: T
	/** Show item id */
	showId?: boolean
	/** Custom form title */
	title?: string
	/** Trigger on form submit. This will pass the created/edited item and will NOT perform the action. */
	onSubmit?: (item: T | undefined) => void
	/** Trigger on action completed. When create/edit action is done this will be fired */
	onDone?: (item: T[] | undefined) => void
}

export const RemultForm = <T,>({
	entity,
	item,
	showId,
	title,
	onSubmit,
	onDone,
}: RemultFormP<T>): ReactNode => {
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

	const onSubmitInternal = async () => {
		console.log('onSubmitInternal(): state', state)
		if (onSubmit) {
			return onSubmit(state)
		}
		if (isEdit) {
			return await onEdit()
		}
		return await onCreate()
	}

	const onEdit = async () => {
		const res = await remult.repo(entity).save(state)
		console.log('onEdit(): res', res)
		onDone && onDone(res)
	}

	const onCreate = async () => {
		const res = await remult.repo(entity).insert(state)
		console.log('onCreate(): res', res)
		onDone && onDone(res)
	}

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
			if (f.key === 'id' && (!showId || !isEdit)) {
				return
			}

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
			<Typography>
				{title || `${isEdit ? 'Edit ' : 'Create'} ${repo.metadata.caption}`}
			</Typography>
			{renderForm(repo.fields)}
			<Button sx={{ m: 1 }} variant='contained' onClick={onSubmitInternal}>
				Create
			</Button>
		</div>
	)
}
